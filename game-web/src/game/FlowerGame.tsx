"use client";

import { useEffect, useRef, type FC } from "react";
import * as PIXI from "pixi.js";
import { Howl } from "howler";
import { useFlowStore } from "../stores/flow.store";

// Màu sắc các bông hoa
const FLOWER_COLORS = [
  { petal: 0xff69b4, center: 0xffd700 }, // Hồng
  { petal: 0xff1493, center: 0xffa500 }, // Đỏ hồng
  { petal: 0xff6347, center: 0xffff00 }, // Cam đỏ
  { petal: 0x9370db, center: 0xffd700 }, // Tím
  { petal: 0xffb6c1, center: 0xffffe0 }, // Hồng nhạt
];

// Tạo hình bông hoa đẹp hơn với nhiều chi tiết
const createFlowerGraphics = (colorIndex: number): PIXI.Container => {
  const container = new PIXI.Container();
  const colors = FLOWER_COLORS[colorIndex % FLOWER_COLORS.length];

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

  // Vẽ cánh hoa (6 cánh hình oval)
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI * 2) / 6;
    const x = Math.cos(angle) * 25;
    const y = Math.sin(angle) * 25;

    const petal = new PIXI.Graphics();
    petal.ellipse(0, 0, 20, 15);
    petal.fill(colors.petal);
    petal.ellipse(0, 0, 20, 15);
    petal.stroke({ width: 2, color: colors.petal - 0x202020, alpha: 0.5 });
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

  container.addChild(center);

  return container;
};

