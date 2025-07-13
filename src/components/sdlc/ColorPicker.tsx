
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp, Palette } from "lucide-react";

interface ColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  disabled?: boolean;
}

const predefinedColors = [
  '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899',
  '#6366F1', '#84CC16', '#F97316', '#06B6D4', '#8B5A2B', '#6B7280',
];

export function ColorPicker({ selectedColor, onColorSelect, disabled }: ColorPickerProps) {
  const [hexInput, setHexInput] = useState(selectedColor);
  const [showQuickColors, setShowQuickColors] = useState(false);

  const handleHexChange = (value: string) => {
    setHexInput(value);
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (hexRegex.test(value)) {
      onColorSelect(value);
    }
  };

  const handleHexSubmit = () => {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (hexRegex.test(hexInput)) {
      onColorSelect(hexInput);
    } else {
      setHexInput(selectedColor);
    }
  };

  return (
    <div className="space-y-4">
      {/* Primary Color Picker */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Pick a custom color:</Label>
        
        {/* Native Color Picker - Primary */}
        <div className="flex gap-3 items-center">
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => {
              onColorSelect(e.target.value);
              setHexInput(e.target.value);
            }}
            disabled={disabled}
            className="w-12 h-12 rounded-lg border-2 border-muted cursor-pointer disabled:cursor-not-allowed"
          />
          <div className="flex-1">
            <Label htmlFor="hex-input" className="text-xs text-muted-foreground">
              Hex Code
            </Label>
            <Input
              id="hex-input"
              value={hexInput}
              onChange={(e) => handleHexChange(e.target.value)}
              placeholder="#3B82F6"
              disabled={disabled}
              className="text-sm font-mono"
              onBlur={handleHexSubmit}
              onKeyPress={(e) => e.key === 'Enter' && handleHexSubmit()}
            />
          </div>
        </div>
      </div>

      {/* Quick Colors Dropdown */}
      <div className="space-y-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowQuickColors(!showQuickColors)}
          disabled={disabled}
          className="w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Choose from quick colors
          </span>
          {showQuickColors ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        
        {showQuickColors && (
          <div className="grid grid-cols-6 gap-2 p-3 border rounded-lg bg-muted/30">
            {predefinedColors.map((color) => (
              <Button
                key={color}
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled}
                className={`w-8 h-8 p-0 border-2 transition-all hover:scale-110 ${
                  selectedColor === color ? 'border-primary ring-2 ring-primary/20 scale-110' : 'border-muted'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => {
                  onColorSelect(color);
                  setHexInput(color);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Color Preview */}
      <div className="p-3 border rounded-lg bg-muted/30">
        <div className="flex items-center gap-3">
          <div 
            className="w-6 h-6 rounded-full border-2 border-border"
            style={{ backgroundColor: selectedColor }}
          />
          <div>
            <p className="text-sm font-medium">Selected Color</p>
            <p className="text-xs text-muted-foreground font-mono">{selectedColor}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
