"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dices, Sparkles, Scale, RotateCcw, HeartHandshake } from "lucide-react";
import { sound } from "@/lib/sound";
import { fireHeartConfetti, fireSideCannons } from "@/lib/confetti";

interface DateCourse {
  emoji: string;
  title: string;
  desc: string;
  mission: string;
}

const DATE_COURSES: DateCourse[] = [
  {
    emoji: "🌉",
    title: "광안리 밤바다 산책 & 드론쇼 데이트",
    desc: "광안대교가 반짝이는 해변을 손잡고 걷고, 맛있는 오션뷰 저녁과 드론쇼까지 감상하기!",
    mission: "비밀 미션: 광안대교 불빛을 배경으로 손하트 투샷 찍기 🐻🐰",
  },
  {
    emoji: "☕",
    title: "전포 카페거리 디저트 투어 & 인생네컷",
    desc: "전포동 골목골목 아기자기한 소품샵 구경하고, 달콤한 케이크 맛집과 네컷사진 찍기!",
    mission: "비밀 미션: 서로에게 어울리는 귀여운 키링 하나씩 골라주기 🎀",
  },
  {
    emoji: "🚋",
    title: "해운대 블루라인파크 스카이캡슐 & 청사포",
    desc: "알록달록 귀여운 스카이캡슐 안에서 부산 바다 내려다보며 둘만의 오붓한 시간 보내기!",
    mission: "비밀 미션: 캡슐 안에서 서로 좋아하는 노래 틀고 셀카 10장 찍기 📸",
  },
  {
    emoji: "🌊",
    title: "영도 흰여울문화마을 산책 & 오션뷰 카페",
    desc: "윤슬이 반짝이는 영도 바닷길을 따라 걷고, 노을 지는 통창 카페에서 도란도란 수다 떨기!",
    mission: "비밀 미션: 흰여울 해안터널 포토존에서 실루엣 커플샷 남기기 ✨",
  },
  {
    emoji: "🎡",
    title: "기장 롯데월드 어드벤처 부산 커플룩 데이트",
    desc: "컬러 맞춘 시밀러룩 입고 귀여운 동물 머리띠 장착! 놀이기구도 타고 퍼레이드도 보기!",
    mission: "비밀 미션: 로리 캐슬 앞에서 공주님·왕자님 포즈로 사진 찍기 🏰",
  },
  {
    emoji: "🥐",
    title: "기장·송정 오션뷰 대형 베이커리 카페 드라이브",
    desc: "시원한 바다 드라이브 후 맛있는 빵과 음료 먹으면서 파도 소리 힐링하기!",
    mission: "비밀 미션: 서로 한 입씩 아~ 해주고 귀여운 리액션 찍기 😋",
  },
  {
    emoji: "🐠",
    title: "해운대 아쿠아리움 & 더베이101 야경 데이트",
    desc: "신비로운 바닷속 수조 구경하고, 밤에는 더베이101에서 반짝이는 야경 보며 치맥/핑거푸드!",
    mission: "비밀 미션: 아쿠아리움에서 서로 닮은 귀여운 바다생물 찾아주기 🦦",
  },
  {
    emoji: "🧺",
    title: "부산시민공원 / 삼락생태공원 피크닉 데이트",
    desc: "날씨 좋은 날 돗자리 펴고 도시락이나 맛있는 배달 음식 시켜서 여유롭게 힐링하기!",
    mission: "비밀 미션: 무릎베개 해주고 머리카락 다정하게 쓰다듬어주기 💕",
  },
];

interface BalanceQuestion {
  q: string;
  optA: { emoji: string; text: string };
  optB: { emoji: string; text: string };
}