const FlowerGame: FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const collectedRef = useRef<number>(0);
  const collectedFlowersRef = useRef<PIXI.Container[]>([]);
  const complete = useFlowStore((state) => state.complete);

  useEffect(() => {
    if (!containerRef.current) return;

    // Reset collected count on mount
    collectedRef.current = 0;
    collectedFlowersRef.current = [];

    let intervalId: number | undefined;
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

      // Vị trí cho bó hoa (8 bông)
      const bouquetPositions = [
        { x: centerX, y: centerY - 60 },
        { x: centerX - 45, y: centerY - 35 },
        { x: centerX + 45, y: centerY - 35 },
        { x: centerX - 65, y: centerY - 5 },
        { x: centerX + 65, y: centerY - 5 },
        { x: centerX - 45, y: centerY + 25 },
        { x: centerX + 45, y: centerY + 25 },
        { x: centerX, y: centerY + 45 },
      ];

      // Thêm counter hiển thị số hoa đã thu thập
      const counterText = new PIXI.Text({
        text: "🌸 Đã thu thập: 0/8",
        style: {
          fontSize: 32,
          fill: 0xff69b4,
          fontWeight: "bold",
          stroke: { color: 0xffffff, width: 4 },
        },
      });
      counterText.x = 20;
      counterText.y = 20;
      app.stage.addChild(counterText);

      const updateCounter = (): void => {
        counterText.text = `🌸 Đã thu thập: ${collectedRef.current}/8`;
      };

      const createFlower = (): void => {
        // Tạo container cho bông hoa
        const flowerContainer = new PIXI.Container();

        // Tạo hình hoa với màu ngẫu nhiên
        const flowerGraphics = createFlowerGraphics(
          Math.floor(Math.random() * FLOWER_COLORS.length)
        );
        flowerContainer.addChild(flowerGraphics);

        flowerContainer.x = Math.random() * app!.screen.width;
        flowerContainer.y = -80;
        flowerContainer.scale.set(0.8 + Math.random() * 0.4); // Kích thước ngẫu nhiên

        flowerContainer.eventMode = "static";
        flowerContainer.cursor = "pointer";

        const speed: number = 1 + Math.random() * 2;
        const rotationSpeed = (Math.random() - 0.5) * 0.05; // Xoay nhẹ khi rơi

        const update = (): void => {
          flowerContainer.y += speed;
          flowerContainer.rotation += rotationSpeed; // Xoay khi rơi

          if (flowerContainer.y > app!.screen.height + 50) {
            app!.stage.removeChild(flowerContainer);
            app!.ticker.remove(update);
          }
        };

        flowerContainer.on("pointerdown", () => {
          // Disable further clicks on this flower
          flowerContainer.eventMode = "none";
          app!.ticker.remove(update);

          // Lưu lại bông hoa đã thu thập
          const flowerIndex = collectedRef.current;
          collectedFlowersRef.current.push(flowerContainer);
          collectedRef.current += 1;
          updateCounter();

          // Vị trí đích trong bó hoa
          const targetPos = bouquetPositions[flowerIndex];
          const targetScale = 1.0;

          let arrived = false;
          const flyToBouquet = (): void => {
            flowerContainer.x += (targetPos.x - flowerContainer.x) * 0.12;
            flowerContainer.y += (targetPos.y - flowerContainer.y) * 0.12;
            flowerContainer.scale.x +=
              (targetScale - flowerContainer.scale.x) * 0.1;
            flowerContainer.scale.y +=
              (targetScale - flowerContainer.scale.y) * 0.1;

            // Giảm tốc độ xoay khi bay về
            flowerContainer.rotation *= 0.95;

            // Check if arrived
            const distance = Math.sqrt(
              Math.pow(targetPos.x - flowerContainer.x, 2) +
                Math.pow(targetPos.y - flowerContainer.y, 2)
            );

            if (distance < 1 && !arrived) {
              arrived = true;
              flowerContainer.x = targetPos.x;
              flowerContainer.y = targetPos.y;
              flowerContainer.rotation = 0;

              // Hiệu ứng "bật" khi đến vị trí
              let bounceTime = 0;
              const bounce = (): void => {
                bounceTime++;
                const bounceScale =
                  1 + Math.sin(bounceTime * 0.3) * 0.1 * (1 - bounceTime / 20);
                flowerContainer.scale.set(targetScale * bounceScale);

                if (bounceTime >= 20) {
                  flowerContainer.scale.set(targetScale);
                  app!.ticker.remove(bounce);
                }
              };
              app!.ticker.add(bounce);

              app!.ticker.remove(flyToBouquet);
            }
          };

          app!.ticker.add(flyToBouquet);

          // Khi đủ 8 bông, hiển thị bó hoa hoàn chỉnh
          if (collectedRef.current === 8) {
            setTimeout(() => {
              showBouquet();
              if (bgm) bgm.fade(0.5, 0, 1500);
            }, 1500);
          }
        });

        app!.ticker.add(update);
        app!.stage.addChild(flowerContainer);
      };

      // Tạo hiệu ứng pháo hoa đẹp hơn
      const createFirework = (x: number, y: number): void => {
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

          app!.stage.addChild(particle);

          let life = 80;
          const updateParticle = (): void => {
            particle.x += vx;
            particle.y += vy + ay;
            ay += 0.05; // Tăng gravity

            particle.alpha = life / 80;
            particle.rotation += 0.1;
            particle.scale.set((life / 80) * 1.5);

            life--;

            if (life <= 0) {
              app!.stage.removeChild(particle);
              app!.ticker.remove(updateParticle);
            }
          };

          app!.ticker.add(updateParticle);
        }

        // Thêm trail effect ở giữa
        const centerBurst = new PIXI.Graphics();
        centerBurst.circle(0, 0, 15);
        centerBurst.fill({ color: mainColor, alpha: 0.8 });
        centerBurst.x = x;
        centerBurst.y = y;
        app!.stage.addChild(centerBurst);

        let burstLife = 20;
        const updateBurst = (): void => {
          centerBurst.scale.set((20 - burstLife) * 0.5);
          centerBurst.alpha = burstLife / 20;
          burstLife--;

          if (burstLife <= 0) {
            app!.stage.removeChild(centerBurst);
            app!.ticker.remove(updateBurst);
          }
        };
        app!.ticker.add(updateBurst);
      };

      const showBouquet = (): void => {
        // Xóa counter và các hoa đang rơi (chỉ giữ lại 8 hoa đã thu thập)
        const childrenToRemove = [...app!.stage.children];
        childrenToRemove.forEach((child) => {
          if (!collectedFlowersRef.current.includes(child as PIXI.Container)) {
            app!.stage.removeChild(child);
          }
        });

        // Dừng tạo hoa mới
        if (intervalId) window.clearInterval(intervalId);

        const bouquetContainer = new PIXI.Container();
        bouquetContainer.x = centerX;
        bouquetContainer.y = centerY;

        // Vẽ cọng hoa (stems) cho các hoa
        const stems = new PIXI.Graphics();
        const stemPositions = [
          { x: 0, y: -60, targetY: 60 },
          { x: -45, y: -35, targetY: 60 },
          { x: 45, y: -35, targetY: 60 },
          { x: -65, y: -5, targetY: 60 },
          { x: 65, y: -5, targetY: 60 },
          { x: -45, y: 25, targetY: 60 },
          { x: 45, y: 25, targetY: 60 },
          { x: 0, y: 45, targetY: 60 },
        ];

        stemPositions.forEach((pos) => {
          stems.moveTo(pos.x, pos.y);
          stems.lineTo(pos.x, pos.targetY);
          stems.stroke({ width: 4, color: 0x2d5016 });
        });

        // Vẽ lá nhỏ trên các cọng
        stemPositions.forEach((pos) => {
          const leafY = pos.y + (pos.targetY - pos.y) * 0.6;

          const leaf1 = new PIXI.Graphics();
          leaf1.ellipse(0, 0, 8, 12);
          leaf1.fill(0x228b22);
          leaf1.x = pos.x - 8;
          leaf1.y = leafY;
          leaf1.rotation = -0.5;
          stems.addChild(leaf1);

          const leaf2 = new PIXI.Graphics();
          leaf2.ellipse(0, 0, 8, 12);
          leaf2.fill(0x228b22);
          leaf2.x = pos.x + 8;
          leaf2.y = leafY + 10;
          leaf2.rotation = 0.5;
          stems.addChild(leaf2);
        });
        bouquetContainer.addChild(stems);

        // Vẽ giấy gói (wrapper) - đẹp hơn với nhiều chi tiết
        const wrapper = new PIXI.Graphics();

        // Giấy gói chính - màu vàng
        wrapper.moveTo(-90, 50);
        wrapper.lineTo(-55, 150);
        wrapper.lineTo(55, 150);
        wrapper.lineTo(90, 50);
        wrapper.lineTo(-90, 50);
        wrapper.fill(0xffd700);

        // Viền giấy gói
        wrapper.moveTo(-90, 50);
        wrapper.lineTo(-55, 150);
        wrapper.lineTo(55, 150);
        wrapper.lineTo(90, 50);
        wrapper.lineTo(-90, 50);
        wrapper.stroke({ width: 3, color: 0xdaa520 });

        // Thêm pattern cho giấy gói (chấm tròn)
        for (let i = -70; i <= 70; i += 20) {
          for (let j = 60; j <= 140; j += 20) {
            const offsetX = j % 40 === 0 ? 10 : 0;
            wrapper.circle(i + offsetX, j, 4);
          }
        }
        wrapper.fill({ color: 0xffa500, alpha: 0.3 });

        // Vẽ nơ (ribbon) đẹp hơn
        const ribbon = new PIXI.Container();

        // Nơ bên trái
        const ribbonLeft = new PIXI.Graphics();
        ribbonLeft.ellipse(0, 0, 18, 25);
        ribbonLeft.fill(0xff1493);
        ribbonLeft.ellipse(0, 0, 18, 25);
        ribbonLeft.stroke({ width: 2, color: 0xc71585 });
        ribbonLeft.x = -35;
        ribbonLeft.y = 70;
        ribbonLeft.rotation = 0.3;
        ribbon.addChild(ribbonLeft);

        // Nơ bên phải
        const ribbonRight = new PIXI.Graphics();
        ribbonRight.ellipse(0, 0, 18, 25);
        ribbonRight.fill(0xff1493);
        ribbonRight.ellipse(0, 0, 18, 25);
        ribbonRight.stroke({ width: 2, color: 0xc71585 });
        ribbonRight.x = 35;
        ribbonRight.y = 70;
        ribbonRight.rotation = -0.3;
        ribbon.addChild(ribbonRight);

        // Giữa nơ
        const ribbonCenter = new PIXI.Graphics();
        ribbonCenter.circle(0, 70, 12);
        ribbonCenter.fill(0xff69b4);
        ribbonCenter.circle(0, 70, 12);
        ribbonCenter.stroke({ width: 2, color: 0xc71585 });
        ribbon.addChild(ribbonCenter);

        // Dải nơ rơi xuống
        const ribbonTail1 = new PIXI.Graphics();
        ribbonTail1.rect(-4, 82, 8, 40);
        ribbonTail1.fill(0xff1493);
        ribbon.addChild(ribbonTail1);

        const ribbonTail2 = new PIXI.Graphics();
        ribbonTail2.rect(4, 82, 8, 40);
        ribbonTail2.fill(0xff1493);
        ribbon.addChild(ribbonTail2);

        wrapper.addChild(ribbon);
        bouquetContainer.addChild(wrapper);

        // Đặt wrapper ở layer dưới cùng
        app!.stage.addChildAt(bouquetContainer, 0);

        // Thêm text "💐"
        const text = new PIXI.Text({
          text: "🎉 Hoàn thành! 🎉",
          style: {
            fontSize: 42,
            fill: 0xff69b4,
            fontWeight: "bold",
            stroke: { color: 0xffffff, width: 5 },
          },
        });
        text.anchor.set(0.5);
        text.x = centerX;
        text.y = centerY + 180;
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
        const fireworkInterval = setInterval(() => {
          if (fireworkCount >= maxFireworks) {
            clearInterval(fireworkInterval);
            return;
          }

          const x = centerX + (Math.random() - 0.5) * 500;
          const y = centerY + (Math.random() - 0.5) * 400;
          createFirework(x, y);

          fireworkCount++;
        }, 250);

        // Thêm confetti rơi xuống
        const createConfetti = (): void => {
          const confetti = new PIXI.Graphics();
          const colors = [0xff69b4, 0xffd700, 0xff1493, 0xffa500, 0x9370db];
          const color = colors[Math.floor(Math.random() * colors.length)];

          // Vẽ confetti hình chữ nhật nhỏ
          confetti.rect(-4, -8, 8, 16);
          confetti.fill(color);

          confetti.x = Math.random() * app!.screen.width;
          confetti.y = -20;
          confetti.rotation = Math.random() * Math.PI * 2;

          const vx = (Math.random() - 0.5) * 2;
          const vy = 2 + Math.random() * 2;
          const rotationSpeed = (Math.random() - 0.5) * 0.2;

          app!.stage.addChild(confetti);

          const updateConfetti = (): void => {
            confetti.x += vx;
            confetti.y += vy;
            confetti.rotation += rotationSpeed;

            if (confetti.y > app!.screen.height + 20) {
              app!.stage.removeChild(confetti);
              app!.ticker.remove(updateConfetti);
            }
          };

          app!.ticker.add(updateConfetti);
        };

        // Tạo confetti liên tục trong 5 giây
        let confettiCount = 0;
        const confettiInterval = setInterval(() => {
          if (confettiCount >= 50) {
            clearInterval(confettiInterval);
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
      if (bgm) bgm.stop();
      if (app) app.destroy(true, true);
    };
  }, [complete]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(to bottom, #87CEEB, #E0F6FF)",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    />
  );
};

export default FlowerGame;
