/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ThemeProfile } from "../types";

export interface ThemeConfig {
  id: ThemeProfile;
  name: string;
  primary: string; // Tailwind class color text, e.g. "text-cyan-400"
  primaryBg: string; // Tailwind bg color, e.g. "bg-cyan-500"
  accent: string; // Gold or cyan, e.g. "text-amber-400"
  bg: string; // Background classes
  panelBg: string; // Panel background
  borderColor: string; // border outline
  glowColor: string; // glow shadow color
  glowIntensity: string; // shadow class
  ringColor: string; // focus rings
  waveformColor: string; // colors for canvas drawing
}

export const THEMES: Record<ThemeProfile, ThemeConfig> = {
  "sophisticated-dark": {
    id: "sophisticated-dark",
    name: "Sophisticated Dark",
    primary: "text-[#00F0FF]",
    primaryBg: "bg-[#00F0FF]",
    accent: "text-[#00F0FF]",
    bg: "bg-[#050505] text-[#E0E0E0] font-sans bg-[radial-gradient(circle_at_center,_#111111_0%,_#050505_100%)]",
    panelBg: "bg-[#0A0A0A]/90 backdrop-blur-md border-white/10 shadow-[0_0_20px_rgba(0,240,255,0.04)]",
    borderColor: "border-[#00F0FF]/30",
    glowColor: "rgba(0, 240, 255, 0.4)",
    glowIntensity: "shadow-[0_0_15px_rgba(0,240,255,0.15)]",
    ringColor: "ring-[#00F0FF]/50",
    waveformColor: "#00F0FF",
  },
  "arc-cyan": {
    id: "arc-cyan",
    name: "Arc Hologram",
    primary: "text-cyan-400",
    primaryBg: "bg-cyan-500",
    accent: "text-blue-400",
    bg: "bg-slate-950 text-slate-100",
    panelBg: "bg-slate-900/60 border-cyan-500/30",
    borderColor: "border-cyan-500/40",
    glowColor: "rgba(34, 211, 238, 0.4)",
    glowIntensity: "shadow-[0_0_15px_rgba(34,211,238,0.25)]",
    ringColor: "ring-cyan-500/50",
    waveformColor: "#22d3ee",
  },
  "stark-red": {
    id: "stark-red",
    name: "Mark LXXXV",
    primary: "text-red-500",
    primaryBg: "bg-red-600",
    accent: "text-amber-400",
    bg: "bg-stone-950 text-stone-100",
    panelBg: "bg-stone-900/60 border-red-500/30",
    borderColor: "border-red-500/40",
    glowColor: "rgba(239, 68, 68, 0.4)",
    glowIntensity: "shadow-[0_0_15px_rgba(239,68,68,0.25)]",
    ringColor: "ring-red-500/50",
    waveformColor: "#ef4444",
  },
  "stealth-obsidian": {
    id: "stealth-obsidian",
    name: "Stealth Tech",
    primary: "text-slate-100",
    primaryBg: "bg-slate-100",
    accent: "text-slate-400",
    bg: "bg-zinc-950 text-zinc-100",
    panelBg: "bg-zinc-900/70 border-zinc-700/50",
    borderColor: "border-zinc-700/50",
    glowColor: "rgba(244, 244, 245, 0.3)",
    glowIntensity: "shadow-[0_0_12px_rgba(244,244,245,0.15)]",
    ringColor: "ring-zinc-400/50",
    waveformColor: "#f4f4f5",
  },
  "matrix-green": {
    id: "matrix-green",
    name: "Digital Stream",
    primary: "text-emerald-400",
    primaryBg: "bg-emerald-500",
    accent: "text-green-500",
    bg: "bg-black text-emerald-300",
    panelBg: "bg-neutral-950 border-emerald-500/30",
    borderColor: "border-emerald-500/30",
    glowColor: "rgba(52, 211, 153, 0.4)",
    glowIntensity: "shadow-[0_0_15px_rgba(52,211,153,0.25)]",
    ringColor: "ring-emerald-500/50",
    waveformColor: "#34d399",
  },
  "cyber-purple": {
    id: "cyber-purple",
    name: "Cosmic Nebula",
    primary: "text-fuchsia-400",
    primaryBg: "bg-fuchsia-500",
    accent: "text-indigo-400",
    bg: "bg-violet-950 text-violet-100",
    panelBg: "bg-violet-900/50 border-fuchsia-500/30",
    borderColor: "border-fuchsia-500/30",
    glowColor: "rgba(232, 121, 249, 0.4)",
    glowIntensity: "shadow-[0_0_15px_rgba(232,121,249,0.25)]",
    ringColor: "ring-fuchsia-500/50",
    waveformColor: "#e879f9",
  },
};
