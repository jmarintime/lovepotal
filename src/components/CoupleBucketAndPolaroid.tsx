"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera, CheckSquare, Sparkles, Upload, Heart } from "lucide-react";
import { sound } from "@/lib/sound";
import { fireHeartConfetti } from "@/lib/confetti";

interface BucketItem {
  id: string;
  emoji: string;
  text: string;
  done: boolean;
}

const DEFAULT_BUCKETS: BucketItem[] = [
  { id: "b1", emoji: "🌉", text: "광안리 밤바다 광안대교 배경으로 커플 하트 사진 찍기", done: true },
  { id: "b2", emoji: "☕", text: "전포 카페거리에서 달콤한 케이크 먹고 인생네컷 찍기", done: false },
  { id: "b3", emoji: "🚋", text: "해운대 블루라인파크 스카이캡슐 타고 노을 구경하기", done: false },
  { id: "b4", emoji: "🌊", text: "영도 흰여울문화마을 바닷길 손잡고 끝까지 걸어보기", done: false },
  { id: "b5", emoji: "🎡", text: "시밀러룩 입고 기장 롯데월드 어드벤처 부산 데이트하기", done: false },
  { id: "b6", emoji: "📱", text: "서로 핸드폰에 귀여운 애칭으로 저장하기 (🐻푸푸/🐰지유)", done: false },
  { id: "b7", emoji: "💍", text: "2월 8일(100일!)에 반짝이는 커플 아이템 맞추기", done: false },
  { id: "b8", emoji: "🎂", text: "부산의 사계절을 다 함께 보내고 11월 1일 1주년 파티하기!", done: false },
];

