import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { FileText, GitBranch, CheckCircle, Zap, Shield } from "lucide-react";
import { useUser } from "@/contexts/UserContext"; // Added import

const FeatureCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
  <div className="bg-card p-6 rounded-lg border">
    <div className="flex items-center gap-4 mb-4">
      <div className="bg-primary/10 p-3 rounded-lg">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, loading } = useUser(); // Added useUser hook

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="container mx-auto px-6 py-4 flex justify-between items-center border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <span className="text-xl font-bold">Archi</span>
        </div>
        <div className="flex items-center gap-4">
          {loading ? (
            <div>Loading...</div>
          ) : user ? (
            <>
              <span className="text-muted-foreground">Welcome, {user.name || user.email}!</span>
              <Button onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Log In
              </Button>
              <Button onClick={() => navigate('/signup')}>
                Get Started
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-24 text-center">
        <Badge variant="outline" className="mb-4">
          The future of SDLC documentation is here
        </Badge>
        <h1 className="text-5xl font-extrabold tracking-tight md:text-6xl">
          Actionable Documentation, Seamless Workflow
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
          Archi transforms your SDLC documentation into a first-class, traceable, and actionable asset. Stop searching, start building.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button size="lg" onClick={() => navigate('/signup')}>
            Sign Up for Free
          </Button>
          <Button size="lg" variant="outline">
            Request a Demo
          </Button>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Why Archi?</h2>
            <p className="text-muted-foreground mt-2">
              Everything you need to manage your software lifecycle documentation.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={FileText}
              title="Notebook-Style Editor"
              description="A powerful, block-based editor for creating rich, versioned documentation for every phase of your SDLC."
            />
            <FeatureCard
              icon={GitBranch}
              title="GitHub Integration"
              description="Automatically link commits and pull requests to tasks and documentation, ensuring full traceability from code to requirements."
            />
            <FeatureCard
              icon={CheckCircle}
              title="Review & Approval Workflows"
              description="Implement quality gates with formal review and approval processes for documentation blocks and tasks."
            />
            <FeatureCard
              icon={Zap}
              title="Smart Task Management"
              description="Create, assign, and track tasks with AI-powered suggestions and context from your documentation."
            />
             <FeatureCard
              icon={Shield}
              title="Hierarchical Tagging"
              description="Organize your knowledge with a flexible, hierarchical tagging system that makes discovery intuitive and powerful."
            />
             <FeatureCard
              icon={FileText}
              title="Centralized Knowledge"
              description="A single source of truth for your entire team, ensuring everyone is aligned and informed."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Archi. All rights reserved.</p>
      </footer>
    </div>
  );
}