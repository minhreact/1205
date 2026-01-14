"use client";

import { useState, type FC } from "react";
import { useFlowStore } from "../stores/flow.store";

interface FloatingElement {
  id: number;
  fontSize: number;
  left: number;
  top: number;
  animationDuration: number;
  animationDelay: number;
  opacity: number;
  emoji: string;
}

// Pre-defined positions for SSR hydration consistency
const FIXED_ELEMENTS: FloatingElement[] = [
  {
    id: 0,
    fontSize: 25,
    left: 10,
    top: 15,
    animationDuration: 7,
    animationDelay: 0,
    opacity: 0.6,
    emoji: "🌸",
  },
  {
    id: 1,
    fontSize: 30,
    left: 85,
    top: 20,
    animationDuration: 8,
    animationDelay: 1,
    opacity: 0.7,
    emoji: "💕",
  },
  {
    id: 2,
    fontSize: 20,
    left: 25,
    top: 70,
    animationDuration: 6,
    animationDelay: 2,
    opacity: 0.5,
    emoji: "✨",
  },
  {
    id: 3,
    fontSize: 35,
    left: 75,
    top: 60,
    animationDuration: 9,
    animationDelay: 0.5,
    opacity: 0.65,
    emoji: "💗",
  },
  {
    id: 4,
    fontSize: 22,
    left: 50,
    top: 10,
    animationDuration: 7.5,
    animationDelay: 1.5,
    opacity: 0.55,
    emoji: "🌷",
  },
  {
    id: 5,
    fontSize: 28,
    left: 5,
    top: 45,
    animationDuration: 8.5,
    animationDelay: 2.5,
    opacity: 0.7,
    emoji: "💐",
  },
  {
    id: 6,
    fontSize: 32,
    left: 90,
    top: 80,
    animationDuration: 6.5,
    animationDelay: 3,
    opacity: 0.6,
    emoji: "🦋",
  },
  {
    id: 7,
    fontSize: 24,
    left: 40,
    top: 35,
    animationDuration: 7,
    animationDelay: 0.8,
    opacity: 0.75,
    emoji: "🌺",
  },
  {
    id: 8,
    fontSize: 26,
    left: 60,
    top: 85,
    animationDuration: 8,
    animationDelay: 1.2,
    opacity: 0.55,
    emoji: "🌸",
  },
  {
    id: 9,
    fontSize: 30,
    left: 15,
    top: 90,
    animationDuration: 9,
    animationDelay: 2,
    opacity: 0.65,
    emoji: "💕",
  },
  {
    id: 10,
    fontSize: 20,
    left: 70,
    top: 5,
    animationDuration: 6,
    animationDelay: 3.5,
    opacity: 0.5,
    emoji: "✨",
  },
  {
    id: 11,
    fontSize: 35,
    left: 30,
    top: 50,
    animationDuration: 7.5,
    animationDelay: 4,
    opacity: 0.7,
    emoji: "💗",
  },
  {
    id: 12,
    fontSize: 23,
    left: 95,
    top: 40,
    animationDuration: 8.5,
    animationDelay: 0.3,
    opacity: 0.6,
    emoji: "🌷",
  },
  {
    id: 13,
    fontSize: 27,
    left: 55,
    top: 75,
    animationDuration: 6.5,
    animationDelay: 1.8,
    opacity: 0.55,
    emoji: "💐",
  },
  {
    id: 14,
    fontSize: 33,
    left: 20,
    top: 25,
    animationDuration: 9,
    animationDelay: 2.8,
    opacity: 0.75,
    emoji: "🦋",
  },
  {
    id: 15,
    fontSize: 21,
    left: 80,
    top: 55,
    animationDuration: 7,
    animationDelay: 3.2,
    opacity: 0.6,
    emoji: "🌺",
  },
  {
    id: 16,
    fontSize: 29,
    left: 45,
    top: 95,
    animationDuration: 8,
    animationDelay: 4.5,
    opacity: 0.65,
    emoji: "🌸",
  },
  {
    id: 17,
    fontSize: 25,
    left: 3,
    top: 65,
    animationDuration: 6.5,
    animationDelay: 0.6,
    opacity: 0.7,
    emoji: "💕",
  },
  {
    id: 18,
    fontSize: 31,
    left: 65,
    top: 30,
    animationDuration: 7.5,
    animationDelay: 1.4,
    opacity: 0.55,
    emoji: "✨",
  },
  {
    id: 19,
    fontSize: 22,
    left: 35,
    top: 8,
    animationDuration: 8.5,
    animationDelay: 2.2,
    opacity: 0.6,
    emoji: "💗",
  },
];

const StartScreen: FC = () => {
  const start = useFlowStore((state) => state.start);
  const [floatingElements] = useState<FloatingElement[]>(FIXED_ELEMENTS);

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 30,
        background:
          "linear-gradient(135deg, #ffecd2 0%, #fcb69f 50%, #ff9a9e 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Floating decorations */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {floatingElements.map((el) => (
          <div
            key={el.id}
            style={{
              position: "absolute",
              fontSize: `${el.fontSize}px`,
              left: `${el.left}%`,
              top: `${el.top}%`,
              animation: `float ${el.animationDuration}s ease-in-out infinite`,
              animationDelay: `${el.animationDelay}s`,
              opacity: el.opacity,
            }}
          >
            {el.emoji}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div
        style={{
          fontSize: "80px",
          animation: "pulse 2s ease-in-out infinite",
        }}
      >
        💌
      </div>

      <h1
        style={{
          fontSize: "42px",
          fontWeight: 700,
          color: "#c2185b",
          textAlign: "center",
          textShadow: "0 2px 10px rgba(255,255,255,0.8)",
          margin: 0,
          animation: "fadeIn 1s ease-out",
        }}
      >
        Có một điều bí mật...
      </h1>

      <p
        style={{
          fontSize: "22px",
          color: "#e91e63",
          textAlign: "center",
          margin: 0,
          opacity: 0.9,
          animation: "fadeIn 1s ease-out 0.3s both",
        }}
      >
        Anh muốn dành cho em 💕
      </p>

      <button
        type="button"
        onClick={start}
        style={{
          marginTop: "20px",
          fontSize: "20px",
          padding: "18px 50px",
          borderRadius: "50px",
          border: "3px solid rgba(255,255,255,0.4)",
          cursor: "pointer",
          background: "linear-gradient(135deg, #ff6b9d 0%, #ff8a80 100%)",
          color: "#fff",
          fontWeight: 700,
          boxShadow:
            "0 10px 40px rgba(255, 107, 157, 0.5), 0 5px 15px rgba(0,0,0,0.1)",
          transition: "all 0.3s ease",
          animation:
            "fadeIn 1s ease-out 0.6s both, wiggle 1s ease-in-out infinite 1.6s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow =
            "0 15px 50px rgba(255, 107, 157, 0.7), 0 8px 25px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow =
            "0 10px 40px rgba(255, 107, 157, 0.5), 0 5px 15px rgba(0,0,0,0.1)";
        }}
      >
        Bắt đầu nào! 💝
      </button>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-15px) rotate(5deg); }
          50% { transform: translateY(-8px) rotate(-3deg); }
          75% { transform: translateY(-20px) rotate(3deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
      `}</style>
    </div>
  );
};

export default StartScreen;
