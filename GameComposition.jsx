import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
const COLORS = [
  "#FF0055",
  // Red
  "#00FFAA",
  // Teal
  "#FFFF00",
  // Yellow
  "#AA00FF",
  // Purple
  "#FFFFFF"
  // White
];
const GameComposition = ({ history, currentLevel, score, username }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const bgPulse = Math.sin(frame / 20) * 0.1 + 0.1;
  const lastEvent = history.length > 0 ? history[history.length - 1] : { type: "init", val: 0, time: 0 };
  const scale = spring({
    frame: frame % 60,
    // Loop the spring every 2 seconds roughly
    fps,
    config: { damping: 10 + currentLevel * 2 }
  });
  const rotation = interpolate(frame, [0, 360], [0, 360 * (lastEvent.val + 1)]);
  const activeColor = COLORS[lastEvent.val % COLORS.length];
  return /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { backgroundColor: "#111", color: "white", fontFamily: "monospace" }, children: [
    /* @__PURE__ */ jsxDEV("div", { style: {
      position: "absolute",
      inset: 0,
      backgroundImage: `linear-gradient(${activeColor}33 1px, transparent 1px),
        linear-gradient(90deg, ${activeColor}33 1px, transparent 1px)`,
      backgroundSize: `${50 - currentLevel * 2}px ${50 - currentLevel * 2}px`,
      transform: `perspective(500px) rotateX(60deg) translateY(${frame % 50}px)`,
      opacity: 0.3
    } }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 37,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { justifyContent: "center", alignItems: "center" }, children: /* @__PURE__ */ jsxDEV("div", { style: {
      width: 200,
      height: 200,
      border: `4px solid ${activeColor}`,
      borderRadius: lastEvent.type === "shape" ? "50%" : "0%",
      transform: `scale(${1 + scale * 0.2}) rotate(${rotation}deg)`,
      boxShadow: `0 0 ${20 + score % 50}px ${activeColor}`,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "4rem",
      background: "rgba(0,0,0,0.5)"
    }, children: currentLevel }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 49,
      columnNumber: 9
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 48,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV("div", { style: {
      position: "absolute",
      inset: 0,
      background: "url(/static_overlay.png)",
      opacity: 0.15,
      backgroundSize: "cover",
      mixBlendMode: "overlay"
    } }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 67,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { padding: 40, justifyContent: "space-between", alignItems: "flex-start", pointerEvents: "none" }, children: [
      /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", justifyContent: "space-between", width: "100%" }, children: [
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("h2", { style: { margin: 0, textShadow: "2px 2px #000" }, children: "LIVE BROADCAST" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 81,
            columnNumber: 13
          }),
          /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
            /* @__PURE__ */ jsxDEV("div", { style: { width: 10, height: 10, borderRadius: "50%", background: "red", boxShadow: "0 0 10px red" } }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 83,
              columnNumber: 15
            }),
            /* @__PURE__ */ jsxDEV("span", { style: { fontSize: "0.8rem", opacity: 0.8 }, children: [
              "REC ",
              Math.floor(frame / 30),
              "s"
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 84,
              columnNumber: 15
            })
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 82,
            columnNumber: 13
          }),
          /* @__PURE__ */ jsxDEV("div", { style: { marginTop: 10, fontSize: "1.2rem" }, children: [
            "USER: ",
            username || "ANONYMOUS"
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 86,
            columnNumber: 13
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 80,
          columnNumber: 11
        }),
        /* @__PURE__ */ jsxDEV("div", { style: { textAlign: "right" }, children: [
          /* @__PURE__ */ jsxDEV("h1", { style: { margin: 0, fontSize: "3rem", color: activeColor }, children: score.toString().padStart(6, "0") }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 90,
            columnNumber: 13
          }),
          /* @__PURE__ */ jsxDEV("div", { children: [
            "SYNC RATE: ",
            (scale * 100 % 100).toFixed(2),
            "%"
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 91,
            columnNumber: 13
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 89,
          columnNumber: 11
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 79,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV("div", { style: { width: "300px", height: "200px", overflow: "hidden", display: "flex", flexDirection: "column-reverse", opacity: 0.7 }, children: history.slice(-5).reverse().map((h, i) => /* @__PURE__ */ jsxDEV("div", { style: { borderLeft: `2px solid ${COLORS[h.val % COLORS.length]}`, paddingLeft: 10, marginBottom: 5, fontSize: "0.8rem" }, children: [
        "[",
        h.time.toFixed(1),
        "s] SYSTEM_EVENT: ",
        h.type.toUpperCase(),
        "_",
        h.val
      ] }, i, true, {
        fileName: "<stdin>",
        lineNumber: 98,
        columnNumber: 13
      })) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 96,
        columnNumber: 9
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 77,
      columnNumber: 7
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 34,
    columnNumber: 5
  });
};
export {
  GameComposition
};
