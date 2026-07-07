import React from "react";
import { AppCustomizations } from "../types";
import { Paintbrush, Layout, Type, Layers, Check, Play, Eye } from "lucide-react";

interface CustomizerPanelProps {
  customizations: AppCustomizations;
  onChange: (updated: AppCustomizations) => void;
  onPreview: () => void;
  isLoggedIn: boolean;
}

const ACCENT_COLORS = [
  { name: "Monolith Orange", value: "#f27d26" },
  { name: "Cyan Spark", value: "#00e5ff" },
  { name: "Neon Rose", value: "#ff2a6d" },
  { name: "Cyber Green", value: "#00ff66" },
  { name: "Gold Standard", value: "#ffd700" },
  { name: "Pure Silver", value: "#ffffff" },
];

const GRID_STYLES = [
  { name: "Sparse Grid", value: "sparse", desc: "40px structural grid" },
  { name: "Dense Grid", value: "dense", desc: "16px dense layout" },
  { name: "Radial Dot Mesh", value: "dot", desc: "Digital pattern" },
  { name: "Stark Matte", value: "none", desc: "Pure deep pitch black" },
];

const FONTS = [
  { name: "Space Grotesk", value: "Space Grotesk", desc: "Brutalist Swiss neo-grotesque" },
  { name: "Playfair Display", value: "Playfair Display", desc: "Editorial high-contrast Serif" },
  { name: "JetBrains Mono", value: "JetBrains Mono", desc: "Consolized technical monospaced" },
];

