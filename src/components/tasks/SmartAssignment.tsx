
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Brain, Clock, Star, TrendingUp } from "lucide-react";

const mockSuggestions = [
  {
    task: 'Implement JWT Refresh Logic',
    description: 'Add automatic token refresh functionality',
    tags: ['#auth', '#jwt', '#api'],
    estimatedHours: 6,
    suggestions: [
      { name: 'Luis', score: 95, reasons: ['Expert in JWT', 'Available 8h/day', 'High velocity'], avatar: 'LU' },
      { name: 'Raj', score: 88, reasons: ['Auth experience', 'Available 6h/day', 'Good velocity'], avatar: 'RA' },
      { name: 'Carlos', score: 72, reasons: ['API knowledge', 'Available 4h/day', 'Medium velocity'], avatar: 'CA' }
    ]
  },
  {
    task: 'Design Password Strength UI',
    description: 'Create password strength indicator component',
    tags: ['#ui', '#password', '#component'],
    estimatedHours: 4,
    suggestions: [
      { name: 'Aisha', score: 92, reasons: ['UI/UX expert', 'Available 7h/day', 'Component specialist'], avatar: 'AI' },
      { name: 'Luis', score: 78, reasons: ['React expertise', 'Available 8h/day', 'Good design sense'], avatar: 'LU' },
      { name: 'Raj', score: 65, reasons: ['Frontend knowledge', 'Available 6h/day', 'Learning UI'], avatar: 'RA' }
    ]
  }
];

export function SmartAssignment() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Brain className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">AI-Powered Task Assignment</h2>
          <p className="text-muted-foreground text-sm">
            Smart suggestions based on skills, availability, and velocity
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {mockSuggestions.map((item, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{item.task}</CardTitle>
                  <p className="text-muted-foreground text-sm mt-1">{item.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {item.estimatedHours}h
                    </div>
                  </div>
                </div>
                <Button size="sm">
                  Assign Best Match
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="font-medium">Recommended Assignees</h4>
                <div className="space-y-3">
                  {item.suggestions.map((suggestion, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>{suggestion.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{suggestion.name}</span>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm font-medium">{suggestion.score}%</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {suggestion.reasons.map((reason, reasonIdx) => (
                              <span key={reasonIdx} className="flex items-center gap-1">
                                {reasonIdx === 0 && <TrendingUp className="h-3 w-3" />}
                                {reason}
                                {reasonIdx < suggestion.reasons.length - 1 && '•'}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <Progress value={suggestion.score} className="w-20" />
                          <span className="text-xs text-muted-foreground">Match Score</span>
                        </div>
                        <Button 
                          variant={idx === 0 ? "default" : "outline"} 
                          size="sm"
                        >
                          {idx === 0 ? 'Assign' : 'Select'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
