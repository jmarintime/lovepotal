"use client";

import confetti from "canvas-confetti";

const LOVE_COLORS = ["#ff4d79", "#ff85a2", "#ffb3c6", "#ffd166", "#fff0f3", "#ff69b4"];

export function fireHeartConfetti() {
  if (typeof window === "undefined") return;

  const heartShape = confetti.shapeFromText
    ? confetti.shapeFromText({ text: "❤️", scalar: 2 })
    : "circle";
  const sparkleShape = confetti.shapeFromText
    ? confetti.shapeFromText({ text: "✨", scalar: 1.8 })
    : "circle";

  confetti({
    particleCount: 55,
    spread: 80,
    origin: { y: 0.65 },
    colors: LOVE_COLORS,
    shapes: [heartShape as confetti.Shape, sparkleShape as confetti.Shape, "circle"],
    scalar: 1.15,
  });
}

export function fireSideCannons() {
  if (typeof window === "undefined") return;

  const end = Date.now() + 1800;

  const frame = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: LOVE_COLORS,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: LOVE_COLORS,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();
}

export function fireBurstAt(xRatio = 0.5, yRatio = 0.5) {
  if (typeof window === "undefined") return;
  confetti({
    particleCount: 40,
    spread: 70,
    origin: { x: xRatio, y: yRatio },
    colors: LOVE_COLORS,
  });
}
