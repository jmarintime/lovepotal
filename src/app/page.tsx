"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  VolumeX,
  Music,
  PartyPopper,
  Heart,
  Sparkles,
  Gift,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight,
  LayoutList,
  BookOpen,
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
import { copyTextWithFallback, encodeSharePayload } from "@/lib/shareState";

const DEFAULT_LETTER = `푸푸야, 지유야! 11월 1일, 두 사람이 드디어 연인이 된 걸 진심으로 축하해!! 🥳🎉

든든하고 다정한 곰돌이 같은 푸푸랑, 웃는 게 세상에서 제일 사랑스러운 토끼 같은 지유가 함께 있는 걸 보면 광안리 밤바다 불빛보다 더 반짝반짝 빛나는 것 같아!

첫날(11월 1일)의 이 떨림과 설렘을 오래오래 간직하면서, 전포동 맛집부터 해운대·광안리·영도까지 부산 곳곳을 누비며 예쁜 추억 매일매일 차곡차곡 쌓아가길 바랄게.
두 사람의 앞날에 꽃길과 꿀길만 가득하길 너희의 1호 팬으로서 언제나 응원할게! 다시 한번 너무너무 축하해!! 🐻❤️🐰`;

interface ChapterItem {
  id: string;
  step: number;
  emoji: string;
  shortTitle: string;
  fullTitle: string;
  desc: string;
}

const CHAPTERS: ChapterItem[] = [
  {
    id: "home",
    step: 1,
    emoji: "💖",
    shortTitle: "러브온도",
    fullTitle: "1장. 푸푸♥지유 러브 온도계",
    desc: "하트를 연타해서 두 사람의 사랑 온도를 100°C까지 올려주세요!",
  },
  {
    id: "timer",
    step: 2,
    emoji: "⏱️",
    shortTitle: "사랑시계",
    fullTitle: "2장. 실시간 사랑 시계 & 기념일 달력",
    desc: "2026년 11월 1일부터 1초씩 쌓이는 시간과 다가올 기념일들",
  },
  {
    id: "contract",
    step: 3,
    emoji: "📜",
    shortTitle: "연애계약서",
    fullTitle: "3장. 제1호 연애 계약서 & 커플 임명장",
    desc: "푸푸와 지유가 도장을 꾹 찍어 완성하는 공식 커플 인증서",
  },
  {
    id: "coupons",
    step: 4,
    emoji: "🎟️",
    shortTitle: "소원쿠폰",
    fullTitle: "4장. 평생 무제한 사랑의 소원 쿠폰북",
    desc: "안아주기권부터 부산 맛집 풀코스권까지 터치해서 사용하세요!",
  },
  {
    id: "busan",
    step: 5,
    emoji: "🌊",
    shortTitle: "부산데이트",
    fullTitle: "5장. 부산 데이트 뽑기 & 텔레파시 게임",
    desc: "이번 주 부산 어디 갈지 뽑아보고 두 사람의 텔레파시도 확인해요!",
  },
  {
    id: "bucket",
    step: 6,
    emoji: "📸",
    shortTitle: "버킷&액자",
    fullTitle: "6장. 폴라로이드 추억 액자 & 버킷리스트",
    desc: "우리 사진으로 액자를 꾸미고 부산 커플 버킷리스트를 달성해요!",
  },
  {
    id: "letter",
    step: 7,
    emoji: "💌",
    shortTitle: "축하편지",
    fullTitle: "7장. 씰링 왁스 축하 편지 & 롤링페이퍼",
    desc: "친구의 편지를 열어보고 롤링페이퍼에 축하 한마디를 남겨보세요!",
  },
];

