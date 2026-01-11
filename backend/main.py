from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from pydantic_ai.agent import Agent
from pydantic_ai.models.groq import GroqModel
from pydantic_ai.providers.groq import GroqProvider
from dotenv import load_dotenv
import os

from uuid import uuid4
import requests
from datetime import datetime
from auth import (
    authenticate_user, 
    create_user, 
    create_access_token, 
    verify_token, 
    SessionLocal as AuthSessionLocal,
    Base as AuthBase,
    engine as auth_engine
)

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
NEON_DB_URL = os.getenv("NEON_DB_URL")
PIXAZO_API_KEY = os.getenv("PIXAZO_API_KEY")

# Initialize database connection
engine = create_engine(NEON_DB_URL)
SessionLocal = sessionmaker(bind=engine)

# Create auth tables on startup
@app.on_event("startup")
async def startup_event():
    """Create all tables on startup."""
    AuthBase.metadata.create_all(bind=auth_engine)

security = HTTPBearer()

'''-------REQUEST/RESPONSE MODELS---------'''
class SignupRequest(BaseModel):
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class AuthResponse(BaseModel):
    access_token: str
    token_type: str
    email: str


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """Extract and verify the email from JWT token."""
    token = credentials.credentials
    email = verify_token(token)
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return email

'''-------AUTH ENDPOINTS---------'''
@app.post("/signup", response_model=AuthResponse)
async def signup(request: SignupRequest):
    """Create a new user account."""
    session = AuthSessionLocal()
    try:
        
        user = create_user(request.email, request.password, session)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        
        access_token = create_access_token(user.email)
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "email": user.email
        }
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Signup failed: {str(e)}"
        )
    finally:
        session.close()

@app.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest):
    """Authenticate user and return JWT token."""
    session = AuthSessionLocal()
    try:
        user = authenticate_user(request.email, request.password, session)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        access_token = create_access_token(user.email)
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "email": user.email
        }
    finally# d[2] is the text column:
        session.close()

'''-------AGENTS---------'''
model1 = GroqModel(model_name="llama-3.3-70b-versatile", provider=GroqProvider(api_key=GROQ_API_KEY))
base_agent = Agent(model=model1)

class Dream(BaseModel):
    text: str

@app.post("/dream")
async def save_dream(dream: Dream, current_user: str = Depends(get_current_user)):
    prompt = f"""You are supposed to format the following text into a structured, vivid dream narrative in first person:
            {dream.text}
            Make it immersive, flow like a dream, and avoid any analysis or explanations. Just narrate as if you're recounting the dream."""
    
    structured_result = await base_agent.run(prompt)
    structured_text = structured_result.output
    new_dream = {
        "id": str(uuid4()),
        "user_id": current_user,
        "text": dream.text,
        "structured_text": structured_text,
        "created_at": datetime.now()
    }
    
    session = SessionLocal()
    try:
        session.execute(
            text("""INSERT INTO dreams (id, user_id, text, structured_text, created_at) 
                    VALUES (:id, :user_id, :text, :structured_text, :created_at)"""),
            new_dream
        )
        session.commit()
    finally:
        session.close()
    
    return {"status": "saved", "dream_id": new_dream["id"]}

@app.get("/dreams/user")
async def get_dreams(current_user: str = Depends(get_current_user)):
    session = SessionLocal()
    try:
        result = session.execute(
            text("""SELECT id, structured_text, created_at FROM dreams 
                    WHERE user_id = :user_id 
                    ORDER BY created_at DESC"""),
            {"user_id": current_user}
        )
        dreams_data = result.fetchall()
        dreams = [{"id": d[0], "content": d[1], "created_at": d[2]} for d in dreams_data]
        return dreams
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching dreams: {str(e)}")
    finally:
        session.close()

@app.get("/dream-response/user")
async def generate_collective_response(current_user: str = Depends(get_current_user)):
    session = SessionLocal()
    try:
        result = session.execute(
            text("SELECT * FROM dreams WHERE user_id = :user_id"),
            {"user_id": current_user}
        )
        dreams_data = result.fetchall()
        
        if not dreams_data:
            return {"error": "No dreams for this user."}
        
        all_dreams_text = "\n\n".join(d[2] for d in dreams_data)  
        
        prompt = f"""
    You are an AI dream weaver. These are a collection of dreams experienced by one person: 
    {all_dreams_text}
    Now, evolve these dreams into one surreal, cohesive, vivid dream experience.
    - The format should be in **first person**.
    - Make it immersive and continuous, as if it was one long night of dreaming.
    - Do not explain. Just narrate the dream directly.
    - Make sure it is about 100 words long."""

        ai_response = await base_agent.run(prompt)
        return {"response": ai_response.output}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
    finally:
        session.close()

@app.get("/dream-generate/user")
async def generate_collective_image(current_user: str = Depends(get_current_user)):
    session = SessionLocal()
    try:
        result = session.execute(
            text("SELECT * FROM dreams WHERE user_id = :user_id"),
            {"user_id": current_user}
        )
        dreams_data = result.fetchall()
        
        if not dreams_data:
            return {"error": "No dreams found for this user."}

        combined_dreams = "\n\n".join(d[2] for d in dreams_data)  
        
        prompt = f"""
    You are a surreal storyteller. Here's a set of dreams:
    {combined_dreams}
    Turn it into a visual, animative description in 1-2 sentences for an artist to paint.
    Be abstract and expressive.
    """

        summarized = await base_agent.run(prompt)
        dream_description = summarized.output.strip()

        
        pixazo_url = "https://gateway.pixazo.ai/flux-1-schnell/v1/getData"
        headers = {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            "Ocp-Apim-Subscription-Key": PIXAZO_API_KEY
        }
        data = {
            "prompt": dream_description,
            "num_steps": 4,
            "seed": 15,
            "height": 512,
            "width": 512
        }

        response = requests.post(pixazo_url, json=data, headers=headers)
        
        if response.status_code != 200:
            raise HTTPException(
                status_code=500,
                detail=f"Pixazo API error: {response.text}"
            )
        
        response_data = response.json()
        
        
        if "output" in response_data and response_data["output"]:
            url = response_data["output"]
        else:
            raise HTTPException(
                status_code=500,
                detail="Invalid Pixazo API response"
            )

        
        result = session.execute(
            text("""SELECT id FROM dreams WHERE user_id = :user_id 
                    ORDER BY created_at DESC LIMIT 1"""),
            {"user_id": current_user}
        )
        latest_dream = result.fetchone()
        
        if not latest_dream:
            return {"error": "No dreams found to update with image."}
        
        dream_id = latest_dream[0]
        session.execute(
            text("UPDATE dreams SET dream_image = :image_url WHERE id = :id"),
            {"image_url": url, "id": dream_id}
        )
        session.commit()
        return {"image_url": url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
    finally:
        session.close()


