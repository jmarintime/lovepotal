"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Volume2,
  VolumeX,
  Music,
  PartyPopper,
  Heart,
  Sparkles,
  Gift,
} from "lucide-react";
import FloatingPetals from "@/components/FloatingPetals";
import IntroGiftModal from "@/components/IntroGiftModal";
import LoveThermometer from "@/components/LoveThermometer";
import LoveTimerAndMilestones from "@/components/LoveTimerAndMilestones";
import LoveContract from "@/components/LoveContract";
import WishCouponBook from "@/components/WishCouponBook";
import DateRouletteAndBalance from "@/components/DateRouletteAndBalance";
import CoupleBucketAndPolaroid from "@/components/CoupleBucketAndPolaroid";
import WaxSealLetterAndGuestbook from "@/components/WaxSealLetterAndGuestbook";
import { sound } from "@/lib/sound";
import { fireHeartConfetti, fireSideCannons } from "@/lib/confetti";

const DEFAULT_LETTER = `푸푸야, 지유야! 11월 1일, 두 사람이 드디어 연인이 된 걸 진심으로 축하해!! 🥳🎉

든든하고 다정한 곰돌이 같은 푸푸랑, 웃는 게 세상에서 제일 사랑스러운 토끼 같은 지유가 함께 있는 걸 보면 광안리 밤바다 불빛보다 더 반짝반짝 빛나는 것 같아!

첫날(11월 1일)의 이 떨림과 설렘을 오래오래 간직하면서, 전포동 맛집부터 해운대·광안리·영도까지 부산 곳곳을 누비며 예쁜 추억 매일매일 차곡차곡 쌓아가길 바랄게.
두 사람의 앞날에 꽃길과 꿀길만 가득하길 너희의 1호 팬으로서 언제나 응원할게! 다시 한번 너무너무 축하해!! 🐻❤️🐰`;

