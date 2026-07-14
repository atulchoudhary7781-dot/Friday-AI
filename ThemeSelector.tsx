/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sliders, Volume2, Type, Palette } from "lucide-react";
import { ThemeProfile } from "../types";
import { THEMES } from "../lib/themes";

interface ThemeSelectorProps {
  currentThemeId: ThemeProfile;
  onChangeTheme: (themeId: ThemeProfile) => void;
  fontSize: "standard" | "large" | "xlarge";
  onChangeFontSize: (size: "standard" | "large" | "xlarge") => void;
  speechRate: number;
  onChangeSpeechRate: (rate: number) => void;
  speechPitch: number;
  onChangeSpeechPitch: (pitch: number) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentThemeId,
  onChangeTheme,
  fontSize,
  onChangeFontSize,
  speechRate,
  onChangeSpeechRate,
  speechPitch,
  onChangeSpeechPitch,
}) => {
  return (
    <div className={`p-4 rounded-xl border bg-stone-900/60 border-white/5 shadow-[0_0_15px_rgba(255,255,255,0.02)] transition-all duration-300 h-full flex flex-col justify-between`}>
      <div>
        {/* Header */}
        <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-2">
          <Sliders className="w-5 h-5 text-indigo-400" />
          <h3 className="font-sans font-medium tracking-wide uppercase text-sm">System Controls</h3>
        </div>

        {/* 1. Theme selection */}
        <div className="space-y-3 font-mono text-xs">
          <div>
            <div className="flex items-center gap-1 opacity-60 uppercase tracking-wider text-[10px] mb-2">
              <Palette className="w-3.5 h-3.5" /> Core Theme Profile
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {Object.values(THEMES).map((t) => (
                <button
                  key={t.id}
                  onClick={() => onChangeTheme(t.id)}
                  className={`px-2 py-1.5 rounded-lg border text-left text-[10px] truncate transition-all cursor-pointer ${
                    currentThemeId === t.id
                      ? "border-white bg-white/10 text-white font-bold shadow-[0_0_10px_rgba(255,255,255,0.05)]"
                      : "border-white/5 bg-black/20 text-white/50 hover:text-white"
                  }`}
                >
                  <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${t.primaryBg}`} />
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Accessible Font Options */}
          <div className="border-t border-white/5 pt-3">
            <div className="flex items-center gap-1 opacity-60 uppercase tracking-wider text-[10px] mb-2">
              <Type className="w-3.5 h-3.5" /> Accessible Typography Size
            </div>
            <div className="flex bg-black/20 border border-white/10 rounded-lg p-0.5">
              {(["standard", "large", "xlarge"] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => onChangeFontSize(size)}
                  className={`flex-1 py-1 text-[10px] rounded-md transition-all font-bold cursor-pointer uppercase ${
                    fontSize === size
                      ? "bg-white/10 text-white"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  {size === "standard" ? "Standard" : size === "large" ? "Vision+" : "Vision++"}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Voice Config (Rate & Pitch) */}
          <div className="border-t border-white/5 pt-3 space-y-2.5">
            <div className="flex items-center gap-1 opacity-60 uppercase tracking-wider text-[10px] mb-1">
              <Volume2 className="w-3.5 h-3.5" /> Voice Synthesizer Output
            </div>

            {/* Speech Rate */}
            <div>
              <div className="flex justify-between text-[10px] mb-0.5">
                <span className="opacity-40">FRIDAY Speaking Rate</span>
                <span>{speechRate}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={speechRate}
                onChange={(e) => onChangeSpeechRate(parseFloat(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Speech Pitch */}
            <div>
              <div className="flex justify-between text-[10px] mb-0.5">
                <span className="opacity-40">Resonance Pitch</span>
                <span>{speechPitch}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={speechPitch}
                onChange={(e) => onChangeSpeechPitch(parseFloat(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="text-[10px] font-mono text-white/30 text-center border-t border-white/5 pt-3 mt-4">
        F.R.I.D.A.Y. SYSTEM CONTROLS v1.85-STARK
      </div>
    </div>
  );
};
