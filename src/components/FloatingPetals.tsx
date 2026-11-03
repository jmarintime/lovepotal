"use client";

import React, { useEffect, useState } from "react";

interface TouchBurst {
  id: number;
  x: number;
  y: number;
  emoji: string;
}

const PETALS = [
  { id: 1, left: "6%", delay: "0s", duration: "13s", size: "text-lg", emoji: "🌸" },
  { id: 2, left: "16%", delay: "2.5s", duration: "15s", size: "text-sm", emoji: "🩷" },
  { id: 3, left: "28%", delay: "5s", duration: "12s", size: "text-base", emoji: "✨" },
  { id: 4, left: "42%", delay: "1.2s", duration: "16s", size: "text-lg", emoji: "🌸" },
  { id: 5, left: "58%", delay: "3.8s", duration: "14s", size: "text-sm", emoji: "💕" },
  { id: 6, left: "71%", delay: "0.7s", duration: "13s", size: "text-base", emoji: "🌸" },
  { id: 7, left: "84%", delay: "4.2s", duration: "15s", size: "text-lg", emoji: "🩷" },
  { id: 8, left: "93%", delay: "2.0s", duration: "12s", size: "text-sm", emoji: "✨" },
];

const BURST_EMOJIS = ["💖", "🐻", "🐰", "🌸", "💕", "✨", "🍬", "🌷"];

export default function FloatingPetals() {
  const [bursts, setBursts] = useState<TouchBurst[]>([]);

  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      // Avoid interfering with input typing
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;

      const id = Date.now() + Math.random();
      const emoji = BURST_EMOJIS[Math.floor(Math.random() * BURST_EMOJIS.length)];
      setBursts((prev) => [...prev.slice(-14), { id, x: e.clientX, y: e.clientY, emoji }]);

      setTimeout(() => {
        setBursts((prev) => prev.filter((b) => b.id !== id));
      }, 900);
    };

    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  return (
    <>
      {/* Background falling cherry blossoms & hearts */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {PETALS.map((p) => (
          <div
            key={p.id}
            style={{
              left: p.left,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
            className={` petal-fall absolute -top-10 select-none opacity-60 ${p.size}`}
          >
            {p.emoji}
          </div>
        ))}
      </div>

      {/* Touch / Click floating heart pops */}
      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
        {bursts.map((b) => (
          <span
            key={b.id}
            style={{ left: b.x - 12, top: b.y - 12 }}
            className="touch-pop absolute select-none text-2xl"
          >
            {b.emoji}
          </span>
        ))}
      </div>
    </>
  );
}
