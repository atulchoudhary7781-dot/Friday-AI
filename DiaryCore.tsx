/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { FolderLock, Unlock, Plus, Search, Calendar, Tag, ShieldCheck } from "lucide-react";
import { DiaryRecord } from "../types";
import { ThemeConfig } from "../lib/themes";
import { generateGlitchText } from "../lib/crypto";

interface DiaryCoreProps {
  theme: ThemeConfig;
  isLocked: boolean;
  records: DiaryRecord[];
  onAddRecord: (title: string, content: string, category: DiaryRecord["category"]) => void;
}

export const DiaryCore: React.FC<DiaryCoreProps> = ({ theme, isLocked, records, onAddRecord }) => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState<DiaryRecord["category"]>("Journal");
  const [isAdding, setIsAdding] = useState(false);
  const [glitchStore, setGlitchStore] = useState<Record<string, string>>({});

  // Cycle glitch text when locked to look super futuristic
  useEffect(() => {
    if (!isLocked) return;

    const interval = setInterval(() => {
      const newGlitches: Record<string, string> = {};
      records.forEach((r) => {
        // Scramble both title and content to preserve cybersecurity vibe
        newGlitches[r.id] = generateGlitchText(Math.min(r.content.length, 120));
        newGlitches[r.id + "_title"] = generateGlitchText(Math.min(r.title.length, 15));
      });
      setGlitchStore(newGlitches);
    }, 450);

    return () => clearInterval(interval);
  }, [isLocked, records]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    onAddRecord(newTitle, newContent, newCategory);
    setNewTitle("");
    setNewContent("");
    setIsAdding(false);
  };

  const filteredRecords = records.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
                          r.content.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || r.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={`p-4 rounded-xl border flex flex-col h-[400px] md:h-[450px] ${theme.panelBg} ${theme.glowIntensity} transition-all duration-300`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
        <div className="flex items-center gap-2">
          {isLocked ? (
            <FolderLock className="w-5 h-5 text-rose-400 animate-pulse" />
          ) : (
            <Unlock className="w-5 h-5 text-emerald-400" />
          )}
          <h3 className="font-sans font-medium tracking-wide uppercase text-sm">Secure Data Vault</h3>
        </div>
        {!isLocked && (
          <button
            onClick={() => setIsAdding(!isAdding)}
            className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all flex items-center gap-1 hover:bg-white/10 text-white cursor-pointer border border-white/10`}
          >
            <Plus className="w-3.5 h-3.5" /> NEW ENTRY
          </button>
        )}
      </div>

      {/* Body content */}
      {isAdding && !isLocked ? (
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between space-y-3 font-mono text-xs">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1">Vault Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as DiaryRecord["category"])}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-400 text-white"
                >
                  <option value="Journal" className="bg-stone-900 text-white">Journal</option>
                  <option value="Blueprint" className="bg-stone-900 text-white">Blueprint</option>
                  <option value="Security" className="bg-stone-900 text-white">Security</option>
                  <option value="Memo" className="bg-stone-900 text-white">Memo</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="Record label..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-400 text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1">Data Payload</label>
              <textarea
                placeholder="Compose secure encrypted entry content..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={5}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-400 text-white resize-none"
                required
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2 border-t border-white/5">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3.5 py-1.5 border border-white/10 hover:bg-white/5 text-white/70 rounded-lg transition-all cursor-pointer"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className={`px-4 py-1.5 ${theme.primaryBg} text-black font-semibold rounded-lg hover:bg-opacity-90 transition-all cursor-pointer flex items-center gap-1.5`}
            >
              <ShieldCheck className="w-3.5 h-3.5" /> SEAL ENTRY
            </button>
          </div>
        </form>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Filters */}
          <div className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-white/30" />
              <input
                type="text"
                placeholder="Search secure core..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-black/30 border border-white/5 text-xs rounded-lg pl-8 pr-3 py-1.5 font-mono text-white placeholder-white/30 focus:outline-none focus:border-cyan-400/40"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-black/30 border border-white/5 text-xs rounded-lg px-2 py-1 focus:outline-none font-mono text-white/70"
            >
              <option value="all" className="bg-stone-900 text-white">ALL</option>
              <option value="Journal" className="bg-stone-900 text-white">JOURNAL</option>
              <option value="Blueprint" className="bg-stone-900 text-white">BLUEPRINT</option>
              <option value="Security" className="bg-stone-900 text-white">SECURITY</option>
              <option value="Memo" className="bg-stone-900 text-white">MEMO</option>
            </select>
          </div>

          {/* Records List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {filteredRecords.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <p className="text-xs font-mono text-white/30 uppercase tracking-widest">
                  {isLocked ? "VAULT LOCKED. AUTHENTICATION REQUIRED." : "NO DATA VAULT RECORDS SEEDED."}
                </p>
              </div>
            ) : (
              filteredRecords.map((r) => (
                <div
                  key={r.id}
                  className="p-2.5 rounded-lg border border-white/5 bg-white/5 flex flex-col justify-between space-y-1.5 transition-all hover:bg-white/10"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="flex items-center gap-1 text-white/50">
                      <Calendar className="w-3 h-3" />
                      {new Date(r.timestamp).toLocaleDateString()}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-semibold ${
                      r.category === "Security" ? "bg-rose-500/10 text-rose-400 border border-rose-500/10" :
                      r.category === "Blueprint" ? "bg-amber-500/10 text-amber-400 border border-amber-500/10" :
                      "bg-cyan-500/10 text-cyan-400 border border-cyan-500/10"
                    }`}>
                      <Tag className="w-2.5 h-2.5 inline mr-1" />
                      {r.category}
                    </span>
                  </div>

                  <h4 className="font-sans font-medium text-xs tracking-wide text-white">
                    {isLocked ? glitchStore[r.id + "_title"] || "********" : r.title}
                  </h4>

                  <p className="font-mono text-[11px] text-white/60 leading-relaxed break-words bg-black/20 p-2 rounded border border-white/5 select-none">
                    {isLocked ? glitchStore[r.id] || "***********************************" : r.content}
                  </p>

                  <div className="flex justify-between items-center text-[10px] font-mono opacity-50 pt-1">
                    <span>Origin: {r.deviceOrigin}</span>
                    <span className="text-emerald-400">AES-256 Verified</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
