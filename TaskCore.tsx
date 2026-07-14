/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { CheckSquare, Square, Trash2, AlertTriangle, CloudLightning, ShieldCheck, ArrowUpRight } from "lucide-react";
import { TaskItem, SyncStatus } from "../types";
import { ThemeConfig } from "../lib/themes";

interface TaskCoreProps {
  theme: ThemeConfig;
  tasks: TaskItem[];
  onAddTask: (title: string, priority: TaskItem["priority"]) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onTriggerSync: () => void;
  syncStatus: SyncStatus;
  resolveConflict: (resolution: "client" | "server") => void;
}

export const TaskCore: React.FC<TaskCoreProps> = ({
  theme,
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onTriggerSync,
  syncStatus,
  resolveConflict,
}) => {
  const [newTitle, setNewTitle] = useState("");
  const [priority, setPriority] = useState<TaskItem["priority"]>("medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask(newTitle, priority);
    setNewTitle("");
  };

  const getPriorityColor = (p: TaskItem["priority"]) => {
    switch (p) {
      case "critical": return "text-rose-500 bg-rose-500/10 border-rose-500/20";
      case "high": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "medium": return "text-cyan-400 bg-cyan-400/10 border-cyan-400/20";
      default: return "text-slate-400 bg-slate-400/10 border-slate-400/20";
    }
  };

  return (
    <div className={`p-4 rounded-xl border flex flex-col h-[400px] md:h-[450px] ${theme.panelBg} ${theme.glowIntensity} transition-all duration-300`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <CheckSquare className={`w-5 h-5 ${theme.primary}`} />
          <h3 className="font-sans font-medium tracking-wide uppercase text-sm">Secure Task Core</h3>
        </div>
        <button
          onClick={onTriggerSync}
          disabled={syncStatus.status === "syncing"}
          className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all flex items-center gap-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 cursor-pointer disabled:opacity-50`}
        >
          <CloudLightning className="w-3.5 h-3.5" />
          {syncStatus.status === "syncing" ? "SYNCING..." : "FORCE SYNC"}
        </button>
      </div>

      {/* Sync Status Sub-bar */}
      <div className="flex justify-between items-center text-[10px] font-mono bg-black/30 px-2.5 py-1.5 rounded-lg mb-3 border border-white/5">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="opacity-60">Cross-Device E2E Sync:</span>
          <span className="text-emerald-400 font-bold uppercase">ARMED (v{syncStatus.version})</span>
        </div>
        <div className="opacity-50">
          {syncStatus.lastSyncTime ? `Last: ${new Date(syncStatus.lastSyncTime).toLocaleTimeString()}` : "Not synced"}
        </div>
      </div>

      {/* Conflict Resolution Prompt */}
      {syncStatus.status === "conflict" && syncStatus.conflictData && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-3 mb-3 space-y-2 font-mono text-[11px] animate-pulse">
          <div className="flex items-center gap-1.5 text-rose-400 font-semibold">
            <AlertTriangle className="w-4 h-4" />
            <span>CROSS-DEVICE CONFLICT DETECTED</span>
          </div>
          <p className="text-white/70 leading-relaxed">
            The encrypted sync backup on the server (v{syncStatus.conflictData.serverVersion}) is newer than the local version (v{syncStatus.version}). Choose conflict resolution strategy:
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => resolveConflict("server")}
              className="px-2.5 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded font-bold cursor-pointer transition-all"
            >
              KEEP SERVER VERSION (Merge)
            </button>
            <button
              onClick={() => resolveConflict("client")}
              className="px-2.5 py-1 border border-white/20 hover:bg-white/5 text-white rounded cursor-pointer transition-all"
            >
              KEEP LOCAL VERSION (Overwrite)
            </button>
          </div>
        </div>
      )}

      {/* Add Task Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="New task directive..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="flex-1 bg-black/40 border border-white/10 text-xs rounded-lg px-3 py-1.5 font-mono text-white placeholder-white/30 focus:outline-none focus:border-cyan-400"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskItem["priority"])}
          className="bg-black/40 border border-white/10 text-xs rounded-lg px-2 py-1.5 focus:outline-none font-mono text-white/70 cursor-pointer"
        >
          <option value="low" className="bg-stone-900 text-white">LOW</option>
          <option value="medium" className="bg-stone-900 text-white">MEDIUM</option>
          <option value="high" className="bg-stone-900 text-white">HIGH</option>
          <option value="critical" className="bg-stone-900 text-white">CRITICAL</option>
        </select>
        <button
          type="submit"
          className={`px-3 py-1.5 ${theme.primaryBg} text-black font-semibold rounded-lg hover:bg-opacity-90 transition-all cursor-pointer text-xs`}
        >
          ADD
        </button>
      </form>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {tasks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <p className="text-xs font-mono text-white/30 uppercase tracking-widest">
              No tasks scheduled, Boss. Systems are running green.
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`p-2.5 rounded-lg border border-white/5 bg-white/5 flex items-center justify-between transition-all hover:bg-white/10 ${
                task.completed ? "opacity-50" : ""
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                  onClick={() => onToggleTask(task.id)}
                  className="text-white/60 hover:text-white cursor-pointer"
                  aria-label={task.completed ? "Mark task incomplete" : "Mark task complete"}
                >
                  {task.completed ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <span className={`text-xs font-sans truncate block ${task.completed ? "line-through text-white/40" : "text-white"}`}>
                    {task.title}
                  </span>
                  <div className="flex gap-2 items-center text-[9px] font-mono opacity-50 mt-0.5">
                    <span>Origin: {task.deviceOrigin}</span>
                    <span>•</span>
                    <span>Synced: True</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[8px] uppercase font-mono font-bold border ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="text-white/30 hover:text-rose-400 p-1 cursor-pointer"
                  aria-label="Delete Task Directive"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cross-device mobile deployment shortcut */}
      <div className="mt-2.5 pt-2 border-t border-white/5 flex justify-between items-center text-[10px] font-mono opacity-60">
        <span>Target: iPhone 16 Pro + MacBook Pro M4 Max</span>
        <span className="flex items-center gap-0.5 hover:text-white cursor-pointer">
          DEPLOY TO APP <ArrowUpRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
};
