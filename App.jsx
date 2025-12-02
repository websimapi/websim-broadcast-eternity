import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Player } from "@websim/remotion/player";
import { GameComposition } from "./GameComposition.jsx";
import { loadGameFromComments, saveGameToComment } from "./utils.js";
import { Mic, Disc, Save, Play, Square, Share2, Loader2 } from "lucide-react";
function App() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [history, setHistory] = useState([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [userData, setUserData] = useState({ username: "Drifter" });
  const playerRef = useRef(null);
  const frameRef = useRef(0);
  const audioContext = useRef(null);
  useEffect(() => {
    const init = async () => {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
      const user = await window.websim.getCurrentUser();
      if (user) setUserData({ username: user.username });
      const saved = await loadGameFromComments();
      if (saved) {
        setHistory(saved.history || []);
        setScore(saved.score || 0);
        setLevel(saved.level || 1);
        console.log("Save loaded!", saved);
      }
      setLoading(false);
    };
    init();
  }, []);
  const playSound = (freq = 440, type = "sine") => {
    if (!audioContext.current) return;
    const osc = audioContext.current.createOscillator();
    const gain = audioContext.current.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioContext.current.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + 0.5);
    gain.gain.setValueAtTime(0.1, audioContext.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(audioContext.current.destination);
    osc.start();
    osc.stop(audioContext.current.currentTime + 0.5);
  };
  useEffect(() => {
    let interval;
    if (playing) {
      interval = setInterval(() => {
        setScore((s) => s + level * 10);
        frameRef.current += 1;
      }, 100);
    }
    return () => clearInterval(interval);
  }, [playing, level]);
  const handleAction = (type, val) => {
    if (!playing) return;
    const newEvent = {
      time: frameRef.current / 30,
      // Approximate seconds
      type,
      val,
      id: Math.random().toString(36).substr(2, 9)
    };
    setHistory((prev) => [...prev, newEvent]);
    setScore((s) => s + 500);
    if (type === "sync") {
      playSound(200 + val * 100, "square");
      if (val === level) {
        setLevel((l) => l + 1);
      }
    } else {
      playSound(800, "sawtooth");
    }
  };
  const handleSave = async () => {
    setPlaying(false);
    setSaving(true);
    const gameState = {
      history,
      score,
      level,
      timestamp: Date.now()
    };
    const success = await saveGameToComment(gameState);
    if (success) {
      alert("BROADCAST ARCHIVED SUCCESSFULLY.");
    } else {
      alert("ARCHIVAL FAILED.");
    }
    setSaving(false);
  };
  if (loading) {
    return /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", color: "#0ff" }, children: [
      /* @__PURE__ */ jsxDEV(Loader2, { className: "animate-spin", size: 48 }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 121,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("p", { children: "INITIALIZING BROADCAST UPLINK..." }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 122,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 120,
      columnNumber: 7
    }, this);
  }
  return /* @__PURE__ */ jsxDEV("div", { style: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    background: "#000"
  }, children: [
    /* @__PURE__ */ jsxDEV("div", { style: { flex: 1, position: "relative", width: "100%", overflow: "hidden" }, children: [
      /* @__PURE__ */ jsxDEV(
        Player,
        {
          ref: playerRef,
          component: GameComposition,
          durationInFrames: 36e3,
          compositionWidth: 1080,
          compositionHeight: 1080,
          fps: 30,
          style: {
            width: "100%",
            height: "100%",
            objectFit: "contain"
          },
          controls: false,
          autoPlay: playing,
          loop: true,
          inputProps: {
            history,
            currentLevel: level,
            score,
            username: userData.username
          }
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 139,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV("div", { style: {
        position: "absolute",
        bottom: 20,
        left: 0,
        right: 0,
        padding: "0 20px",
        display: "flex",
        justifyContent: "center",
        gap: 20,
        zIndex: 50
      }, children: !playing ? /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => setPlaying(true),
          className: "game-btn",
          style: { background: "#0f0", color: "#000", padding: "15px 40px", fontSize: "1.2rem", fontWeight: "bold" },
          children: [
            /* @__PURE__ */ jsxDEV(Play, { size: 24, style: { display: "inline", marginRight: 8 } }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 180,
              columnNumber: 16
            }, this),
            history.length > 0 ? "RESUME SIGNAL" : "START BROADCAST"
          ]
        },
        void 0,
        true,
        {
          fileName: "<stdin>",
          lineNumber: 175,
          columnNumber: 14
        },
        this
      ) : /* @__PURE__ */ jsxDEV(Fragment, { children: [
        /* @__PURE__ */ jsxDEV("button", { onClick: () => handleAction("sync", 0), className: "game-btn red", children: "MOD A" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 185,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("button", { onClick: () => handleAction("sync", 1), className: "game-btn blue", children: "MOD B" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 186,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("button", { onClick: () => handleAction("sync", 2), className: "game-btn yellow", children: "MOD C" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 187,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("button", { onClick: () => handleAction("shape", Math.floor(Math.random() * 5)), className: "game-btn purple", children: "SHIFT" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 188,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 184,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 163,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { style: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        padding: 15,
        background: "linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%)",
        display: "flex",
        justifyContent: "space-between",
        zIndex: 50
      }, children: [
        /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", gap: 10, alignItems: "center" }, children: [
          /* @__PURE__ */ jsxDEV("div", { style: { width: 12, height: 12, borderRadius: "50%", background: playing ? "#f00" : "#444" } }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 206,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("span", { style: { fontWeight: "bold", letterSpacing: 2 }, children: playing ? "ON AIR" : "OFFLINE" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 207,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 205,
          columnNumber: 12
        }, this),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: handleSave,
            disabled: saving,
            style: {
              background: "transparent",
              border: "1px solid #fff",
              color: "#fff",
              padding: "5px 15px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 5
            },
            children: [
              saving ? /* @__PURE__ */ jsxDEV(Loader2, { className: "animate-spin", size: 16 }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 226,
                columnNumber: 24
              }, this) : /* @__PURE__ */ jsxDEV("img", { src: "/tape_icon.png", style: { width: 16, height: 16, objectFit: "contain" } }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 226,
                columnNumber: 72
              }, this),
              "ARCHIVE TAPE"
            ]
          },
          void 0,
          true,
          {
            fileName: "<stdin>",
            lineNumber: 212,
            columnNumber: 12
          },
          this
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 194,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 138,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("style", { children: `
        .game-btn {
          border: none;
          padding: 20px;
          border-radius: 50%;
          width: 80px;
          height: 80px;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.1s;
          box-shadow: 0 4px 0 rgba(0,0,0,0.5);
          text-shadow: 1px 1px 0 rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Courier New', monospace;
        }
        .game-btn:active {
          transform: translateY(4px);
          box-shadow: 0 0 0 rgba(0,0,0,0.5);
        }
        .game-btn.red { background: #FF0055; color: white; }
        .game-btn.blue { background: #00FFAA; color: black; }
        .game-btn.yellow { background: #FFFF00; color: black; }
        .game-btn.purple { background: #AA00FF; color: white; }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      ` }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 232,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 128,
    columnNumber: 5
  }, this);
}
export {
  App as default
};
