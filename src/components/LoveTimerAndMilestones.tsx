"use client";

import React, { useEffect, useState } from "react";
import { Calendar, Clock, Heart, Sparkles, Edit3, Check } from "lucide-react";
import { sound } from "@/lib/sound";
import { fireHeartConfetti } from "@/lib/confetti";

interface LoveTimerAndMilestonesProps {
  startDateStr: string;
  onChangeStartDate: (newDate: string) => void;
}

interface MilestoneItem {
  title: string;
  emoji: string;
  days: number;
  desc: string;
  dateStr: string;
  dDayText: string;
  isTodayOrPast: boolean;
}

function addDays(baseDateStr: string, daysToAdd: number): Date {
  const [y, m, d] = baseDateStr.split("-").map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1);
  // In Korean couple counting, Day 1 is startDate (+0 days), Day 100 is startDate + 99 days, 1st Anniversary is +365 days
  dt.setDate(dt.getDate() + daysToAdd);
  return dt;
}

function formatKoreanDate(dt: Date): string {
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const d = String(dt.getDate()).padStart(2, "0");
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
  const w = weekDays[dt.getDay()];
  return `${y}.${m}.${d} (${w})`;
}

export default function LoveTimerAndMilestones({
  startDateStr,
  onChangeStartDate,
}: LoveTimerAndMilestonesProps) {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState<Date>(() => new Date(2026, 10, 3, 12, 0, 0));
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [tempDate, setTempDate] = useState(startDateStr);

  useEffect(() => {
    setTempDate(startDateStr);
  }, [startDateStr]);

  useEffect(() => {
    setMounted(true);
    setNow(new Date());
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [y, m, d] = startDateStr.split("-").map(Number);
  const startMidnight = new Date(y, (m || 1) - 1, d || 1, 0, 0, 0);
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);

  // Korean D+1 calculation (Day 1 = start date)
  const diffDaysFloor = Math.floor(
    (todayMidnight.getTime() - startMidnight.getTime()) / (1000 * 60 * 60 * 24)
  );
  const coupleDayCount = Math.max(1, diffDaysFloor + 1);

  // Live elapsed hours, minutes, seconds since startMidnight
  const totalSeconds = Math.max(0, Math.floor((now.getTime() - startMidnight.getTime()) / 1000));
  const elapsedDays = Math.floor(totalSeconds / 86400);
  const elapsedHours = Math.floor((totalSeconds % 86400) / 3600);
  const elapsedMinutes = Math.floor((totalSeconds % 3600) / 60);
  const elapsedSeconds = totalSeconds % 60;

  const rawMilestones = [
    { title: "설레는 1일", emoji: "🐣", offsetDays: 0, daysLabel: 1, desc: "푸푸 & 지유 공식 커플 탄생일!" },
    { title: "투투데이 (22일)", emoji: "🐥", offsetDays: 21, daysLabel: 22, desc: "귀여운 첫 번째 미니 기념일 💕" },
    { title: "50일 기념일", emoji: "💐", offsetDays: 49, daysLabel: 50, desc: "반백일 동안 더 가까워지는 날" },
    { title: "두근두근 100일", emoji: "💍", offsetDays: 99, daysLabel: 100, desc: "커플들의 로망! 첫 100일 파티" },
    { title: "달달한 200일", emoji: "🥂", offsetDays: 199, daysLabel: 200, desc: "사계절의 절반을 함께한 날" },
    { title: "소중한 300일", emoji: "🎁", offsetDays: 299, daysLabel: 300, desc: "300일 동안 쌓인 행복한 추억들" },
    { title: "첫 번째 1주년", emoji: "🎂", offsetDays: 365, daysLabel: 365, desc: "사계절을 모두 함께 보낸 1주년!" },
  ];

  const milestones: MilestoneItem[] = rawMilestones.map((item) => {
    const targetDate = addDays(startDateStr, item.offsetDays);
    const diffFromToday = Math.round(
      (targetDate.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24)
    );
    let dDayText = "";
    if (diffFromToday === 0) dDayText = "D-DAY 🎉";
    else if (diffFromToday > 0) dDayText = `D-${diffFromToday}`;
    else dDayText = `달성 완료 💖`;

    return {
      title: item.title,
      emoji: item.emoji,
      days: item.daysLabel,
      desc: item.desc,
      dateStr: formatKoreanDate(targetDate),
      dDayText,
      isTodayOrPast: diffFromToday <= 0,
    };
  });

  const handleSaveDate = () => {
    if (tempDate) {
      onChangeStartDate(tempDate);
      sound.playChime();
      fireHeartConfetti();
    }
    setIsEditingDate(false);
  };

  return (
    <section className="rounded-[2rem] border-2 border-rose-200/80 bg-white/90 p-6 shadow-[0_12px_40px_-12px_rgba(255,105,147,0.2)] backdrop-blur-sm sm:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100 text-rose-500">
            <Clock className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-black text-choco-800 sm:text-xl">
              우리의 실시간 사랑 시계 ⏱️
            </h2>
            <p className="text-xs text-choco-600">
              1초마다 차곡차곡 쌓이는 푸푸와 지유의 행복한 시간
            </p>
          </div>
        </div>

        {/* Start Date Edit Button */}
        {!isEditingDate ? (
          <button
            onClick={() => setIsEditingDate(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 ring-1 ring-rose-200 transition hover:bg-rose-100"
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>1일 시작일: {startDateStr.replace(/-/g, ".")}</span>
            <Edit3 className="h-3 w-3 opacity-70" />
          </button>
        ) : (
          <div className="flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 ring-2 ring-rose-300">
            <input
              type="date"
              value={tempDate}
              onChange={(e) => setTempDate(e.target.value)}
              className="rounded-lg bg-white px-2 py-0.5 text-xs font-bold text-choco-800 outline-none"
            />
            <button
              onClick={handleSaveDate}
              className="inline-flex items-center gap-1 rounded-full bg-rose-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm hover:bg-rose-600"
            >
              <Check className="h-3 w-3" /> 저장
            </button>
          </div>
        )}
      </div>

      {/* Main D+1 Banner */}
      <div className="mt-5 rounded-3xl bg-gradient-to-br from-rose-500 via-pink-500 to-rose-400 p-6 text-center text-white shadow-[0_12px_30px_-8px_rgba(255,59,114,0.5)]">
        <div className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5" />
          <span>푸푸 🐻 ❤️ 🐰 지유 사랑한 지</span>
        </div>

        <div className="mt-2 flex items-baseline justify-center gap-2">
          <span className="text-4xl font-black tracking-tight sm:text-5xl">
            {coupleDayCount}일째
          </span>
          <span className="text-xl font-extrabold text-rose-100">달달 연애 중 💘</span>
        </div>

        {/* Live Ticking Boxes */}
        <div className="mt-5 grid grid-cols-4 gap-2 sm:gap-3">
          {[
            { label: "DAYS", value: mounted ? String(elapsedDays).padStart(2, "0") : "--" },
            { label: "HOURS", value: mounted ? String(elapsedHours).padStart(2, "0") : "--" },
            { label: "MINUTES", value: mounted ? String(elapsedMinutes).padStart(2, "0") : "--" },
            { label: "SECONDS", value: mounted ? String(elapsedSeconds).padStart(2, "0") : "--" },
          ].map((box, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white/20 py-2.5 backdrop-blur-md ring-1 ring-white/30"
            >
              <div suppressHydrationWarning className="font-mono text-2xl font-black sm:text-3xl">
                {box.value}
              </div>
              <div className="mt-0.5 text-[10px] font-bold tracking-wider text-rose-100">
                {box.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Anniversary Timeline */}
      <div className="mt-6">
        <div className="mb-3 flex items-center gap-1.5 text-sm font-black text-choco-800">
          <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
          <span>앞으로 함께 맞이할 설레는 기념일 캘린더</span>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2">
          {milestones.map((mItem, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between rounded-2xl border p-3.5 transition ${
                mItem.isTodayOrPast
                  ? "border-rose-300 bg-gradient-to-r from-rose-50 to-pink-50 shadow-sm"
                  : "border-rose-100 bg-cream-50/70 hover:bg-rose-50/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm ring-1 ring-rose-100">
                  {mItem.emoji}
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black text-choco-800">{mItem.title}</span>
                  </div>
                  <div className="text-xs font-medium text-choco-600">{mItem.desc}</div>
                  <div className="mt-0.5 text-[11px] font-bold text-rose-500">{mItem.dateStr}</div>
                </div>
              </div>

              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-black ${
                  mItem.dDayText.includes("D-DAY")
                    ? "animate-bounce bg-rose-500 text-white shadow"
                    : mItem.isTodayOrPast
                    ? "bg-rose-200 text-rose-700"
                    : "bg-white text-rose-500 ring-1 ring-rose-200"
                }`}
              >
                {mItem.dDayText}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
