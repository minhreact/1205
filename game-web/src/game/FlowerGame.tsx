"use client";

import { useEffect, useRef, useState, type FC } from "react";
import * as PIXI from "pixi.js";
import { Howl } from "howler";
import { useFlowStore } from "../stores/flow.store";

// Màu sắc các bông hoa - thêm nhiều màu đẹp hơn
const FLOWER_COLORS = [
  { petal: 0xff69b4, center: 0xffd700, glow: 0xff69b4 }, // Hồng
  { petal: 0xff1493, center: 0xffa500, glow: 0xff1493 }, // Đỏ hồng
  { petal: 0xff6347, center: 0xffff00, glow: 0xff6347 }, // Cam đỏ
  { petal: 0x9370db, center: 0xffd700, glow: 0x9370db }, // Tím
  { petal: 0xffb6c1, center: 0xffffe0, glow: 0xffb6c1 }, // Hồng nhạt
  { petal: 0xe91e63, center: 0xffc107, glow: 0xe91e63 }, // Hồng đậm
  { petal: 0xba68c8, center: 0xffeb3b, glow: 0xba68c8 }, // Tím lavender
  { petal: 0xf48fb1, center: 0xfff176, glow: 0xf48fb1 }, // Hồng pastel
];

// Tạo hình bông hoa đẹp hơn với nhiều chi tiết và glow effect
const createFlowerGraphics = (
  colorIndex: number,
  withGlow = true
): PIXI.Container => {
  const container = new PIXI.Container();
  const colors = FLOWER_COLORS[colorIndex % FLOWER_COLORS.length];

  // Vẽ glow effect phía sau hoa
  if (withGlow) {
    const glow = new PIXI.Graphics();
    glow.circle(0, 0, 50);
    glow.fill({ color: colors.glow, alpha: 0.2 });
    glow.circle(0, 0, 40);
    glow.fill({ color: colors.glow, alpha: 0.15 });
    glow.circle(0, 0, 30);
    glow.fill({ color: colors.glow, alpha: 0.1 });
    container.addChild(glow);
  }

  // Vẽ bóng đổ cho hoa
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI * 2) / 6;
    const x = Math.cos(angle) * 26 + 2;
    const y = Math.sin(angle) * 26 + 2;

    const shadowPetal = new PIXI.Graphics();
    shadowPetal.ellipse(0, 0, 20, 15);
    shadowPetal.fill({ color: 0x000000, alpha: 0.15 });
    shadowPetal.x = x;
    shadowPetal.y = y;
    shadowPetal.rotation = angle;
    container.addChild(shadowPetal);
  }

  // Vẽ cánh hoa (6 cánh hình oval) với gradient effect
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI * 2) / 6;
    const x = Math.cos(angle) * 25;
    const y = Math.sin(angle) * 25;

    // Cánh hoa chính
    const petal = new PIXI.Graphics();
    petal.ellipse(0, 0, 20, 15);
    petal.fill(colors.petal);
    petal.ellipse(0, 0, 20, 15);
    petal.stroke({ width: 2, color: colors.petal - 0x202020, alpha: 0.5 });

    // Thêm highlight cho cánh hoa
    const highlight = new PIXI.Graphics();
    highlight.ellipse(-3, -3, 8, 5);
    highlight.fill({ color: 0xffffff, alpha: 0.3 });
    petal.addChild(highlight);

    petal.x = x;
    petal.y = y;
    petal.rotation = angle;
    container.addChild(petal);
  }

  // Vẽ nhị hoa (center) với nhiều lớp
  const center = new PIXI.Graphics();
  center.circle(0, 0, 16);
  center.fill(colors.center);
  center.circle(0, 0, 16);
  center.stroke({ width: 1.5, color: colors.center - 0x303030 });

  // Thêm các chấm nhỏ ở giữa (pollen)
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI * 2) / 8;
    const x = Math.cos(angle) * 8;
    const y = Math.sin(angle) * 8;
    center.circle(x, y, 2);
  }
  center.fill({ color: colors.center - 0x404040, alpha: 0.8 });

  // Highlight ở giữa
  const centerHighlight = new PIXI.Graphics();
  centerHighlight.circle(-3, -3, 5);
  centerHighlight.fill({ color: 0xffffff, alpha: 0.4 });
  center.addChild(centerHighlight);

  container.addChild(center);

  return container;
};

// Tạo sparkle effect khi bắt hoa
const createSparkles = (
  app: PIXI.Application,
  x: number,
  y: number,
  color: number
): void => {
  for (let i = 0; i < 12; i++) {
    const sparkle = new PIXI.Graphics();

    // Vẽ ngôi sao nhỏ
    for (let s = 0; s < 4; s++) {
      const angle = (s * Math.PI) / 2;
      sparkle.moveTo(0, 0);
      sparkle.lineTo(Math.cos(angle) * 8, Math.sin(angle) * 8);
    }
    sparkle.stroke({ width: 2, color: color });
    sparkle.circle(0, 0, 3);
    sparkle.fill(0xffffff);

    sparkle.x = x;
    sparkle.y = y;

    const angle = (Math.PI * 2 * i) / 12;
    const speed = 3 + Math.random() * 3;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;

    app.stage.addChild(sparkle);

    let life = 30;
    const updateSparkle = (): void => {
      sparkle.x += vx;
      sparkle.y += vy;
      sparkle.alpha = life / 30;
      sparkle.rotation += 0.2;
      sparkle.scale.set(life / 30);
      life--;

      if (life <= 0) {
        app.stage.removeChild(sparkle);
        app.ticker.remove(updateSparkle);
      }
    };
    app.ticker.add(updateSparkle);
  }
};

