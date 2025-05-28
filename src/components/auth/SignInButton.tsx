"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ChromeIcon } from "lucide-react"; // Using Chrome icon as a stand-in for Google

export function SignInButton() {
  const { signInWithGoogle, loading } = useAuth();

  return (
    <Button onClick={signInWithGoogle} disabled={loading} className="w-full" size="lg">
      <ChromeIcon className="mr-2 h-5 w-5" />
      {loading ? "Signing in..." : "Sign in with Google"}
    </Button>
  );
}
