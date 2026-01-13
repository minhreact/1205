"use client";

import { type FC, useState, useRef } from "react";

const LoveForm: FC = () => {
  const [noButtonPosition, setNoButtonPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [yesButtonPosition, setYesButtonPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const [showSuccess, setShowSuccess] = useState(false);
  const yesButtonRef = useRef<HTMLButtonElement>(null);

  const handleNoClick = () => {
    const yesButton = yesButtonRef.current;
    if (!yesButton) return;

    let yesTop, yesLeft;

    if (yesButtonPosition === null) {
      // First click: Save current Yes button position
      const yesRect = yesButton.getBoundingClientRect();
      yesTop = (yesRect.top / window.innerHeight) * 100;
      yesLeft = (yesRect.left / window.innerWidth) * 100;
      setYesButtonPosition({ top: yesTop, left: yesLeft });
    } else {
      // Use saved Yes button position
      yesTop = yesButtonPosition.top;
      yesLeft = yesButtonPosition.left;
    }

    let newTop, newLeft;
    let attempts = 0;
    const maxAttempts = 15;

    do {
      // Random position (5% to 95% of screen) - wider range
      newTop = Math.random() * 90 + 5;
      newLeft = Math.random() * 90 + 5;
      attempts++;

      // Check if too close to Yes button (must be at least 30% away)
      const distance = Math.sqrt(
        Math.pow(newTop - yesTop, 2) + Math.pow(newLeft - yesLeft, 2)
      );

      if (distance > 30 || attempts >= maxAttempts) {
        break;
      }
    } while (true);

    setNoButtonPosition({ top: newTop, left: newLeft });
  };

  const handleYesClick = () => {
    setShowSuccess(true);
  };

  if (showSuccess) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
        }}
      >
        <div
          style={{
            fontSize: "120px",
            marginBottom: "30px",
            animation: "bounce 1s infinite",
          }}
        >
          💝
        </div>
        <h1
          style={{
            fontSize: "48px",
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
            marginBottom: "20px",
            textShadow: "0 4px 20px rgba(0,0,0,0.3)",
          }}
        >
          Yayyy! 🎉
        </h1>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          fontSize: "100px",
          marginBottom: "30px",
        }}
      >
        💐
      </div>
      <h1
        style={{
          fontSize: "36px",
          color: "white",
          textAlign: "center",
          fontWeight: "bold",
          marginBottom: "20px",
          maxWidth: "700px",
          padding: "0 20px",
          textShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        Trong một ngày bình thường như này, em có muốn làm nó trở nên đặc biệt
        hơn không?
      </h1>
      <p
        style={{
          fontSize: "28px",
          color: "white",
          textAlign: "center",
          marginBottom: "50px",
          fontWeight: "bold",
          textShadow: "0 2px 10px rgba(0,0,0,0.2)",
        }}
      >
        Làm người yêu anh nhé :3
      </p>

      {noButtonPosition === null ? (
        // Initial state: 2 buttons side by side
        <div
          style={{
            display: "flex",
            gap: "40px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button
            ref={yesButtonRef}
            onClick={handleYesClick}
            style={{
              padding: "12px 20px",
              fontSize: "24px",
              fontWeight: "700",
              background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
              color: "white",
              border: "3px solid rgba(255,255,255,0.12)",
              borderRadius: "20px",
              cursor: "pointer",
              boxShadow:
                "0 12px 40px rgba(67, 233, 123, 0.45), 0 6px 20px rgba(0,0,0,0.12)",
              transition:
                "transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.08)";
              e.currentTarget.style.boxShadow =
                "0 18px 60px rgba(67, 233, 123, 0.6), 0 8px 30px rgba(0,0,0,0.12)";
              e.currentTarget.style.filter = "brightness(1.03)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow =
                "0 12px 40px rgba(67, 233, 123, 0.45), 0 6px 20px rgba(0,0,0,0.12)";
              e.currentTarget.style.filter = "brightness(1)";
            }}
          >
            Đồng ý
          </button>

          <button
            onClick={handleNoClick}
            style={{
              padding: "12px 20px",
              fontSize: "24px",
              fontWeight: "700",
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              border: "none",
              borderRadius: "20px",
              cursor: "pointer",
              boxShadow: "0 8px 30px rgba(245, 87, 108, 0.4)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.1)";
              e.currentTarget.style.boxShadow =
                "0 12px 40px rgba(245, 87, 108, 0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow =
                "0 8px 30px rgba(245, 87, 108, 0.4)";
            }}
          >
            Khum
          </button>
        </div>
      ) : (
        // After clicking No: Moving buttons
        <div style={{ position: "relative", width: "100%", height: "200px" }}>
          {/* Yes Button - Fixed at original position */}
          <button
            ref={yesButtonRef}
            onClick={handleYesClick}
            style={{
              // Use fixed positioning so the button stays at the same viewport
              // coordinates when the layout switches after clicking "Khum"
              position: "fixed",
              top: yesButtonPosition ? `${yesButtonPosition.top}%` : "40%",
              left: noButtonPosition
                ? "50%"
                : yesButtonPosition
                ? `${yesButtonPosition.left}%`
                : "40%",
              transform: "translate(-50%, -50%)",
              padding: "12px 20px",
              fontSize: "24px",
              fontWeight: "700",
              background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
              color: "white",
              border: "3px solid rgba(255,255,255,0.12)",
              borderRadius: "20px",
              cursor: "pointer",
              transition:
                "transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease",
              zIndex: 999,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "translate(-50%, -50%) scale(1.08)";
              e.currentTarget.style.boxShadow =
                "0 18px 60px rgba(67, 233, 123, 0.6), 0 8px 30px rgba(0,0,0,0.12)";
              e.currentTarget.style.filter = "brightness(1.03)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "translate(-50%, -50%) scale(1)";
              e.currentTarget.style.boxShadow =
                "0 12px 40px rgba(67, 233, 123, 0.45), 0 6px 20px rgba(0,0,0,0.15)";
              e.currentTarget.style.filter = "brightness(1)";
            }}
          >
            Đồng ý
          </button>

          {/* No Button - Moving position */}

          <button
            onClick={handleNoClick}
            style={{
              // Use fixed positioning so both buttons use the same viewport coords
              position: "fixed",
              top: `${noButtonPosition.top}%`,
              left: `${noButtonPosition.left}%`,
              transform: "translate(-50%, -50%)",
              padding: "12px 20px",
              fontSize: "24px",
              fontWeight: "700",
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              border: "none",
              borderRadius: "20px",
              cursor: "pointer",
              boxShadow: "0 10px 34px rgba(245, 87, 108, 0.45)",
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
              zIndex: 5,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "translate(-50%, -50%) scale(1.08)";
              e.currentTarget.style.boxShadow =
                "0 16px 50px rgba(245, 87, 108, 0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "translate(-50%, -50%) scale(1)";
              e.currentTarget.style.boxShadow =
                "0 10px 34px rgba(245, 87, 108, 0.45)";
            }}
          >
            Khum
          </button>
        </div>
      )}
    </div>
  );
};

export default LoveForm;
