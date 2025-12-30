"use client";

import type { FC } from "react";
import { useFlowStore } from "../stores/flow.store";

const StartScreen: FC = () => {
  const start = useFlowStore((state) => state.start);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        background: "linear-gradient(#fdeff2, #fff)",
      }}
    >
      <h1
        style={{
          fontSize: 48,
          fontWeight: 600,
          letterSpacing: 2,
        }}
      >
        Bắt đầu
      </h1>

      <button
        type="button"
        onClick={start}
        style={{
          fontSize: 32,
          width: 64,
          height: 64,
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          background: "#ff6b81",
          color: "#fff",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        }}
      >
        &gt;
      </button>
    </div>
  );
};

export default StartScreen;