// Tạo floating heart/petal background
const createFloatingPetal = (app: PIXI.Application): void => {
  const petal = new PIXI.Graphics();
  const colors = [0xff69b4, 0xffb6c1, 0xff1493, 0xf48fb1, 0xe91e63];
  const color = colors[Math.floor(Math.random() * colors.length)];

  // Vẽ cánh hoa nhỏ
  petal.ellipse(0, 0, 6 + Math.random() * 4, 4 + Math.random() * 3);
  petal.fill({ color, alpha: 0.4 + Math.random() * 0.3 });

  petal.x = Math.random() * app.screen.width;
  petal.y = -20;
  petal.rotation = Math.random() * Math.PI * 2;

  const vx = (Math.random() - 0.5) * 1;
  const vy = 0.5 + Math.random() * 1;
  const rotationSpeed = (Math.random() - 0.5) * 0.05;
  const swaySpeed = 0.02 + Math.random() * 0.02;
  let swayOffset = Math.random() * Math.PI * 2;

  app.stage.addChildAt(petal, 0); // Add behind other elements

  const updatePetal = (): void => {
    swayOffset += swaySpeed;
    petal.x += vx + Math.sin(swayOffset) * 0.5;
    petal.y += vy;
    petal.rotation += rotationSpeed;

    if (petal.y > app.screen.height + 20) {
      app.stage.removeChild(petal);
      app.ticker.remove(updatePetal);
    }
  };

  app.ticker.add(updatePetal);
};

