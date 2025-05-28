"use client";

import { SignInButton } from "@/components/auth/SignInButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Aperture } from "lucide-react";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  if (loading || (!loading && user)) {
    // Show a loader or nothing while redirecting or if user is already logged in
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Aperture className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Aperture className="h-8 w-8" />
          </div>
          <CardTitle className="text-3xl font-bold">SocioPilot Lite</CardTitle>
          <CardDescription>AI-Powered Social Media Management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <p className="text-center text-muted-foreground">
              Sign in to manage and automate your social media presence.
            </p>
            <SignInButton />
          </div>
        </CardContent>
      </Card>
       <footer className="mt-8 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} SocioPilot Lite. All rights reserved.
      </footer>
    </div>
  );
}
