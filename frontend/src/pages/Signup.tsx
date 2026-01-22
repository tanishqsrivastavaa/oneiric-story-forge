import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon, Lock, Mail, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

export function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
            toast({
                title: "Missing Fields",
                description: "Please fill in all fields.",
                variant: "destructive",
            });
            return;
        }

        if (password !== confirmPassword) {
            toast({
                title: "Passwords Don't Match",
                description: "Please ensure both password fields match.",
                variant: "destructive",
            });
            return;
        }

        if (password.length < 6) {
            toast({
                title: "Password Too Short",
                description: "Password must be at least 6 characters long.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/signup`, {
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
                throw new Error(data.detail || "Signup failed");
            }

            const data = await response.json();
            login(data.email, data.access_token);

            toast({
                title: "Welcome to the Dream Realm! ✨",
                description: "Your account has been created successfully.",
            });

            navigate("/");
        } catch (error) {
            toast({
                title: "Signup Failed",
                description: error instanceof Error ? error.message : "Unable to create account. Please try again.",
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
                        Join the Dream Realm
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Create your account and start your dream journey
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

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                                <Lock className="h-4 w-4" />
                                Confirm Password
                            </label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={isLoading}
                                className="bg-input/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="magical"
                            className="w-full"
                            disabled={isLoading || !email.trim() || !password.trim() || !confirmPassword.trim()}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 animate-spin" />
                                    Creating Account...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-4 w-4" />
                                    Create Account
                                </div>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link to="/login" className="text-primary hover:underline font-medium">
                            Log in here
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
