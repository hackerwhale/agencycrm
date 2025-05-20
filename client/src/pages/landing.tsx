import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const [_, navigate] = useLocation();

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    navigate("/dashboard");
  }

  const handleLogin = () => {
    setIsLoading(true);
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted">
      <header className="container mx-auto py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="font-bold text-2xl">AgencyCRM</div>
        </div>
        <Button onClick={handleLogin} variant="outline" className="px-6" disabled={isLoading}>
          {isLoading ? "Redirecting..." : "Log In"}
        </Button>
      </header>

      <main className="flex-1 container mx-auto flex flex-col md:flex-row items-center justify-center py-12 px-4">
        <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Manage your SMMA clients with ease
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            A comprehensive platform to manage client information, projects, and payment history for your social media marketing agency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleLogin} size="lg" className="px-8" disabled={isLoading}>
              {isLoading ? "Redirecting..." : "Get Started"}
            </Button>
          </div>
        </div>
        <div className="md:w-1/2 bg-muted/50 p-8 rounded-lg border border-border">
          <div className="aspect-video bg-background rounded-md flex items-center justify-center">
            <div className="text-4xl opacity-80">✨ AgencyCRM</div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-2">
            {["Clients", "Projects", "Payments", "Reports", "Analytics", "Customizable"].map((feature) => (
              <div key={feature} className="bg-background border border-border rounded-md p-2 text-center text-sm">
                {feature}
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-muted/30 border-t border-border py-6">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} AgencyCRM. All rights reserved.
        </div>
      </footer>
    </div>
  );
}