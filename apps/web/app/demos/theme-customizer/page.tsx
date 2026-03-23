"use client";

import { useState } from "react";
import { Chessboard, themePresets } from "@mdwebb/react-chess";
import type { CustomTheme, ChessboardThemePreset } from "@mdwebb/react-chess";
import { CodeBlock } from "@/components/CodeBlock";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMaxBoardSize } from "@/hooks/useMaxBoardSize";
import { cn } from "@/lib/utils";

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const hexValue = value.startsWith("#") ? value : "#b58863";

  return (
    <div className="flex items-center gap-3">
      <input
        type="color"
        value={hexValue}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-10 cursor-pointer rounded-lg border-2 border-border bg-transparent p-0.5"
      />
      <div className="flex-1">
        <div className="mb-1 text-xs font-semibold text-(--fg-secondary)">
          {label}
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md border border-border bg-(--bg-tertiary) px-2 py-1.5 font-mono text-xs text-(--fg)"
        />
      </div>
    </div>
  );
}

export default function ThemeCustomizerDemo() {
  const [customTheme, setCustomTheme] = useState<CustomTheme>({
    ...themePresets.brown,
  });
  const [activePreset, setActivePreset] = useState<string>("brown");
  const maxSize = useMaxBoardSize();
  const effectiveSize = Math.min(450, maxSize);

  const updateTheme = (key: keyof CustomTheme, value: string) => {
    setCustomTheme((prev) => ({ ...prev, [key]: value }));
    setActivePreset("");
  };

  const loadPreset = (preset: ChessboardThemePreset) => {
    setCustomTheme({ ...themePresets[preset] });
    setActivePreset(preset);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-7">
        <h1 className="mb-1 text-2xl font-extrabold tracking-tight sm:text-3xl">Theme Customizer</h1>
        <p className="max-w-xl text-(--fg-secondary)">
          Design custom board themes with live color pickers. Start from a preset
          and tweak every color, or build from scratch.
        </p>
      </div>

      <div className="flex flex-wrap gap-8">
        {/* Board */}
        <div>
          <Chessboard
            width={effectiveSize}
            height={effectiveSize}
            theme={customTheme}
            showBoardControls={true}
            autoPromoteToQueen={true}
          />
        </div>

        {/* Controls */}
        <div className="min-w-70 flex-1">
          {/* Presets */}
          <Card className="mb-4" size="sm">
            <CardContent>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-(--fg-secondary)">Presets</label>
              <div className="grid grid-cols-4 gap-2">
                {(["brown", "blue", "green", "gray"] as const).map((preset) => (
                  <Button
                    key={preset}
                    size="sm"
                    variant={activePreset === preset ? "default" : "outline"}
                    onClick={() => loadPreset(preset)}
                    className="capitalize"
                  >
                    <span
                      className="size-3 rounded-full border border-white/10"
                      style={{ background: themePresets[preset].darkSquare }}
                    />
                    {preset}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Color pickers */}
          <Card className="mb-4" size="sm">
            <CardContent>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-(--fg-secondary)">Square Colors</label>
              <div className="flex flex-col gap-3">
                <ColorInput
                  label="Light Square"
                  value={customTheme.lightSquare}
                  onChange={(v) => updateTheme("lightSquare", v)}
                />
                <ColorInput
                  label="Dark Square"
                  value={customTheme.darkSquare}
                  onChange={(v) => updateTheme("darkSquare", v)}
                />
              </div>

              <div className="my-4 h-px bg-border" />

              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-(--fg-secondary)">Interaction Colors</label>
              <div className="flex flex-col gap-3">
                <ColorInput
                  label="Selected Square"
                  value={customTheme.selectedSquare || "rgba(20, 85, 30, 0.5)"}
                  onChange={(v) => updateTheme("selectedSquare", v)}
                />
                <ColorInput
                  label="Last Move Highlight"
                  value={customTheme.lastMoveHighlight || "rgba(155, 199, 0, 0.41)"}
                  onChange={(v) => updateTheme("lastMoveHighlight", v)}
                />
                <ColorInput
                  label="Move Destination"
                  value={customTheme.moveDestination || "rgba(20, 85, 30, 0.5)"}
                  onChange={(v) => updateTheme("moveDestination", v)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Generated code */}
          <CodeBlock
            title="Generated Theme"
            code={`<Chessboard
  theme={{
    lightSquare: "${customTheme.lightSquare}",
    darkSquare: "${customTheme.darkSquare}",
    selectedSquare: "${customTheme.selectedSquare}",
    lastMoveHighlight: "${customTheme.lastMoveHighlight}",
    moveDestination: "${customTheme.moveDestination}",
  }}
/>`}
          />
        </div>
      </div>
    </div>
  );
}
