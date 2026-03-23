"use client";

import { useState } from "react";
import { Chessboard, themePresets } from "@mdwebb/react-chess";
import type { CustomTheme, ChessboardThemePreset } from "@mdwebb/react-chess";
import { CodeBlock } from "@/components/CodeBlock";
import { FadeIn } from "@/components/Motion";

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  // Extract hex for the color picker (fallback for rgba values)
  const hexValue = value.startsWith("#") ? value : "#b58863";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      <input
        type="color"
        value={hexValue}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "2.5rem",
          height: "2.5rem",
          border: "2px solid var(--border)",
          borderRadius: "0.5rem",
          cursor: "pointer",
          background: "transparent",
          padding: "2px",
        }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--fg-secondary)", marginBottom: "0.25rem" }}>
          {label}
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            fontSize: "0.75rem",
            padding: "0.375rem 0.5rem",
            border: "1px solid var(--border)",
            borderRadius: "0.375rem",
            width: "100%",
            fontFamily: "ui-monospace, monospace",
            background: "var(--bg-tertiary)",
            color: "var(--fg)",
          }}
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

  const updateTheme = (key: keyof CustomTheme, value: string) => {
    setCustomTheme((prev) => ({ ...prev, [key]: value }));
    setActivePreset("");
  };

  const loadPreset = (preset: ChessboardThemePreset) => {
    setCustomTheme({ ...themePresets[preset] });
    setActivePreset(preset);
  };

  return (
    <div style={{ padding: "2.5rem 1.5rem", maxWidth: "72rem", margin: "0 auto" }}>
      <div className="page-header">
        <h1>Theme Customizer</h1>
        <p>
          Design custom board themes with live color pickers. Start from a preset
          and tweak every color, or build from scratch.
        </p>
      </div>

      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        {/* Board */}
        <div >
          <Chessboard
            width={450}
            height={450}
            theme={customTheme}
            showBoardControls={true}
            autoPromoteToQueen={true}
          />
        </div>

        {/* Controls */}
        <div  style={{ flex: 1, minWidth: "300px" }}>
          {/* Presets */}
          <div className="card" style={{ padding: "1.25rem", marginBottom: "1rem" }}>
            <label className="label">Presets</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem" }}>
              {(["brown", "blue", "green", "gray"] as const).map((preset) => (
                <button
                  key={preset}
                  onClick={() => loadPreset(preset)}
                  className="btn btn--sm"
                  style={{
                    justifyContent: "center",
                    background: activePreset === preset ? "var(--accent)" : "var(--bg-tertiary)",
                    color: activePreset === preset ? "#0c0c0f" : "var(--fg-secondary)",
                    border: activePreset === preset ? "none" : "1px solid var(--border)",
                    textTransform: "capitalize",
                  }}
                >
                  <span
                    style={{
                      width: "0.75rem",
                      height: "0.75rem",
                      borderRadius: "50%",
                      background: themePresets[preset].darkSquare,
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  />
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Color pickers */}
          <div className="card" style={{ padding: "1.25rem", marginBottom: "1rem" }}>
            <label className="label">Square Colors</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
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

            <div style={{ height: "1px", background: "var(--border)", margin: "1rem 0" }} />

            <label className="label">Interaction Colors</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
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
          </div>

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
