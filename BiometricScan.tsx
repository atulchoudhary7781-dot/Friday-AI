/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldAlert, ShieldCheck, Fingerprint, RefreshCw, KeyRound } from "lucide-react";
import { ThemeConfig } from "../lib/themes";

interface BiometricScanProps {
  theme: ThemeConfig;
  isLocked: boolean;
  onUnlock: (passcode: string) => Promise<boolean>;
  onLock: () => void;
}

export const BiometricScan: React.FC<BiometricScanProps> = ({ theme, isLocked, onUnlock, onLock }) => {
  const [passcode, setPasscode] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Trigger simulated biometric iris/facial scan
  const triggerBiometricScan = () => {
    if (scanning) return;
    setErrorMsg(null);
    setScanning(true);
    setScanProgress(0);
  };

  useEffect(() => {
    if (!scanning) return;

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanning(false);
          // Auto-trigger unlock logic with standard security key "3000"
          handleBiometricVerification();
          return 100;
        }
        return prev + 5;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [scanning]);

  const handleBiometricVerification = async () => {
    // If scanning completes, we unlock using default passphrase "3000"
    const valid = await onUnlock("3000");
    if (valid) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setPasscode("");
      }, 1500);
    } else {
      setErrorMsg("Biometric signature mismatch or encrypted core corrupt.");
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!passcode) {
      setErrorMsg("Please enter security passcode.");
      return;
    }

    const valid = await onUnlock(passcode);
    if (valid) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setPasscode("");
      }, 1500);
    } else {
      setErrorMsg("Access denied. Decryption signature invalid.");
    }
  };

  return (
    <div className={`p-4 rounded-xl border h-full flex flex-col justify-between ${theme.panelBg} ${theme.glowIntensity} transition-all duration-300`}>
      <div className="flex flex-col h-full justify-between">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
          <div className="flex items-center gap-2">
            {isLocked ? (
              <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            )}
            <h3 className="font-sans font-medium tracking-wide uppercase text-sm">Security Core</h3>
          </div>
          <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded ${
            isLocked ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          }`}>
            {isLocked ? "Secure Locked" : "Authenticated"}
          </span>
        </div>

        {/* Core Biometric Interface */}
        <AnimatePresence mode="wait">
          {isLocked ? (
            <motion.div
              key="locked"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center py-4 space-y-4"
            >
              {/* Interactive Futuristic Fingerprint/Iris Scanner */}
              <button
                onClick={triggerBiometricScan}
                disabled={scanning}
                aria-label="Trigger Biometric Verification Scan"
                className={`relative w-28 h-28 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                  scanning
                    ? "border-cyan-400 bg-cyan-400/10 scale-105"
                    : "border-white/10 hover:border-cyan-500/50 bg-white/5"
                }`}
                style={{ borderColor: scanning ? theme.waveformColor : undefined }}
              >
                {/* Scanner Glitch Lines */}
                {scanning && (
                  <motion.div
                    className="absolute left-0 right-0 h-0.5 bg-cyan-400 opacity-80"
                    style={{ backgroundColor: theme.waveformColor }}
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  />
                )}
                {/* Fingerprint Glyph */}
                <Fingerprint className={`w-14 h-14 transition-all duration-300 ${
                  scanning ? "text-cyan-400 animate-pulse scale-110" : "text-white/40"
                }`} style={{ color: scanning ? theme.waveformColor : undefined }} />
              </button>

              <div className="text-center">
                <p className="text-xs font-mono font-medium tracking-wide">
                  {scanning ? `SCANNING RETINAL CHANNELS: ${scanProgress}%` : "TAP MODULE FOR BIOMETRIC SCAN"}
                </p>
                <p className="text-[10px] text-white/40 font-mono mt-0.5 uppercase tracking-tight">
                  Simulates facial or iris scan structure
                </p>
              </div>

              {/* Manual Passcode Input Fallback */}
              <form onSubmit={handleManualSubmit} className="w-full max-w-xs space-y-2 pt-2 border-t border-white/5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <KeyRound className="absolute left-2.5 top-2.5 w-4 h-4 text-white/30" />
                    <input
                      type="password"
                      placeholder="Enter cryptographic key..."
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      className="w-full text-xs font-mono pl-9 pr-3 py-2 bg-black/40 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/30 text-white placeholder-white/30"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 text-xs font-mono font-medium tracking-wide text-black bg-white hover:bg-neutral-200 rounded-lg transition-all cursor-pointer"
                  >
                    BYPASS
                  </button>
                </div>
                {errorMsg && (
                  <p className="text-[10px] text-rose-400 font-mono text-center animate-pulse">{errorMsg}</p>
                )}
                <p className="text-[9px] text-white/30 font-mono text-center">
                  *Default key derived decrypt: <span className="text-white/60">3000</span>
                </p>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="unlocked"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center py-6 space-y-4"
            >
              {/* Authenticated State */}
              <div className="relative w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-400 flex items-center justify-center animate-pulse">
                <ShieldCheck className="w-12 h-12 text-emerald-400" />
              </div>

              <div className="text-center font-mono space-y-1">
                <h4 className="text-sm font-medium text-emerald-400 tracking-wide uppercase">Identity Confirmed</h4>
                <p className="text-[10px] text-white/50 uppercase tracking-tight">Access granted to decrypt storage</p>
              </div>

              <button
                onClick={onLock}
                className="px-5 py-2 border border-rose-500/30 hover:bg-rose-500/10 text-rose-400 rounded-lg text-xs font-mono font-medium tracking-wide transition-all cursor-pointer uppercase"
              >
                Seal Secured Vault
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
