"use client";

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, LogIn } from "lucide-react";
import { signIn } from "next-auth/react";

export function SnippetFormAuth() {
  return (
    <div className="w-full max-w-md mx-auto px-4 py-12">
      <Card className="border shadow-md text-center">
        <CardHeader className="space-y-1 pb-2">
          <ShieldAlert className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <CardTitle className="text-xl">Authentication Required</CardTitle>
          <CardDescription>
            You need to be signed in to submit code snippets
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 pb-2">
          <p className="text-sm text-muted-foreground mb-6">
            Sign in to your account to save and share your code snippets with the community.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center pt-2 pb-6">
          <Button onClick={() => signIn()} className="w-full max-w-xs">
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}