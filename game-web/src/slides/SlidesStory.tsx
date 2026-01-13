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
        scrollingSpeed: 1000,
      });
    });

    return () => {
      if (fp) {
        fp.destroy("all");
      }
    };
  }, []);

  return (
    <div id="fullpage">
      {/* Slide 1 */}
      <div
        className="section"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <h1
          style={{
            fontSize: "64px",
            color: "white",
            marginBottom: "20px",
            textAlign: "center",
            fontWeight: "bold",
            textShadow: "0 4px 20px rgba(0,0,0,0.3)",
          }}
        >
          🌸 Câu chuyện bắt đầu
        </h1>
        <p
          style={{
            fontSize: "24px",
            color: "rgba(255,255,255,0.9)",
            maxWidth: "600px",
            textAlign: "center",
            lineHeight: "1.6",
          }}
        >
          Trong một khu vườn xinh đẹp, những bông hoa đang chờ đợi được yêu
          thương...
        </p>
        <div
          style={{
            marginTop: "40px",
            fontSize: "48px",
            animation: "bounce 2s infinite",
          }}
        >
          ⬇️
        </div>
      </div>

      {/* Slide 2 */}
      <div
        className="section"
        style={{
          background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontSize: "120px",
            marginBottom: "30px",
          }}
        >
          💐
        </div>
        <h2
          style={{
            fontSize: "48px",
            color: "white",
            marginBottom: "20px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Bạn đã thu thập được 8 bông hoa
        </h2>
        <p
          style={{
            fontSize: "20px",
            color: "rgba(255,255,255,0.9)",
            maxWidth: "600px",
            textAlign: "center",
            lineHeight: "1.6",
          }}
        >
          Mỗi bông hoa đại diện cho một kỷ niệm đẹp, một khoảnh khắc đáng nhớ
          trong cuộc đời.
        </p>
      </div>

      {/* Slide 3 */}
      <div
        className="section"
        style={{
          background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontSize: "120px",
            marginBottom: "30px",
          }}
        >
          🎨
        </div>
        <h2
          style={{
            fontSize: "48px",
            color: "white",
            marginBottom: "20px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Màu sắc của yêu thương
        </h2>
        <p
          style={{
            fontSize: "20px",
            color: "rgba(255,255,255,0.9)",
            maxWidth: "600px",
            textAlign: "center",
            lineHeight: "1.6",
          }}
        >
          Hồng đại diện cho tình yêu, vàng cho niềm vui, tím cho sự lãng mạn.
          Tất cả hòa quyện thành một bó hoa tuyệt đẹp.
        </p>
      </div>

      {/* Slide 4 */}
      <div
        className="section"
        style={{
          background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontSize: "120px",
            marginBottom: "30px",
          }}
        >
          ✨
        </div>
        <h2
          style={{
            fontSize: "48px",
            color: "white",
            marginBottom: "20px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Điều kỳ diệu
        </h2>
        <p
          style={{
            fontSize: "20px",
            color: "rgba(255,255,255,0.9)",
            maxWidth: "600px",
            textAlign: "center",
            lineHeight: "1.6",
          }}
        >
          Khi những bông hoa được chăm sóc với tình yêu thương, chúng sẽ nở rộ
          và lan tỏa hạnh phúc đến mọi người xung quanh.
        </p>
      </div>

      {/* Slide 5 */}
      <div
        className="section"
        style={{
          background: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontSize: "120px",
            marginBottom: "30px",
          }}
        >
          🌈
        </div>
        <h2
          style={{
            fontSize: "48px",
            color: "white",
            marginBottom: "20px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Kết thúc có hậu
        </h2>
        <p
          style={{
            fontSize: "20px",
            color: "rgba(255,255,255,0.9)",
            maxWidth: "600px",
            textAlign: "center",
            lineHeight: "1.6",
            marginBottom: "40px",
          }}
        >
          Và họ sống hạnh phúc mãi mãi với vườn hoa xinh đẹp của mình... 💝
        </p>
        <button onClick={goToForm} className="replay-button">
          Tiếp tục →
        </button>
      </div>
    </div>
  );
};

export default SlidesStory;
