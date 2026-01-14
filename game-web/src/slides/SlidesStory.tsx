"use client";

import { type FC, useEffect, useRef } from "react";
import { useFlowStore } from "../stores/flow.store";
import "fullpage.js/dist/fullpage.css";
import "./slides.css";

const SlidesStory: FC = () => {
  const goToForm = useFlowStore((state) => state.goToForm);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    let fp: { destroy: (type: string) => void } | null = null;

    // Dynamically import fullpage.js
    import("fullpage.js").then((module) => {
      const fullpage = module.default;
      fp = new fullpage("#fullpage", {
        licenseKey: "gplv3-license",
        navigation: false,
        scrollingSpeed: 800,
      });
    });

    return () => {
      if (fp) {
        fp.destroy("all");
      }
    };
  }, []);

  const slideStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column" as const,
    padding: "0 40px",
  };

  const textStyle = {
    fontSize: "26px",
    color: "rgba(255,255,255,0.95)",
    maxWidth: "700px",
    textAlign: "center" as const,
    lineHeight: "1.8",
    fontWeight: "400",
    letterSpacing: "0.3px",
  };

  const headingStyle = {
    fontSize: "52px",
    color: "white",
    marginBottom: "30px",
    textAlign: "center" as const,
    fontWeight: "600",
    textShadow: "0 2px 20px rgba(0,0,0,0.2)",
    letterSpacing: "1px",
  };

  return (
    <div id="fullpage">
      {/* Slide 1 - Chào mừng */}
      <div
        className="section"
        style={{
          ...slideStyle,
          background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
        }}
      >
        <div style={{ fontSize: "80px", marginBottom: "30px" }}>💐</div>
        <h1 style={headingStyle}>Chào Quế</h1>
        <p style={textStyle}>Anh có một vài điều muốn nói với em...</p>
        <div
          style={{
            marginTop: "50px",
            fontSize: "40px",
            animation: "bounce 2s infinite",
            opacity: 0.7,
          }}
        >
          ↓
        </div>
      </div>

      {/* Slide 2 - Giới thiệu */}
      <div
        className="section"
        style={{
          ...slideStyle,
          background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        }}
      >
        <div style={{ fontSize: "70px", marginBottom: "30px" }}>🌸</div>
        <h2 style={{ ...headingStyle, fontSize: "42px" }}>Anh</h2>
        <p style={textStyle}>Là một người chưa được bình thường</p>
        <p style={textStyle}>Đang trên con đường tìm kiếm</p>
        <p style={textStyle}>Một cuộc sống bình thường dành cho anh</p>
      </div>

      {/* Slide 3 - Gặp gỡ */}
      <div
        className="section"
        style={{
          ...slideStyle,
          background: "linear-gradient(135deg, #ffd3a5 0%, #fd6585 100%)",
        }}
      >
        <div style={{ fontSize: "70px", marginBottom: "30px" }}>✨</div>
        <h2 style={{ ...headingStyle, fontSize: "42px" }}>Thật tình cờ...</h2>
        <p style={textStyle}>Trên con đường đó, hai ta lại gặp nhau</p>
        <p style={textStyle}>Cùng nhau tạo nên những kỷ niệm đẹp</p>
      </div>

      {/* Slide 4 - Cô gái đặc biệt */}
      <div
        className="section"
        style={{
          ...slideStyle,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        <div style={{ fontSize: "70px", marginBottom: "30px" }}>💫</div>
        <h2 style={{ ...headingStyle, fontSize: "42px" }}>Em, một cô gái</h2>
        <p style={textStyle}>Luôn yêu đời, xinh đẹp, đáng yêu</p>
        <p style={textStyle}>Dám rủ anh, một người xa lạ</p>
        <p style={textStyle}>lên chuyến tàu di sản</p>
      </div>

      {/* Slide 5 - Ấn tượng */}
      <div
        className="section"
        style={{
          ...slideStyle,
          background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
        }}
      >
        <div style={{ fontSize: "70px", marginBottom: "30px" }}>🌟</div>
        <h2 style={{ ...headingStyle, fontSize: "42px" }}>Em, một cô gái</h2>
        <p style={textStyle}>Để lại ấn tượng sâu sắc cho anh</p>
      </div>

      {/* Slide 6 - Cảm xúc */}
      <div
        className="section"
        style={{
          ...slideStyle,
          background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        }}
      >
        <div style={{ fontSize: "70px", marginBottom: "30px" }}>💗</div>
        <h2 style={{ ...headingStyle, fontSize: "42px" }}>Em, một cô gái</h2>
        <p style={textStyle}>Khiến anh cười mỗi khi nhớ về</p>
      </div>

      {/* Slide 7 - Điều kỳ diệu */}
      <div
        className="section"
        style={{
          ...slideStyle,
          background: "linear-gradient(135deg, #ffd3a5 0%, #fd6585 100%)",
        }}
      >
        <div style={{ fontSize: "70px", marginBottom: "30px" }}>🎀</div>
        <h2 style={{ ...headingStyle, fontSize: "42px" }}>Em, một cô gái</h2>
        <p style={textStyle}>
          Khiến cho anh cảm nhận được sự bình thường trong tình yêu đôi lứa
        </p>
      </div>

      {/* Slide 8 - Kết thúc */}
      <div
        className="section"
        style={{
          ...slideStyle,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        <div style={{ fontSize: "80px", marginBottom: "30px" }}>💝</div>
        <h2 style={{ ...headingStyle, fontSize: "42px" }}>Vậy nên...</h2>
        <p style={{ ...textStyle, marginBottom: "50px" }}>
          Anh có một câu hỏi rất cần em trả lời
        </p>
        <button
          onClick={goToForm}
          style={{
            padding: "18px 50px",
            fontSize: "22px",
            fontWeight: "600",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            borderRadius: "50px",
            cursor: "pointer",
            boxShadow: "0 10px 30px rgba(102, 126, 234, 0.4)",
            transition: "all 0.3s ease",
            letterSpacing: "0.5px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-3px) scale(1.05)";
            e.currentTarget.style.boxShadow =
              "0 15px 40px rgba(102, 126, 234, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow =
              "0 10px 30px rgba(102, 126, 234, 0.4)";
          }}
        >
          Tiếp tục →
        </button>
      </div>
      {/* Slide 9 - che logo slides */}
      <div
        className="section"
        style={{
          ...slideStyle,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        <p>...</p>
      </div>
    </div>
  );
};

export default SlidesStory;
