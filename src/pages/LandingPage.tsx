
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowRight, 
  CheckCircle, 
  GitBranch, 
  Users, 
  BarChart3,
  FileText,
  Zap,
  Shield,
  Star
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: FileText,
      title: "SDLC Document Linking",
      description: "Connect requirements, design docs, and code with intelligent traceability"
    },
    {
      icon: Zap,
      title: "AI Task Suggestions",
      description: "Smart recommendations based on your project context and team capacity"
    },
    {
      icon: GitBranch,
      title: "Git Integration",
      description: "Seamless integration with GitHub, GitLab, and other version control systems"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Deep insights into project progress, team performance, and bottlenecks"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Engineering Manager",
      company: "TechCorp",
      content: "Archi transformed how we manage our SDLC. The traceability between requirements and code is a game-changer.",
      rating: 5
    },
    {
      name: "Mike Rodriguez",
      role: "Product Manager",
      company: "StartupXYZ",
      content: "Finally, a tool that bridges the gap between documentation and development. Our team velocity increased by 40%.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold">Archi</span>
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
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="outline" className="mb-6">
            Manage projects the SDLC-native way
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Project Management<br />
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Built for Developers
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Bridge the gap between documentation and development with intelligent traceability, 
            AI-powered insights, and seamless SDLC integration.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" onClick={() => navigate('/signup')}>
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need for SDLC management</h2>
            <p className="text-xl text-muted-foreground">
              From requirements to deployment, manage your entire development lifecycle
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Trusted by development teams</h2>
            <p className="text-xl text-muted-foreground">
              See what our users say about Archi
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-lg mb-4">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="font-semibold text-primary">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to transform your SDLC?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of teams already using Archi to build better software
          </p>
          <Button size="lg" variant="secondary" onClick={() => navigate('/signup')}>
            Get Started Today
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