export default function CoupleBucketAndPolaroid({ startDateStr }: { startDateStr: string }) {
  const [buckets, setBuckets] = useState<BucketItem[]>(DEFAULT_BUCKETS);
  const [photoUrl, setPhotoUrl] = useState<string>("/hero-couple.jpg");
  const [caption, setCaption] = useState<string>("2026.11.01 부산 최강 귀요미 커플 푸푸♥지유 시작 ✨");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      const savedBuckets = localStorage.getItem("lovepotal_buckets_v2");
      if (savedBuckets) setBuckets(JSON.parse(savedBuckets));
      const savedCaption = localStorage.getItem("lovepotal_polaroid_caption_v2");
      if (savedCaption) setCaption(savedCaption);
      const savedPhoto = localStorage.getItem("lovepotal_polaroid_photo_v2");
      if (savedPhoto) setPhotoUrl(savedPhoto);
    } catch {}
  }, []);

  const toggleBucket = (id: string) => {
    const updated = buckets.map((b) => (b.id === id ? { ...b, done: !b.done } : b));
    setBuckets(updated);
    const target = updated.find((b) => b.id === id);
    if (target?.done) {
      sound.playChime();
      fireHeartConfetti();
    } else {
      sound.playPop(1);
    }
    try {
      localStorage.setItem("lovepotal_buckets_v2", JSON.stringify(updated));
    } catch {}
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPhotoUrl(dataUrl);
      sound.playFanfare();
      fireHeartConfetti();
      try {
        localStorage.setItem("lovepotal_polaroid_photo_v1", dataUrl);
      } catch {}
    };
    reader.readAsDataURL(file);
  };

  const handleCaptionChange = (val: string) => {
    setCaption(val);
    try {
      localStorage.setItem("lovepotal_polaroid_caption_v1", val);
    } catch {}
  };

  const doneCount = buckets.filter((b) => b.done).length;
  const percent = Math.round((doneCount / buckets.length) * 100);

  return (
    <section className="rounded-[2rem] border-2 border-rose-200/80 bg-white/90 p-6 shadow-[0_12px_40px_-12px_rgba(255,105,147,0.2)] backdrop-blur-sm sm:p-8">
      <div className="grid gap-7 lg:grid-cols-12">
        {/* Left: Cute Polaroid Frame */}
        <div className="flex flex-col items-center justify-center lg:col-span-5">
          <div className="mb-3 flex items-center gap-1.5 text-sm font-black text-choco-800">
            <Camera className="h-4 w-4 text-rose-500" />
            <span>우리의 1일차 폴라로이드 액자 📸</span>
          </div>

          <motion.div
            whileHover={{ rotate: -1, scale: 1.01 }}
            className="relative w-full max-w-xs rounded-2xl border border-rose-100 bg-white p-4 pb-6 shadow-[0_14px_30px_-8px_rgba(62,39,35,0.16)] ring-2 ring-rose-100"
          >
            {/* Cute Washi Tape on Top */}
            <div className="absolute -top-3 left-1/2 h-6 w-28 -translate-x-1/2 -rotate-2 rounded-sm bg-rose-200/80 shadow-sm" />

            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-cream-50">
              <img
                src={photoUrl}
                alt="커플 폴라로이드"
                className="h-full w-full object-cover"
              />
              <div className="absolute right-2 top-2 rounded-full bg-white/85 px-2.5 py-0.5 text-[10px] font-black text-rose-500 shadow-sm backdrop-blur-sm">
                DAY 1 ♥ {startDateStr.replace(/-/g, ".")}
              </div>
            </div>

            <input
              type="text"
              value={caption}
              onChange={(e) => handleCaptionChange(e.target.value)}
              className="mt-3 w-full border-b border-dashed border-rose-200 bg-transparent pb-1 text-center text-xs font-extrabold text-choco-800 outline-none focus:border-rose-400"
            />

            <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-rose-400">
              <span>🐻 PUPU &amp; JIYU 🐰</span>
              <span>#오늘부터_1일</span>
            </div>
          </motion.div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-3.5 inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-4 py-2 text-xs font-extrabold text-rose-600 ring-1 ring-rose-200 transition hover:bg-rose-100"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>우리 커플 사진으로 액자 끼우기</span>
          </button>
        </div>

        {/* Right: Couple Bucket List */}
        <div className="lg:col-span-7">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <CheckSquare className="h-4 w-4 text-rose-500" />
              <h3 className="text-base font-black text-choco-800 sm:text-lg">
                푸푸 ♥ 지유 설렘 버킷리스트 ✨
              </h3>
            </div>
            <span className="rounded-full bg-rose-100 px-3 py-0.5 text-xs font-black text-rose-600">
              달성률 {percent}% ({doneCount}/{buckets.length})
            </span>
          </div>

          <div className="mb-4 h-2.5 w-full overflow-hidden rounded-full bg-rose-50 ring-1 ring-rose-100">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-rose-400 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
            />
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {buckets.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleBucket(item.id)}
                className={`flex cursor-pointer items-center gap-2.5 rounded-2xl border p-3 transition ${
                  item.done
                    ? "border-rose-300 bg-rose-50/80 text-choco-800 shadow-sm"
                    : "border-rose-100 bg-cream-50/50 text-choco-600 hover:bg-rose-50/40"
                }`}
              >
                <span className="text-xl">{item.emoji}</span>
                <span
                  className={`flex-1 text-xs font-bold leading-snug ${
                    item.done ? "line-through decoration-rose-400" : ""
                  }`}
                >
                  {item.text}
                </span>
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${
                    item.done
                      ? "bg-rose-500 text-white"
                      : "border border-rose-200 bg-white text-transparent"
                  }`}
                >
                  ✓
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-center gap-1.5 rounded-2xl bg-amber-50/80 p-3 text-center text-xs font-bold text-amber-900">
            <Sparkles className="h-4 w-4 shrink-0 text-amber-500" />
            <span>하나씩 함께 도장 깨기 하면서 평생 잊지 못할 추억을 만들어 보세요!</span>
            <Heart className="h-3.5 w-3.5 shrink-0 fill-rose-500 text-rose-500" />
          </div>
        </div>
      </div>
    </section>
  );
}