const BALANCE_QUESTIONS: BalanceQuestion[] = [
  {
    q: "Q1. 푸푸와 지유의 부산 바다 데이트 취향은?",
    optA: { emoji: "🌉", text: "광안대교 야경 보며 로맨틱 밤바다 산책" },
    optB: { emoji: "🚋", text: "해운대 스카이캡슐 타고 청사포 노을 구경" },
  },
  {
    q: "Q2. 이번 주말 부산 핫플 데이트 코스는?",
    optA: { emoji: "☕", text: "전포 카페거리 소품샵 & 디저트 맛집 투어" },
    optB: { emoji: "🎡", text: "기장 롯데월드 & 오션뷰 카페 신나는 나들이" },
  },
  {
    q: "Q3. 더 설레는 애정표현 방식은?",
    optA: { emoji: "💬", text: "하루 종일 카톡으로 귀엽게 폭풍 주접 떨기" },
    optB: { emoji: "🫂", text: "만났을 때 말없이 꽉 안아주고 손 안 놓기" },
  },
  {
    q: "Q4. 다가올 100일 기념일(2월 8일!)에 더 하고 싶은 것은?",
    optA: { emoji: "🌊", text: "오션뷰 감성 숙소로 1박 2일 달달 커플 여행" },
    optB: { emoji: "🥂", text: "광안리·마린시티 뷰 맛집 코스요리 & 커플템 맞추기" },
  },
  {
    q: "Q5. 애인이 더 귀여워 보이는 순간은?",
    optA: { emoji: "😋", text: "맛있는 거 먹으면서 볼 빵빵해져서 행복해할 때" },
    optB: { emoji: "😳", text: "갑자기 눈 마주쳤는데 부끄러워하며 웃을 때" },
  },
];

