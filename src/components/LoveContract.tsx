"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollText, Plus, Award, RotateCcw, Sparkles } from "lucide-react";
import { sound } from "@/lib/sound";
import { fireHeartConfetti, fireSideCannons } from "@/lib/confetti";

const DEFAULT_CLAUSES = [
  "제1조 [애정표현] 하루에 최소 3번 이상 '좋아해, 예쁘다, 멋있다' 아낌없이 표현하기 💕",
  "제2조 [화해의 법칙] 삐지거나 서운한 일이 생겨도 그날 자정(12시) 전에 꼭 안아주며 풀기 🤝",
  "제3조 [맛집 공유] 맛있는 음식을 보면 제일 먼저 서로를 떠올리고 데려가기 🍰",
  "제4조 [무조건 내 편] 언제 어디서나 세상에서 가장 든든한 서로의 1호 팬이 되어주기 🐾",
  "제5조 [유효기간] 본 계약의 유효기간은 오늘(1일)부터 우주 끝까지 무기한으로 한다 ♾️",
];

export default function LoveContract({ startDateStr }: { startDateStr: string }) {
  const [clauses, setClauses] = useState<string[]>(DEFAULT_CLAUSES);
  const [newClause, setNewClause] = useState("");
  const [pupuStamped, setPupuStamped] = useState(false);
  const [jiyuStamped, setJiyuStamped] = useState(false);
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lovepotal_contract_v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.clauses) setClauses(parsed.clauses);
        if (typeof parsed.pupuStamped === "boolean") setPupuStamped(parsed.pupuStamped);
        if (typeof parsed.jiyuStamped === "boolean") setJiyuStamped(parsed.jiyuStamped);
      }
    } catch {}
  }, []);

  const saveState = (nextClauses: string[], nextPupu: boolean, nextJiyu: boolean) => {
    try {
      localStorage.setItem(
        "lovepotal_contract_v1",
        JSON.stringify({
          clauses: nextClauses,
          pupuStamped: nextPupu,
          jiyuStamped: nextJiyu,
        })
      );
    } catch {}
  };

  const triggerStampEffect = (who: "pupu" | "jiyu") => {
    sound.playStamp();
    setShaking(true);
    setTimeout(() => setShaking(false), 350);

    const nextPupu = who === "pupu" ? true : pupuStamped;
    const nextJiyu = who === "jiyu" ? true : jiyuStamped;

    if (who === "pupu") setPupuStamped(true);
    if (who === "jiyu") setJiyuStamped(true);

    saveState(clauses, nextPupu, nextJiyu);

    if (nextPupu && nextJiyu) {
      setTimeout(() => {
        sound.playFanfare();
        fireHeartConfetti();
        fireSideCannons();
      }, 220);
    } else {
      fireHeartConfetti();
    }
  };

  const handleAddClause = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClause.trim()) return;
    const formatted = `제${clauses.length + 1}조 [특별약속] ${newClause.trim()} ✨`;
    const updated = [...clauses, formatted];
    setClauses(updated);
    setNewClause("");
    sound.playPop(3);
    saveState(updated, pupuStamped, jiyuStamped);
  };

  const handleResetStamps = () => {
    setPupuStamped(false);
    setJiyuStamped(false);
    sound.playPop(0);
    saveState(clauses, false, false);
  };

  const bothSigned = pupuStamped && jiyuStamped;

  return (
    <motion.section
      animate={shaking ? { x: [-6, 6, -5, 5, 0], y: [-3, 3, -2, 2, 0] } : {}}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-[2rem] border-2 border-amber-200/90 bg-gradient-to-b from-cream-50 via-white to-amber-50/40 p-6 shadow-[0_12px_40px_-12px_rgba(217,119,6,0.18)] sm:p-8"
    >
      {/* Decorative Corner Ribbons */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
            <ScrollText className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-black text-choco-800 sm:text-xl">
              제1호 연애 계약서 & 커플 임명장 📜
            </h2>
            <p className="text-xs text-choco-600">
              두 사람이 도장을 꾹 찍으면 공식 커플 임명장이 발급돼요!
            </p>
          </div>
        </div>

        {(pupuStamped || jiyuStamped) && (
          <button
            onClick={handleResetStamps}
            className="inline-flex items-center gap-1 rounded-full bg-amber-100/80 px-3 py-1 text-xs font-bold text-amber-800 transition hover:bg-amber-200"
          >
            <RotateCcw className="h-3 w-3" /> 도장 다시 찍기
          </button>
        )}
      </div>

      {/* Certificate Frame */}
      <div className="relative rounded-3xl border-4 border-double border-amber-300 bg-[#fffdf8] p-5 shadow-inner sm:p-7">
        <div className="text-center">
          <span className="inline-block rounded-full bg-amber-100 px-3 py-0.5 text-[11px] font-black tracking-widest text-amber-700">
            COUPLE CERTIFICATE NO. 2026-0001
          </span>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-choco-800">
            🐻 푸푸 &amp; 지유 🐰 공식 연애 협약서
          </h3>
          <p className="mt-1 text-xs font-medium text-choco-600">
            두 사람은 <b>{startDateStr.replace(/-/g, "년 ").replace(/(\d+)$/, "$1일")}</b>부터 서로의 가장 소중한 연인이 되었음을 선언하며 아래 조항을 약속합니다.
          </p>
        </div>

        {/* Clauses List */}
        <ul className="mt-5 space-y-2.5">
          {clauses.map((clause, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2.5 rounded-2xl border border-amber-100 bg-white/90 px-4 py-3 text-xs font-bold leading-relaxed text-choco-700 shadow-sm sm:text-sm"
            >
              <span className="mt-0.5 text-rose-500">♥</span>
              <span>{clause}</span>
            </li>
          ))}
        </ul>

        {/* Add Custom Clause Form */}
        <form onSubmit={handleAddClause} className="mt-3 flex gap-2">
          <input
            type="text"
            value={newClause}
            onChange={(e) => setNewClause(e.target.value)}
            placeholder="우리만의 특별 약속 한 줄 추가하기... (예: 매달 네컷사진 찍기!)"
            className="flex-1 rounded-xl border border-amber-200 bg-white px-3.5 py-2 text-xs font-medium text-choco-800 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
          />
          <button
            type="submit"
            className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-black text-white shadow-sm transition hover:bg-amber-600"
          >
            <Plus className="h-3.5 w-3.5" /> 조항 추가
          </button>
        </form>

        {/* Stamp Pads */}
        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-dashed border-amber-200 pt-6">
          {/* Pupu Stamp Box */}
          <div className="flex flex-col items-center rounded-2xl border border-amber-200/80 bg-amber-50/40 p-4 text-center">
            <span className="text-xs font-extrabold text-choco-700">남자친구 (갑)</span>
            <span className="mt-0.5 text-base font-black text-choco-800">🐻 푸 푸</span>

            <div className="relative mt-3 flex h-24 w-24 items-center justify-center">
              {!pupuStamped ? (
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => triggerStampEffect("pupu")}
                  className="flex h-20 w-20 flex-col items-center justify-center rounded-full border-2 border-dashed border-rose-300 bg-white text-rose-500 shadow-sm transition hover:border-rose-500 hover:bg-rose-50"
                >
                  <span className="text-xl">🐾</span>
                  <span className="mt-0.5 text-[11px] font-black">도장 꾹!</span>
                </motion.button>
              ) : (
                <motion.div
                  initial={{ scale: 2.4, opacity: 0, rotate: -25 }}
                  animate={{ scale: 1, opacity: 1, rotate: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 14 }}
                  className="flex h-20 w-20 flex-col items-center justify-center rounded-full border-4 border-red-500 bg-red-50/90 text-red-600 shadow-md ring-2 ring-red-200"
                >
                  <span className="text-[10px] font-extrabold tracking-tighter">공식연인</span>
                  <span className="text-sm font-black">푸푸之印</span>
                  <span className="text-xs">🐾 합격</span>
                </motion.div>
              )}
            </div>
          </div>

          {/* Jiyu Stamp Box */}
          <div className="flex flex-col items-center rounded-2xl border border-rose-200/80 bg-rose-50/40 p-4 text-center">
            <span className="text-xs font-extrabold text-choco-700">여자친구 (을)</span>
            <span className="mt-0.5 text-base font-black text-choco-800">🐰 지 유</span>

            <div className="relative mt-3 flex h-24 w-24 items-center justify-center">
              {!jiyuStamped ? (
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => triggerStampEffect("jiyu")}
                  className="flex h-20 w-20 flex-col items-center justify-center rounded-full border-2 border-dashed border-rose-300 bg-white text-rose-500 shadow-sm transition hover:border-rose-500 hover:bg-rose-50"
                >
                  <span className="text-xl">🐰</span>
                  <span className="mt-0.5 text-[11px] font-black">도장 꾹!</span>
                </motion.button>
              ) : (
                <motion.div
                  initial={{ scale: 2.4, opacity: 0, rotate: 25 }}
                  animate={{ scale: 1, opacity: 1, rotate: 7 }}
                  transition={{ type: "spring", stiffness: 300, damping: 14 }}
                  className="flex h-20 w-20 flex-col items-center justify-center rounded-full border-4 border-rose-500 bg-rose-50/90 text-rose-600 shadow-md ring-2 ring-rose-200"
                >
                  <span className="text-[10px] font-extrabold tracking-tighter">공식연인</span>
                  <span className="text-sm font-black">지유之印</span>
                  <span className="text-xs">💖 합격</span>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Official Completion Banner */}
        <AnimatePresence>
          {bothSigned && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mt-6 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-r from-amber-400 via-rose-400 to-pink-500 p-4 text-center text-white shadow-lg"
            >
              <div className="flex items-center gap-1.5 text-sm font-black sm:text-base">
                <Award className="h-5 w-5" />
                <span>축하합니다! 푸푸 ♥ 지유 공식 커플 임명 완료!</span>
                <Sparkles className="h-5 w-5" />
              </div>
              <p className="mt-1 text-xs font-medium text-white/95">
                양측의 도장이 모두 날인되어 지금 이 순간부터 평생 달달할 권리가 부여되었습니다 🎊
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
