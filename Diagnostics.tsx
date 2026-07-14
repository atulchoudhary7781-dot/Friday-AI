/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Laptop, Phone, Battery, Cpu, Radio, Shield, HelpCircle } from "lucide-react";
import { SystemDiagnostics } from "../types";
import { ThemeConfig } from "../lib/themes";

interface DiagnosticsProps {
  theme: ThemeConfig;
  diagnostics: SystemDiagnostics;
  setDiagnostics: React.Dispatch<React.SetStateAction<SystemDiagnostics>>;
}

export const Diagnostics: React.FC<DiagnosticsProps> = ({ theme, diagnostics, setDiagnostics }) => {
  const [activeTab, setActiveTab] = useState<"laptop" | "phone">("laptop");

  // Fetch real battery status if available in browser
  useEffect(() => {
    let batteryInstance: any = null;

    const handleBatteryChange = (batt: any) => {
      setDiagnostics((prev) => ({
        ...prev,
        batteryLevel: Math.round(batt.level * 100),
        batteryCharging: batt.charging,
      }));
    };

    if (typeof navigator !== "undefined" && "getBattery" in navigator) {
      (navigator as any).getBattery().then((batt: any) => {
        batteryInstance = batt;
        handleBatteryChange(batt);
        batt.addEventListener("levelchange", () => handleBatteryChange(batt));
        batt.addEventListener("chargingchange", () => handleBatteryChange(batt));
      }).catch((err) => {
        console.warn("Battery API not supported or blocked", err);
      });
    }

    return () => {
      if (batteryInstance) {
        batteryInstance.removeEventListener("levelchange", () => {});
        batteryInstance.removeEventListener("chargingchange", () => {});
      }
    };
  }, [setDiagnostics]);

  // Simulate dynamically fluctuating CPU, RAM, and measuring actual network ping latency to server
  useEffect(() => {
    const interval = setInterval(async () => {
      // Fluctuating values
      const cpuDelta = Math.floor(Math.random() * 11) - 5; // -5 to +5
      const ramDelta = Math.floor(Math.random() * 5) - 2;  // -2 to +2
      const tempDelta = Math.floor(Math.random() * 3) - 1;  // -1 to +1

      // Actual latency measurement
      let latency = diagnostics.networkLatency;
      const start = performance.now();
      try {
        const res = await fetch("/api/health");
        if (res.ok) {
          latency = Math.round(performance.now() - start);
        }
      } catch (err) {
        // Offline or slow
        latency = 999;
      }

      setDiagnostics((prev) => {
        const newCpu = Math.max(5, Math.min(95, prev.cpuUsage + cpuDelta));
        const newRam = Math.max(10, Math.min(90, prev.ramUsage + ramDelta));
        const newTemp = Math.max(35, Math.min(85, prev.temp + tempDelta));

        return {
          ...prev,
          cpuUsage: newCpu,
          ramUsage: newRam,
          temp: newTemp,
          networkLatency: latency,
          uptime: prev.uptime + 3,
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [setDiagnostics, diagnostics.networkLatency]);

  const formatUptime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`p-4 rounded-xl border ${theme.panelBg} ${theme.glowIntensity} transition-all duration-300 h-full flex flex-col justify-between`}>
      <div>
        {/* Title and Device Toggle */}
        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
          <div className="flex items-center gap-2">
            <Cpu className={`w-5 h-5 ${theme.primary}`} />
            <h3 className="font-sans font-medium tracking-wide uppercase text-sm">Hardware Core</h3>
          </div>
          <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab("laptop")}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 font-mono cursor-pointer ${
                activeTab === "laptop" ? "bg-white/10 text-white font-medium" : "text-white/40 hover:text-white"
              }`}
            >
              <Laptop className="w-3.5 h-3.5" /> HOST
            </button>
            <button
              onClick={() => setActiveTab("phone")}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 font-mono cursor-pointer ${
                activeTab === "phone" ? "bg-white/10 text-white font-medium" : "text-white/40 hover:text-white"
              }`}
            >
              <Phone className="w-3.5 h-3.5" /> MOBILE
            </button>
          </div>
        </div>

        {/* Tab content: HOST (Laptop) */}
        {activeTab === "laptop" && (
          <div className="space-y-4">
            {/* Real CPU & RAM Progress Bars */}
            <div className="space-y-3 font-mono">
              {/* CPU */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="opacity-60">CPU load</span>
                  <span className={theme.primary}>{diagnostics.cpuUsage}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${theme.primaryBg}`}
                    style={{ width: `${diagnostics.cpuUsage}%` }}
                  />
                </div>
              </div>

              {/* RAM */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="opacity-60">Memory allocation</span>
                  <span className={theme.primary}>{diagnostics.ramUsage}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 transition-all duration-1000"
                    style={{ width: `${diagnostics.ramUsage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Grid Specs */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono border-t border-white/5 pt-3">
              <div className="bg-white/5 p-2 rounded border border-white/5">
                <div className="opacity-40 uppercase tracking-wider text-[9px] mb-0.5">Core Temp</div>
                <div className="text-white text-xs">{diagnostics.temp}°C</div>
              </div>
              <div className="bg-white/5 p-2 rounded border border-white/5">
                <div className="opacity-40 uppercase tracking-wider text-[9px] mb-0.5">Uptime</div>
                <div className="text-white text-xs truncate">{formatUptime(diagnostics.uptime)}</div>
              </div>
              <div className="bg-white/5 p-2 rounded border border-white/5">
                <div className="opacity-40 uppercase tracking-wider text-[9px] mb-0.5">Platform</div>
                <div className="text-white text-xs truncate uppercase">{diagnostics.os}</div>
              </div>
              <div className="bg-white/5 p-2 rounded border border-white/5">
                <div className="opacity-40 uppercase tracking-wider text-[9px] mb-0.5">Hardware Enc</div>
                <div className="text-emerald-400 text-xs flex items-center gap-1">
                  <Shield className="w-3 h-3" /> ACTIVE
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab content: MOBILE (Phone - iOS/Android) */}
        {activeTab === "phone" && (
          <div className="space-y-4">
            {/* Interactive Mobile Emulation Indicators */}
            <div className="space-y-3 font-mono">
              {/* Battery level */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="opacity-60 flex items-center gap-1"><Battery className="w-3.5 h-3.5" /> Mobile Battery</span>
                  <span className={theme.primary}>
                    {diagnostics.batteryLevel ? `${diagnostics.batteryLevel}%` : "84%"}
                    {diagnostics.batteryCharging && " (⚡ Charging)"}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 transition-all duration-1000"
                    style={{ width: `${diagnostics.batteryLevel || 84}%` }}
                  />
                </div>
              </div>

              {/* Cellular Signal Strength */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="opacity-60 flex items-center gap-1"><Radio className="w-3.5 h-3.5" /> Signal (5G Ultra)</span>
                  <span className="text-indigo-400">92%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-400 transition-all duration-1000"
                    style={{ width: "92%" }}
                  />
                </div>
              </div>
            </div>

            {/* Grid specs phone */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono border-t border-white/5 pt-3">
              <div className="bg-white/5 p-2 rounded border border-white/5">
                <div className="opacity-40 uppercase tracking-wider text-[9px] mb-0.5">iOS/Android Sync</div>
                <div className="text-emerald-400 text-xs">E2E Secure</div>
              </div>
              <div className="bg-white/5 p-2 rounded border border-white/5">
                <div className="opacity-40 uppercase tracking-wider text-[9px] mb-0.5">Mobile Latency</div>
                <div className="text-white text-xs">{diagnostics.networkLatency + 4}ms</div>
              </div>
              <div className="bg-white/5 p-2 rounded border border-white/5">
                <div className="opacity-40 uppercase tracking-wider text-[9px] mb-0.5">Mobile Temp</div>
                <div className="text-white text-xs">37.2°C</div>
              </div>
              <div className="bg-white/5 p-2 rounded border border-white/5">
                <div className="opacity-40 uppercase tracking-wider text-[9px] mb-0.5">NFC Security</div>
                <div className="text-emerald-400 text-xs flex items-center gap-1">
                  <Shield className="w-3 h-3" /> ARMED
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Connection Latency Diagnostics HUD */}
      <div className="border-t border-white/5 pt-3 mt-4 flex items-center justify-between text-[11px] font-mono opacity-80">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${diagnostics.isOnline ? "bg-emerald-400 animate-pulse" : "bg-rose-400 animate-pulse"}`} />
          <span className="uppercase text-white/50 text-[10px]">PING FRIDAY SYSTEM</span>
        </div>
        <div className={`text-right ${diagnostics.networkLatency < 100 ? "text-emerald-400" : diagnostics.networkLatency < 250 ? "text-amber-400" : "text-rose-400"}`}>
          {diagnostics.networkLatency === 999 ? "OFFLINE" : `${diagnostics.networkLatency} ms`}
        </div>
      </div>
    </div>
  );
};
