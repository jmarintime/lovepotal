"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, Gift } from "lucide-react";
import { fireHeartConfetti, fireSideCannons } from "@/lib/confetti";
import { sound } from "@/lib/sound";

interface IntroGiftModalProps {
  onOpen: () => void;
  senderName: string;
}

export default function IntroGiftModal({ onOpen, senderName }: IntroGiftModalProps) {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenClick = () => {
    if (isOpening) return;
    setIsOpening(true);
    sound.playFanfare();
    fireHeartConfetti();
    fireSideCannons();

    setTimeout(() => {
      onOpen();
    }, 950);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.08 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-rose-100/95 via-cream-50/95 to-pink-200/95 p-4 backdrop-blur-md"
      >
        {/* Decorative floating circles */}
        <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-rose-300/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-16 h-72 w-72 rounded-full bg-pink-300/30 blur-3xl" />

        <motion.div
          initial={{ y: 30, scale: 0.9, opacity: 0 }}
          animate={
            isOpening
              ? { scale: [1, 1.12, 0.85, 1.2], rotate: [0, -4, 4, -2, 0], opacity: [1, 1, 0] }
              : { y: 0, scale: 1, opacity: 1 }
          }
          transition={{ duration: isOpening ? 0.9 : 0.5, ease: "easeOut" }}
          className="relative w-full max-w-md overflow-hidden rounded-[2.2rem] border-4 border-white bg-white/90 p-7 text-center shadow-[0_20px_60px_-15px_rgba(255,90,138,0.35)]"
        >
          {/* Top ribbon tag */}
          <div className="mx-auto mb-4 inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-4 py-1.5 text-xs font-bold text-rose-600 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-rose-500" />
            <span>🌊 BUSAN COUPLE • 2026.11.01 DAY 1</span>
            <Sparkles className="h-3.5 w-3.5 text-rose-500" />
          </div>

          {/* Cute Character Badges */}
          <div className="mb-3 flex items-center justify-center gap-3">
            <div className="flex flex-col items-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-4xl shadow-inner ring-2 ring-amber-200/70">
                🐻
              </span>
              <span className="mt-1.5 text-xs font-extrabold text-choco-700">푸푸</span>
            </div>

            <motion.div
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="flex flex-col items-center"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500 text-white shadow-md shadow-rose-300">
                <Heart className="h-5 w-5 fill-current" />
              </div>
              <span className="mt-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-500">
                11월 1일부터 1일!
              </span>
            </motion.div>

            <div className="flex flex-col items-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-4xl shadow-inner ring-2 ring-rose-200/70">
                🐰
              </span>
              <span className="mt-1.5 text-xs font-extrabold text-choco-700">지유</span>
            </div>
          </div>

          <h1 className="mt-2 text-2xl font-black tracking-tight text-choco-800 sm:text-3xl">
            푸푸 <span className="text-rose-500">♥</span> 지유
            <br />
            <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              커플 탄생 축하 선물이 도착했어요!
            </span>
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-choco-600">
            부산에서 제일 잘 어울리는 곰돌이 <b>푸푸</b>와 토끼 <b>지유</b>의<br />
            설레는 <b>11월 1일(1일!)</b>을 축하하며 <b>{senderName}</b>가 준비한<br />
            세상에 하나뿐인 러브 포털이에요 💝
          </p>

          {/* Bouncing Gift Box */}
          <motion.button
            onClick={handleOpenClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="group relative mx-auto my-6 flex h-32 w-32 flex-col items-center justify-center rounded-3xl bg-gradient-to-br from-rose-400 via-rose-500 to-pink-500 text-white shadow-[0_14px_30px_-5px_rgba(255,59,114,0.55)] ring-4 ring-rose-200 transition-all"
          >
            <div className="absolute -top-3 rounded-full bg-amber-300 px-3 py-0.5 text-[11px] font-black text-choco-800 shadow">
              TAP ME! 🎀
            </div>
            <Gift className="h-14 w-14 stroke-[2.2] transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
            <span className="mt-1.5 text-xs font-bold tracking-wide text-rose-50">
              선물 상자 열기
            </span>
          </motion.button>

          <p className="text-xs font-medium text-rose-400">
            🔊 귀여운 효과음과 함께 폭죽이 터져요! 상자를 터치해 주세요 ✨
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
