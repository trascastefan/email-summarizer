"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export default function LoginPage() {
  const handleGoogleSignIn = () => {
    signIn("google", { 
      callbackUrl: "/dashboard" 
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Mail className="w-16 h-16 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-4">
          Email Summarizer Login
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Connect your Gmail account to start summarizing emails
        </p>
        <Button 
          onClick={handleGoogleSignIn} 
          className="w-full"
          variant="default"
        >
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}
