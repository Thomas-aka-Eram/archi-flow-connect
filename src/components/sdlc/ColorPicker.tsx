
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  disabled?: boolean;
}

const predefinedColors = [
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#EC4899', // Pink
  '#6366F1', // Indigo
  '#84CC16', // Lime
  '#F97316', // Orange
  '#06B6D4', // Cyan
  '#8B5A2B', // Brown
  '#6B7280', // Gray
];

export function ColorPicker({ selectedColor, onColorSelect, disabled }: ColorPickerProps) {
  const [hexInput, setHexInput] = useState(selectedColor);
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  const handleHexChange = (value: string) => {
    setHexInput(value);
    // Validate hex color format
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
      // Reset to current selected color if invalid
      setHexInput(selectedColor);
    }
  };

  return (
    <div className="space-y-4">
      {/* Predefined Colors */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Quick Colors</Label>
        <div className="grid grid-cols-6 gap-2">
          {predefinedColors.map((color) => (
            <Button
              key={color}
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
              className={`w-8 h-8 p-0 border-2 ${
                selectedColor === color ? 'border-primary ring-2 ring-primary/20' : 'border-muted'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => onColorSelect(color)}
            />
          ))}
        </div>
      </div>

      {/* Custom Color Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Custom Color</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowCustomPicker(!showCustomPicker)}
            disabled={disabled}
          >
            {showCustomPicker ? 'Hide' : 'More Options'}
          </Button>
        </div>

        {/* Hex Input */}
        <div className="flex gap-2 items-end">
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
              className="text-sm"
              onBlur={handleHexSubmit}
              onKeyPress={(e) => e.key === 'Enter' && handleHexSubmit()}
            />
          </div>
          <div 
            className="w-10 h-10 rounded border-2 border-muted"
            style={{ backgroundColor: selectedColor }}
          />
        </div>

        {/* Native Color Picker */}
        {showCustomPicker && (
          <div>
            <Label htmlFor="color-picker" className="text-xs text-muted-foreground block mb-1">
              Color Picker
            </Label>
            <input
              id="color-picker"
              type="color"
              value={selectedColor}
              onChange={(e) => {
                onColorSelect(e.target.value);
                setHexInput(e.target.value);
              }}
              disabled={disabled}
              className="w-full h-10 rounded border cursor-pointer disabled:cursor-not-allowed"
            />
          </div>
        )}
      </div>

      {/* Color Preview */}
      <div className="p-3 border rounded-lg bg-muted/30">
        <div className="flex items-center gap-3">
          <div 
            className="w-6 h-6 rounded-full border"
            style={{ backgroundColor: selectedColor }}
          />
          <div>
            <p className="text-sm font-medium">Selected Color</p>
            <p className="text-xs text-muted-foreground">{selectedColor}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