export default function HomePage() {
  const [showIntro, setShowIntro] = useState(true);
  const [startDateStr, setStartDateStr] = useState<string>("2026-11-01");
  const [senderName, setSenderName] = useState<string>("너희를 아끼는 단짝 친구");
  const [letterBody, setLetterBody] = useState<string>(DEFAULT_LETTER);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [bgmPlaying, setBgmPlaying] = useState(false);
  const [headerCopied, setHeaderCopied] = useState(false);

  // Navigation state: current chapter index & view mode ("chapter" vs "all")
  const [activeChapterIdx, setActiveChapterIdx] = useState<number>(0);
  const [viewAllMode, setViewAllMode] = useState<boolean>(false);

  const handleHeaderShare = () => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set("from", senderName);
    url.searchParams.set("msg", letterBody);
    url.searchParams.set("date", startDateStr);

    try {
      const rawNotes = localStorage.getItem("lovepotal_guestbook_v2");
      const rawBuckets = localStorage.getItem("lovepotal_buckets_v2");
      const rawCaption = localStorage.getItem("lovepotal_polaroid_caption_v2");
      const encoded = encodeSharePayload({
        notes: rawNotes ? JSON.parse(rawNotes) : undefined,
        buckets: rawBuckets ? JSON.parse(rawBuckets) : undefined,
        caption: rawCaption || undefined,
      });
      if (encoded) url.searchParams.set("s", encoded);
    } catch {}

    copyTextWithFallback(url.toString());
    setHeaderCopied(true);
    sound.playChime();
    fireHeartConfetti();
    setTimeout(() => setHeaderCopied(false), 2800);
  };

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

  const selectChapter = (idx: number) => {
    setViewAllMode(false);
    setActiveChapterIdx(idx);
    sound.playPop((idx % 5) + 1);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const currentChapter = CHAPTERS[activeChapterIdx];

  return (
    <div className="relative min-h-screen pb-28">
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

      {/* Sticky Top Header + Table of Contents Navigation */}
      <header className="sticky top-0 z-40 border-b border-rose-200/80 bg-white/90 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-2.5">
          <div
            onClick={() => selectChapter(0)}
            className="flex cursor-pointer items-center gap-2"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 text-lg text-white shadow-sm">
              💝
            </span>
            <div>
              <div className="flex items-center gap-1 text-sm font-black text-choco-800 sm:text-base">
                <span>푸푸 🐻</span>
                <Heart className="h-3.5 w-3.5 animate-pulse fill-rose-500 text-rose-500" />
                <span>🐰 지유</span>
              </div>
              <p className="text-[10px] font-bold text-rose-500">
                🌊 부산 커플 • 2026.11.01 ~
              </p>
            </div>
          </div>

          {/* Right Controls: View Mode, BGM, Sound FX, Share, Confetti */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setViewAllMode(!viewAllMode);
                sound.playPop(2);
              }}
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-extrabold transition ${
                viewAllMode
                  ? "bg-amber-400 text-choco-800 shadow-sm"
                  : "bg-rose-50 text-choco-700 ring-1 ring-rose-200 hover:bg-rose-100"
              }`}
              title={viewAllMode ? "목차별로 한 장씩 넘겨 보기" : "전체 코너 한 페이지로 펼치기"}
            >
              {viewAllMode ? (
                <>
                  <BookOpen className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">책자 모드</span>
                </>
              ) : (
                <>
                  <LayoutList className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">전체 펼치기</span>
                </>
              )}
            </button>

            <button
              onClick={toggleBgm}
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-extrabold transition ${
                bgmPlaying
                  ? "bg-rose-500 text-white shadow-sm ring-2 ring-rose-200"
                  : "bg-rose-50 text-rose-600 ring-1 ring-rose-200 hover:bg-rose-100"
              }`}
              title="귀여운 오르골 멜로디 켜기/끄기"
            >
              <Music className={`h-3.5 w-3.5 ${bgmPlaying ? "animate-spin-slow" : ""}`} />
              <span className="hidden md:inline">{bgmPlaying ? "오르골 ON" : "오르골"}</span>
            </button>

            <button
              onClick={toggleSound}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-rose-600 ring-1 ring-rose-200 transition hover:bg-rose-100"
              title={soundEnabled ? "효과음 켜짐" : "효과음 꺼짐"}
            >
              {soundEnabled ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4 opacity-50" />
              )}
            </button>

            <button
              onClick={handleHeaderShare}
              className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1.5 text-xs font-extrabold text-rose-600 ring-1 ring-rose-200 transition hover:bg-rose-100"
              title="현재 설정과 롤링페이퍼·버킷리스트가 담긴 카톡 공유 링크 복사"
            >
              {headerCopied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{headerCopied ? "복사됨!" : "공유"}</span>
            </button>

            <button
              onClick={triggerPartyFireworks}
              className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-rose-500 px-3 py-1.5 text-xs font-black text-white shadow-sm transition hover:brightness-105 active:scale-95"
            >
              <PartyPopper className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">폭죽!</span>
            </button>
          </div>
        </div>

        {/* Horizontal Chapter TOC Pills Bar */}
        <div className="border-t border-rose-100 bg-rose-50/50">
          <div className="mx-auto flex max-w-4xl items-center gap-1.5 overflow-x-auto px-3 py-2 no-scrollbar">
            {CHAPTERS.map((chap, idx) => {
              const isActive = !viewAllMode && activeChapterIdx === idx;
              return (
                <button
                  key={chap.id}
                  onClick={() => selectChapter(idx)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-black transition-all ${
                    isActive
                      ? "scale-[1.03] bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-sm ring-2 ring-rose-200"
                      : "bg-white text-choco-700 ring-1 ring-rose-200/70 hover:bg-rose-100/70 hover:text-rose-600"
                  }`}
                >
                  <span>{chap.emoji}</span>
                  <span>
                    {chap.step}. {chap.shortTitle}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="relative z-10 mx-auto max-w-4xl px-4 pt-5 sm:px-6 sm:pt-7">
        {/* Compact Hero Title + Active Chapter Indicator */}
        <div className="mb-5 text-center">
          <div className="mx-auto inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-1 text-[11px] font-black text-rose-500 shadow-sm ring-1 ring-rose-200">
            <Sparkles className="h-3 w-3" />
            <span>🌊 부산 최강 달달 커플 • 2026.11.01 ~</span>
            <Sparkles className="h-3 w-3" />
          </div>

          <h1 className="mt-2 text-2xl font-black tracking-tight text-choco-800 sm:text-4xl">
            푸푸 <span className="text-rose-500">♥</span> 지유,{" "}
            <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 bg-clip-text text-transparent">
              설레는 시작을 축하해!
            </span>
          </h1>

          {/* Current Chapter Banner when in Step-by-Step Book Mode */}
          {!viewAllMode && (
            <div className="mt-3 inline-flex flex-col items-center rounded-2xl border border-rose-200/80 bg-white/85 px-5 py-2 shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-xs font-black text-rose-600 sm:text-sm">
                <span>{currentChapter.emoji}</span>
                <span>{currentChapter.fullTitle}</span>
                <span className="ml-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] text-rose-600">
                  {activeChapterIdx + 1} / {CHAPTERS.length}
                </span>
              </div>
              <p className="mt-0.5 text-[11px] font-medium text-choco-600">
                {currentChapter.desc}
              </p>
            </div>
          )}
        </div>

        {/* CHAPTER MODE (One clean section at a time with Previous / Next buttons) */}
        {!viewAllMode ? (
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentChapter.id}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {activeChapterIdx === 0 && <LoveThermometer />}
                {activeChapterIdx === 1 && (
                  <LoveTimerAndMilestones
                    startDateStr={startDateStr}
                    onChangeStartDate={handleChangeStartDate}
                  />
                )}
                {activeChapterIdx === 2 && <LoveContract startDateStr={startDateStr} />}
                {activeChapterIdx === 3 && <WishCouponBook />}
                {activeChapterIdx === 4 && <DateRouletteAndBalance />}
                {activeChapterIdx === 5 && (
                  <CoupleBucketAndPolaroid startDateStr={startDateStr} />
                )}
                {activeChapterIdx === 6 && (
                  <WaxSealLetterAndGuestbook
                    senderName={senderName}
                    letterBody={letterBody}
                    startDateStr={startDateStr}
                    onUpdateLetter={handleUpdateLetter}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Bottom Prev / Next Chapter Navigation Card */}
            <div className="mt-6 flex items-center justify-between gap-3 rounded-3xl border-2 border-rose-200/80 bg-white/90 p-4 shadow-md backdrop-blur-sm">
              <button
                type="button"
                disabled={activeChapterIdx === 0}
                onClick={() => selectChapter(Math.max(0, activeChapterIdx - 1))}
                className="inline-flex items-center gap-1.5 rounded-2xl bg-rose-50 px-4 py-2.5 text-xs font-black text-rose-600 ring-1 ring-rose-200 transition hover:bg-rose-100 disabled:opacity-35 sm:text-sm"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>
                  {activeChapterIdx > 0
                    ? `${CHAPTERS[activeChapterIdx - 1].emoji} ${CHAPTERS[activeChapterIdx - 1].shortTitle}`
                    : "첫 페이지"}
                </span>
              </button>

              {/* Step Dots */}
              <div className="hidden items-center gap-1.5 sm:flex">
                {CHAPTERS.map((c, idx) => (
                  <button
                    key={c.id}
                    onClick={() => selectChapter(idx)}
                    className={`h-2.5 rounded-full transition-all ${
                      idx === activeChapterIdx
                        ? "w-7 bg-rose-500"
                        : "w-2.5 bg-rose-200 hover:bg-rose-300"
                    }`}
                    title={c.fullTitle}
                  />
                ))}
              </div>

              {activeChapterIdx < CHAPTERS.length - 1 ? (
                <button
                  type="button"
                  onClick={() => selectChapter(activeChapterIdx + 1)}
                  className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 px-5 py-2.5 text-xs font-black text-white shadow-sm transition hover:brightness-105 active:scale-95 sm:text-sm"
                >
                  <span>
                    다음: {CHAPTERS[activeChapterIdx + 1].emoji}{" "}
                    {CHAPTERS[activeChapterIdx + 1].shortTitle}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => selectChapter(0)}
                  className="inline-flex items-center gap-1.5 rounded-2xl bg-amber-400 px-4 py-2.5 text-xs font-black text-choco-800 shadow-sm transition hover:bg-amber-500 sm:text-sm"
                >
                  <span>💖 처음으로 돌아가기</span>
                </button>
              )}
            </div>

            {/* Table of Contents Quick Grid Card */}
            <div className="mt-5 rounded-3xl border border-rose-200/70 bg-white/75 p-4 backdrop-blur-sm">
              <div className="mb-2.5 flex items-center justify-between text-xs font-black text-choco-700">
                <span>📖 선물 포털 전체 목차 (원하는 코너로 바로 이동)</span>
                <button
                  onClick={() => setViewAllMode(true)}
                  className="text-[11px] font-bold text-rose-500 underline hover:text-rose-600"
                >
                  한 페이지로 모두 펼치기
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-7">
                {CHAPTERS.map((chap, idx) => {
                  const isCurrent = idx === activeChapterIdx;
                  return (
                    <button
                      key={chap.id}
                      onClick={() => selectChapter(idx)}
                      className={`flex flex-col items-center justify-center rounded-2xl border p-2.5 text-center transition ${
                        isCurrent
                          ? "border-rose-400 bg-rose-50 text-rose-600 shadow-sm ring-1 ring-rose-300"
                          : "border-rose-100 bg-white/80 text-choco-700 hover:bg-rose-50/50"
                      }`}
                    >
                      <span className="text-xl">{chap.emoji}</span>
                      <span className="mt-1 text-[11px] font-black">
                        {chap.step}. {chap.shortTitle}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* VIEW ALL MODE (When user clicks '전체 펼치기') */
          <div className="space-y-8">
            <LoveThermometer />
            <LoveTimerAndMilestones
              startDateStr={startDateStr}
              onChangeStartDate={handleChangeStartDate}
            />
            <LoveContract startDateStr={startDateStr} />
            <WishCouponBook />
            <DateRouletteAndBalance />
            <CoupleBucketAndPolaroid startDateStr={startDateStr} />
            <WaxSealLetterAndGuestbook
              senderName={senderName}
              letterBody={letterBody}
              startDateStr={startDateStr}
              onUpdateLetter={handleUpdateLetter}
            />
          </div>
        )}

        {/* Footer */}
        <footer className="pt-6 text-center">
          <div className="mx-auto max-w-md rounded-3xl border border-rose-200/60 bg-white/70 p-4 backdrop-blur-sm">
            <div className="text-lg">🐻 ❤️ 🐰</div>
            <p className="mt-0.5 text-xs font-extrabold text-choco-800">
              푸푸 &amp; 지유의 모든 계절이 11월 1일처럼 반짝이기를!
            </p>
            <button
              onClick={() => setShowIntro(true)}
              className="mt-2.5 inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-[11px] font-bold text-rose-500 ring-1 ring-rose-200 hover:bg-rose-100"
            >
              <Gift className="h-3 w-3" /> 오프닝 선물 상자 다시 열기
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}
