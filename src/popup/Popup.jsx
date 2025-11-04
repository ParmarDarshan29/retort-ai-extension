import React, { useState, useEffect } from "react";
import "./styles.css";
import { getAIReply } from "../api/openrouter";

export default function Popup() {
  const [reply, setReply] = useState("");
  const [context, setContext] = useState("");
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("message");
  const [tone, setTone] = useState("Polite");
  const [contextSource, setContextSource] = useState("selection");
  const [toast, setToast] = useState("");
  const [contextPreloaded, setContextPreloaded] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(["retortContext"], (result) => {
      if (result.retortContext) {
        setContext(result.retortContext);
        setContextPreloaded(true);
        chrome.storage.local.remove(["retortContext"]);
      }
    });
    // Load stored API key (if any)
    chrome.storage.local.get(["openrouterApiKey"], (res) => {
      if (res.openrouterApiKey) setApiKey(res.openrouterApiKey);
    });
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const sendToAI = async (extracted) => {
    const input =
      mode === "message"
        ? `Rewrite the message "${userInput}" in a ${tone.toLowerCase()} tone.`
        : userInput;

    const prompt = `Context:\n${extracted}\n\nUser:\n${input}`;

    try {
      if (!apiKey) throw new Error("Missing API key");
      const result = await getAIReply(prompt, apiKey);
      setReply(result || "No reply received.");
    } catch (error) {
      console.error("AI API Error:", error);
      if (error.message && error.message.includes("missing")) {
        showToast("⚠️ API key missing — open Settings to add your OpenRouter key.");
      } else {
        showToast("❌ Failed to fetch AI reply.");
      }
      setReply("Failed to fetch reply.");
    }
  };

  const saveApiKey = () => {
    const trimmed = apiKey.trim();
    if (!trimmed) {
      showToast("⚠️ API key cannot be empty.");
      return;
    }
    chrome.storage.local.set({ openrouterApiKey: trimmed }, () => {
      showToast("✅ API key saved.");
    });
  };

  const clearApiKey = () => {
    chrome.storage.local.remove(["openrouterApiKey"], () => {
      setApiKey("");
      showToast("✅ API key cleared.");
    });
  };

  const generateReply = async () => {
    setLoading(true);

    if (contextPreloaded && contextSource === "selection" && context.trim() !== "") {
      await sendToAI(context);
      setLoading(false);
      return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "extractText", source: contextSource },
        async (response) => {
          const extracted = response?.text || "";

          if (contextSource === "selection" && (!extracted || extracted.startsWith("No text selected"))) {
            showToast("⚠️ Please highlight text on the page before generating.");
            setLoading(false);
            return;
          }

          setContext(extracted);
          await sendToAI(extracted);
          setLoading(false);
        }
      );
    });
  };

  const copyReplyToClipboard = () => {
    navigator.clipboard.writeText(reply).then(() => {
      showToast("✅ Reply copied to clipboard!");
    }).catch(() => {
      showToast("❌ Failed to copy reply.");
    });
  };

  return (
    <div className="container">
      <h1 className="header-with-image">
        <img src="/logo.png" alt="retort.ai logo" className="header-icon" />
        retort.ai
      </h1>

      {/* Settings toggle */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <button
          onClick={() => setShowSettings(!showSettings)}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#666' }}
          aria-label="Toggle settings"
        >
          ⚙️
        </button>
      </div>

      {showSettings && (
        <div className="box" style={{ marginBottom: 12 }}>
          <div style={{ marginBottom: 8, fontWeight: 600 }}>Settings</div>
          <label style={{ fontSize: 12, color: '#444' }}>OpenRouter API Key</label>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-or-... or Bearer sk-..."
            style={{ width: '100%', marginTop: 6, padding: '6px', boxSizing: 'border-box' }}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button onClick={saveApiKey} style={{ flex: 1 }}>Save API Key</button>
            <button onClick={clearApiKey} style={{ flex: 1, background: '#777' }}>Clear</button>
          </div>
        </div>
      )}

      {/* Mode Toggle */}
      <div className="toggle-section">
        <span className="switch-label">
          {mode === "message" ? "Message Mode" : "Prompt Mode"}
        </span>
        <label className="switch">
          <input
            type="checkbox"
            checked={mode === "prompt"}
            onChange={() => setMode(mode === "message" ? "prompt" : "message")}
          />
          <span className="slider" />
        </label>
      </div>

      {/* Tone Selection */}
      {mode === "message" && (
        <div className="toggle-section" style={{ marginTop: 4 }}>
          <span className="switch-label">Tone:</span>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="tone-select"
          >
            <option value="Polite">Polite</option>
            <option value="Friendly">Friendly</option>
            <option value="Professional">Professional</option>
            <option value="Casual">Casual</option>
            <option value="Witty">Witty</option>
            <option value="Formal">Formal</option>
          </select>
        </div>
      )}

      {/* Context Source */}
      <div className="toggle-section">
        <span className="switch-label">Context Source:</span>
        <select
          value={contextSource}
          onChange={(e) => setContextSource(e.target.value)}
          className="tone-select"
        >
          <option value="selection">Use Highlighted Text</option>
          <option value="fullpage">Use Full Page Content</option>
        </select>
      </div>

      {/* User Input */}
      <textarea
        className="box"
        placeholder={mode === "message" ? "Type your message..." : "Write a prompt..."}
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      />

      {/* Context Display */}
      <div className="box">{context || "Context will appear here..."}</div>

      {/* AI Reply */}
      <div className="box reply-box">{reply || "AI reply will appear here..."}</div>

      {/* Copy Button */}
      {reply && reply !== "AI reply will appear here..." && (
        <button onClick={copyReplyToClipboard} className="copy-button">
          📋 Copy Reply
        </button>
      )}

      {/* Generate Button */}
      <button onClick={generateReply} disabled={loading}>
        {loading ? "Thinking..." : "Generate Reply"}
      </button>

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}