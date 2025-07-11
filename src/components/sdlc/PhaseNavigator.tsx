
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Lock } from "lucide-react";

interface Phase {
  id: string;
  name: string;
  color: string;
  enabled: boolean;
}

interface PhaseNavigatorProps {
  phases: Phase[];
  activePhase: string;
  onPhaseSelect: (phaseId: string) => void;
}

export function PhaseNavigator({ phases, activePhase, onPhaseSelect }: PhaseNavigatorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {phases.map((phase, index) => {
        const isActive = activePhase === phase.id;
        const isEnabled = phase.enabled;
        
        return (
          <Button
            key={phase.id}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => isEnabled && onPhaseSelect(phase.id)}
            disabled={!isEnabled}
            className={`relative ${isActive ? 'ring-2 ring-primary ring-offset-2' : ''}`}
          >
            <div className={`w-2 h-2 rounded-full mr-2 ${phase.color}`} />
            {phase.name}
            {!isEnabled && <Lock className="h-3 w-3 ml-2" />}
            {isEnabled && index < phases.findIndex(p => p.id === activePhase) && (
              <CheckCircle className="h-3 w-3 ml-2 text-green-500" />
            )}
          </Button>
        );
      })}
    </div>
  );
}
