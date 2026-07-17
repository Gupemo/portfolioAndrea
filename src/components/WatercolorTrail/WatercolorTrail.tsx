"use client";

import { useEffect, useRef } from "react";
import styles from "./WatercolorTrail.module.css";

type PaintSpot = {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  color: string;
  createdAt: number;
  duration: number;
};

const colors = [
  "236, 166, 169",
  "244, 196, 147",
  "173, 198, 214",
  "190, 169, 209",
  "166, 201, 181",
];

export default function WatercolorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const context = canvas.getContext("2d");

    if (!context) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

    if (reducedMotion || isTouchDevice) return;

    let animationFrameId: number;
    let lastSpotTime = 0;

    const spots: PaintSpot[] = [];

    const resizeCanvas = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = window.innerWidth * pixelRatio;
      canvas.height = window.innerHeight * pixelRatio;

      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const createSpot = (x: number, y: number) => {
      const now = performance.now();

      if (now - lastSpotTime < 35) return;

      lastSpotTime = now;

      spots.push({
        x: x + (Math.random() - 0.5) * 12,
        y: y + (Math.random() - 0.5) * 12,
        radius: 15 + Math.random() * 25,
        opacity: 0.12 + Math.random() * 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        createdAt: now,
        duration: 900 + Math.random() * 700,
      });

      if (spots.length > 45) {
        spots.shift();
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      createSpot(event.clientX, event.clientY);
    };

    const drawSpot = (
      spot: PaintSpot,
      currentOpacity: number,
      progress: number
    ) => {
      const currentRadius = spot.radius * (1 + progress * 0.3);

      const gradient = context.createRadialGradient(
        spot.x,
        spot.y,
        0,
        spot.x,
        spot.y,
        currentRadius
      );

      gradient.addColorStop(
        0,
        `rgba(${spot.color}, ${currentOpacity * 0.7})`
      );

      gradient.addColorStop(
        0.45,
        `rgba(${spot.color}, ${currentOpacity})`
      );

      gradient.addColorStop(1, `rgba(${spot.color}, 0)`);

      context.beginPath();
      context.fillStyle = gradient;

      context.ellipse(
        spot.x,
        spot.y,
        currentRadius,
        currentRadius * (0.65 + Math.random() * 0.1),
        0,
        0,
        Math.PI * 2
      );

      context.fill();
    };

    const animate = (time: number) => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let index = spots.length - 1; index >= 0; index--) {
        const spot = spots[index];
        const elapsed = time - spot.createdAt;
        const progress = elapsed / spot.duration;

        if (progress >= 1) {
          spots.splice(index, 1);
          continue;
        }

        const currentOpacity = spot.opacity * (1 - progress);

        drawSpot(spot, currentOpacity, progress);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("pointermove", handlePointerMove);

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);

      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={styles.canvas}
    />
  );
}