const FlowerGame: FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const collectedRef = useRef<number>(0);
  const collectedFlowerColorsRef = useRef<number[]>([]); // Lưu màu hoa thay vì container
  const [showContinueButton, setShowContinueButton] = useState(false);
  const goToSlides = useFlowStore((state) => state.goToSlides);

  useEffect(() => {
    if (!containerRef.current) return;

    // Reset collected count on mount
    collectedRef.current = 0;
    collectedFlowerColorsRef.current = [];

    let intervalId: number | undefined;
    let confettiIntervalId: number | undefined;
    let fireworkIntervalId: number | undefined;
    let bgm: Howl | undefined;
    let app: PIXI.Application | undefined;
    let mounted = true;

    (async () => {
      const pixiApp = new PIXI.Application();

      await pixiApp.init({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundAlpha: 0,
      });

      if (!mounted || !containerRef.current) {
        // Cleanup if component unmounted during init
        pixiApp.destroy(true, true);
        return;
      }

      app = pixiApp;
      containerRef.current.appendChild(app.canvas);

      // 🎵 Nhạc nền (optional)
      try {
        bgm = new Howl({
          src: ["/music/cham-hoa.mp3"],
          loop: true,
          volume: 0.5,
          onloaderror: () => {
            console.log("Music file not found - continuing without music");
          },
        });
        bgm.play();
      } catch (error) {
        console.log("Could not load music:", error);
      }

      const centerX: number = app.screen.width / 2;
      const centerY: number = app.screen.height / 2;

      // Tạo UI container
      const uiContainer = new PIXI.Container();
      app.stage.addChild(uiContainer);

      // Background cho progress bar
      const progressBg = new PIXI.Graphics();
      progressBg.roundRect(0, 0, 300, 40, 20);
      progressBg.fill({ color: 0x000000, alpha: 0.3 });
      progressBg.x = 20;
      progressBg.y = 20;
      uiContainer.addChild(progressBg);

      // Progress bar fill
      const progressFill = new PIXI.Graphics();
      progressFill.x = 25;
      progressFill.y = 25;
      uiContainer.addChild(progressFill);

      // Progress text
      const counterText = new PIXI.Text({
        text: "🌸 0 / 8",
        style: {
          fontSize: 24,
          fill: 0xffffff,
          fontWeight: "bold",
        },
      });
      counterText.x = 335;
      counterText.y = 25;
      uiContainer.addChild(counterText);

      // Instruction text với animation
      const instructionText = new PIXI.Text({
        text: "✨ Chạm vào hoa để thu thập! ✨",
        style: {
          fontSize: 28,
          fill: 0xff69b4,
          fontWeight: "bold",
          stroke: { color: 0xffffff, width: 4 },
        },
      });
      instructionText.anchor.set(0.5);
      instructionText.x = centerX;
      instructionText.y = 80;
      uiContainer.addChild(instructionText);

      // Animate instruction text
      let instructionAlpha = 1;
      let instructionDirection = -1;
      const animateInstruction = (): void => {
        instructionAlpha += instructionDirection * 0.02;
        if (instructionAlpha <= 0.5) instructionDirection = 1;
        if (instructionAlpha >= 1) instructionDirection = -1;
        instructionText.alpha = instructionAlpha;
        instructionText.scale.set(0.95 + instructionAlpha * 0.1);
      };
      app.ticker.add(animateInstruction);

      // Combo counter
      let comboCount = 0;
      let comboTimer = 0;
      const comboText = new PIXI.Text({
        text: "",
        style: {
          fontSize: 48,
          fill: 0xffd700,
          fontWeight: "bold",
          stroke: { color: 0xff6347, width: 6 },
        },
      });
      comboText.anchor.set(0.5);
      comboText.x = centerX;
      comboText.y = centerY - 100;
      comboText.alpha = 0;
      uiContainer.addChild(comboText);

      const updateCounter = (): void => {
        counterText.text = `🌸 ${collectedRef.current} / 8`;

        // Update progress bar
        progressFill.clear();
        const progress = collectedRef.current / 8;
        const colors = [0xff69b4, 0xff1493, 0xe91e63];
        const colorIndex = Math.floor(progress * (colors.length - 1));
        progressFill.roundRect(0, 0, 290 * progress, 30, 15);
        progressFill.fill(colors[Math.min(colorIndex, colors.length - 1)]);

        // Thêm shine effect trên progress bar
        if (progress > 0) {
          progressFill.roundRect(5, 5, 290 * progress - 10, 10, 5);
          progressFill.fill({ color: 0xffffff, alpha: 0.3 });
        }

        // Update combo
        comboCount++;
        comboTimer = 60; // 1 second at 60fps
        if (comboCount >= 2) {
          comboText.text = `🔥 COMBO x${comboCount}! 🔥`;
          comboText.alpha = 1;
          comboText.scale.set(1.5);
        }
      };

      // Combo decay
      const updateCombo = (): void => {
        if (comboTimer > 0) {
          comboTimer--;
          // Animate combo text
          if (comboText.alpha > 0) {
            comboText.scale.x = Math.max(1, comboText.scale.x - 0.02);
            comboText.scale.y = Math.max(1, comboText.scale.y - 0.02);
          }
        } else {
          comboCount = 0;
          comboText.alpha = Math.max(0, comboText.alpha - 0.05);
        }
      };
      app.ticker.add(updateCombo);

      // Floating petals background
      let petalTimer = 0;
      const createBackgroundPetals = (): void => {
        petalTimer++;
        if (petalTimer % 30 === 0) {
          createFloatingPetal(app!);
        }
      };
      app.ticker.add(createBackgroundPetals);

      const createFlower = (): void => {
        // Tạo container cho bông hoa với custom property
        const flowerContainer = new PIXI.Container() as PIXI.Container & {
          colorIndex: number;
        };

        // Tạo hình hoa với màu ngẫu nhiên và lưu colorIndex
        const colorIndex = Math.floor(Math.random() * FLOWER_COLORS.length);
        const flowerGraphics = createFlowerGraphics(colorIndex);
        flowerContainer.addChild(flowerGraphics);

        // Lưu colorIndex vào container để dùng sau
        flowerContainer.colorIndex = colorIndex;

        flowerContainer.x = Math.random() * app!.screen.width;
        flowerContainer.y = -80;
        const baseScale = 0.8 + Math.random() * 0.4;
        flowerContainer.scale.set(baseScale);

        flowerContainer.eventMode = "static";
        flowerContainer.cursor = "pointer";

        const speed: number = 1.5 + Math.random() * 2;
        const rotationSpeed = (Math.random() - 0.5) * 0.03;
        const swaySpeed = 0.02 + Math.random() * 0.02;
        let swayOffset = Math.random() * Math.PI * 2;
        let pulseOffset = Math.random() * Math.PI * 2;

        const update = (): void => {
          swayOffset += swaySpeed;
          pulseOffset += 0.05;

          // Lắc lư khi rơi
          flowerContainer.x += Math.sin(swayOffset) * 0.5;
          flowerContainer.y += speed;
          flowerContainer.rotation += rotationSpeed;

          // Hiệu ứng pulse nhẹ
          const pulse = 1 + Math.sin(pulseOffset) * 0.05;
          flowerContainer.scale.set(baseScale * pulse);

          if (flowerContainer.y > app!.screen.height + 50) {
            app!.stage.removeChild(flowerContainer);
            app!.ticker.remove(update);
          }
        };

        // Hover effect
        flowerContainer.on("pointerover", () => {
          flowerContainer.scale.set(baseScale * 1.2);
        });
        flowerContainer.on("pointerout", () => {
          flowerContainer.scale.set(baseScale);
        });

        flowerContainer.on("pointerdown", () => {
          // Disable further clicks on this flower
          flowerContainer.eventMode = "none";
          app!.ticker.remove(update);

          // Tạo sparkle effect
          const colors = FLOWER_COLORS[flowerContainer.colorIndex];
          createSparkles(
            app!,
            flowerContainer.x,
            flowerContainer.y,
            colors.petal
          );

          // Lưu màu sắc hoa đã thu thập để hiển thị sau
          collectedFlowerColorsRef.current.push(flowerContainer.colorIndex);
          collectedRef.current += 1;
          updateCounter();

          // Hiệu ứng "+1" text
          const plusText = new PIXI.Text({
            text: "+1 🌸",
            style: {
              fontSize: 32,
              fill: colors.petal,
              fontWeight: "bold",
              stroke: { color: 0xffffff, width: 4 },
            },
          });
          plusText.anchor.set(0.5);
          plusText.x = flowerContainer.x;
          plusText.y = flowerContainer.y;
          app!.stage.addChild(plusText);

          let textLife = 40;
          const animatePlusText = (): void => {
            plusText.y -= 2;
            plusText.alpha = textLife / 40;
            textLife--;
            if (textLife <= 0) {
              app!.stage.removeChild(plusText);
              app!.ticker.remove(animatePlusText);
            }
          };
          app!.ticker.add(animatePlusText);

          // Hiệu ứng hoa biến mất với animation
          let fadeTime = 0;
          const fadeOut = (): void => {
            fadeTime++;
            flowerContainer.alpha = 1 - fadeTime / 15;
            flowerContainer.scale.x *= 1.08;
            flowerContainer.scale.y *= 1.08;
            flowerContainer.rotation += 0.15;

            if (fadeTime >= 15) {
              app!.stage.removeChild(flowerContainer);
              app!.ticker.remove(fadeOut);
            }
          };
          app!.ticker.add(fadeOut);

          // Khi đủ 8 bông, hiển thị bó hoa hoàn chỉnh
          if (collectedRef.current === 8) {
            setTimeout(() => {
              showBouquet();
              if (bgm) bgm.fade(0.5, 0, 1500);
              // Hiện nút sau 3 giây
              setTimeout(() => {
                setShowContinueButton(true);
              }, 3000);
            }, 1000);
          }
        });

        app!.ticker.add(update);
        app!.stage.addChild(flowerContainer);
      };

      // Tạo hiệu ứng pháo hoa đẹp hơn
      const createFirework = (x: number, y: number): void => {
        if (!app) return;

        const particleCount = 40;
        const colors = [
          0xff69b4, 0xffd700, 0xff1493, 0xffa500, 0x9370db, 0xff6347, 0xffb6c1,
          0xffffff,
        ];
        const mainColor = colors[Math.floor(Math.random() * colors.length)];

        // Tạo burst effect
        for (let i = 0; i < particleCount; i++) {
          const angle = (Math.PI * 2 * i) / particleCount;
          const speed = 2 + Math.random() * 4;

          const particle = new PIXI.Graphics();

          // Vẽ particle với hình dạng ngôi sao nhỏ
          const size = 4 + Math.random() * 4;
          for (let s = 0; s < 5; s++) {
            const starAngle = (s * Math.PI * 2) / 5;
            const px = Math.cos(starAngle) * size;
            const py = Math.sin(starAngle) * size;
            if (s === 0) {
              particle.moveTo(px, py);
            } else {
              particle.lineTo(px, py);
            }
          }
          particle.fill(mainColor);

          particle.x = x;
          particle.y = y;

          const vx = Math.cos(angle) * speed;
          const vy = Math.sin(angle) * speed - 1; // Hướng lên trên một chút
          let ay = 0.1; // Gravity

          app.stage.addChild(particle);

          let life = 80;
          const updateParticle = (): void => {
            if (!app) return;

            particle.x += vx;
            particle.y += vy + ay;
            ay += 0.05; // Tăng gravity

            particle.alpha = life / 80;
            particle.rotation += 0.1;
            particle.scale.set((life / 80) * 1.5);

            life--;

            if (life <= 0) {
              app.stage.removeChild(particle);
              app.ticker.remove(updateParticle);
            }
          };

          app.ticker.add(updateParticle);
        }

        // Thêm trail effect ở giữa
        const centerBurst = new PIXI.Graphics();
        centerBurst.circle(0, 0, 15);
        centerBurst.fill({ color: mainColor, alpha: 0.8 });
        centerBurst.x = x;
        centerBurst.y = y;
        app.stage.addChild(centerBurst);

        let burstLife = 20;
        const updateBurst = (): void => {
          if (!app) return;

          centerBurst.scale.set((20 - burstLife) * 0.5);
          centerBurst.alpha = burstLife / 20;
          burstLife--;

          if (burstLife <= 0) {
            app.stage.removeChild(centerBurst);
            app.ticker.remove(updateBurst);
          }
        };
        app.ticker.add(updateBurst);
      };

      const showBouquet = (): void => {
        // Xóa tất cả (counter và các hoa đang rơi)
        app!.stage.removeChildren();

        // Dừng tạo hoa mới
        if (intervalId) window.clearInterval(intervalId);

        // Tạo glow/aura phía sau bouquet
        const glowContainer = new PIXI.Container();
        glowContainer.x = centerX;
        glowContainer.y = centerY;

        // Aura lớn phía sau - chỉ màu hồng, không có trắng
        const aura = new PIXI.Graphics();
        aura.circle(0, 0, 200);
        aura.fill({ color: 0xffd700, alpha: 0.12 });
        aura.circle(0, 0, 160);
        aura.fill({ color: 0xff69b4, alpha: 0.18 });
        aura.circle(0, 0, 120);
        aura.fill({ color: 0xf48fb1, alpha: 0.15 });
        glowContainer.addChild(aura);

        // Animate aura
        let auraScale = 1;
        let auraDirection = 1;
        const animateAura = (): void => {
          auraScale += auraDirection * 0.003;
          if (auraScale > 1.1) auraDirection = -1;
          if (auraScale < 0.95) auraDirection = 1;
          aura.scale.set(auraScale);
          aura.alpha = 0.6 + (auraScale - 1) * 2;
        };
        app!.ticker.add(animateAura);

        app!.stage.addChild(glowContainer);

        const bouquetContainer = new PIXI.Container();
        bouquetContainer.x = centerX;
        bouquetContainer.y = centerY;

        const stemPositions = [
          { x: 0, y: -70, targetY: 60 },
          { x: -50, y: -45, targetY: 60 },
          { x: 50, y: -45, targetY: 60 },
          { x: -75, y: -10, targetY: 60 },
          { x: 75, y: -10, targetY: 60 },
          { x: -50, y: 20, targetY: 60 },
          { x: 50, y: 20, targetY: 60 },
          { x: 0, y: 40, targetY: 60 },
        ];

        // ===== LAYER 1: Giấy gói tissue phía sau - cao và nhỏ hơn =====
        const wrapperBack = new PIXI.Graphics();

        // Shadow mềm
        wrapperBack.ellipse(0, 180, 45, 10);
        wrapperBack.fill({ color: 0x000000, alpha: 0.1 });

        // Lớp giấy tissue phía sau - cao và nhỏ hơn
        // Phần bên trái
        wrapperBack.moveTo(-55, 30);
        wrapperBack.bezierCurveTo(-60, 70, -50, 140, -35, 180);
        wrapperBack.lineTo(-20, 180);
        wrapperBack.bezierCurveTo(-30, 120, -35, 60, -30, 30);
        wrapperBack.closePath();
        wrapperBack.fill({ color: 0xfce4ec, alpha: 0.85 });

        // Phần bên phải
        wrapperBack.moveTo(55, 30);
        wrapperBack.bezierCurveTo(60, 70, 50, 140, 35, 180);
        wrapperBack.lineTo(20, 180);
        wrapperBack.bezierCurveTo(30, 120, 35, 60, 30, 30);
        wrapperBack.closePath();
        wrapperBack.fill({ color: 0xfce4ec, alpha: 0.85 });

        // Phần giữa phía sau
        wrapperBack.moveTo(-30, 35);
        wrapperBack.bezierCurveTo(-25, 100, -18, 150, -10, 180);
        wrapperBack.lineTo(10, 180);
        wrapperBack.bezierCurveTo(18, 150, 25, 100, 30, 35);
        wrapperBack.closePath();
        wrapperBack.fill({ color: 0xf8bbd9, alpha: 0.7 });

        bouquetContainer.addChild(wrapperBack);

        // ===== LAYER 2: Cọng hoa =====
        const stems = new PIXI.Graphics();

        // Vẽ stems với curve đẹp hơn
        stemPositions.forEach((pos) => {
          const controlX = pos.x * 0.3;
          stems.moveTo(pos.x, pos.y);
          stems.quadraticCurveTo(
            controlX,
            (pos.y + pos.targetY) / 2,
            0,
            pos.targetY + 20
          );
          stems.stroke({ width: 5, color: 0x2d5016 });
          // Thêm stem highlight
          stems.moveTo(pos.x - 1, pos.y);
          stems.quadraticCurveTo(
            controlX - 1,
            (pos.y + pos.targetY) / 2,
            -1,
            pos.targetY + 20
          );
          stems.stroke({ width: 2, color: 0x4a7c23, alpha: 0.5 });
        });

        // Vẽ lá nhỏ trên các cọng - đẹp hơn
        stemPositions.forEach((pos, idx) => {
          const leafY = pos.y + (pos.targetY - pos.y) * 0.5;

          // Lá lớn hơn và đẹp hơn
          const leaf1 = new PIXI.Graphics();
          leaf1.ellipse(0, 0, 10, 16);
          leaf1.fill(0x228b22);
          // Thêm gân lá
          leaf1.moveTo(0, -12);
          leaf1.lineTo(0, 12);
          leaf1.stroke({ width: 1, color: 0x1a6b1a });
          leaf1.x = pos.x - 12;
          leaf1.y = leafY;
          leaf1.rotation = -0.4 - idx * 0.05;
          stems.addChild(leaf1);

          const leaf2 = new PIXI.Graphics();
          leaf2.ellipse(0, 0, 10, 16);
          leaf2.fill(0x32cd32);
          leaf2.moveTo(0, -12);
          leaf2.lineTo(0, 12);
          leaf2.stroke({ width: 1, color: 0x228b22 });
          leaf2.x = pos.x + 12;
          leaf2.y = leafY + 15;
          leaf2.rotation = 0.4 + idx * 0.05;
          stems.addChild(leaf2);
        });
        bouquetContainer.addChild(stems);

        // Tạo lại 8 bông hoa đã thu thập và đặt vào bó
        collectedFlowerColorsRef.current.forEach((colorIndex, index) => {
          if (index < 8) {
            // Tạo hoa mới với màu đã lưu - có glow cho đẹp
            const newFlower = createFlowerGraphics(colorIndex, true);

            const pos = stemPositions[index];
            newFlower.x = pos.x;
            newFlower.y = pos.y;
            newFlower.scale.set(1.1);

            // Thêm animation nhẹ cho từng bông hoa trong bouquet
            let pulseOffset = index * 0.8;
            const animateFlower = (): void => {
              pulseOffset += 0.04;
              newFlower.rotation = Math.sin(pulseOffset) * 0.08;
              // Pulse scale nhẹ
              const scale = 1.1 + Math.sin(pulseOffset * 0.5) * 0.05;
              newFlower.scale.set(scale);
            };
            app!.ticker.add(animateFlower);

            bouquetContainer.addChild(newFlower);
          }
        });

        // Thêm cành hoa phụ (baby's breath / gypsophila) - cành hoa nhỏ trắng
        const createBabyBreath = (
          startX: number,
          startY: number,
          direction: number
        ): PIXI.Container => {
          const branch = new PIXI.Container();

          // Vẽ cành chính
          const stem = new PIXI.Graphics();
          const endX = startX + direction * (40 + Math.random() * 20);
          const endY = startY - 60 - Math.random() * 30;
          const controlX = startX + direction * 20;
          const controlY = startY - 30;

          stem.moveTo(startX, startY);
          stem.quadraticCurveTo(controlX, controlY, endX, endY);
          stem.stroke({ width: 2, color: 0x6b8e23 });
          branch.addChild(stem);

          // Thêm các bông hoa nhỏ trắng dọc theo cành
          const numFlowers = 5 + Math.floor(Math.random() * 4);
          for (let i = 0; i < numFlowers; i++) {
            const t = 0.3 + (i / numFlowers) * 0.7;
            // Bezier interpolation
            const fx =
              (1 - t) * (1 - t) * startX +
              2 * (1 - t) * t * controlX +
              t * t * endX;
            const fy =
              (1 - t) * (1 - t) * startY +
              2 * (1 - t) * t * controlY +
              t * t * endY;

            // Cành con
            const subStemLength = 8 + Math.random() * 8;
            const subAngle =
              direction * (0.3 + Math.random() * 0.8) - Math.PI / 2;
            const subEndX = fx + Math.cos(subAngle) * subStemLength;
            const subEndY = fy + Math.sin(subAngle) * subStemLength;

            stem.moveTo(fx, fy);
            stem.lineTo(subEndX, subEndY);
            stem.stroke({ width: 1, color: 0x6b8e23 });

            // Bông hoa nhỏ - màu hồng nhạt thay vì trắng
            const flower = new PIXI.Graphics();
            flower.circle(0, 0, 3 + Math.random() * 2);
            flower.fill({ color: 0xfce4ec, alpha: 0.9 });
            flower.circle(0, 0, 1.5);
            flower.fill({ color: 0xfff9c4, alpha: 0.8 });
            flower.x = subEndX;
            flower.y = subEndY;
            branch.addChild(flower);
          }

          return branch;
        };

        // Thêm các cành baby's breath ở hai bên
        const babyBreath1 = createBabyBreath(-60, 30, -1);
        const babyBreath2 = createBabyBreath(60, 30, 1);
        const babyBreath3 = createBabyBreath(-40, 45, -1);
        const babyBreath4 = createBabyBreath(40, 45, 1);
        bouquetContainer.addChild(babyBreath1);
        bouquetContainer.addChild(babyBreath2);
        bouquetContainer.addChild(babyBreath3);
        bouquetContainer.addChild(babyBreath4);

        // Thêm lá eucalyptus trang trí
        const createEucalyptus = (
          startX: number,
          startY: number,
          direction: number
        ): PIXI.Container => {
          const eucalyptus = new PIXI.Container();

          // Cành chính
          const stem = new PIXI.Graphics();
          const length = 50 + Math.random() * 20;
          stem.moveTo(startX, startY);
          stem.quadraticCurveTo(
            startX + direction * 15,
            startY - length / 2,
            startX + direction * 25,
            startY - length
          );
          stem.stroke({ width: 2, color: 0x5f9ea0 });
          eucalyptus.addChild(stem);

          // Lá tròn eucalyptus
          for (let i = 0; i < 5; i++) {
            const t = 0.2 + i * 0.15;
            const lx = startX + direction * 15 * t + direction * 25 * t * t;
            const ly = startY - length * t;

            const leaf = new PIXI.Graphics();
            leaf.circle(0, 0, 6 + Math.random() * 3);
            leaf.fill({ color: 0x8fbc8f, alpha: 0.8 });
            leaf.circle(-1, -1, 2);
            leaf.fill({ color: 0xb0e0b0, alpha: 0.5 });
            leaf.x = lx + direction * (8 + i * 2);
            leaf.y = ly;
            eucalyptus.addChild(leaf);

            // Lá đối xứng
            if (i > 0) {
              const leaf2 = new PIXI.Graphics();
              leaf2.circle(0, 0, 5 + Math.random() * 2);
              leaf2.fill({ color: 0x9acd32, alpha: 0.7 });
              leaf2.x = lx - direction * 5;
              leaf2.y = ly + 5;
              eucalyptus.addChild(leaf2);
            }
          }

          return eucalyptus;
        };

        const eucalyptus1 = createEucalyptus(-70, 20, -1);
        const eucalyptus2 = createEucalyptus(70, 20, 1);
        bouquetContainer.addChild(eucalyptus1);
        bouquetContainer.addChild(eucalyptus2);

        // ===== LAYER CUỐI: Giấy gói tissue phía trước + Nơ - cao và nhỏ =====
        const wrapperFront = new PIXI.Graphics();

        // Lớp tissue chính phía trước - cao và nhỏ hơn
        // Nếp gấp trái
        wrapperFront.moveTo(-45, 40);
        wrapperFront.bezierCurveTo(-55, 80, -45, 140, -30, 175);
        wrapperFront.bezierCurveTo(-22, 140, -28, 80, -20, 45);
        wrapperFront.closePath();
        wrapperFront.fill({ color: 0xfce4ec, alpha: 0.9 });

        // Nếp gấp giữa trái
        wrapperFront.moveTo(-22, 42);
        wrapperFront.bezierCurveTo(-28, 90, -22, 145, -12, 175);
        wrapperFront.bezierCurveTo(-6, 130, -10, 80, -4, 45);
        wrapperFront.closePath();
        wrapperFront.fill({ color: 0xf8bbd9, alpha: 0.85 });

        // Nếp gấp giữa phải
        wrapperFront.moveTo(22, 42);
        wrapperFront.bezierCurveTo(28, 90, 22, 145, 12, 175);
        wrapperFront.bezierCurveTo(6, 130, 10, 80, 4, 45);
        wrapperFront.closePath();
        wrapperFront.fill({ color: 0xf8bbd9, alpha: 0.85 });

        // Nếp gấp phải
        wrapperFront.moveTo(45, 40);
        wrapperFront.bezierCurveTo(55, 80, 45, 140, 30, 175);
        wrapperFront.bezierCurveTo(22, 140, 28, 80, 20, 45);
        wrapperFront.closePath();
        wrapperFront.fill({ color: 0xfce4ec, alpha: 0.9 });

        // Nếp gấp giữa
        wrapperFront.moveTo(-6, 45);
        wrapperFront.bezierCurveTo(-8, 100, -5, 150, 0, 175);
        wrapperFront.bezierCurveTo(5, 150, 8, 100, 6, 45);
        wrapperFront.closePath();
        wrapperFront.fill({ color: 0xffc1e3, alpha: 0.8 });

        bouquetContainer.addChild(wrapperFront);

        // Nơ ribbon ở giữa - nhỏ hơn phù hợp với bình
        const ribbon = new PIXI.Graphics();

        // Cánh nơ trái - nhỏ hơn
        ribbon.moveTo(0, 65);
        ribbon.bezierCurveTo(-10, 58, -25, 62, -22, 70);
        ribbon.bezierCurveTo(-25, 78, -10, 82, 0, 75);
        ribbon.fill(0xff69b4);
        ribbon.moveTo(0, 65);
        ribbon.bezierCurveTo(-10, 58, -25, 62, -22, 70);
        ribbon.bezierCurveTo(-25, 78, -10, 82, 0, 75);
        ribbon.stroke({ width: 1, color: 0xff1493 });

        // Cánh nơ phải
        ribbon.moveTo(0, 65);
        ribbon.bezierCurveTo(10, 58, 25, 62, 22, 70);
        ribbon.bezierCurveTo(25, 78, 10, 82, 0, 75);
        ribbon.fill(0xff69b4);
        ribbon.moveTo(0, 65);
        ribbon.bezierCurveTo(10, 58, 25, 62, 22, 70);
        ribbon.bezierCurveTo(25, 78, 10, 82, 0, 75);
        ribbon.stroke({ width: 1, color: 0xff1493 });

        // Nút giữa nơ
        ribbon.circle(0, 70, 6);
        ribbon.fill(0xff1493);
        ribbon.circle(0, 70, 6);
        ribbon.stroke({ width: 1, color: 0xc71585 });

        // Dải nơ rủ xuống - dài hơn
        ribbon.moveTo(-4, 76);
        ribbon.quadraticCurveTo(-12, 110, -8, 145);
        ribbon.lineTo(-4, 143);
        ribbon.quadraticCurveTo(-8, 105, -1, 78);
        ribbon.fill(0xff69b4);

        ribbon.moveTo(4, 76);
        ribbon.quadraticCurveTo(12, 110, 8, 145);
        ribbon.lineTo(4, 143);
        ribbon.quadraticCurveTo(8, 105, 1, 78);
        ribbon.fill(0xff69b4);

        bouquetContainer.addChild(ribbon);

        // Đặt bouquet ở layer phù hợp
        app!.stage.addChild(bouquetContainer);

        // Tạo floating hearts xung quanh bouquet
        const createFloatingHeart = (): void => {
          const heart = new PIXI.Graphics();
          const colors = [0xff69b4, 0xff1493, 0xe91e63, 0xf48fb1];
          const color = colors[Math.floor(Math.random() * colors.length)];
          const size = 8 + Math.random() * 8;

          // Vẽ trái tim
          heart.moveTo(0, size);
          heart.bezierCurveTo(
            -size,
            size * 0.4,
            -size,
            -size * 0.2,
            0,
            size * 0.2
          );
          heart.bezierCurveTo(size, -size * 0.2, size, size * 0.4, 0, size);
          heart.fill({ color, alpha: 0.7 + Math.random() * 0.3 });

          // Vị trí ngẫu nhiên xung quanh bouquet
          const angle = Math.random() * Math.PI * 2;
          const distance = 150 + Math.random() * 100;
          heart.x = centerX + Math.cos(angle) * distance;
          heart.y = centerY + Math.sin(angle) * distance;

          app!.stage.addChildAt(heart, 1);

          let life = 120 + Math.random() * 60;
          const startLife = life;
          const floatSpeed = 0.5 + Math.random() * 0.5;
          const swaySpeed = 0.03 + Math.random() * 0.02;
          let swayOffset = Math.random() * Math.PI * 2;

          const animateHeart = (): void => {
            swayOffset += swaySpeed;
            heart.y -= floatSpeed;
            heart.x += Math.sin(swayOffset) * 0.8;
            heart.rotation = Math.sin(swayOffset) * 0.2;
            heart.alpha = (life / startLife) * 0.8;
            life--;

            if (life <= 0) {
              app!.stage.removeChild(heart);
              app!.ticker.remove(animateHeart);
            }
          };
          app!.ticker.add(animateHeart);
        };

        // Tạo hearts liên tục
        let heartTimer = 0;
        const spawnHearts = (): void => {
          heartTimer++;
          if (heartTimer % 20 === 0) {
            createFloatingHeart();
          }
        };
        app!.ticker.add(spawnHearts);

        // Thêm sparkles xung quanh hoa - màu hồng/vàng
        const createBouquetSparkle = (): void => {
          const sparkle = new PIXI.Graphics();
          const sparkleColors = [0xffd700, 0xff69b4, 0xf48fb1, 0xffeb3b];
          const sparkleColor =
            sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
          sparkle.circle(0, 0, 2 + Math.random() * 2);
          sparkle.fill({ color: sparkleColor, alpha: 0.8 });

          const angle = Math.random() * Math.PI * 2;
          const distance = 50 + Math.random() * 100;
          sparkle.x = centerX + Math.cos(angle) * distance;
          sparkle.y = centerY - 20 + Math.sin(angle) * distance * 0.6;

          app!.stage.addChild(sparkle);

          let life = 40 + Math.random() * 20;
          const startLife = life;
          const animateSparkle = (): void => {
            sparkle.alpha = (life / startLife) * 0.8;
            sparkle.scale.set(life / startLife);
            life--;
            if (life <= 0) {
              app!.stage.removeChild(sparkle);
              app!.ticker.remove(animateSparkle);
            }
          };
          app!.ticker.add(animateSparkle);
        };

        let sparkleTimer = 0;
        const spawnSparkles = (): void => {
          sparkleTimer++;
          if (sparkleTimer % 8 === 0) {
            createBouquetSparkle();
          }
        };
        app!.ticker.add(spawnSparkles);

        // Thêm text đẹp hơn
        const text = new PIXI.Text({
          text: "🎉 Tặng em bó hoa em đã tự chọn! 🎉",
          style: {
            fontSize: 24,
            fill: 0xff1493,
            fontWeight: "bold",
            stroke: { color: 0xffffff, width: 6 },
          },
        });
        text.anchor.set(0.5);
        text.x = centerX;
        text.y = centerY + 200;
        text.alpha = 0;
        app!.stage.addChild(text);

        // Fade in text
        const fadeInText = (): void => {
          text.alpha += 0.02;
          if (text.alpha >= 1) {
            text.alpha = 1;
            app!.ticker.remove(fadeInText);
          }
        };
        app!.ticker.add(fadeInText);

        // Tạo pháo hoa liên tục
        let fireworkCount = 0;
        const maxFireworks = 20;
        fireworkIntervalId = window.setInterval(() => {
          if (fireworkCount >= maxFireworks) {
            if (fireworkIntervalId) clearInterval(fireworkIntervalId);
            return;
          }

          if (!app) return;

          const x = centerX + (Math.random() - 0.5) * 500;
          const y = centerY + (Math.random() - 0.5) * 400;
          createFirework(x, y);

          fireworkCount++;
        }, 250);

        // Thêm confetti rơi xuống
        const createConfetti = (): void => {
          if (!app) return;

          const confetti = new PIXI.Graphics();
          const colors = [0xff69b4, 0xffd700, 0xff1493, 0xffa500, 0x9370db];
          const color = colors[Math.floor(Math.random() * colors.length)];

          // Vẽ confetti hình chữ nhật nhỏ
          confetti.rect(-4, -8, 8, 16);
          confetti.fill(color);

          confetti.x = Math.random() * app.screen.width;
          confetti.y = -20;
          confetti.rotation = Math.random() * Math.PI * 2;

          const vx = (Math.random() - 0.5) * 2;
          const vy = 2 + Math.random() * 2;
          const rotationSpeed = (Math.random() - 0.5) * 0.2;

          app.stage.addChild(confetti);

          const updateConfetti = (): void => {
            if (!app) return;

            confetti.x += vx;
            confetti.y += vy;
            confetti.rotation += rotationSpeed;

            if (confetti.y > app.screen.height + 20) {
              app.stage.removeChild(confetti);
              app.ticker.remove(updateConfetti);
            }
          };

          app.ticker.add(updateConfetti);
        };

        // Tạo confetti liên tục trong 5 giây
        let confettiCount = 0;
        confettiIntervalId = window.setInterval(() => {
          if (confettiCount >= 50) {
            if (confettiIntervalId) clearInterval(confettiIntervalId);
            return;
          }

          for (let i = 0; i < 3; i++) {
            createConfetti();
          }
          confettiCount++;
        }, 100);
      };

      // Tạo hoa mỗi 1 giây
      intervalId = window.setInterval(createFlower, 1000);
    })();

    return () => {
      mounted = false;
      if (intervalId) window.clearInterval(intervalId);
      if (confettiIntervalId) window.clearInterval(confettiIntervalId);
      if (fireworkIntervalId) window.clearInterval(fireworkIntervalId);
      if (bgm) bgm.stop();
      if (app) app.destroy(true, true);
    };
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: `
          radial-gradient(ellipse at top, #fce4ec 0%, transparent 50%),
          radial-gradient(ellipse at bottom, #f8bbd9 0%, transparent 50%),
          linear-gradient(180deg, #e1bee7 0%, #f3e5f5 30%, #fce4ec 60%, #fff9c4 100%)
        `,
        position: "fixed",
        top: 0,
        left: 0,
        overflow: "hidden",
      }}
    >
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      {showContinueButton && (
        <button
          onClick={goToSlides}
          style={{
            position: "fixed",
            bottom: "50px",
            left: "50%",
            transform: "translateX(-50%)",
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
            zIndex: 1000,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateX(-50%) scale(1.1)";
            e.currentTarget.style.boxShadow =
              "0 12px 30px rgba(255, 20, 147, 0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateX(-50%) scale(1)";
            e.currentTarget.style.boxShadow =
              "0 8px 20px rgba(255, 20, 147, 0.4)";
          }}
        >
          Tiếp tục →
        </button>
      )}
    </div>
  );
};

export default FlowerGame;