export default function CustomizerPanel({
  customizations,
  onChange,
  onPreview,
  isLoggedIn,
}: CustomizerPanelProps) {
  const updateCustomization = <K extends keyof AppCustomizations>(
    key: K,
    value: AppCustomizations[K]
  ) => {
    onChange({
      ...customizations,
      [key]: value,
    });
  };

  return (
    <div className="bg-surface border-2 border-white p-5 space-y-6 relative w-full text-left">
      {/* Decorative ledger details */}
      <span className="absolute top-1 right-2 text-[8px] font-mono text-white/30 tracking-widest">
        DEV_PANEL_V2.6 // SECURE_STREAM
      </span>

      <div className="border-b border-white/20 pb-2">
        <h3 className="font-headline font-black text-sm uppercase tracking-wider text-primary flex items-center gap-2">
          <Paintbrush className="w-4 h-4" />
          Workspace Editor
        </h3>
        <p className="text-[10px] text-on-surface-variant font-mono mt-0.5">
          TWEAK REALTIME ARCHITECTURAL THEMES & GRIDS
        </p>
      </div>

      {/* Persistence indicator */}
      <div className="bg-surface-dim border border-white/10 p-2.5 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <div
            className={`w-1.5 h-1.5 ${isLoggedIn ? "bg-primary" : "bg-yellow-500"} animate-pulse`}
          />
          <span className="text-[10px]">
            {isLoggedIn ? "PERSISTED ON YOUR CLOUD PROFILE" : "PERSISTED LOCALLY (GUEST)"}
          </span>
        </div>
        {!isLoggedIn && (
          <span className="text-[8px] text-primary font-bold uppercase animate-pulse">
            Sign in to save online
          </span>
        )}
      </div>

      {/* 1. Accent Color option selection */}
      <div className="space-y-2">
        <label className="block text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">
          01 // Accent Hue
        </label>
        <div className="grid grid-cols-3 gap-2">
          {ACCENT_COLORS.map(color => {
            const isSelected = customizations.accentColor === color.value;
            return (
              <button
                key={color.value}
                onClick={() => updateCustomization("accentColor", color.value)}
                className={`py-2 px-1 text-[10px] font-mono border flex flex-col items-center justify-center gap-1 h-14 relative transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10 text-white"
                    : "border-white/10 hover:border-white/30 text-on-surface-variant hover:text-white"
                }`}
                style={{ contentVisibility: "auto" }}
              >
                <span
                  className="w-4 h-4 border border-white/40"
                  style={{ backgroundColor: color.value }}
                />
                <span className="truncate max-w-full text-[8px] leading-none tracking-tight">
                  {color.name}
                </span>
                {isSelected && (
                  <Check className="absolute top-1 right-1 w-2.5 h-2.5 text-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Grid Style Background pattern choices */}
      <div className="space-y-2">
        <label className="block text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">
          02 // Grid Mesh Sizing
        </label>
        <div className="grid grid-cols-2 gap-2">
          {GRID_STYLES.map(grid => {
            const isSelected = customizations.gridStyle === grid.value;
            return (
              <button
                key={grid.value}
                onClick={() => updateCustomization("gridStyle", grid.value as any)}
                className={`p-2.5 text-left border flex flex-col justify-between transition-all h-16 relative ${
                  isSelected
                    ? "border-primary bg-primary/5 text-white"
                    : "border-white/10 hover:border-white/30 text-on-surface-variant hover:text-white"
                }`}
                style={{ contentVisibility: "auto" }}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider leading-none">
                  {grid.name}
                </span>
                <span className="text-[8px] opacity-60 font-mono">{grid.desc}</span>
                {isSelected && <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Typography pairing option */}
      <div className="space-y-2">
        <label className="block text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">
          03 // Primary Letterform Font
        </label>
        <div className="space-y-1.5">
          {FONTS.map(f => {
            const isSelected = customizations.font === f.value;
            return (
              <button
                key={f.value}
                onClick={() => updateCustomization("font", f.value as any)}
                className={`w-full p-2.5 text-left border flex items-center justify-between transition-all relative ${
                  isSelected
                    ? "border-primary bg-primary/5 text-white"
                    : "border-white/10 hover:border-white/30 text-on-surface-variant hover:text-white"
                }`}
              >
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest block">
                    {f.name}
                  </span>
                  <span className="text-[9px] opacity-60 font-mono mt-0.5">{f.desc}</span>
                </div>
                <span className="text-[10px]" style={{ fontFamily: f.value }}>
                  Aa 123
                </span>
                {isSelected && <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Heading Case settings and Layout Sizing density */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="block text-[9px] font-mono uppercase tracking-wider text-on-surface-variant">
            04 // Label Casing
          </label>
          <div className="flex border border-white/20">
            <button
              onClick={() => updateCustomization("headingStyle", "uppercase")}
              className={`flex-1 py-1 px-1 text-[9px] font-mono ${
                customizations.headingStyle === "uppercase"
                  ? "bg-primary text-white"
                  : "bg-surface-dim text-on-surface-variant active:bg-white/10"
              }`}
            >
              UPPER
            </button>
            <button
              onClick={() => updateCustomization("headingStyle", "normal")}
              className={`flex-1 py-1 px-1 text-[9px] font-mono ${
                customizations.headingStyle === "normal"
                  ? "bg-primary text-white"
                  : "bg-surface-dim text-on-surface-variant active:bg-white/10"
              }`}
            >
              NORMAL
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[9px] font-mono uppercase tracking-wider text-on-surface-variant">
            05 // Density
          </label>
          <div className="flex border border-white/20">
            <button
              onClick={() => updateCustomization("layoutDensity", "compact")}
              className={`flex-1 py-1 px-1 text-[9px] font-mono ${
                customizations.layoutDensity === "compact"
                  ? "bg-primary text-white"
                  : "bg-surface-dim text-on-surface-variant"
              }`}
            >
              COMPACT
            </button>
            <button
              onClick={() => updateCustomization("layoutDensity", "standard")}
              className={`flex-1 py-1 px-1 text-[9px] font-mono ${
                customizations.layoutDensity === "standard"
                  ? "bg-primary text-white"
                  : "bg-surface-dim text-on-surface-variant"
              }`}
            >
              WIDE
            </button>
          </div>
        </div>
      </div>

      {/* 5. Trigger FULL PREVIEW button */}
      <div className="pt-2">
        <button
          onClick={onPreview}
          className="w-full bg-white text-black hover:bg-neutral-200 transition-colors font-bold py-3 px-4 flex items-center justify-center gap-2 uppercase tracking-widest text-xs font-mono"
        >
          <Eye className="w-4 h-4 text-primary" />
          Preview Workspace
        </button>
        <p className="text-[8px] text-on-surface-variant font-mono mt-1.5 text-center uppercase">
          hides editing controls to display pure styled layout
        </p>
      </div>
    </div>
  );
}
