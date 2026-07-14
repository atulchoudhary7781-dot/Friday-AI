/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { Mic, Send, Volume2, VolumeX, Sparkles, AlertCircle } from "lucide-react";
import { ChatMessage } from "../types";
import { ThemeConfig } from "../lib/themes";

interface ChatPanelProps {
  theme: ThemeConfig;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isListening: boolean;
  onToggleListen: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isThinking: boolean;
  isContinuousVoice: boolean;
  onToggleContinuousVoice: () => void;
}

const PROACTIVE_SUGGESTIONS = [
  "Run diagnostics scan",
  "Synchronize all devices",
  "Check safe vault logs",
  "How's my current battery?",
];

export const ChatPanel: React.FC<ChatPanelProps> = ({
  theme,
  messages,
  onSendMessage,
  isListening,
  onToggleListen,
  isMuted,
  onToggleMute,
  isThinking,
  isContinuousVoice,
  onToggleContinuousVoice,
}) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;

    onSendMessage(input.trim());
    setInput("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (isThinking) return;
    onSendMessage(suggestion);
  };

  return (
    <div className={`p-4 rounded-xl border flex flex-col h-[500px] md:h-[550px] ${theme.panelBg} ${theme.glowIntensity} transition-all duration-300`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className={`w-5 h-5 ${theme.primary} animate-pulse`} />
          <h3 className="font-sans font-medium tracking-wide uppercase text-sm">F.R.I.D.A.Y. Interface</h3>
        </div>
        <div className="flex items-center gap-2">
          {/* Mute button */}
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? "Unmute vocal synthesizer" : "Mute vocal synthesizer"}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 cursor-pointer transition-all"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Acoustic Wake Word Banner */}
      <div className={`mb-3 p-2.5 rounded-lg border text-xs font-mono flex items-center justify-between transition-all ${
        isContinuousVoice 
          ? "bg-[#00F0FF]/5 border-[#00F0FF]/25 text-[#00F0FF] shadow-[0_0_12px_rgba(0,240,255,0.08)] animate-pulse" 
          : "bg-white/5 border-white/5 text-white/40"
      }`}>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 items-center h-4 w-4 justify-center">
            {isContinuousVoice && isListening ? (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0FF] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00F0FF]"></span>
              </span>
            ) : (
              <div className="w-1.5 h-1.5 rounded-full bg-white/30"></div>
            )}
          </div>
          <div className="leading-tight">
            <span className="font-bold uppercase tracking-wider text-[10px] block">Acoustic Wake Word Mode</span>
            <span className="text-[9px] opacity-70 block">Vocal Passphrase Signature mode enabled. Say passcode to trigger.</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleContinuousVoice}
          className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider cursor-pointer border transition-all ${
            isContinuousVoice 
              ? "bg-[#00F0FF] text-black border-[#00F0FF] hover:bg-cyan-400" 
              : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10"
          }`}
        >
          {isContinuousVoice ? "ACTIVE" : "STANDBY"}
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 mb-3 custom-scrollbar flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className={`w-12 h-12 rounded-full border border-dashed flex items-center justify-center animate-spin ${theme.borderColor}`} style={{ animationDuration: "12s" }}>
              <Sparkles className="w-5 h-5 opacity-40" />
            </div>
            <div className="space-y-1 max-w-sm">
              <p className="text-xs font-mono font-medium tracking-wide">SYSTEM INTEGRATION READY</p>
              <p className="text-[11px] text-white/50 font-mono leading-relaxed">
                "Online and fully operational, Boss. Press the mic button or choose a directive below to initialize communications."
              </p>
            </div>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col max-w-[85%] ${
                m.role === "user" ? "self-end items-end" : "self-start items-start"
              }`}
            >
              <span className="text-[9px] font-mono opacity-40 mb-0.5 uppercase">
                {m.role === "user" ? "Boss" : "F.R.I.D.A.Y."}
              </span>
              <div
                className={`p-3 rounded-xl text-xs font-sans leading-relaxed break-words border ${
                  m.role === "user"
                    ? "bg-white/10 text-white border-white/10 rounded-tr-none"
                    : `bg-black/40 text-slate-100 ${theme.borderColor} rounded-tl-none`
                }`}
              >
                {m.text}
              </div>
              <span className="text-[9px] font-mono opacity-30 mt-0.5">
                {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))
        )}

        {/* Thinking Indicator */}
        {isThinking && (
          <div className="self-start flex flex-col items-start max-w-[85%]">
            <span className="text-[9px] font-mono opacity-40 mb-0.5 uppercase">F.R.I.D.A.Y.</span>
            <div className={`p-3 rounded-xl rounded-tl-none text-xs font-mono flex items-center gap-2 bg-black/40 text-cyan-400 border ${theme.borderColor}`}>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span>SYNAPSE ROUTING ACTIVE...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Proactive Suggestions */}
      <div className="mb-3.5">
        <p className="text-[9px] font-mono uppercase tracking-wider text-white/30 mb-1.5 flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Proactive Directives
        </p>
        <div className="flex flex-wrap gap-1.5">
          {PROACTIVE_SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSuggestionClick(s)}
              disabled={isThinking}
              className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 hover:border-cyan-500/20 hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Input controls */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <button
          type="button"
          onClick={onToggleListen}
          aria-label={isListening ? "Stop listening to microphone" : "Start listening to microphone"}
          className={`p-2.5 rounded-xl border flex items-center justify-center cursor-pointer transition-all ${
            isListening
              ? "bg-rose-500 border-rose-500 text-white animate-pulse"
              : "bg-white/5 border-white/10 text-white hover:bg-white/10"
          }`}
        >
          <Mic className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isListening ? "Listening... speak now..." : "Submit directive to FRIDAY..."}
          disabled={isThinking || isListening}
          className="flex-1 bg-black/40 border border-white/10 text-xs rounded-xl px-4 py-2.5 font-mono text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={!input.trim() || isThinking}
          aria-label="Send Message Directive"
          className={`p-2.5 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
            input.trim() && !isThinking
              ? `${theme.primaryBg} text-black font-semibold hover:bg-opacity-95`
              : "bg-white/5 text-white/30 border border-white/10 cursor-not-allowed"
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
