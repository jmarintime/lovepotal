"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  CheckSquare,
  Sparkles,
  Upload,
  Heart,
  Plus,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { fireHeartConfetti, fireSideCannons } from "@/lib/confetti";
import { decodeSharePayload } from "@/lib/shareState";

export interface BucketItem {
  id: string;
  emoji: string;
  text: string;
  done: boolean;
}

export const DEFAULT_BUCKETS: BucketItem[] = [
  { id: "b1", emoji: "🌉", text: "광안리 밤바다 광안대교 배경으로 커플 하트 사진 찍기", done: true },
  { id: "b2", emoji: "☕", text: "전포 카페거리에서 달콤한 케이크 먹고 인생네컷 찍기", done: false },
  { id: "b3", emoji: "🚋", text: "해운대 블루라인파크 스카이캡슐 타고 노을 구경하기", done: false },
  { id: "b4", emoji: "🌊", text: "영도 흰여울문화마을 바닷길 손잡고 끝까지 걸어보기", done: false },
  { id: "b5", emoji: "🎡", text: "시밀러룩 입고 기장 롯데월드 어드벤처 부산 데이트하기", done: false },
  { id: "b6", emoji: "📱", text: "서로 핸드폰에 귀여운 애칭으로 저장하기 (🐻푸푸/🐰지유)", done: false },
  { id: "b7", emoji: "💍", text: "2월 8일(100일!)에 반짝이는 커플 아이템 맞추기", done: false },
  { id: "b8", emoji: "🎂", text: "부산의 사계절을 다 함께 보내고 11월 1일 1주년 파티하기!", done: false },
];

const EMOJI_OPTIONS = ["🌉", "☕", "🎡", "✈️", "🍰", "📸", "💍", "🏖️", "🏕️", "🐾"];

