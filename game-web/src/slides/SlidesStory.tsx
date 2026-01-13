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
          Chào Quế
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
          Anh có một vài điều muốn nói với em ...
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
        <p
          style={{
            fontSize: "20px",
            color: "rgba(255,255,255,0.9)",
            maxWidth: "600px",
            textAlign: "center",
            lineHeight: "1.6",
          }}
        >
          Anh, là một người chưa được bình thường đang trên con đường tìm kiếm
          một cuộc sống bình thường dành cho anh
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
          Thật tình cờ, trên con đường đó, hai ta lại găp nhau, cùng nhau tạo
          nên những kỷ niệm đẹp.
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
          Một cô gái luôn yêu đời, xinh đẹp, đáng yêu. Người dám rủ anh, một
          người xa lạ lên một chuyến tàu di sản.
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
          Một cô gái để lại ấn tượng sâu sắc cho anh về sự thật thà nhí nhảnh.
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
          Một cô gái khiến anh cười mỗi khi nhớ về.
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
          Khiến cho một người chưa được bình thường như anh cảm nhận được sự
          bình thường trong tình yêu đôi lứa
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
          Kết thúc
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
          Vậy nên anh có một câu hỏi rất cần em trả lời...
        </p>
        <button
          onClick={goToForm}
          style={{
            padding: "12px 20px",
            fontSize: "24px",
            fontWeight: "bold",
            background: "linear-gradient(135deg, #FF69B4, #FF1493)",
            color: "white",
            border: "none",
            borderRadius: "50px",
            cursor: "pointer",
            boxShadow: "0 8px 20px rgba(255, 20, 147, 0.4)",
            transition: "all 0.3s ease",
          }}
        >
          Tiếp tục →
        </button>
      </div>

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
          ...
        </p>
      </div>
    </div>
  );
};

export default SlidesStory;