export default function HomePage() {
  const [showIntro, setShowIntro] = useState(true);
  const [startDateStr, setStartDateStr] = useState<string>("2026-11-01");
  const [senderName, setSenderName] = useState<string>("너희를 아끼는 단짝 친구");
  const [letterBody, setLetterBody] = useState<string>(DEFAULT_LETTER);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [bgmPlaying, setBgmPlaying] = useState(false);

  useEffect(() => {
    let initialDate = "2026-11-01";
    let initialSender = "너희를 아끼는 단짝 친구";
    let initialMsg = DEFAULT_LETTER;

    try {
      const savedDate = localStorage.getItem("lovepotal_start_date_v2");
      if (savedDate) initialDate = savedDate;

      const savedSender = localStorage.getItem("lovepotal_sender_v2");
      if (savedSender) initialSender = savedSender;

      const savedMsg = localStorage.getItem("lovepotal_letter_v2");
      if (savedMsg) initialMsg = savedMsg;
    } catch {}

    // Override with URL query params if shared via link
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const qFrom = params.get("from");
      const qMsg = params.get("msg");
      const qDate = params.get("date");

      if (qFrom) initialSender = qFrom;
      if (qMsg) initialMsg = qMsg;
      if (qDate && /^\d{4}-\d{2}-\d{2}$/.test(qDate)) initialDate = qDate;
    }

    setStartDateStr(initialDate);
    setSenderName(initialSender);
    setLetterBody(initialMsg);
  }, []);

  const handleChangeStartDate = (newDate: string) => {
    setStartDateStr(newDate);
    try {
      localStorage.setItem("lovepotal_start_date_v2", newDate);
    } catch {}
  };

  const handleUpdateLetter = (newSender: string, newBody: string) => {
    setSenderName(newSender);
    setLetterBody(newBody);
    try {
      localStorage.setItem("lovepotal_sender_v2", newSender);
      localStorage.setItem("lovepotal_letter_v2", newBody);
    } catch {}
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
    if (!next && bgmPlaying) {
      sound.stopBgm();
      setBgmPlaying(false);
    } else if (next) {
      sound.playPop(2);
    }
  };

  const toggleBgm = () => {
    if (!soundEnabled) {
      setSoundEnabled(true);
      sound.enabled = true;
    }
    const nowPlaying = sound.toggleBgm();
    setBgmPlaying(nowPlaying);
  };

  const triggerPartyFireworks = () => {
    sound.playFanfare();
    fireHeartConfetti();
    fireSideCannons();
  };

  return (
    <div className="relative min-h-screen pb-24">
      <FloatingPetals />

      {/* Intro Unbox Gift Modal */}
      {showIntro && (
        <IntroGiftModal
          senderName={senderName}
          onOpen={() => {
            setShowIntro(false);
          }}
        />
      )}

      {/* Sticky Top Cute Bar */}
      <header className="sticky top-0 z-40 border-b border-rose-200/70 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 text-lg text-white shadow-sm">
              💝
            </span>
            <div>
              <div className="flex items-center gap-1 text-sm font-black text-choco-800 sm:text-base">
                <span>푸푸 🐻</span>
                <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500 animate-pulse" />
                <span>🐰 지유</span>
              </div>
              <p className="text-[10px] font-bold text-rose-500">
                HAPPY DAY 1 CELEBRATION PORTAL
              </p>
            </div>
          </div>

          {/* Right Controls: BGM, Sound FX, Confetti */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={toggleBgm}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-extrabold transition ${
                bgmPlaying
                  ? "bg-rose-500 text-white shadow-sm ring-2 ring-rose-200"
                  : "bg-rose-50 text-rose-600 ring-1 ring-rose-200 hover:bg-rose-100"
              }`}
              title="귀여운 오르골 멜로디 켜기/끄기"
            >
              <Music className={`h-3.5 w-3.5 ${bgmPlaying ? "animate-spin-slow" : ""}`} />
              <span className="hidden sm:inline">{bgmPlaying ? "오르골 ON" : "오르골 BGM"}</span>
            </button>

            <button
              onClick={toggleSound}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-rose-600 ring-1 ring-rose-200 transition hover:bg-rose-100"
              title={soundEnabled ? "효과음 켜짐" : "효과음 꺼짐"}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 opacity-50" />}
            </button>

            <button
              onClick={triggerPartyFireworks}
              className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-rose-500 px-3 py-1.5 text-xs font-black text-white shadow-sm transition hover:brightness-105 active:scale-95"
            >
              <PartyPopper className="h-3.5 w-3.5" />
              <span>축하 폭죽!</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="relative z-10 mx-auto max-w-4xl space-y-8 px-4 pt-6 sm:space-y-10 sm:px-6 sm:pt-10">
        {/* Top Hero Banner Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mx-auto inline-flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-1.5 text-xs font-black text-rose-500 shadow-sm ring-1 ring-rose-200">
            <Sparkles className="h-3.5 w-3.5" />
            <span>🌊 부산 최강 달달 커플 탄생 • 2026.11.01 ~</span>
            <Sparkles className="h-3.5 w-3.5" />
          </div>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-choco-800 sm:text-5xl">
            푸푸 <span className="text-rose-500">♥</span> 지유,{" "}
            <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 bg-clip-text text-transparent">
              설레는 시작을 축하해!
            </span>
          </h1>
          <p className="mt-2 text-sm font-medium text-choco-600 sm:text-base">
            11월 1일부터 시작된 부산 귀요미 곰돌이 <b>푸푸</b>와 러블리 토끼 <b>지유</b>의 러브 스토리 🌸
          </p>
        </motion.div>

        {/* Section 1: Hero Illustration + Love Thermometer Game */}
        <LoveThermometer />

        {/* Section 2: Real-time D+1 Timer & Anniversary Milestones */}
        <LoveTimerAndMilestones
          startDateStr={startDateStr}
          onChangeStartDate={handleChangeStartDate}
        />

        {/* Section 3: Official Couple Contract & Stamp Pad */}
        <LoveContract startDateStr={startDateStr} />

        {/* Section 4: Wish Coupon Book */}
        <WishCouponBook />

        {/* Section 5: Date Course Roulette & Couple Telepathy Balance Game */}
        <DateRouletteAndBalance />

        {/* Section 6: Polaroid Frame & Couple Bucket List */}
        <CoupleBucketAndPolaroid startDateStr={startDateStr} />

        {/* Section 7: Friend's Wax-Seal Celebration Letter & Rolling Paper */}
        <WaxSealLetterAndGuestbook
          senderName={senderName}
          letterBody={letterBody}
          startDateStr={startDateStr}
          onUpdateLetter={handleUpdateLetter}
        />

        {/* Footer */}
        <footer className="pt-4 text-center">
          <div className="mx-auto max-w-md rounded-3xl border border-rose-200/60 bg-white/70 p-5 backdrop-blur-sm">
            <div className="text-xl">🐻 ❤️ 🐰</div>
            <p className="mt-1 text-xs font-extrabold text-choco-800">
              푸푸 &amp; 지유의 모든 계절이 오늘처럼 반짝이기를!
            </p>
            <p className="mt-1 text-[11px] text-choco-600">
              Made with 💖 for Pupu &amp; Jiyu&#39;s Day 1 Anniversary
            </p>
            <button
              onClick={() => setShowIntro(true)}
              className="mt-3 inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-[11px] font-bold text-rose-500 ring-1 ring-rose-200 hover:bg-rose-100"
            >
              <Gift className="h-3 w-3" /> 오프닝 선물 상자 다시 열기
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}