export default function DateRouletteAndBalance() {
  const [activeTab, setActiveTab] = useState<"roulette" | "balance">("roulette");

  // Roulette state
  const [isSpinning, setIsSpinning] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState<number>(0);
  const [selectedCourse, setSelectedCourse] = useState<DateCourse | null>(null);

  // Balance Game state
  const [qIdx, setQIdx] = useState(0);
  const [turn, setTurn] = useState<"pupu" | "jiyu" | "result">("pupu");
  const [pupuChoice, setPupuChoice] = useState<"A" | "B" | null>(null);
  const [jiyuChoice, setJiyuChoice] = useState<"A" | "B" | null>(null);
  const [matchHistory, setMatchHistory] = useState<boolean[]>([]);
  const [gameFinished, setGameFinished] = useState(false);

  const handleSpinRoulette = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSelectedCourse(null);

    let ticks = 0;
    const totalTicks = 20 + Math.floor(Math.random() * 8);

    const interval = setInterval(() => {
      ticks++;
      setHighlightIdx((prev) => (prev + 1) % DATE_COURSES.length);
      sound.playTick();

      if (ticks >= totalTicks) {
        clearInterval(interval);
        const finalIdx = Math.floor(Math.random() * DATE_COURSES.length);
        setHighlightIdx(finalIdx);
        setSelectedCourse(DATE_COURSES[finalIdx]);
        setIsSpinning(false);
        sound.playFanfare();
        fireHeartConfetti();
      }
    }, 90);
  };

  const handlePickBalance = (choice: "A" | "B") => {
    sound.playPop(choice === "A" ? 2 : 4);
    if (turn === "pupu") {
      setPupuChoice(choice);
      setTurn("jiyu");
    } else if (turn === "jiyu") {
      setJiyuChoice(choice);
      setTurn("result");
      const matched = pupuChoice === choice;
      const nextHistory = [...matchHistory, matched];
      setMatchHistory(nextHistory);
      if (matched) {
        sound.playChime();
        fireHeartConfetti();
      }
    }
  };

  const handleNextQuestion = () => {
    if (qIdx + 1 >= BALANCE_QUESTIONS.length) {
      setGameFinished(true);
      sound.playFanfare();
      fireSideCannons();
    } else {
      setQIdx(qIdx + 1);
      setTurn("pupu");
      setPupuChoice(null);
      setJiyuChoice(null);
    }
  };

  const handleResetBalance = () => {
    setQIdx(0);
    setTurn("pupu");
    setPupuChoice(null);
    setJiyuChoice(null);
    setMatchHistory([]);
    setGameFinished(false);
    sound.playPop(1);
  };

  const currentQ = BALANCE_QUESTIONS[qIdx];
  const matchCount = matchHistory.filter(Boolean).length;

  return (
    <section className="rounded-[2rem] border-2 border-rose-200/80 bg-white/90 p-6 shadow-[0_12px_40px_-12px_rgba(255,105,147,0.2)] backdrop-blur-sm sm:p-8">
      {/* Tabs Header */}
      <div className="mb-6 flex rounded-2xl bg-rose-50 p-1.5 ring-1 ring-rose-200/70">
        <button
          onClick={() => {
            setActiveTab("roulette");
            sound.playPop(1);
          }}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-black transition sm:text-sm ${
            activeTab === "roulette"
              ? "bg-white text-rose-600 shadow-sm ring-1 ring-rose-200"
              : "text-choco-600 hover:text-rose-500"
          }`}
        >
          <Dices className="h-4 w-4" />
          <span>🎰 설레는 데이트 코스 뽑기</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("balance");
            sound.playPop(2);
          }}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-black transition sm:text-sm ${
            activeTab === "balance"
              ? "bg-white text-rose-600 shadow-sm ring-1 ring-rose-200"
              : "text-choco-600 hover:text-rose-500"
          }`}
        >
          <Scale className="h-4 w-4" />
          <span>⚖️ 푸푸♥지유 텔레파시 게임</span>
        </button>
      </div>

      {/* TAB 1: DATE ROULETTE */}
      {activeTab === "roulette" && (
        <div>
          <div className="text-center">
            <h3 className="text-lg font-black text-choco-800 sm:text-xl">
              이번 주 우리 뭐 할까? 랜덤 데이트 뽑기 🎲
            </h3>
            <p className="mt-1 text-xs text-choco-600">
              버튼을 누르면 푸푸와 지유에게 딱 맞는 달달한 데이트 코스와 비밀 미션이 나와요!
            </p>
          </div>

          {/* Grid of 8 courses that light up during spin */}
          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {DATE_COURSES.map((course, idx) => {
              const isHighlighted = highlightIdx === idx;
              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-center rounded-2xl border p-3 text-center transition-all duration-150 ${
                    isHighlighted
                      ? "scale-[1.04] border-rose-500 bg-gradient-to-br from-rose-100 to-pink-100 shadow-md ring-2 ring-rose-400"
                      : "border-rose-100 bg-cream-50/70 opacity-80"
                  }`}
                >
                  <span className="text-2xl">{course.emoji}</span>
                  <span className="mt-1.5 line-clamp-2 text-xs font-extrabold text-choco-800">
                    {course.title}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-5 text-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              disabled={isSpinning}
              onClick={handleSpinRoulette}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 px-7 py-3.5 text-sm font-black text-white shadow-[0_8px_20px_-4px_rgba(255,59,114,0.5)] transition disabled:opacity-60 sm:text-base"
            >
              <Dices className={`h-5 w-5 ${isSpinning ? "animate-spin" : ""}`} />
              <span>{isSpinning ? "두근두근 데이트 고르는 중..." : "오늘의 운명 데이트 코스 뽑기!"}</span>
            </motion.button>
          </div>

          {/* Selected Winner Card */}
          <AnimatePresence>
            {selectedCourse && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                className="mt-5 rounded-3xl border-2 border-rose-300 bg-gradient-to-br from-rose-50 via-white to-amber-50 p-5 text-center shadow-md"
              >
                <div className="inline-flex items-center gap-1 rounded-full bg-rose-500 px-3 py-0.5 text-[11px] font-black text-white">
                  <Sparkles className="h-3 w-3" /> 당첨된 데이트 코스!
                </div>
                <div className="mt-2 text-4xl">{selectedCourse.emoji}</div>
                <h4 className="mt-1 text-lg font-black text-choco-800">{selectedCourse.title}</h4>
                <p className="mt-1 text-xs leading-relaxed text-choco-600 sm:text-sm">
                  {selectedCourse.desc}
                </p>
                <div className="mt-3 inline-block rounded-xl bg-amber-100/90 px-3.5 py-1.5 text-xs font-extrabold text-amber-900">
                  🎯 {selectedCourse.mission}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* TAB 2: COUPLE TELEPATHY BALANCE GAME */}
      {activeTab === "balance" && (
        <div>
          {!gameFinished ? (
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-rose-500">
                <span>
                  질문 {qIdx + 1} / {BALANCE_QUESTIONS.length}
                </span>
                <span>현재 텔레파시 성공: {matchCount}회 ⚡</span>
              </div>

              <div className="mt-3 rounded-3xl border-2 border-rose-200 bg-gradient-to-b from-rose-50/60 to-white p-5 text-center">
                {/* Turn Indicator Badge */}
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1 text-xs font-black shadow-sm ring-1 ring-rose-200">
                  {turn === "pupu" && (
                    <span className="text-amber-700">🐻 1단계: 푸푸가 먼저 비밀리에 골라주세요!</span>
                  )}
                  {turn === "jiyu" && (
                    <span className="text-rose-600">🐰 2단계: 이제 지유가 골라주세요! (푸푸 선택 완료!)</span>
                  )}
                  {turn === "result" && (
                    <span className="text-pink-600">✨ 두 사람의 선택 결과 공개!</span>
                  )}
                </div>

                <h3 className="text-base font-black text-choco-800 sm:text-lg">{currentQ.q}</h3>

                {turn !== "result" ? (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handlePickBalance("A")}
                      className="flex flex-col items-center justify-center rounded-2xl border-2 border-rose-200 bg-white p-5 text-center shadow-sm transition hover:border-rose-400 hover:bg-rose-50"
                    >
                      <span className="text-3xl">{currentQ.optA.emoji}</span>
                      <span className="mt-2 text-sm font-black text-choco-800">
                        {currentQ.optA.text}
                      </span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handlePickBalance("B")}
                      className="flex flex-col items-center justify-center rounded-2xl border-2 border-pink-200 bg-white p-5 text-center shadow-sm transition hover:border-pink-400 hover:bg-pink-50"
                    >
                      <span className="text-3xl">{currentQ.optB.emoji}</span>
                      <span className="mt-2 text-sm font-black text-choco-800">
                        {currentQ.optB.text}
                      </span>
                    </motion.button>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-5 rounded-2xl bg-rose-50/90 p-4"
                  >
                    <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                      <div className="rounded-xl bg-white p-3 shadow-sm">
                        <div className="text-amber-700">🐻 푸푸의 선택</div>
                        <div className="mt-1 text-sm font-black text-choco-800">
                          {pupuChoice === "A" ? currentQ.optA.text : currentQ.optB.text}
                        </div>
                      </div>
                      <div className="rounded-xl bg-white p-3 shadow-sm">
                        <div className="text-rose-600">🐰 지유의 선택</div>
                        <div className="mt-1 text-sm font-black text-choco-800">
                          {jiyuChoice === "A" ? currentQ.optA.text : currentQ.optB.text}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 text-sm font-black">
                      {pupuChoice === jiyuChoice ? (
                        <span className="text-rose-600">
                          ⚡ 찌릿찌릿! 1일차부터 마음이 완벽하게 통했어요!! 💖
                        </span>
                      ) : (
                        <span className="text-amber-700">
                          🤭 둘 다 해보면 되죠! 서로의 새로운 취향 발견 성공 💕
                        </span>
                      )}
                    </div>

                    <button
                      onClick={handleNextQuestion}
                      className="mt-4 rounded-xl bg-rose-500 px-6 py-2.5 text-xs font-black text-white shadow hover:bg-rose-600"
                    >
                      {qIdx + 1 >= BALANCE_QUESTIONS.length
                        ? "최종 텔레파시 궁합 결과 보기 🎉"
                        : "다음 질문으로 넘어가기 →"}
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl border-2 border-rose-300 bg-gradient-to-br from-rose-50 via-white to-amber-50 p-6 text-center"
            >
              <HeartHandshake className="mx-auto h-12 w-12 text-rose-500" />
              <h3 className="mt-2 text-xl font-black text-choco-800">
                푸푸 🐻 ♥ 🐰 지유 텔레파시 테스트 완료!
              </h3>
              <p className="mt-1 text-sm font-bold text-rose-600">
                5문제 중 총 <b>{matchCount}문제</b> 일치! (행복 궁합 지수 <b>999%</b> 💖)
              </p>
              <p className="mt-2 text-xs leading-relaxed text-choco-600">
                같은 걸 골랐을 땐 두 배로 신나게 즐기고, 다른 걸 골랐을 땐 이번 주엔 푸푸 코스, 다음 주엔 지유 코스로 데이트하면 재미가 200배!
              </p>
              <button
                onClick={handleResetBalance}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-rose-500 px-5 py-2.5 text-xs font-black text-white shadow hover:bg-rose-600"
              >
                <RotateCcw className="h-3.5 w-3.5" /> 처음부터 다시 해보기
              </button>
            </motion.div>
          )}
        </div>
      )}
    </section>
  );
}
