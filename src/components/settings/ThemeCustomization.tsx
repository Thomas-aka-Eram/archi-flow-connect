import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, RotateCcw, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Quick color presets
const quickColors = [
  { name: 'Default Red', value: '346 100% 58%', hex: '#E23C4D' },
  { name: 'Ocean Blue', value: '210 100% 60%', hex: '#3366FF' },
  { name: 'Forest Green', value: '140 100% 45%', hex: '#00E64D' },
  { name: 'Royal Purple', value: '260 100% 65%', hex: '#8A2BE2' },
  { name: 'Sunset Orange', value: '25 100% 60%', hex: '#FF6633' },
  { name: 'Emerald', value: '158 100% 50%', hex: '#00FF7F' },
  { name: 'Pink Rose', value: '330 100% 70%', hex: '#FF69B4' },
  { name: 'Amber Gold', value: '45 100% 55%', hex: '#FFB84D' },
];

interface ThemeCustomizationProps {
  canCustomize?: boolean;
}

export function ThemeCustomization({ canCustomize = true }: ThemeCustomizationProps) {
  const { toast } = useToast();
  const [selectedColor, setSelectedColor] = useState(quickColors[0]);
  const [customHex, setCustomHex] = useState('#E23C4D');
  const [previewMode, setPreviewMode] = useState(false);

  // Convert hex to HSL
  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  // Apply theme color
  const applyThemeColor = (hslValue: string, preview = false) => {
    if (!canCustomize && !preview) return;
    
    const root = document.documentElement;
    if (preview) {
      root.style.setProperty('--primary', hslValue);
      root.style.setProperty('--ring', hslValue);
      root.style.setProperty('--sidebar-primary', hslValue);
      root.style.setProperty('--sidebar-ring', hslValue);
    } else {
      // In a real app, this would save to user preferences/database
      localStorage.setItem('theme-primary-color', hslValue);
      root.style.setProperty('--primary', hslValue);
      root.style.setProperty('--ring', hslValue);
      root.style.setProperty('--sidebar-primary', hslValue);
      root.style.setProperty('--sidebar-ring', hslValue);
      
      toast({
        title: "Theme Updated",
        description: "Your primary color has been saved successfully.",
      });
    }
  };

  // Reset to default
  const resetToDefault = () => {
    const defaultColor = '346 100% 58%';
    setSelectedColor(quickColors[0]);
    setCustomHex('#E23C4D');
    applyThemeColor(defaultColor);
    localStorage.removeItem('theme-primary-color');
  };

  // Handle custom hex input
  const handleCustomHexChange = (hex: string) => {
    if (hex.match(/^#[0-9A-Fa-f]{6}$/)) {
      const hslValue = hexToHsl(hex);
      setCustomHex(hex);
      setSelectedColor({ name: 'Custom', value: hslValue, hex });
      if (previewMode) {
        applyThemeColor(hslValue, true);
      }
    }
  };

  // Handle quick color selection
  const handleQuickColorSelect = (color: typeof quickColors[0]) => {
    setSelectedColor(color);
    setCustomHex(color.hex);
    if (previewMode) {
      applyThemeColor(color.value, true);
    }
  };

  // Toggle preview mode
  const togglePreview = () => {
    const newPreviewMode = !previewMode;
    setPreviewMode(newPreviewMode);
    
    if (newPreviewMode) {
      applyThemeColor(selectedColor.value, true);
    } else {
      // Restore saved color or default
      const savedColor = localStorage.getItem('theme-primary-color') || '346 100% 58%';
      applyThemeColor(savedColor, true);
    }
  };

  // Load saved color on mount
  useEffect(() => {
    const savedColor = localStorage.getItem('theme-primary-color');
    if (savedColor) {
      // Find matching quick color or set as custom
      const matching = quickColors.find(c => c.value === savedColor);
      if (matching) {
        setSelectedColor(matching);
        setCustomHex(matching.hex);
      }
      applyThemeColor(savedColor, true);
    }
  }, []);

  if (!canCustomize) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Palette className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Theme Customization Restricted</h3>
          <p className="text-muted-foreground">
            Only PM and Admin users can customize the theme colors for the project.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Theme Color Customization
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Customize your primary color for buttons, alerts, active tabs, and key interface elements.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs defaultValue="quick" className="space-y-4">
          <TabsList>
            <TabsTrigger value="quick">Quick Colors</TabsTrigger>
            <TabsTrigger value="custom">Custom Color</TabsTrigger>
          </TabsList>

          <TabsContent value="quick" className="space-y-4">
            <div className="grid grid-cols-4 gap-3">
              {quickColors.map((color) => (
                <button
                  key={color.name}
                  className={`relative p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                    selectedColor.hex === color.hex ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                  }`}
                  onClick={() => handleQuickColorSelect(color)}
                >
                  <div 
                    className="w-full h-8 rounded-md mb-2"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="text-xs font-medium text-center">{color.name}</div>
                  {selectedColor.hex === color.hex && (
                    <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hex-input">Hex Color Code</Label>
                <div className="flex gap-3">
                  <div 
                    className="w-12 h-10 rounded border border-border"
                    style={{ backgroundColor: customHex }}
                  />
                  <Input
                    id="hex-input"
                    value={customHex}
                    onChange={(e) => handleCustomHexChange(e.target.value)}
                    placeholder="#FF6600"
                    className="font-mono"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="color-picker">Or use color picker</Label>
                <input
                  id="color-picker"
                  type="color"
                  value={customHex}
                  onChange={(e) => handleCustomHexChange(e.target.value)}
                  className="w-full h-10 rounded border border-border cursor-pointer"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Preview Section */}
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Preview</h4>
            <Button 
              variant="outline" 
              size="sm"
              onClick={togglePreview}
            >
              {previewMode ? 'Stop Preview' : 'Live Preview'}
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button size="sm">Primary Button</Button>
            <Button variant="outline" size="sm">Outline Button</Button>
            <Badge>Active Badge</Badge>
            <Badge variant="secondary">Secondary Badge</Badge>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Preview shows how your selected color will appear on interface elements.
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button 
            variant="ghost" 
            onClick={resetToDefault}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Default
          </Button>
          
          <Button 
            onClick={() => applyThemeColor(selectedColor.value)}
            disabled={!canCustomize}
          >
            Save Theme
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          <p><strong>Current selection:</strong> {selectedColor.name} ({selectedColor.hex})</p>
          <p><strong>HSL value:</strong> {selectedColor.value}</p>
        </div>
      </CardContent>
    </Card>
  );
}