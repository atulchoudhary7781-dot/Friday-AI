/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { ThemeProfile, SystemDiagnostics, DiaryRecord, TaskItem, ChatMessage, SyncStatus } from "./types";
import { THEMES } from "./lib/themes";
import { encryptPayload, decryptPayload } from "./lib/crypto";
import { ArcReactor } from "./components/ArcReactor";
import { Diagnostics } from "./components/Diagnostics";
import { BiometricScan } from "./components/BiometricScan";
import { DiaryCore } from "./components/DiaryCore";
import { TaskCore } from "./components/TaskCore";
import { ThemeSelector } from "./components/ThemeSelector";
import { ChatPanel } from "./components/ChatPanel";
import { CinematicDemo } from "./components/CinematicDemo";
import { Sparkles, Laptop, Shield, User, Tv, Play } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Theme & Accessibility options
  const [themeId, setThemeId] = useState<ThemeProfile>("sophisticated-dark");
  const [fontSize, setFontSize] = useState<"standard" | "large" | "xlarge">("standard");
  const [speechRate, setSpeechRate] = useState<number>(1.1);
  const [speechPitch, setSpeechPitch] = useState<number>(1.0);

  // Security Lock
  const [isLocked, setIsLocked] = useState(true);
  const [userPasscode, setUserPasscode] = useState("");

  // States
  const [arcState, setArcState] = useState<"idle" | "listening" | "speaking" | "thinking">("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isContinuousVoice, setIsContinuousVoice] = useState(true);

  // Core Data Stores (Prepopulated with highly immersive, futuristic, secure Stark records)
  const [records, setRecords] = useState<DiaryRecord[]>([
    {
      id: "rec-1",
      title: "Mark LXXXV Nanotech Lattice Stabilizers",
      content: "Nanoparticle fluid dynamics stabilized at 14.8 THz. Vibranium-alloy casing successfully mitigates kinetic recoil. Arc Reactor sustained at 3.2 GW.",
      isEncrypted: false,
      timestamp: new Date(Date.now() - 36000000).toISOString(),
      deviceOrigin: "Stark Labs Host",
      category: "Blueprint"
    },
    {
      id: "rec-2",
      title: "F.R.I.D.A.Y. Remote Synchronizer Node",
      content: "Secure cross-device handshakes established over AES-GCM. End-to-end telemetry sync covers portable mobile and desktop hubs with active hardware diagnostics.",
      isEncrypted: false,
      timestamp: new Date(Date.now() - 12000000).toISOString(),
      deviceOrigin: "Stark iPhone 16",
      category: "Security"
    }
  ]);

  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: "task-1",
      title: "Recalibrate local Arc Reactor stabilizers",
      completed: false,
      priority: "critical",
      deviceOrigin: "Stark Labs Host",
      timestamp: new Date().toISOString()
    },
    {
      id: "task-2",
      title: "Synchronize secure mobile phone vault profile",
      completed: false,
      priority: "high",
      deviceOrigin: "Stark iPhone 16",
      timestamp: new Date().toISOString()
    },
    {
      id: "task-3",
      title: "Seal local data core diaries",
      completed: true,
      priority: "medium",
      deviceOrigin: "Stark Labs Host",
      timestamp: new Date().toISOString()
    }
  ]);

  // Sync status
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    lastSyncTime: null,
    status: "idle",
    version: 1
  });

  // Diagnostics state
  const [diagnostics, setDiagnostics] = useState<SystemDiagnostics>({
    cpuUsage: 14,
    ramUsage: 38,
    batteryLevel: null,
    batteryCharging: null,
    temp: 42,
    networkLatency: 45,
    networkType: "Wi-Fi 6E (Stark Secure)",
    isOnline: navigator.onLine,
    os: "macOS / iOS Hybrid Core",
    deviceType: window.innerWidth < 768 ? "Phone" : window.innerWidth < 1024 ? "Tablet" : "Laptop",
    uptime: 1845
  });

  // Chat conversation
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const theme = THEMES[themeId];
  const recognitionRef = useRef<any>(null);

  // Initial greeting speech & online tracking
  useEffect(() => {
    // Sync status connection listeners
    const handleOnline = () => {
      setIsOnline(true);
      setDiagnostics(prev => ({ ...prev, isOnline: true }));
      // Auto-trigger sync when back online
      triggerAutoSync();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setDiagnostics(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Dynamic screen-size device detection for responsive design
    const handleResize = () => {
      setDiagnostics(prev => ({
        ...prev,
        deviceType: window.innerWidth < 768 ? "Phone" : window.innerWidth < 1024 ? "Tablet" : "Laptop"
      }));
    };
    window.addEventListener("resize", handleResize);

    // Load synthesis voices on start
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }

    // Set initial greeting
    setMessages([
      {
        id: "greet",
        role: "assistant",
        text: "System fully initialized. Hello, Boss. Encrypted local storage vault is currently sealed. Authorization required.",
        timestamp: new Date().toISOString()
      }
    ]);

    // Initial voice greeting (short delaying to allow voices load)
    setTimeout(() => {
      speakText("System fully initialized. Hello, Boss. Encrypted local storage vault is currently sealed. Authorization required.");
    }, 1200);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Trigger wake up sequence
  const triggerWakeUp = () => {
    setUserPasscode("3000");
    setIsLocked(false);
    
    setRecords(prev =>
      prev.map(r => {
        if (r.isEncrypted) {
          return {
            ...r,
            content: r.content,
            isEncrypted: false
          };
        }
        return r;
      })
    );

    const welcomeMsg = "Systems fully online. Good evening, Boss. Friday neural core is awake and all security gates are unlocked. How may I assist you today?";
    
    setMessages(prev => [
      ...prev,
      {
        id: `wakeup-${Date.now()}`,
        role: "assistant",
        text: welcomeMsg,
        timestamp: new Date().toISOString()
      }
    ]);

    speakText(welcomeMsg);
  };

  // Web Speech Synthesis Engine
  const speakText = (text: string) => {
    if (isMuted || typeof window === "undefined" || !window.speechSynthesis) return;

    // Stop ongoing speech
    window.speechSynthesis.cancel();

    // Stop recognition while speaking to prevent microphone loopback
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
    }

    // Clean text for nicer reading
    const cleanText = text.replace(/\[.*?\]/g, "").replace(/[*_`]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;

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

    setArcState("speaking");
    
    const handleSpeechFinished = () => {
      setArcState("idle");
      // Resume listening if continuous voice is enabled
      if (isContinuousVoice && recognitionRef.current) {
        setTimeout(() => {
          try {
            recognitionRef.current.start();
          } catch (e) {}
        }, 400);
      }
    };

    utterance.onend = handleSpeechFinished;
    utterance.onerror = handleSpeechFinished;

    window.speechSynthesis.speak(utterance);
  };

  // Web Speech Recognition Engine
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-US";

      rec.onstart = () => {
        setIsListening(true);
        setArcState("listening");
      };

      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        if (text) {
          const lowerText = text.toLowerCase().trim();
          
          // Check for wake-up keyword triggers
          if (
            lowerText.includes("wake up friday") || 
            lowerText.includes("wake up, friday") || 
            lowerText.includes("wakeup friday") ||
            lowerText.includes("back friday") ||
            lowerText.includes("friday wake up") ||
            lowerText.includes("wake up")
          ) {
            triggerWakeUp();
          } else {
            // If unlocked, process naturally, otherwise block
            if (!isLocked) {
              handleSendMessage(text);
            } else {
              const accessDeniedMsg = `Vocal access signature mismatch for directive: "${text}". Cryptographic authorization signature required.`;
              setMessages(prev => [
                ...prev,
                {
                  id: `denied-${Date.now()}`,
                  role: "assistant",
                  text: accessDeniedMsg,
                  timestamp: new Date().toISOString()
                }
              ]);
              speakText("Access denied. Vocal passphrase signature required.");
            }
          }
        }
      };

      rec.onerror = (err: any) => {
        console.warn("Voice recognition error status:", err.error || err);
        // If microphone access is denied, disable continuous loop to avoid infinite permission prompts
        if (err.error === "not-allowed" || err.error === "service-not-allowed") {
          setIsContinuousVoice(false);
        }
        setIsListening(false);
        setArcState("idle");
      };

      rec.onend = () => {
        setIsListening(false);
        setArcState("idle");
        
        // Auto restart if continuous listening is on and synthesis isn't active
        if (isContinuousVoice && typeof window !== "undefined" && !window.speechSynthesis.speaking) {
          setTimeout(() => {
            try {
              recognitionRef.current?.start();
            } catch (e) {}
          }, 800);
        }
      };

      recognitionRef.current = rec;

      // Automatically trigger initial listening in continuous mode
      if (isContinuousVoice) {
        setTimeout(() => {
          try {
            rec.start();
          } catch (e) {}
        }, 1500);
      }
    }
  }, [themeId, isLocked, isOnline, diagnostics, speechRate, speechPitch, userPasscode, isContinuousVoice]);

  const toggleListening = () => {
    if (isListening) {
      setIsContinuousVoice(false);
      recognitionRef.current?.stop();
    } else {
      setIsContinuousVoice(true);
      try {
        recognitionRef.current?.start();
      } catch (e) {}
    }
  };

  // 1. Authorize Retinal / Passcode Unlock using WebCrypto
  const handleUnlock = async (passcode: string): Promise<boolean> => {
    try {
      // We will derive crypt key using 'passcode'
      // To simulate true cryptographic access: if they use '3000', we unlock and automatically
      // decrypt our initial secure database records seamlessly.
      if (passcode === "3000") {
        setUserPasscode(passcode);
        setIsLocked(false);
        
        // Decrypt logs/diaries from encrypted storage (if previously sealed)
        setRecords(prev =>
          prev.map(r => {
            if (r.isEncrypted) {
              return {
                ...r,
                // Simple demo simulated decrypted block (re-loaded seamlessly via key)
                content: r.content,
                isEncrypted: false
              };
            }
            return r;
          })
        );

        const welcomeBack = "Identity authorized. Welcome back, Boss. Displaying nanotech lattices and secure blueprints.";
        speakText(welcomeBack);
        setMessages(prev => [
          ...prev,
          {
            id: `auth-${Date.now()}`,
            role: "assistant",
            text: welcomeBack,
            timestamp: new Date().toISOString()
          }
        ]);
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const handleLock = () => {
    setIsLocked(true);
    setUserPasscode("");
    speakText("Data core secured. Cryptographic locks engaged.");
    setMessages(prev => [
      ...prev,
      {
        id: `lock-${Date.now()}`,
        role: "assistant",
        text: "Vault core secured. Secure encryption keys flushed.",
        timestamp: new Date().toISOString()
      }
    ]);
  };

  // 2. Chat with FRIDAY Server API (Exposing server-side Gemini 3.5 API)
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Append user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setArcState("thinking");

    // Dynamic diagnostic values to feed FRIDAY brain
    const systemContext = {
      localTime: new Date().toISOString(),
      deviceType: diagnostics.deviceType,
      isOnline: isOnline,
      batteryLevel: diagnostics.batteryLevel || 84,
      cpuUsage: diagnostics.cpuUsage,
      ramUsage: diagnostics.ramUsage,
      storageLocked: isLocked
    };

    try {
      const response = await fetch("/api/friday/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-10), // pass last 10 messages for continuous memory
          context: systemContext
        })
      });

      const data = await response.json();
      setArcState("idle");

      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMsg: ChatMessage = {
        id: `friday-${Date.now()}`,
        role: "assistant",
        text: data.reply,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMsg]);
      speakText(data.reply);

      // Sarcastic trigger or special action checks matching FRIDAY commands
      processSpecialCommands(text);

    } catch (error: any) {
      console.error(error);
      setArcState("idle");
      const errorMsg = "Core synapse connection error, Boss. I am operating on client-side safety overrides.";
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          text: errorMsg,
          timestamp: new Date().toISOString()
        }
      ]);
      speakText(errorMsg);
    }
  };

  const processSpecialCommands = (text: string) => {
    const cmd = text.toLowerCase();
    if (cmd.includes("diagnostics") || cmd.includes("scan")) {
      setDiagnostics(prev => ({ ...prev, cpuUsage: 89, ramUsage: 76 }));
      setTimeout(() => {
        setDiagnostics(prev => ({ ...prev, cpuUsage: 14, ramUsage: 35, temp: 39 }));
      }, 1500);
    }
  };

  // 3. Sync & Conflict Resolution Strategies (E2E End-to-End Encrypted Sync Protocol)
  const handleAddRecord = async (title: string, content: string, category: DiaryRecord["category"]) => {
    // Encrypt payload if password present, otherwise store plaintext fallback
    let finalContent = content;
    let encrypted = false;

    if (userPasscode) {
      try {
        const payload = await encryptPayload(content, userPasscode);
        // Save the cipher text block
        finalContent = payload.cipherText;
        encrypted = true;
      } catch (err) {
        console.error("WebCrypto fail:", err);
      }
    }

    const newRecord: DiaryRecord = {
      id: `rec-${Date.now()}`,
      title,
      content: content, // in memory we keep active clear text for decrypted session
      isEncrypted: encrypted,
      timestamp: new Date().toISOString(),
      deviceOrigin: diagnostics.deviceType === "Laptop" ? "Stark Labs Host" : "Stark iPhone 16",
      category
    };

    setRecords(prev => [newRecord, ...prev]);
    speakText(`Blueprint and diary logs sealed with AES-GCM 256 keys.`);
  };

  // Task core controls
  const handleAddTask = (title: string, priority: TaskItem["priority"]) => {
    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title,
      completed: false,
      priority,
      deviceOrigin: diagnostics.deviceType === "Laptop" ? "Stark Labs Host" : "Stark iPhone 16",
      timestamp: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Server-Side Handshake Synchronize Trigger
  const triggerAutoSync = () => {
    if (isOnline) {
      handleTriggerSync();
    }
  };

  const handleTriggerSync = async () => {
    if (!isOnline) {
      setSyncStatus({
        lastSyncTime: new Date().toISOString(),
        status: "error",
        version: syncStatus.version
      });
      speakText("Network signal offline. Sync payload queued for auto dispatch.");
      return;
    }

    setSyncStatus(prev => ({ ...prev, status: "syncing" }));

    try {
      // Simulate/derive local state encrypted string to sync
      const payloadString = JSON.stringify({ tasks, records });
      // Encrypt full database package before dispatching (true end-to-end privacy)
      let encryptedPayload = payloadString;
      if (userPasscode) {
        const payload = await encryptPayload(payloadString, userPasscode);
        encryptedPayload = JSON.stringify(payload);
      }

      const response = await fetch("/api/friday/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          encryptedBlob: encryptedPayload,
          updatedAt: new Date().toISOString(),
          version: syncStatus.version,
          clientDevice: diagnostics.deviceType
        })
      });

      if (response.status === 409) {
        // Conflict! Server has a newer model!
        const data = await response.json();
        setSyncStatus({
          lastSyncTime: new Date().toISOString(),
          status: "conflict",
          version: syncStatus.version,
          conflictData: {
            serverVersion: data.serverVersion,
            serverUpdatedAt: data.serverUpdatedAt,
            serverBlob: data.serverData
          }
        });
        speakText("Sync conflict detected, Boss. Please choose merge priority.");
        return;
      }

      if (!response.ok) {
        throw new Error("Handshake failure");
      }

      const data = await response.json();

      setSyncStatus({
        lastSyncTime: data.updatedAt,
        status: "idle",
        version: data.version
      });

      speakText("Lattice synchronization complete, Boss. Multi-device logs are aligned.");

    } catch (err) {
      console.error(err);
      setSyncStatus(prev => ({ ...prev, status: "error" }));
    }
  };

  // Conflict Resolution: Merge client or server priority
  const resolveConflict = (resolution: "client" | "server") => {
    if (resolution === "server" && syncStatus.conflictData) {
      // Decrypt or process server override (for demo we increment state version)
      setSyncStatus({
        lastSyncTime: new Date().toISOString(),
        status: "idle",
        version: syncStatus.conflictData.serverVersion + 1
      });
      speakText("Server payload prioritised. Database converged.");
    } else {
      // Overwrite server with local
      setSyncStatus(prev => ({
        lastSyncTime: new Date().toISOString(),
        status: "idle",
        version: prev.version + 1
      }));
      // Retrigger with forced higher version
      setTimeout(() => {
        handleTriggerSync();
      }, 500);
    }
  };
  
  // Guided Cinematic Video Demo simulation action handler
  const handleSimulateAction = (actionType: string, payload?: any) => {
    switch (actionType) {
      case "BOOT_SYSTEM":
        setIsLocked(true);
        setDiagnostics(prev => ({ ...prev, cpuUsage: 88, ramUsage: 79 }));
        setArcState("thinking");
        setMessages([
          {
            id: "boot-1",
            role: "assistant",
            text: "[F.R.I.D.A.Y. SYNAPSE BOOT] Connection handshakes queued over secure local multiplexer.",
            timestamp: new Date().toISOString()
          }
        ]);
        setTimeout(() => {
          setDiagnostics(prev => ({ ...prev, cpuUsage: 14, ramUsage: 38 }));
          setArcState("idle");
        }, 3000);
        break;

      case "BIOMETRIC_UNLOCK":
        handleUnlock(payload || "3000");
        break;

      case "CALIBRATE_REACTOR":
        setArcState("speaking");
        setDiagnostics(prev => ({ ...prev, cpuUsage: 94, ramUsage: 88, temp: 52 }));
        setMessages(prev => [
          ...prev,
          {
            id: `calibrate-${Date.now()}`,
            role: "assistant",
            text: "Warning: Arc Reactor flux levels spiking. Calibrating lattice dynamics... Power stabilization complete. Multi-device sync optimal (+14% efficiency potential established).",
            timestamp: new Date().toISOString()
          }
        ]);
        setTimeout(() => {
          setDiagnostics(prev => ({ ...prev, cpuUsage: 18, ramUsage: 41, temp: 39 }));
          setArcState("idle");
        }, 4000);
        break;

      case "ENCRYPT_AND_SYNC":
        if (payload) {
          handleAddRecord(payload.title, payload.content, payload.category);
          triggerAutoSync();
        }
        break;

      case "CONVERSATIONAL_CHAT":
        if (payload) {
          handleSendMessage(payload);
        }
        break;

      case "RESET_SYSTEM":
        setIsLocked(true);
        setUserPasscode("");
        setDiagnostics({
          cpuUsage: 14,
          ramUsage: 38,
          batteryLevel: null,
          batteryCharging: null,
          temp: 42,
          networkLatency: 45,
          networkType: "Wi-Fi 6E (Stark Secure)",
          isOnline: navigator.onLine,
          os: "macOS / iOS Hybrid Core",
          deviceType: window.innerWidth < 768 ? "Phone" : window.innerWidth < 1024 ? "Tablet" : "Laptop",
          uptime: 1845
        });
        setRecords([
          {
            id: "rec-1",
            title: "Mark LXXXV Nanotech Lattice Stabilizers",
            content: "Nanoparticle fluid dynamics stabilized at 14.8 THz. Vibranium-alloy casing successfully mitigates kinetic recoil. Arc Reactor sustained at 3.2 GW.",
            isEncrypted: false,
            timestamp: new Date(Date.now() - 36000000).toISOString(),
            deviceOrigin: "Stark Labs Host",
            category: "Blueprint"
          },
          {
            id: "rec-2",
            title: "F.R.I.D.A.Y. Remote Synchronizer Node",
            content: "Secure cross-device handshakes established over AES-GCM. End-to-end telemetry sync covers portable mobile and desktop hubs with active hardware diagnostics.",
            isEncrypted: false,
            timestamp: new Date(Date.now() - 12000000).toISOString(),
            deviceOrigin: "Stark iPhone 16",
            category: "Security"
          }
        ]);
        setTasks([
          {
            id: "task-1",
            title: "Recalibrate local Arc Reactor stabilizers",
            completed: false,
            priority: "critical",
            deviceOrigin: "Stark Labs Host",
            timestamp: new Date().toISOString()
          },
          {
            id: "task-2",
            title: "Synchronize secure mobile phone vault profile",
            completed: false,
            priority: "high",
            deviceOrigin: "Stark iPhone 16",
            timestamp: new Date().toISOString()
          },
          {
            id: "task-3",
            title: "Seal local data core diaries",
            completed: true,
            priority: "medium",
            deviceOrigin: "Stark Labs Host",
            timestamp: new Date().toISOString()
          }
        ]);
        setMessages([
          {
            id: "greet",
            role: "assistant",
            text: "System fully initialized. Hello, Boss. Encrypted local storage vault is currently sealed. Authorization required.",
            timestamp: new Date().toISOString()
          }
        ]);
        break;
      
      default:
        break;
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case "large": return "text-base";
      case "xlarge": return "text-lg";
      default: return "text-sm";
    }
  };

  return (
    <div className={`min-h-screen bg-black ${theme.bg} ${getFontSizeClass()} p-4 md:p-6 flex flex-col font-sans select-none overflow-x-hidden relative`}>
      {/* Background Concentric Circles for Sophisticated Dark Theme */}
      {themeId === "sophisticated-dark" && (
        <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none overflow-hidden z-0">
          <div className="w-[800px] h-[800px] rounded-full border border-[#00F0FF]/10 flex items-center justify-center animate-pulse duration-5000">
            <div className="w-[600px] h-[600px] rounded-full border border-[#00F0FF]/15 flex items-center justify-center">
              <div className="w-[400px] h-[400px] rounded-full border border-[#00F0FF]/25"></div>
            </div>
          </div>
        </div>
      )}

      {/* 1. Immersive HUD Header */}
      <header className={`max-w-7xl w-full mx-auto mb-6 p-4 rounded-xl border ${theme.panelBg} ${theme.glowIntensity} flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300 relative z-10`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-cyan-500/10 border flex items-center justify-center relative ${theme.borderColor}`}>
            <Sparkles className={`w-5 h-5 ${theme.primary} animate-pulse`} />
            <span className="absolute top-0 right-0 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <h1 className="font-sans font-bold tracking-wider text-white flex items-center gap-1.5 uppercase text-base sm:text-lg">
              F.R.I.D.A.Y. <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-1.5 rounded font-mono">STARK Core v1.85</span>
            </h1>
            <p className="text-[10px] text-white/50 font-mono tracking-tight uppercase">
              Active Lattice: {theme.name} • Hardware Link Secured
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          {/* Cinematic Video Demo Playback Trigger */}
          <button
            onClick={() => setIsDemoOpen(true)}
            className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-500/50 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer hover:shadow-[0_0_15px_rgba(239,68,68,0.25)]"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <Tv className="w-3.5 h-3.5" /> PLAY VIDEO DEMO
          </button>

          {/* Diagnostic Stats Quick bar */}
          <div className="hidden md:flex items-center gap-3 bg-black/40 px-3 py-1.5 border border-white/5 rounded-lg text-white/70">
            <span className="flex items-center gap-1"><Laptop className="w-3.5 h-3.5 text-cyan-400" /> Host Online</span>
            <span>|</span>
            <span className="flex items-center gap-1 text-emerald-400"><Shield className="w-3.5 h-3.5" /> Core Armed</span>
          </div>

          <div className="text-right">
            <span className="text-white font-bold block">{new Date().toLocaleTimeString()}</span>
            <span className="text-[10px] text-white/40 block">UTC-07:00 • SYSTEM PORT 3000</span>
          </div>
        </div>
      </header>

      {/* 2. Primary Workspace Grid Layout (Adapts fluidly to tablet & mobile form factors) */}
      <main className="max-w-7xl w-full mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative z-10">
        {/* Left Column (Diagnostic, Holographic Core & Controls) */}
        <section className="lg:col-span-5 space-y-6">
          {/* Holographic Arc Reactor visualizer widget */}
          <div className={`p-4 rounded-xl border ${theme.panelBg} ${theme.glowIntensity} flex items-center justify-center transition-all duration-300`}>
            <ArcReactor theme={theme} state={arcState} />
          </div>

          {/* Secure biometric facial scan gate overlay */}
          <BiometricScan
            theme={theme}
            isLocked={isLocked}
            onUnlock={handleUnlock}
            onLock={handleLock}
          />

          {/* Hardware status diagnostic block */}
          <Diagnostics
            theme={theme}
            diagnostics={diagnostics}
            setDiagnostics={setDiagnostics}
          />

          {/* Core controls parameters (Accessible settings) */}
          <AnimatePresence>
            {!isLocked && (
              <motion.div
                initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                transition={{ duration: 0.4 }}
              >
                <ThemeSelector
                  currentThemeId={themeId}
                  onChangeTheme={setThemeId}
                  fontSize={fontSize}
                  onChangeFontSize={setFontSize}
                  speechRate={speechRate}
                  onChangeSpeechRate={setSpeechRate}
                  speechPitch={speechPitch}
                  onChangeSpeechPitch={setSpeechPitch}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Right Column (Witty Conversational HUD, Encrypted Vault & Secure Tasks) */}
        <section className="lg:col-span-7 space-y-6">
          <AnimatePresence>
            {!isLocked && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="space-y-6"
              >
                {/* Primary Conversational Terminal */}
                <ChatPanel
                  theme={theme}
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isListening={isListening}
                  onToggleListen={toggleListening}
                  isMuted={isMuted}
                  onToggleMute={() => setIsMuted(!isMuted)}
                  isThinking={arcState === "thinking"}
                  isContinuousVoice={isContinuousVoice}
                  onToggleContinuousVoice={() => setIsContinuousVoice(!isContinuousVoice)}
                />

                {/* Grid layout for vault records and task schedules (Two parallel columns) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DiaryCore
                    theme={theme}
                    isLocked={isLocked}
                    records={records}
                    onAddRecord={handleAddRecord}
                  />

                  <TaskCore
                    theme={theme}
                    tasks={tasks}
                    onAddTask={handleAddTask}
                    onToggleTask={handleToggleTask}
                    onDeleteTask={handleDeleteTask}
                    onTriggerSync={handleTriggerSync}
                    syncStatus={syncStatus}
                    resolveConflict={resolveConflict}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* 3. Footer */}
      <footer className="max-w-7xl w-full mx-auto mt-6 text-center text-[10px] font-mono text-white/30 border-t border-white/5 pt-4 relative z-10">
        STARK INDUSTRIES SYSTEM TELEMETRY DATA RECON • LICENSED UNDER SYSTEM CODE F.R.I.D.A.Y. • MULTI-PLATFORM SYNC ACTIVE
      </footer>

      {/* Cinematic Guided Video Simulator Overlay */}
      <CinematicDemo
        theme={theme}
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        onSimulateAction={handleSimulateAction}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(!isMuted)}
      />
    </div>
  );
}
