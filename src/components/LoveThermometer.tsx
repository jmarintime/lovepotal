"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Flame, Sparkles, Stars } from "lucide-react";
import { fireHeartConfetti, fireSideCannons } from "@/lib/confetti";
import { sound } from "@/lib/sound";

interface FlyingHeart {
  id: number;
  xOffset: number;
  emoji: string;
}

const PUPU_LINES = [
  "지유야, 11월 1일부터 우리가 1일이다! 🐻💕",
  "광안리 밤바다보다 우리 지유가 더 반짝거려! 🌉✨",
  "내가 매일매일 웃게 해줄게 약속! 🐾",
  "부산 맛집이랑 예쁜 카페 내가 다 데려갈게! 🍰",
  "우주 끝까지 지유 손 꼭 잡을래! 🍯",
];

const JIYU_LINES = [
  "푸푸랑 연인이 되다니 꿈만 같아! 🐰💗",
  "부산에서 제일 든든한 곰돌이 내꺼 찜콩!! 🎀",
  "전포동 카페거리도 가고 해운대도 같이 가자! 🌊",
  "나도 푸푸가 세상에서 제일 좋아! ✨",
  "우리 평생 알콩달콩 예쁘게 만나자! 💖",
];

export default function LoveThermometer() {
  const [blessCount, setBlessCount] = useState(0);
  const [temperature, setTemperature] = useState(36.5);
  const [flyingHearts, setFlyingHearts] = useState<FlyingHeart[]>([]);
  const [pupuLineIdx, setPupuLineIdx] = useState(0);
  const [jiyuLineIdx, setJiyuLineIdx] = useState(0);
  const [feverTriggered, setFeverTriggered] = useState(false);

  const handleBlessTap = () => {
    const nextCount = blessCount + 1;
    setBlessCount(nextCount);

    // Increase temperature smoothly toward 100+
    const nextTemp = Math.min(999, +(temperature + 4.5).toFixed(1));
    setTemperature(nextTemp);

    sound.playPop(nextCount % 8);

    // Spawn flying heart on the hero image
    const emojis = ["💖", "💘", "💝", "🌸", "🐻", "🐰", "✨"];
    const newHeart: FlyingHeart = {
      id: Date.now() + Math.random(),
      xOffset: Math.floor(Math.random() * 180) - 90,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    };
    setFlyingHearts((prev) => [...prev.slice(-10), newHeart]);

    if (nextCount % 3 === 0) {
      setPupuLineIdx((i) => (i + 1) % PUPU_LINES.length);
      setJiyuLineIdx((i) => (i + 1) % JIYU_LINES.length);
    }

    if (nextTemp >= 100 && !feverTriggered) {
      setFeverTriggered(true);
      sound.playFanfare();
      fireHeartConfetti();
      fireSideCannons();
    } else if (nextCount % 10 === 0) {
      sound.playChime();
      fireHeartConfetti();
    }
  };

  const progressPercent = Math.min(100, ((temperature - 36.5) / (100 - 36.5)) * 100);

  const getStatusLabel = () => {
    if (temperature < 50) return "🌸 설레는 두근두근 1일차 온도";
    if (temperature < 75) return "🍯 눈에서 꿀이 뚝뚝 떨어지는 중!";
    if (temperature < 100) return "🔥 달달함 주의보 발령 직전!!";
    return "👑 100°C 돌파! 우주 최강 천생연분 커플 달성!!";
  };

  return (
    <section className="relative overflow-hidden rounded-[2rem] border-2 border-rose-200/80 bg-white/90 p-6 shadow-[0_12px_40px_-12px_rgba(255,105,147,0.25)] backdrop-blur-sm sm:p-8">
      {/* Top Crown Badge */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-3.5 py-1 text-xs font-extrabold text-white shadow-sm">
          <Stars className="h-3.5 w-3.5" />
          <span>DAY 1 OFFICIAL COUPLE</span>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-600 ring-1 ring-rose-200">
          <span>축복 하트 누적:</span>
          <span className="font-black text-rose-500">{blessCount}개 💕</span>
        </div>
      </div>

      {/* Main Illustration Frame with Speech Bubbles */}
      <div className="relative mx-auto max-w-md">
        {/* Speech Bubbles */}
        <div className="mb-3 grid grid-cols-2 gap-2.5">
          <motion.div
            key={`pupu-${pupuLineIdx}`}
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="relative rounded-2xl rounded-bl-sm border border-amber-200 bg-amber-50/95 p-2.5 text-center text-xs font-bold text-choco-800 shadow-sm"
          >
            <span className="block text-[10px] font-extrabold text-amber-700">🐻 든든스윗 푸푸</span>
            {PUPU_LINES[pupuLineIdx]}
          </motion.div>

          <motion.div
            key={`jiyu-${jiyuLineIdx}`}
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="relative rounded-2xl rounded-br-sm border border-rose-200 bg-rose-50/95 p-2.5 text-center text-xs font-bold text-choco-800 shadow-sm"
          >
            <span className="block text-[10px] font-extrabold text-rose-600">🐰 러블리요정 지유</span>
            {JIYU_LINES[jiyuLineIdx]}
          </motion.div>
        </div>

        {/* Illustration Container */}
        <div
          onClick={handleBlessTap}
          className="group relative cursor-pointer overflow-hidden rounded-3xl border-4 border-rose-100 bg-cream-50 shadow-inner transition-transform duration-300 hover:scale-[1.01]"
        >
          <img
            src="/hero-couple.jpg"
            alt="푸푸 곰돌이와 지유 토끼 커플 일러스트"
            className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Floating Hearts Overlay on Tap */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
            <AnimatePresence>
              {flyingHearts.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 1, y: 40, x: item.xOffset, scale: 0.7 }}
                  animate={{ opacity: 0, y: -150, x: item.xOffset * 1.2, scale: 1.5 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute text-3xl drop-shadow"
                >
                  {item.emoji}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Bottom overlay name pill */}
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-white/90 px-4 py-1.5 text-sm font-black text-choco-800 shadow-md backdrop-blur-sm ring-1 ring-rose-200">
            <span>🐻 푸푸</span>
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="text-rose-500"
            >
              ❤️
            </motion.span>
            <span>지유 🐰</span>
          </div>
        </div>
      </div>

      {/* Love Thermometer Bar */}
      <div className="mt-6 rounded-2xl bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50 p-4 ring-1 ring-rose-200/70">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Flame className="h-5 w-5 text-rose-500" />
            <span className="text-sm font-extrabold text-choco-800">푸푸❤️지유 러브 온도계</span>
          </div>
          <span
            className={`rounded-full px-3 py-0.5 text-sm font-black ${
              temperature >= 100
                ? "animate-pulse bg-rose-500 text-white shadow-sm"
                : "bg-white text-rose-600 ring-1 ring-rose-200"
            }`}
          >
            {temperature.toFixed(1)}°C
          </span>
        </div>

        <div className="h-4 w-full overflow-hidden rounded-full bg-white p-0.5 shadow-inner ring-1 ring-rose-200">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-rose-400 via-pink-500 to-amber-400"
            initial={{ width: "12%" }}
            animate={{ width: `${ Math.max(12, progressPercent) }%` }}
            transition={{ type: "spring", stiffness: 120, damping: 15 }}
          />
        </div>

        <p className="mt-2 text-center text-xs font-bold text-rose-600">{getStatusLabel()}</p>

        {/* Big Interactive Blessing Button */}
        <motion.button
          onClick={handleBlessTap}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 py-3.5 text-base font-black text-white shadow-[0_8px_20px_-4px_rgba(255,59,114,0.5)] transition-all hover:brightness-105 active:shadow-inner"
        >
          <Heart className="h-5 w-5 fill-current animate-bounce" />
          <span>하트 연타해서 100°C 축복 폭죽 터뜨리기!</span>
          <Sparkles className="h-5 w-5" />
        </motion.button>
      </div>

      {/* Cute Couple Compatibility Tags */}
      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {[
          { label: "비주얼 케미", score: "100%", desc: "곰돌이&토끼 정석" },
          { label: "다정함 지수", score: "MAX", desc: "꿀 떨어지는 눈빛" },
          { label: "티키타카 궁합", score: "99.9%", desc: "숨만 쉬어도 재밌음" },
          { label: "유통기한", score: "평생∞", desc: "무기한 연애 계약" },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-rose-100 bg-rose-50/50 p-3 text-center transition hover:bg-rose-50"
          >
            <div className="text-[11px] font-bold text-rose-400">{stat.label}</div>
            <div className="mt-0.5 text-lg font-black text-rose-600">{stat.score}</div>
            <div className="mt-0.5 text-[11px] font-medium text-choco-600">{stat.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
