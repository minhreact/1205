"use client";

import { type FC, useState, useRef, useEffect } from "react";

const LoveForm: FC = () => {
  const heartContainerRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (!showSuccess || !heartContainerRef.current) return;

    // Load scripts dynamically
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve();
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let renderer: any = null;

    const initHeartAnimation = async () => {
      try {
        // Load Three.js and dependencies from CDN
        await loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
        );
        await loadScript(
          "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/OBJLoader.js"
        );
        await loadScript(
          "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/TrackballControls.js"
        );
        await loadScript(
          "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/math/MeshSurfaceSampler.js"
        );
        await loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/simplex-noise/2.4.0/simplex-noise.min.js"
        );
        await loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"
        );

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const THREE = (window as any).THREE;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const SimplexNoise = (window as any).SimplexNoise;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const gsap = (window as any).gsap;

        const container = heartContainerRef.current;
        if (!container) return;

        // Create scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
          75,
          window.innerWidth / window.innerHeight,
          0.1,
          1000
        );

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setClearColor(new THREE.Color("rgb(0,0,0)"));
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        camera.position.z = 1.8;

        const controls = new THREE.TrackballControls(
          camera,
          renderer.domElement
        );
        controls.noPan = true;
        controls.maxDistance = 3;
        controls.minDistance = 0.7;

        const group = new THREE.Group();
        scene.add(group);

        // Create "I Love U" text as 3D plane (rotates with heart)
        const createTextPlane = (text: string) => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) return null;

          canvas.width = 512;
          canvas.height = 256;

          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Text styling
          ctx.font = "bold 72px 'Dancing Script', cursive, sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          // Glow effect
          ctx.shadowColor = "#ff1775";
          ctx.shadowBlur = 30;
          ctx.fillStyle = "#ffffff";
          ctx.fillText(text, canvas.width / 2, canvas.height / 2);

          // Second pass for stronger glow
          ctx.shadowColor = "#ff77fc";
          ctx.shadowBlur = 50;
          ctx.fillText(text, canvas.width / 2, canvas.height / 2);

          // Final text
          ctx.shadowBlur = 0;
          ctx.fillStyle = "#ffffff";
          ctx.fillText(text, canvas.width / 2, canvas.height / 2);

          const texture = new THREE.CanvasTexture(canvas);
          texture.needsUpdate = true;

          // Use PlaneGeometry instead of Sprite so it rotates with the group
          const planeGeometry = new THREE.PlaneGeometry(0.5, 0.25);
          const planeMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            depthTest: false,
            side: THREE.DoubleSide,
          });

          const plane = new THREE.Mesh(planeGeometry, planeMaterial);
          // Position inside the heart center (y=-0.35 is visual center, z=0 is middle depth)
          plane.position.set(0, 0.05, 0);
          plane.renderOrder = 999; // Render on top

          return plane;
        };

        const textPlane = createTextPlane("I Love U");
        if (textPlane) {
          group.add(textPlane);
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let heart: any = null;
        let originHeart: number[] = [];

        const geometry = new THREE.BufferGeometry();
        const material = new THREE.PointsMaterial({
          vertexColors: true,
          size: 0.009,
        });
        const particles = new THREE.Points(geometry, material);
        group.add(particles);

        const simplex = new SimplexNoise();
        const pos = new THREE.Vector3();
        const palette = [
          new THREE.Color("#ffd4ee"),
          new THREE.Color("#ff77fc"),
          new THREE.Color("#ff77ae"),
          new THREE.Color("#ff1775"),
        ];

        interface SparkPointType {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          color: any;
          rand: number;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          pos: any;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          one: any;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          two: any;
          update: () => void;
        }

        const spikes: SparkPointType[] = [];
        const beat = { a: 0 };

        gsap
          .timeline({ repeat: -1, repeatDelay: 0.3 })
          .to(beat, { a: 0.5, duration: 0.6, ease: "power2.in" })
          .to(beat, { a: 0.0, duration: 0.6, ease: "power3.out" });

        const maxZ = 0.23;
        const rateZ = 0.5;

        // Load OBJ
        new THREE.OBJLoader().load(
          "https://assets.codepen.io/127738/heart_2.obj",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (obj: any) => {
            heart = obj.children[0];
            heart.geometry.rotateX(-Math.PI * 0.5);
            heart.geometry.scale(0.04, 0.04, 0.04);
            heart.geometry.translate(0, -0.4, 0);
            group.add(heart);

            heart.material = new THREE.MeshBasicMaterial({
              color: new THREE.Color("rgb(0,0,0)"),
            });
            originHeart = Array.from(heart.geometry.attributes.position.array);

            const sampler = new THREE.MeshSurfaceSampler(heart).build();

            // Create spark points
            for (let i = 0; i < 10000; i++) {
              sampler.sample(pos);
              const spark: SparkPointType = {
                color: palette[Math.floor(Math.random() * palette.length)],
                rand: Math.random() * 0.03,
                pos: pos.clone(),
                one: null,
                two: null,
                update() {
                  const noise =
                    simplex.noise4D(this.pos.x, this.pos.y, this.pos.z, 0.1) +
                    1.5;
                  const noise2 =
                    simplex.noise4D(
                      this.pos.x * 500,
                      this.pos.y * 500,
                      this.pos.z * 500,
                      1
                    ) + 1;
                  this.one = this.pos
                    .clone()
                    .multiplyScalar(1.01 + noise * 0.15 * beat.a);
                  this.two = this.pos
                    .clone()
                    .multiplyScalar(
                      1 + noise2 * 1 * (beat.a + 0.3) - beat.a * 1.2
                    );
                },
              };
              spikes.push(spark);
            }

            // Animation loop
            const render = (time: number) => {
              if (!heart) return;

              const positions: number[] = [];
              const colors: number[] = [];

              spikes.forEach((g) => {
                g.update();
                const rand = g.rand;
                const color = g.color;
                if (
                  g.one &&
                  maxZ * rateZ + rand > g.one.z &&
                  g.one.z > -maxZ * rateZ - rand
                ) {
                  positions.push(g.one.x, g.one.y, g.one.z);
                  colors.push(color.r, color.g, color.b);
                }
                if (
                  g.two &&
                  maxZ * rateZ + rand * 2 > g.one!.z &&
                  g.one!.z > -maxZ * rateZ - rand * 2
                ) {
                  positions.push(g.two.x, g.two.y, g.two.z);
                  colors.push(color.r, color.g, color.b);
                }
              });

              geometry.setAttribute(
                "position",
                new THREE.BufferAttribute(new Float32Array(positions), 3)
              );
              geometry.setAttribute(
                "color",
                new THREE.BufferAttribute(new Float32Array(colors), 3)
              );

              const vs = heart.geometry.attributes.position
                .array as Float32Array;
              for (let i = 0; i < vs.length; i += 3) {
                const v = new THREE.Vector3(
                  originHeart[i],
                  originHeart[i + 1],
                  originHeart[i + 2]
                );
                const noise =
                  simplex.noise4D(
                    originHeart[i] * 1.5,
                    originHeart[i + 1] * 1.5,
                    originHeart[i + 2] * 1.5,
                    time * 0.0005
                  ) + 1;
                v.multiplyScalar(noise * 0.15 * beat.a);
                vs[i] = v.x;
                vs[i + 1] = v.y;
                vs[i + 2] = v.z;
              }
              heart.geometry.attributes.position.needsUpdate = true;

              // Animate text plane with heartbeat
              if (textPlane) {
                const scale = 1 + beat.a * 0.15;
                textPlane.scale.set(scale, scale, 1);
              }

              controls.update();
              renderer?.render(scene, camera);
            };

            renderer?.setAnimationLoop(render);
          }
        );

        // Handle resize
        const onResize = () => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer?.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener("resize", onResize);
      } catch (error) {
        console.error("Failed to load heart animation:", error);
      }
    };

    initHeartAnimation();

    return () => {
      if (renderer) {
        renderer.setAnimationLoop(null);
        renderer.dispose();
      }
    };
  }, [showSuccess]);

  if (showSuccess) {
    return (
      <div
        ref={heartContainerRef}
        style={{
          width: "100vw",
          height: "100vh",
          background: "#000",
          position: "fixed",
          top: 0,
          left: 0,
          overflow: "hidden",
          transform: "scale(1.7)",
          transformOrigin: "center center",
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background:
          "linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)",
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
      {/* Floating hearts background */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              fontSize: `${20 + Math.random() * 30}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `floatHeart ${
                5 + Math.random() * 5
              }s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.6,
            }}
          >
            {
              ["💕", "💗", "💖", "💝", "🌸", "✨"][
                Math.floor(Math.random() * 6)
              ]
            }
          </div>
        ))}
      </div>

      {/* Main content */}
      <div
        style={{
          fontSize: "100px",
          marginBottom: "20px",
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      >
        💘
      </div>
      <h1
        style={{
          fontSize: "32px",
          color: "#c2185b",
          textAlign: "center",
          fontWeight: "bold",
          marginBottom: "15px",
          maxWidth: "600px",
          padding: "0 20px",
          textShadow: "0 2px 10px rgba(255,255,255,0.8)",
          animation: "fadeInUp 1s ease-out",
        }}
      >
        Ê này... có chuyện muốn nói với em nè 🥺
      </h1>
      <p
        style={{
          fontSize: "26px",
          color: "#e91e63",
          textAlign: "center",
          marginBottom: "10px",
          fontWeight: "600",
          textShadow: "0 2px 8px rgba(255,255,255,0.6)",
          animation: "fadeInUp 1s ease-out 0.3s both",
        }}
      >
        Anh thích em... thích lắm luôn ấy 💓
      </p>
      <p
        style={{
          fontSize: "28px",
          color: "#c2185b",
          textAlign: "center",
          marginBottom: "40px",
          fontWeight: "bold",
          textShadow: "0 2px 10px rgba(255,255,255,0.7)",
          animation: "fadeInUp 1s ease-out 0.6s both",
        }}
      >
        Làm người yêu anh nha? 🥹💕
      </p>

      <style>{`
        @keyframes floatHeart {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(5deg); }
          50% { transform: translateY(-10px) rotate(-5deg); }
          75% { transform: translateY(-25px) rotate(3deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
      `}</style>

      {noButtonPosition === null ? (
        // Initial state: 2 buttons side by side
        <div
          style={{
            display: "flex",
            gap: "30px",
            justifyContent: "center",
            alignItems: "center",
            animation: "fadeInUp 1s ease-out 0.9s both",
          }}
        >
          <button
            ref={yesButtonRef}
            onClick={handleYesClick}
            style={{
              padding: "15px 35px",
              fontSize: "22px",
              fontWeight: "700",
              background: "linear-gradient(135deg, #ff6b9d 0%, #ff8a80 100%)",
              color: "white",
              border: "3px solid rgba(255,255,255,0.3)",
              borderRadius: "30px",
              cursor: "pointer",
              boxShadow:
                "0 10px 35px rgba(255, 107, 157, 0.5), 0 5px 15px rgba(0,0,0,0.1)",
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
              animation: "wiggle 0.5s ease-in-out infinite",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.15)";
              e.currentTarget.style.boxShadow =
                "0 15px 50px rgba(255, 107, 157, 0.7), 0 8px 25px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow =
                "0 10px 35px rgba(255, 107, 157, 0.5), 0 5px 15px rgba(0,0,0,0.1)";
            }}
          >
            Chịu nè! 💕
          </button>

          <button
            onClick={handleNoClick}
            style={{
              padding: "15px 35px",
              fontSize: "22px",
              fontWeight: "600",
              background: "rgba(255,255,255,0.3)",
              color: "#c2185b",
              border: "2px solid rgba(194, 24, 91, 0.3)",
              borderRadius: "30px",
              cursor: "pointer",
              boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
              backdropFilter: "blur(10px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.background = "rgba(255,255,255,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.background = "rgba(255,255,255,0.3)";
            }}
          >
            Để suy nghĩ... 🤔
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
              position: "fixed",
              top: yesButtonPosition ? `${yesButtonPosition.top}%` : "40%",
              left: noButtonPosition
                ? "50%"
                : yesButtonPosition
                ? `${yesButtonPosition.left}%`
                : "40%",
              transform: "translate(-50%, -50%)",
              padding: "15px 35px",
              fontSize: "22px",
              fontWeight: "700",
              background: "linear-gradient(135deg, #ff6b9d 0%, #ff8a80 100%)",
              color: "white",
              border: "3px solid rgba(255,255,255,0.3)",
              borderRadius: "30px",
              cursor: "pointer",
              transition:
                "transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease",
              zIndex: 999,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "translate(-50%, -50%) scale(1.15)";
              e.currentTarget.style.boxShadow =
                "0 15px 50px rgba(255, 107, 157, 0.7), 0 8px 25px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "translate(-50%, -50%) scale(1)";
              e.currentTarget.style.boxShadow =
                "0 10px 35px rgba(255, 107, 157, 0.5), 0 5px 15px rgba(0,0,0,0.1)";
            }}
          >
            Chịu nè! 💕
          </button>

          {/* No Button - Moving position */}
          <button
            onClick={handleNoClick}
            style={{
              position: "fixed",
              top: `${noButtonPosition.top}%`,
              left: `${noButtonPosition.left}%`,
              transform: "translate(-50%, -50%)",
              padding: "15px 35px",
              fontSize: "22px",
              fontWeight: "600",
              background: "rgba(255,255,255,0.3)",
              color: "#c2185b",
              border: "2px solid rgba(194, 24, 91, 0.3)",
              borderRadius: "30px",
              cursor: "pointer",
              boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
              zIndex: 5,
              backdropFilter: "blur(10px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "translate(-50%, -50%) scale(1.05)";
              e.currentTarget.style.background = "rgba(255,255,255,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "translate(-50%, -50%) scale(1)";
              e.currentTarget.style.background = "rgba(255,255,255,0.3)";
            }}
          >
            Để suy nghĩ... 🤔
          </button>
        </div>
      )}
    </div>
  );
};

export default LoveForm;
