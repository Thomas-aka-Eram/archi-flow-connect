
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  CheckCircle, 
  GitBranch, 
  FileText, 
  Users, 
  Zap,
  Star,
  Play
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: <FileText className="h-6 w-6" />,
    title: "SDLC-Native Documentation",
    description: "Create structured documentation that follows your development lifecycle with intelligent linking between phases."
  },
  {
    icon: <GitBranch className="h-6 w-6" />,
    title: "Traceability Matrix",
    description: "Automatically track relationships between requirements, designs, code, and tests with visual mapping."
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Collaborative Workflow",
    description: "Real-time collaboration with role-based access, comments, and review workflows for distributed teams."
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "AI-Powered Insights",
    description: "Get intelligent task suggestions, automated tagging, and smart project recommendations."
  }
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Senior PM at TechCorp",
    content: "Archi transformed how we manage complex projects. The SDLC integration saved us 40% time on documentation.",
    rating: 5
  },
  {
    name: "Marcus Rodriguez", 
    role: "Engineering Lead at DevHouse",
    content: "Finally, a tool that understands software development. The traceability features are game-changing.",
    rating: 5
  }
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <span className="text-xl font-bold">Archi</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button onClick={() => navigate('/signup')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            🚀 Now supporting multi-project management
          </Badge>
          
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
            Manage projects the{" "}
            <span className="text-primary">SDLC-native</span> way
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Archi bridges the gap between documentation and development with intelligent 
            traceability, collaborative workflows, and AI-powered project insights.
          </p>
          
          <div className="flex items-center gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/signup')}>
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              <Play className="mr-2 h-4 w-4" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Built for Modern Development Teams
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to manage complex software projects from requirements to deployment
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-lg w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Why Choose Archi Over Traditional Tools?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-muted-foreground">
                Traditional Tools (Jira + Confluence)
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                  </div>
                  <span className="text-muted-foreground">Disconnected documentation and task management</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                  </div>
                  <span className="text-muted-foreground">Manual traceability maintenance</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                  </div>
                  <span className="text-muted-foreground">Complex setup and configuration</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4 text-primary">
                Archi Platform
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>Integrated SDLC documentation and task management</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>Automatic traceability matrix generation</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>Ready-to-use templates and AI assistance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Trusted by Development Teams
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Project Management?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join hundreds of development teams already using Archi to deliver better software faster.
          </p>
          <Button size="lg" onClick={() => navigate('/signup')}>
            Start Your Free Trial
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-semibold">Archi</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Archi. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
