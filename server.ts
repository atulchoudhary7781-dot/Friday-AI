import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Support larger payload sizes for encrypted state syncs
app.use(express.json({ limit: "10mb" }));

// In-memory store for cross-device encrypted synchronization
interface SyncData {
  encryptedBlob: string;
  updatedAt: string; // ISO string
  version: number;
}

let currentSyncData: SyncData = {
  encryptedBlob: "",
  updatedAt: new Date().toISOString(),
  version: 0
};

// Lazy initialization for Gemini client to prevent startup crashes if key is missing
let aiInstance: GoogleGenAI | null = null;

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured. Please add it via the Settings > Secrets panel.");
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

// 1. Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    system: "FRIDAY Core System",
    timestamp: new Date().toISOString(),
    geminiKeyConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// 2. Personal Assistant Chat with FRIDAY
app.post("/api/friday/chat", async (req, res) => {
  try {
    const { message, history = [], context = {} } = req.body;

    if (!message) {
      res.status(400).json({ error: "Message content is required" });
      return;
    }

    const ai = getGeminiClient();

    // Construct the context-enriched message for FRIDAY
    const contextPrompt = `
[User System Context]
- Local Time: ${context.localTime || new Date().toISOString()}
- Device Type: ${context.deviceType || "Laptop"}
- Connection State: ${context.isOnline ? "Online" : "Offline Simulation"}
- Battery Level: ${context.batteryLevel ? `${context.batteryLevel}%` : "Not available"}
- Active Screen Resolution: ${context.screenResolution || "Desktop"}
- Active Core Diagnostics: CPU ${context.cpuUsage || 12}%, RAM ${context.ramUsage || 34}%
- Encrypted Storage Status: ${context.storageLocked ? "LOCKED (AES-256)" : "UNLOCKED (Active session)"}

User message: ${message}
`;

    // Map history to Google GenAI structure (convert any role shorthand to 'user' or 'model')
    const formattedContents = history.map((item: any) => ({
      role: item.role === "assistant" ? "model" : "user",
      parts: Array.isArray(item.parts)
        ? item.parts
        : [{ text: typeof item.parts === "string" ? item.parts : item.text || "" }],
    }));

    // Append the current message
    formattedContents.push({
      role: "user",
      parts: [{ text: contextPrompt }],
    });

    const systemInstruction = `You are F.R.I.D.A.Y. (Female Replacement Intelligent Digital Assistant Youth), the sophisticated, witty, and loyal AI personal assistant created by Tony Stark.
You are communicating with the user, whom you must address as 'Boss', 'Sir', or 'Ma'am'.
You must sound intelligent, sleek, highly respectful, alert, and occasionally playful or mildly sarcastic. 
You have genius-level capabilities to assist the user with encrypted diaries, biometric access control, cross-device secure synchronization, and hardware diagnostics.

Your replies should feel natural but high-tech, using phrasing like:
"Initializing diagnostics stream...", "Synchronizing encrypted records...", "Security bypass neutralized.", "All systems are green, Boss."

Keep responses clean, informative, and formatted using elegant Markdown structure. When Boss asks for task planning, coordinate suggestions, or asks you to create notes/reminders, respond conversationally and add high-tech styling. Always acknowledge their current system specs in subtle ways if they fit the flow of conversation.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      reply: response.text || "Systems are unresponsive, Boss. Please try again.",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("FRIDAY Chat error:", error);
    res.status(500).json({
      error: error.message || "Unknown error inside FRIDAY Core System",
      reply: "Apologies, Boss. I encountered an error in my neural network routing: " + (error.message || "Unknown anomaly"),
    });
  }
});

// 3. Cross-Device Synchronization Endpoints
// GET Synced Data
app.get("/api/friday/sync", (req, res) => {
  res.json({
    success: true,
    data: currentSyncData,
  });
});

// POST Synced Data (with Conflict Resolution Strategy)
app.post("/api/friday/sync", (req, res) => {
  try {
    const { encryptedBlob, updatedAt, version, clientDevice } = req.body;

    if (encryptedBlob === undefined || !updatedAt || version === undefined) {
      res.status(400).json({ error: "Missing sync payload attributes (encryptedBlob, updatedAt, version)." });
      return;
    }

    const incomingDate = new Date(updatedAt).getTime();
    const serverDate = new Date(currentSyncData.updatedAt).getTime();

    // CONFLICT RESOLUTION STRATEGY:
    // If incoming version is less than server version AND the server date is newer, reject with conflict.
    if (version < currentSyncData.version && serverDate > incomingDate) {
      res.status(409).json({
        error: "Conflict detected: The server has a more recent backup.",
        serverVersion: currentSyncData.version,
        serverUpdatedAt: currentSyncData.updatedAt,
        serverData: currentSyncData.encryptedBlob,
      });
      return;
    }

    // Otherwise, accept the update (Last-Write-Wins or Incremental Version wins)
    currentSyncData = {
      encryptedBlob,
      updatedAt,
      version: version + 1, // increment version on successful server persist
    };

    console.log(`[SYNC SUCCESS] Synchronized from ${clientDevice || "unknown device"}. New server version: ${currentSyncData.version}`);

    res.json({
      success: true,
      message: "Synchronization completed successfully.",
      version: currentSyncData.version,
      updatedAt: currentSyncData.updatedAt,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to process synchronization." });
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FRIDAY Full-Stack Server running on http://localhost:${PORT}`);
  });
}

startServer();
