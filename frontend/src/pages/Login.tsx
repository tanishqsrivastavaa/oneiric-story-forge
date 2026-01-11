import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon, Lock, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            toast({
                title: "Missing Fields",
                description: "Please enter both email and password.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("http://127.0.0.1:8000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || "Login failed");
            }

            const data = await response.json();
            login(data.email, data.access_token);

            toast({
                title: "Welcome Back! ✨",
                description: "You have successfully logged into the dream realm.",
            });

            navigate("/");
        } catch (error) {
            toast({
                title: "Login Failed",
                description: error instanceof Error ? error.message : "Unable to log in. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-gradient-card backdrop-blur-sm border-border/50 shadow-dream">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-2">
                        <Moon className="h-8 w-8 text-primary animate-pulse" />
                    </div>
                    <CardTitle className="text-2xl font-bold bg-gradient-magical bg-clip-text text-transparent">
                        Dream Realm Entry
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Log in to access your dream sanctuary
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                                <Mail className="h-4 w-4" />
                                Email
                            </label>
                            <Input
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                className="bg-input/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                                <Lock className="h-4 w-4" />
                                Password
                            </label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                className="bg-input/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="magical"
                            className="w-full"
                            disabled={isLoading || !email.trim() || !password.trim()}
                        >
                            {isLoading ? "Entering..." : "Enter the Dream Realm"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-primary hover:underline font-medium">
                            Create one now
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
