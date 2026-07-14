/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ThemeConfig } from "../lib/themes";

interface ArcProps {
  theme: ThemeConfig;
  state: "idle" | "listening" | "speaking" | "thinking";
  voiceVolume?: number; // 0 to 100
}

export const ArcReactor: React.FC<ArcProps> = ({ theme, state, voiceVolume = 0 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Draw reactive energy wave inside the canvas for speaking / listening states
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let phase = 0;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || 220;
      canvas.height = canvas.parentElement?.clientHeight || 220;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const baseRadius = Math.min(cx, cy) * 0.45;

      phase += 0.05;

      // Draw background ambient glow
      const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, baseRadius * 1.5);
      grad.addColorStop(0, `${theme.glowColor.replace("0.4", "0.15")}`);
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Set up drawing styles
      ctx.strokeStyle = theme.waveformColor;
      ctx.shadowColor = theme.waveformColor;
      ctx.shadowBlur = state === "thinking" ? 15 : state === "speaking" ? 10 : 4;

      if (state === "speaking" || state === "listening") {
        // Draw circular acoustic visualizer lines
        const segments = 60;
        const volMultiplier = state === "speaking" ? 1.5 : 0.8;
        const noiseScale = (voiceVolume || 20) * volMultiplier;

        ctx.beginPath();
        for (let i = 0; i <= segments; i++) {
          const angle = (i / segments) * Math.PI * 2;
          // Generate wave amplitude using sine combined with volume/random noise
          const wave = Math.sin(angle * 8 + phase * 2) * Math.cos(angle * 3 + phase) * (5 + noiseScale * 0.15);
          const r = baseRadius + wave;
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Inner secondary pulse ring
        ctx.beginPath();
        for (let i = 0; i <= segments; i++) {
          const angle = (i / segments) * Math.PI * 2;
          const wave = Math.cos(angle * 12 - phase * 3) * (2 + noiseScale * 0.08);
          const r = baseRadius * 0.7 + wave;
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.lineWidth = 1.2;
        ctx.stroke();

      } else {
        // IDLE or THINKING standard holographic rings
        const speedMultiplier = state === "thinking" ? 3 : 1;

        // Concentric Ring 1
        ctx.beginPath();
        ctx.arc(cx, cy, baseRadius, 0, Math.PI * 2);
        ctx.lineWidth = 1;
        ctx.strokeStyle = `${theme.waveformColor}22`;
        ctx.stroke();

        // Concentric Ring 2 (Dashed spinning)
        ctx.beginPath();
        ctx.arc(cx, cy, baseRadius * 1.15, phase * 0.5 * speedMultiplier, phase * 0.5 * speedMultiplier + Math.PI * 1.5);
        ctx.lineWidth = 1.5;
        ctx.setLineDash([8, 12]);
        ctx.strokeStyle = `${theme.waveformColor}88`;
        ctx.stroke();
        ctx.setLineDash([]); // reset

        // Concentric Ring 3 (Multi-segmented thick border)
        ctx.beginPath();
        ctx.arc(cx, cy, baseRadius * 0.85, -phase * 0.3 * speedMultiplier, -phase * 0.3 * speedMultiplier + Math.PI * 0.8);
        ctx.lineWidth = 2;
        ctx.strokeStyle = theme.waveformColor;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, baseRadius * 0.85, -phase * 0.3 * speedMultiplier + Math.PI, -phase * 0.3 * speedMultiplier + Math.PI * 1.8);
        ctx.lineWidth = 2;
        ctx.strokeStyle = theme.waveformColor;
        ctx.stroke();
      }

      // Draw Center Core Reactor
      ctx.beginPath();
      const corePulse = state === "thinking"
        ? baseRadius * 0.35 + Math.sin(phase * 4) * 3
        : state === "listening"
        ? baseRadius * 0.35 + Math.sin(phase * 2) * 2
        : baseRadius * 0.35 + Math.sin(phase) * 1.5;

      ctx.arc(cx, cy, Math.max(5, corePulse), 0, Math.PI * 2);
      ctx.fillStyle = theme.waveformColor;
      ctx.shadowBlur = 20;
      ctx.fill();

      // Draw subtle coordinate axis overlay around the arc reactor
      ctx.shadowBlur = 0;
      ctx.strokeStyle = `${theme.waveformColor}11`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(cx - baseRadius * 1.6, cy);
      ctx.lineTo(cx + baseRadius * 1.6, cy);
      ctx.moveTo(cx, cy - baseRadius * 1.6);
      ctx.lineTo(cx, cy + baseRadius * 1.6);
      ctx.stroke();

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [theme, state, voiceVolume]);

  return (
    <div className="relative flex items-center justify-center w-full h-full min-h-[220px]">
      {/* Outer Rotating Digital Tech Gimbals */}
      <motion.div
        className="absolute w-44 h-44 rounded-full border border-dashed border-cyan-500/10 pointer-events-none"
        style={{ borderColor: `${theme.waveformColor}15` }}
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
      
      <motion.div
        className="absolute w-48 h-48 rounded-full border border-double border-cyan-500/5 pointer-events-none"
        style={{ borderColor: `${theme.waveformColor}0a` }}
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />

      {/* Futuristic Angular Scope Bracket Indicators */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <div className="w-[190px] h-[190px] border border-cyan-500/10 relative" style={{ borderColor: `${theme.waveformColor}11` }}>
          <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: theme.waveformColor }}></span>
          <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: theme.waveformColor }}></span>
          <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2" style={{ borderColor: theme.waveformColor }}></span>
          <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: theme.waveformColor }}></span>
        </div>
      </div>

      <canvas ref={canvasRef} className="w-full h-full relative z-10 block" />

      {/* Floating State Info Text */}
      <div className="absolute bottom-1 text-[10px] font-mono tracking-widest uppercase opacity-75 select-none" style={{ color: theme.waveformColor }}>
        {state === "listening" && <span className="animate-pulse">● Rec Voice</span>}
        {state === "speaking" && <span>⚡ Audio Synapse</span>}
        {state === "thinking" && <span className="animate-pulse">⚡ Neural Pathing</span>}
        {state === "idle" && <span className="opacity-40">System Idle</span>}
      </div>
    </div>
  );
};
