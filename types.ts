/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ThemeProfile = "sophisticated-dark" | "arc-cyan" | "stark-red" | "stealth-obsidian" | "matrix-green" | "cyber-purple";

export interface SystemDiagnostics {
  cpuUsage: number;
  ramUsage: number;
  batteryLevel: number | null;
  batteryCharging: boolean | null;
  temp: number;
  networkLatency: number;
  networkType: string;
  isOnline: boolean;
  os: string;
  deviceType: "Laptop" | "Phone" | "Tablet" | "Unknown";
  uptime: number; // in seconds
}

export interface DiaryRecord {
  id: string;
  title: string;
  content: string; // decrypted in UI, stored encrypted in LocalStorage/Sync
  isEncrypted: boolean;
  timestamp: string;
  deviceOrigin: string;
  category: "Journal" | "Blueprint" | "Security" | "Memo";
}

export interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high" | "critical";
  deviceOrigin: string;
  timestamp: string;
  dueDate?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
}

export interface SyncStatus {
  lastSyncTime: string | null;
  status: "idle" | "syncing" | "error" | "conflict";
  version: number;
  conflictData?: {
    serverVersion: number;
    serverUpdatedAt: string;
    serverBlob: string;
  };
}

export interface VoiceConfig {
  enabled: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  pitch: number;
  rate: number;
  voiceName: string;
  transcript: string;
}
