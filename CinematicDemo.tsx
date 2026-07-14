/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  X, 
  Tv, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Activity, 
  Disc, 
  ShieldAlert, 
  Sparkles,
  ChevronRight,
  Monitor,
  Heart,
  FileCode2,
  Cpu
} from "lucide-react";
import { ThemeConfig } from "../lib/themes";

interface CinematicDemoProps {
  theme: ThemeConfig;
  isOpen: boolean;
  onClose: () => void;
  onSimulateAction: (actionType: string, payload?: any) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

interface DemoStep {
  id: number;
  title: string;
  subtitle: string;
  narration: string;
  durationMs: number;
  actionType: string;
  actionPayload?: any;
}

export const CinematicDemo: React.FC<CinematicDemoProps> = ({
  theme,
  isOpen,
  onClose,
  onSimulateAction,
  isMuted,
  onToggleMute
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [videoQuality, setVideoQuality] = useState("1080p60 HUD");
  const [logs, setLogs] = useState<string[]>([]);
  const [cameraSignal, setCameraSignal] = useState("STARK-DIRECT_LINK_CH-04");

  const timelineTimerRef = useRef<NodeJS.Timeout | null>(null);
  const stepTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const stepStartTimeRef = useRef<number>(0);

  // Cinematic Demo Scenario Steps
  const DEMO_STEPS: DemoStep[] = [
    {
      id: 0,
      title: "SCENE 1: Neural OS Bootup & Diagnostics Initialization",
      subtitle: "Connecting Stark Host mainframes to portable link nodes.",
      narration: "System diagnostics offline status clearing. Booting primary neural synapse engines. Establishing high-speed local connection loops.",
      durationMs: 8000,
      actionType: "BOOT_SYSTEM"
    },
    {
      id: 1,
      title: "SCENE 2: Biometric Facial Scanning & Secure Unlock",
      subtitle: "Bypassing biometric safeguards using Stark bypass parameters.",
      narration: "Initiating biometric scan. Analyzing eye movement profiles. Match detected: Tony Stark. Disengaging AES-GCM local storage encryption locks.",
      durationMs: 10000,
      actionType: "BIOMETRIC_UNLOCK",
      actionPayload: "3000"
    },
    {
      id: 2,
      title: "SCENE 3: Arc Reactor Core Power Optimization",
      subtitle: "Increasing GigaWatt power throughput by 14% efficiency potential.",
      narration: "Re-tuning local Arc Reactor flux ratios. Calibrating fluid dampers on nanotech lattice structures. Energy output stable at 3.2 Gigawatts.",
      durationMs: 10000,
      actionType: "CALIBRATE_REACTOR"
    },
    {
      id: 3,
      title: "SCENE 4: Encrypted Blueprint Dispatch & Cloud Synchronization",
      subtitle: "Sealing newly crafted nanotech schematics with GCM payload keys.",
      narration: "Sealing Mark 85 nanotech stabilizers blueprints into localized vault. Dispatching end-to-end encrypted backup handshake to Stark secure network clouds.",
      durationMs: 11000,
      actionType: "ENCRYPT_AND_SYNC",
      actionPayload: {
        title: "Mark LXXXV Nanotech Stabilizer v2.4",
        content: "Power grid optimized with 14% efficiency gain. Quantum lattice integrity: 99.8%. Casing thermal mitigation: Active.",
        category: "Blueprint"
      }
    },
    {
      id: 4,
      title: "SCENE 5: Conversational AI Command Demonstration",
      subtitle: "Issuing speech-synthesized flight calibration commands to FRIDAY.",
      narration: "Interactive speech loop verified. Friday AI responsive at under half a millisecond. All backup nodes fully coordinated.",
      durationMs: 9000,
      actionType: "CONVERSATIONAL_CHAT",
      actionPayload: "Friday, analyze overall power throughput and verify nanotech lattice casing health."
    }
  ];

  // System status text effects
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      const activeLogs = [
        "Lattice synchronization: SECURE",
        "Network latency optimized: 0.4ms",
        "Thermal stabilizers: 42°C",
        "Quantum encryption: AES-GCM 256",
        "Biometric handshake verified: TRUE",
        "Mark LXXXV casing feedback: EXCELLENT",
        "Friday feedback: 'Ready when you are, Boss.'"
      ];
      const randomLog = activeLogs[Math.floor(Math.random() * activeLogs.length)];
      setLogs(prev => [randomLog, ...prev.slice(0, 5)]);
    }, 3000);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Audio speech narration triggers matching each scene
  const triggerNarration = (text: string) => {
    if (isMuted || typeof window === "undefined" || !window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(
      v =>
        v.name.includes("Google UK English Female") ||
        v.name.includes("Hazel") ||
        v.name.includes("Zira") ||
        v.name.includes("Samantha") ||
        v.lang.startsWith("en-GB")
    ) || voices.find(v => v.lang.startsWith("en")) || voices[0];

    if (voice) {
      utterance.voice = voice;
    }
    window.speechSynthesis.speak(utterance);
  };

  // Manage Steps timeline playback loop
  useEffect(() => {
    if (isPlaying && isOpen) {
      const currentStep = DEMO_STEPS[currentStepIndex];
      
      // Perform automated app simulation action
      onSimulateAction(currentStep.actionType, currentStep.actionPayload);
      triggerNarration(currentStep.narration);

      stepStartTimeRef.current = Date.now();
      
      // Progress bar animation timer
      const updateProgress = () => {
        const elapsed = Date.now() - stepStartTimeRef.current;
        const currentProgress = Math.min((elapsed / currentStep.durationMs) * 100, 100);
        setProgress(currentProgress);
        
        if (elapsed < currentStep.durationMs) {
          animationFrameRef.current = requestAnimationFrame(updateProgress);
        } else {
          // Advance to next step
          if (currentStepIndex < DEMO_STEPS.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
            setProgress(0);
          } else {
            // Demo finished, loop back or stay at end
            setIsPlaying(false);
            setProgress(100);
            triggerNarration("Cinematic system simulation complete, Boss. Multi-device telemetry logs are aligned perfectly.");
          }
        }
      };

      animationFrameRef.current = requestAnimationFrame(updateProgress);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, currentStepIndex, isOpen]);

  const handlePlayToggle = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      if (progress >= 100) {
        setCurrentStepIndex(0);
        setProgress(0);
      }
    } else {
      setIsPlaying(false);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setProgress(0);
    onSimulateAction("RESET_SYSTEM");
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const handleSelectStep = (index: number) => {
    setIsPlaying(false);
    setCurrentStepIndex(index);
    setProgress(0);
    // Force immediate demo state trigger
    const step = DEMO_STEPS[index];
    onSimulateAction(step.actionType, step.actionPayload);
    triggerNarration(step.narration);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4 md:p-6 backdrop-blur-md overflow-hidden select-none">
        
        {/* Futuristic Grid Cyber Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] opacity-20 pointer-events-none" />

        {/* Cinematic Widescreen Viewport Window Frame */}
        <div className="max-w-6xl w-full flex-1 flex flex-col justify-between border border-[#00F0FF]/30 bg-[#060606] shadow-[0_0_50px_rgba(0,240,255,0.15)] rounded-2xl relative overflow-hidden z-10 p-6 md:p-8">
          
          {/* TOP HUD BAR */}
          <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4 gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
              </span>
              <div>
                <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-[#00F0FF] flex items-center gap-2">
                  <Monitor className="w-4 h-4 animate-pulse" /> F.R.I.D.A.Y. CINEMATIC SIMULATION LIVE
                </h2>
                <p className="text-[10px] font-mono text-white/50 uppercase tracking-wider">
                  SIGNAL: {cameraSignal} • DECODER: H.265 ULTRA-HUD
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs bg-red-500/10 text-red-400 border border-red-500/30 px-2 py-1 rounded font-mono font-semibold tracking-wider flex items-center gap-1.5 uppercase">
                <Disc className="w-3 h-3 animate-spin" /> REC VIDEO DEMO
              </span>
              <button 
                onClick={onClose}
                className="text-white/40 hover:text-white border border-white/10 hover:border-white/30 p-2 rounded-lg bg-white/5 transition-all cursor-pointer"
                title="Exit Demo Mode"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* MAIN DEMO THEATER VIEWPORT */}
          <div className="flex-1 my-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch overflow-hidden">
            
            {/* Visualizer and Live Narration Player Screen */}
            <div className="lg:col-span-8 flex flex-col justify-between border border-white/5 bg-[#090909] rounded-xl p-6 relative overflow-hidden">
              
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00F0FF]/50"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00F0FF]/50"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00F0FF]/50"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00F0FF]/50"></div>

              {/* Watermark */}
              <div className="absolute top-4 right-4 text-[9px] font-mono text-white/10 uppercase tracking-widest select-none">
                STARK LABS HUD INTERNAL VIEWPORT ONLY
              </div>

              {/* Active Scene Heading */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#00F0FF] border border-[#00F0FF]/30 px-2 py-0.5 rounded-full bg-[#00F0FF]/5">
                    STEP {currentStepIndex + 1} OF {DEMO_STEPS.length}
                  </span>
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                    SYSTEM SIMULATOR SECURE HANDSHAKE
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-serif text-white font-medium tracking-tight">
                  {DEMO_STEPS[currentStepIndex].title}
                </h3>
                <p className="text-xs text-white/50 font-mono mt-1">
                  {DEMO_STEPS[currentStepIndex].subtitle}
                </p>
              </div>

              {/* Holographic Waveforms / Cinema Central Visualizer */}
              <div className="my-8 flex flex-col items-center justify-center relative">
                {/* Visual Audio Sound Waves */}
                <div className="flex items-end justify-center gap-1.5 h-16 w-full max-w-sm mb-4">
                  {Array.from({ length: 28 }).map((_, i) => {
                    const duration = 0.5 + Math.random() * 0.8;
                    const delay = Math.random() * 0.5;
                    return (
                      <motion.div
                        key={i}
                        className="w-1 bg-gradient-to-t from-[#00F0FF]/20 to-[#00F0FF] rounded-full"
                        animate={{ 
                          height: isPlaying ? [4, Math.random() * 48 + 8, 4] : 4
                        }}
                        transition={{ 
                          repeat: Infinity, 
                          duration, 
                          delay,
                          ease: "easeInOut" 
                        }}
                      />
                    );
                  })}
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center gap-1.5 text-xs text-[#00F0FF]/80 font-mono bg-[#00F0FF]/5 border border-[#00F0FF]/20 px-3 py-1 rounded-md animate-pulse">
                    <Activity className="w-3.5 h-3.5" /> Neural Synthesizer Mode
                  </div>
                </div>
              </div>

              {/* AI Voice Speech & Typewriter Text Narration Area */}
              <div className="bg-[#0D0D0D] border border-white/5 rounded-xl p-4 min-h-[96px] flex flex-col justify-between">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-[#00F0FF] font-mono font-bold block mb-1">
                    AI NARRATION TRANSCRIPT
                  </span>
                  <p className="text-xs md:text-sm text-white/90 leading-relaxed font-sans italic">
                    "{DEMO_STEPS[currentStepIndex].narration}"
                  </p>
                </div>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5 text-[10px] font-mono text-white/40">
                  <span>SPEECH RATE: 1.1x • HIGH DEFINITION VOICE</span>
                  <span className="text-[#00F0FF]">AES-GCM DECODED</span>
                </div>
              </div>

            </div>

            {/* Video Interactive Control Deck (Scene Navigator & Direct Command Injection) */}
            <div className="lg:col-span-4 flex flex-col justify-between gap-6">
              
              {/* Timeline Navigation */}
              <div className="bg-[#090909] border border-white/5 rounded-xl p-5 flex flex-col flex-1">
                <h4 className="text-[11px] font-mono uppercase tracking-widest text-white/40 border-b border-white/5 pb-2 mb-4">
                  Demo Interactive Timeline
                </h4>

                <div className="space-y-2 flex-1 overflow-y-auto max-h-[220px] md:max-h-[none] pr-1">
                  {DEMO_STEPS.map((step, i) => {
                    const isActive = currentStepIndex === i;
                    return (
                      <button
                        key={step.id}
                        onClick={() => handleSelectStep(i)}
                        className={`w-full text-left p-3 rounded-lg border transition-all flex items-start gap-3 cursor-pointer ${
                          isActive 
                            ? "bg-[#00F0FF]/10 border-[#00F0FF]/30 text-white" 
                            : "bg-black/40 border-white/5 text-white/50 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] mt-0.5 ${
                          isActive ? "bg-[#00F0FF] text-black font-bold" : "bg-white/5 text-white/40 border border-white/10"
                        }`}>
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[11px] font-semibold block truncate leading-tight">
                            {step.title.replace(/SCENE \d+: /, "")}
                          </span>
                          <span className="text-[9px] font-mono block text-white/40 mt-0.5">
                            Duration: {step.durationMs / 1000}s • Click to skip
                          </span>
                        </div>
                        {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#00F0FF] animate-pulse mt-1" />}
                      </button>
                    );
                  })}
                </div>

                {/* Simulated Logs Stream */}
                <div className="mt-4 pt-4 border-t border-white/5">
                  <span className="text-[9px] uppercase tracking-widest text-white/30 font-mono block mb-2">
                    LIVESTREAM MATRIX TELEMETRY
                  </span>
                  <div className="bg-black/50 rounded-lg p-3 font-mono text-[9px] text-[#00F0FF]/70 space-y-1 h-20 overflow-hidden">
                    {logs.length === 0 ? (
                      <div className="text-white/20 animate-pulse">Waiting for telemetry connection...</div>
                    ) : (
                      logs.map((log, i) => (
                        <div key={i} className="truncate flex items-center gap-1">
                          <span className="text-white/20">&gt;&gt;</span>
                          <span>{log}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* LOWER HUD VIDEO PROGRESS BAR & CINEMATIC CONTROL PANEL */}
          <div className="border-t border-white/10 pt-4 flex flex-col gap-4">
            
            {/* PROGRESS BAR */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-mono text-white/40">
                <span>CINEMATIC PLAYER PROGRESS</span>
                <span className="text-[#00F0FF] font-semibold">{Math.round(progress)}% COMPLETE</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden relative border border-white/10">
                {/* Active Progress Fill */}
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#00F0FF]/60 to-[#00F0FF] shadow-[0_0_10px_#00F0FF]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* CONTROLS */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                
                {/* PLAY / PAUSE BUTTON */}
                <button
                  onClick={handlePlayToggle}
                  className={`px-5 py-2.5 rounded-lg font-mono text-xs uppercase font-bold tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                    isPlaying 
                      ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30" 
                      : "bg-[#00F0FF] text-black hover:bg-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" /> PAUSE SIMULATION
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" /> PLAY VIDEO DEMO
                    </>
                  )}
                </button>

                {/* RESET BUTTON */}
                <button
                  onClick={handleReset}
                  className="p-2.5 rounded-lg border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                  title="Reset Scenario State"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

              </div>

              {/* DEMO FEATURES BRIEFING */}
              <div className="hidden md:flex items-center gap-4 text-[10px] font-mono text-white/50">
                <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded border border-white/5">
                  <Heart className="w-3.5 h-3.5 text-red-500" /> Biometric Face Scan
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded border border-white/5">
                  <FileCode2 className="w-3.5 h-3.5 text-yellow-500" /> AES-256 GCM Cryptography
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded border border-white/5">
                  <Cpu className="w-3.5 h-3.5 text-purple-500" /> Dynamic Arc Diagnostics
                </div>
              </div>

              {/* VOICE CONTROLS */}
              <div className="flex items-center gap-2">
                <button
                  onClick={onToggleMute}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center gap-2 text-xs font-mono ${
                    isMuted 
                      ? "bg-red-500/10 border-red-500/20 text-red-400" 
                      : "bg-white/5 border-white/10 text-white/80 hover:bg-white/5"
                  }`}
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="w-4 h-4" /> SPEECH MUTED
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-[#00F0FF]" /> SPEECH ON
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </AnimatePresence>
  );
};
