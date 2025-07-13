
import React from 'react';
import { Button } from "@/components/ui/button";

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
  return (
    <div className="grid grid-cols-6 gap-2">
      {predefinedColors.map((color) => (
        <Button
          key={color}
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          className={`w-8 h-8 p-0 border-2 ${
            selectedColor === color ? 'border-primary' : 'border-muted'
          }`}
          style={{ backgroundColor: color }}
          onClick={() => onColorSelect(color)}
        />
      ))}
    </div>
  );
}
