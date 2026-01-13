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
        <p
          style={{
            fontSize: "24px",
            color: "rgba(255,255,255,0.9)",
            textAlign: "center",
            maxWidth: "600px",
            lineHeight: "1.6",
          }}
        >
          Anh rất hạnh phúc! Cảm ơn em đã đồng ý làm người yêu anh 💕
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: "40px",
            padding: "15px 40px",
            fontSize: "20px",
            fontWeight: "bold",
            background: "white",
            color: "#667eea",
            border: "none",
            borderRadius: "50px",
            cursor: "pointer",
            boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          🔄 Chơi lại
        </button>
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
        Trong một ngày bình thường này, em có muốn làm nó trở nên đặc biệt hay
        không?
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
              padding: "20px 60px",
              fontSize: "28px",
              fontWeight: "bold",
              background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
              color: "white",
              border: "none",
              borderRadius: "50px",
              cursor: "pointer",
              boxShadow: "0 8px 30px rgba(67, 233, 123, 0.4)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.1)";
              e.currentTarget.style.boxShadow =
                "0 12px 40px rgba(67, 233, 123, 0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow =
                "0 8px 30px rgba(67, 233, 123, 0.4)";
            }}
          >
            Đồng ý
          </button>

          <button
            onClick={handleNoClick}
            style={{
              padding: "20px 60px",
              fontSize: "28px",
              fontWeight: "bold",
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              border: "none",
              borderRadius: "50px",
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
        <div style={{ position: "relative", width: "100%", height: "400px" }}>
          {/* Yes Button - Fixed at original position */}
          <button
            ref={yesButtonRef}
            onClick={handleYesClick}
            style={{
              position: "absolute",
              top: yesButtonPosition ? `${yesButtonPosition.top}%` : "50%",
              left: yesButtonPosition ? `${yesButtonPosition.left}%` : "50%",
              transform: "translate(-50%, -50%)",
              padding: "20px 60px",
              fontSize: "28px",
              fontWeight: "bold",
              background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
              color: "white",
              border: "none",
              borderRadius: "50px",
              cursor: "pointer",
              boxShadow: "0 8px 30px rgba(67, 233, 123, 0.4)",
              transition: "all 0.3s ease",
              zIndex: 10,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "translate(-50%, -50%) scale(1.1)";
              e.currentTarget.style.boxShadow =
                "0 12px 40px rgba(67, 233, 123, 0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "translate(-50%, -50%) scale(1)";
              e.currentTarget.style.boxShadow =
                "0 8px 30px rgba(67, 233, 123, 0.4)";
            }}
          >
            Đồng ý
          </button>

          {/* No Button - Moving position */}
          <button
            onClick={handleNoClick}
            style={{
              position: "absolute",
              top: `${noButtonPosition.top}%`,
              left: `${noButtonPosition.left}%`,
              transform: "translate(-50%, -50%)",
              padding: "20px 60px",
              fontSize: "28px",
              fontWeight: "bold",
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              border: "none",
              borderRadius: "50px",
              cursor: "pointer",
              boxShadow: "0 8px 30px rgba(245, 87, 108, 0.4)",
              transition: "all 0.3s ease",
              zIndex: 5,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "translate(-50%, -50%) scale(1.1)";
              e.currentTarget.style.boxShadow =
                "0 12px 40px rgba(245, 87, 108, 0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "translate(-50%, -50%) scale(1)";
              e.currentTarget.style.boxShadow =
                "0 8px 30px rgba(245, 87, 108, 0.4)";
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