export default function CoupleBucketAndPolaroid({ startDateStr }: { startDateStr: string }) {
  const [buckets, setBuckets] = useState<BucketItem[]>(DEFAULT_BUCKETS);
  const [newBucketText, setNewBucketText] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("🌉");
  const [filter, setFilter] = useState<"all" | "todo" | "done">("all");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [photoUrl, setPhotoUrl] = useState<string>("/hero-couple.jpg");
  const [caption, setCaption] = useState<string>(
    "2026.11.01 부산 최강 귀요미 커플 푸푸♥지유 시작 ✨"
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 2500);
  };

  useEffect(() => {
    try {
      const savedBuckets = localStorage.getItem("lovepotal_buckets_v2");
      if (savedBuckets) {
        const parsed = JSON.parse(savedBuckets);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBuckets(parsed);
        }
      }
      const savedCaption = localStorage.getItem("lovepotal_polaroid_caption_v2");
      if (savedCaption) setCaption(savedCaption);
      const savedPhoto = localStorage.getItem("lovepotal_polaroid_photo_v2");
      if (savedPhoto) setPhotoUrl(savedPhoto);

      // Check if URL has shared payload `s`
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const sParam = params.get("s");
        if (sParam) {
          const decoded = decodeSharePayload<{ buckets?: BucketItem[]; caption?: string }>(sParam);
          if (decoded?.buckets && Array.isArray(decoded.buckets)) {
            setBuckets(decoded.buckets);
            localStorage.setItem("lovepotal_buckets_v2", JSON.stringify(decoded.buckets));
          }
          if (decoded?.caption) {
            setCaption(decoded.caption);
            localStorage.setItem("lovepotal_polaroid_caption_v2", decoded.caption);
          }
        }
      }
    } catch {}
  }, []);

  const saveBuckets = (updated: BucketItem[]) => {
    setBuckets(updated);
    try {
      localStorage.setItem("lovepotal_buckets_v2", JSON.stringify(updated));
    } catch {}
  };

  const toggleBucket = (id: string) => {
    const updated = buckets.map((b) => (b.id === id ? { ...b, done: !b.done } : b));
    saveBuckets(updated);

    const target = updated.find((b) => b.id === id);
    const allDone = updated.length > 0 && updated.every((b) => b.done);

    if (allDone) {
      sound.playFanfare();
      fireSideCannons();
      showToast("🎉와아!! 모든 커플 버킷리스트를 100% 달성했어요!!");
    } else if (target?.done) {
      sound.playChime();
      fireHeartConfetti();
      showToast(`💖 '${target.text.slice(0, 14)}...' 달성 완료!`);
    } else {
      sound.playPop(1);
    }
  };

  const handleAddBucket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBucketText.trim()) {
      showToast("✏️ 추가할 버킷리스트 내용을 입력해 주세요!");
      return;
    }
    const newItem: BucketItem = {
      id: `b-${Date.now()}`,
      emoji: selectedEmoji,
      text: newBucketText.trim(),
      done: false,
    };
    const updated = [newItem, ...buckets];
    saveBuckets(updated);
    setNewBucketText("");
    setFilter("all");
    sound.playChime();
    fireHeartConfetti();
    showToast("✨ 새로운 커플 버킷리스트가 추가되었어요!");
  };

  const handleDeleteBucket = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = buckets.filter((b) => b.id !== id);
    saveBuckets(updated);
    sound.playPop(0);
    showToast("🗑️ 선택한 버킷리스트 항목을 삭제했어요.");
  };

  const handleResetBuckets = () => {
    saveBuckets(DEFAULT_BUCKETS);
    sound.playPop(2);
    showToast("🔄 기본 부산 커플 버킷리스트로 초기화되었어요!");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        // Compress image via canvas so it never exceeds localStorage limits
        const canvas = document.createElement("canvas");
        const maxDim = 720;
        let w = img.width;
        let h = img.height;
        if (w > h && w > maxDim) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else if (h > maxDim) {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.82);
          setPhotoUrl(compressedDataUrl);
          try {
            localStorage.setItem("lovepotal_polaroid_photo_v2", compressedDataUrl);
          } catch {}
        } else {
          setPhotoUrl(reader.result as string);
        }
        sound.playFanfare();
        fireHeartConfetti();
        showToast("📸 폴라로이드 액자에 사진이 예쁘게 끼워졌어요!");
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleCaptionChange = (val: string) => {
    setCaption(val);
    try {
      localStorage.setItem("lovepotal_polaroid_caption_v2", val);
    } catch {}
  };

  const doneCount = buckets.filter((b) => b.done).length;
  const percent = buckets.length > 0 ? Math.round((doneCount / buckets.length) * 100) : 0;

  const filteredBuckets = buckets.filter((b) => {
    if (filter === "done") return b.done;
    if (filter === "todo") return !b.done;
    return true;
  });

  return (
    <section className="relative rounded-[2rem] border-2 border-rose-200/80 bg-white/90 p-6 shadow-[0_12px_40px_-12px_rgba(255,105,147,0.2)] backdrop-blur-sm sm:p-8">
      {/* Floating feedback toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="mb-4 rounded-2xl bg-rose-500 px-4 py-2.5 text-center text-xs font-black text-white shadow-md"
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-7 lg:grid-cols-12">
        {/* Left: Cute Polaroid Frame */}
        <div className="flex flex-col items-center justify-center lg:col-span-5">
          <div className="mb-3 flex items-center gap-1.5 text-sm font-black text-choco-800">
            <Camera className="h-4 w-4 text-rose-500" />
            <span>우리의 폴라로이드 추억 액자 📸</span>
          </div>

          <motion.div
            whileHover={{ rotate: -1, scale: 1.01 }}
            className="relative w-full max-w-xs rounded-2xl border border-rose-100 bg-white p-4 pb-6 shadow-[0_14px_30px_-8px_rgba(62,39,35,0.16)] ring-2 ring-rose-100"
          >
            {/* Cute Washi Tape on Top */}
            <div className="absolute -top-3 left-1/2 h-6 w-28 -translate-x-1/2 -rotate-2 rounded-sm bg-rose-200/80 shadow-sm" />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="group relative aspect-square w-full cursor-pointer overflow-hidden rounded-xl bg-cream-50"
              title="클릭해서 사진 변경하기"
            >
              <img src={photoUrl} alt="커플 폴라로이드" className="h-full w-full object-cover" />
              <div className="absolute right-2 top-2 rounded-full bg-white/85 px-2.5 py-0.5 text-[10px] font-black text-rose-500 shadow-sm backdrop-blur-sm">
                DAY 1 ♥ {startDateStr.replace(/-/g, ".")}
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-black/40 py-1.5 text-center text-[11px] font-bold text-white opacity-0 transition group-hover:opacity-100">
                📷 터치해서 사진 바꾸기
              </div>
            </div>

            <input
              type="text"
              value={caption}
              onChange={(e) => handleCaptionChange(e.target.value)}
              placeholder="폴라로이드 한 줄 메모를 적어보세요!"
              className="mt-3 w-full border-b border-dashed border-rose-200 bg-transparent pb-1 text-center text-xs font-extrabold text-choco-800 outline-none focus:border-rose-400"
            />

            <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-rose-400">
              <span>🐻 PUPU &amp; JIYU 🐰</span>
              <span>#부산커플_1101</span>
            </div>
          </motion.div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />

          <div className="mt-3.5 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-full bg-rose-500 px-4 py-2 text-xs font-extrabold text-white shadow-sm transition hover:bg-rose-600"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>우리 커플 사진 끼우기</span>
            </button>
            {photoUrl !== "/hero-couple.jpg" && (
              <button
                type="button"
                onClick={() => {
                  setPhotoUrl("/hero-couple.jpg");
                  try {
                    localStorage.removeItem("lovepotal_polaroid_photo_v2");
                  } catch {}
                  showToast("🐻🐰 기본 일러스트 액자로 되돌렸어요!");
                }}
                className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600 ring-1 ring-rose-200 hover:bg-rose-100"
              >
                <RotateCcw className="h-3 w-3" /> 기본 일러스트
              </button>
            )}
          </div>
        </div>

        {/* Right: Couple Bucket List */}
        <div className="lg:col-span-7">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <CheckSquare className="h-4 w-4 text-rose-500" />
              <h3 className="text-base font-black text-choco-800 sm:text-lg">
                푸푸 ♥ 지유 부산 커플 버킷리스트 ✨
              </h3>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="rounded-full bg-rose-100 px-3 py-0.5 text-xs font-black text-rose-600">
                달성률 {percent}% ({doneCount}/{buckets.length})
              </span>
              <button
                type="button"
                onClick={handleResetBuckets}
                className="rounded-full bg-rose-50 p-1.5 text-rose-500 ring-1 ring-rose-200 hover:bg-rose-100"
                title="기본 버킷리스트로 초기화"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-3 h-3 w-full overflow-hidden rounded-full bg-rose-50 p-0.5 ring-1 ring-rose-200">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-rose-400 via-pink-500 to-amber-400"
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
            />
          </div>

          {/* Filter Tabs */}
          <div className="mb-3 flex gap-1.5">
            {[
              { key: "all", label: `전체 (${buckets.length})` },
              { key: "todo", label: `도전 중 🔥 (${buckets.length - doneCount})` },
              { key: "done", label: `달성 완료 💖 (${doneCount})` },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setFilter(tab.key as "all" | "todo" | "done")}
                className={`rounded-full px-3 py-1 text-xs font-extrabold transition ${
                  filter === tab.key
                    ? "bg-rose-500 text-white shadow-sm"
                    : "bg-rose-50 text-choco-600 hover:bg-rose-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Bucket List Items */}
          <div className="grid max-h-[320px] gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
            {filteredBuckets.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleBucket(item.id)}
                className={`group flex cursor-pointer items-center gap-2.5 rounded-2xl border p-3 transition ${
                  item.done
                    ? "border-rose-300 bg-rose-50/90 text-choco-800 shadow-sm"
                    : "border-rose-100 bg-cream-50/60 text-choco-700 hover:border-rose-300 hover:bg-rose-50/40"
                }`}
              >
                <span className="text-xl">{item.emoji}</span>
                <span
                  className={`flex-1 text-xs font-bold leading-snug ${
                    item.done ? "line-through decoration-rose-400 opacity-80" : ""
                  }`}
                >
                  {item.text}
                </span>
                <button
                  type="button"
                  onClick={(e) => handleDeleteBucket(e, item.id)}
                  className="rounded-full p-1 text-rose-300 opacity-60 transition hover:bg-rose-100 hover:text-rose-600 group-hover:opacity-100"
                  title="삭제"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-black transition ${
                    item.done
                      ? "bg-rose-500 text-white shadow-sm"
                      : "border-2 border-rose-300 bg-white text-transparent"
                  }`}
                >
                  ✓
                </span>
              </div>
            ))}
          </div>

          {/* Add New Bucket Item Form */}
          <form
            onSubmit={handleAddBucket}
            className="mt-4 rounded-2xl border border-rose-200 bg-rose-50/50 p-3.5"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-black text-choco-800">
                ➕ 우리만의 새 버킷리스트 직접 추가하기
              </span>
              <div className="flex gap-1">
                {EMOJI_OPTIONS.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setSelectedEmoji(em)}
                    className={`flex h-6 w-6 items-center justify-center rounded-lg text-xs transition ${
                      selectedEmoji === em
                        ? "scale-110 bg-rose-500 text-white shadow-sm"
                        : "bg-white hover:bg-rose-100"
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newBucketText}
                onChange={(e) => setNewBucketText(e.target.value)}
                placeholder="예: 다대포 노을 보면서 손잡고 산책하기 🌅"
                className="flex-1 rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-bold text-choco-800 outline-none focus:border-rose-400"
              />
              <button
                type="submit"
                className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-rose-500 px-4 py-2 text-xs font-black text-white shadow-sm transition hover:bg-rose-600"
              >
                <Plus className="h-4 w-4" /> 추가하기
              </button>
            </div>
          </form>

          <div className="mt-3 flex items-center justify-center gap-1.5 rounded-2xl bg-amber-50/80 p-2.5 text-center text-xs font-bold text-amber-900">
            <Sparkles className="h-4 w-4 shrink-0 text-amber-500" />
            <span>항목을 터치하면 달성 체크(✓)가 되며, 공유 링크 복사 시 함께 전달됩니다!</span>
            <Heart className="h-3.5 w-3.5 shrink-0 fill-rose-500 text-rose-500" />
          </div>
        </div>
      </div>
    </section>
  );
}
