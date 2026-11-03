"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Ticket, Plus, Sparkles, CheckCircle2 } from "lucide-react";
import { sound } from "@/lib/sound";
import { fireHeartConfetti } from "@/lib/confetti";

interface CouponItem {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  target: string;
  used: boolean;
  bgClass: string;
}

const INITIAL_COUPONS: CouponItem[] = [
  {
    id: "c1",
    emoji: "🫂",
    title: "5분 동안 꼬옥 안아주기권",
    desc: "언제 어디서든 부르면 달려가서 행복지수 100% 충전해주기!",
    target: "푸푸 🐻 ↔ 지유 🐰 공용",
    used: false,
    bgClass: "from-rose-50 to-pink-50 border-rose-200",
  },
  {
    id: "c2",
    emoji: "🏳️",
    title: "삐짐 1회 즉시 사르르 해제권",
    desc: "이 쿠폰을 내밀면 무조건 웃으면서 귀엽게 봐주기 약속!",
    target: "푸푸 🐻 ↔ 지유 🐰 공용",
    used: false,
    bgClass: "from-amber-50 to-orange-50 border-amber-200",
  },
  {
    id: "c3",
    emoji: "🍰",
    title: "전포·광안리 맛집 & 디저트 풀코스 쏘기권",
    desc: "부산 핫플 맛집부터 예쁜 카페 디저트까지 풀코스로 기분 좋게 대접하기!",
    target: "부산 데이트 찬스",
    used: false,
    bgClass: "from-pink-50 to-purple-50 border-pink-200",
  },
  {
    id: "c4",
    emoji: "👑",
    title: "오늘 하루 '내 말 다 맞아' 대접권",
    desc: "데이트 코스부터 메뉴까지 오늘 하루 왕/공주님으로 모시기!",
    target: "1일 1회 스페셜",
    used: false,
    bgClass: "from-yellow-50 to-amber-50 border-amber-200",
  },
  {
    id: "c5",
    emoji: "🌉",
    title: "광안리·해운대 밤바다 산책 긴급 호출권",
    desc: "밤늦게 갑자기 보고 싶거나 부산 밤바다 걷고 싶을 때 즉시 소환!",
    target: "부산 야경 로맨스",
    used: false,
    bgClass: "from-indigo-50 to-pink-50 border-indigo-200",
  },
  {
    id: "c6",
    emoji: "✨",
    title: "소원 1가지 무조건 들어주기 골드티켓",
    desc: "귀여운 부탁이라면 무엇이든 예스(YES) 해주는 마법의 프리패스!",
    target: "VIP 한정판 쿠폰",
    used: false,
    bgClass: "from-rose-100 via-amber-50 to-pink-100 border-rose-300",
  },
];

export default function WishCouponBook() {
  const [coupons, setCoupons] = useState<CouponItem[]>(INITIAL_COUPONS);
  const [customTitle, setCustomTitle] = useState("");
  const [customDesc, setCustomDesc] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lovepotal_coupons_v2");
      if (saved) {
        setCoupons(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const updateCoupons = (next: CouponItem[]) => {
    setCoupons(next);
    try {
      localStorage.setItem("lovepotal_coupons_v2", JSON.stringify(next));
    } catch {}
  };

  const toggleCouponUse = (id: string) => {
    const next = coupons.map((c) => (c.id === id ? { ...c, used: !c.used } : c));
    const target = next.find((c) => c.id === id);
    if (target?.used) {
      sound.playStamp();
      fireHeartConfetti();
    } else {
      sound.playPop(1);
    }
    updateCoupons(next);
  };

  const handleAddCustomCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;
    const newItem: CouponItem = {
      id: `custom-${Date.now()}`,
      emoji: "💝",
      title: customTitle.trim(),
      desc: customDesc.trim() || "푸푸와 지유만의 달콤한 커스텀 소원 쿠폰이에요 💕",
      target: "커스텀 스페셜 쿠폰",
      used: false,
      bgClass: "from-rose-50 to-amber-50 border-rose-200",
    };
    sound.playChime();
    fireHeartConfetti();
    updateCoupons([newItem, ...coupons]);
    setCustomTitle("");
    setCustomDesc("");
  };

  return (
    <section className="rounded-[2rem] border-2 border-rose-200/80 bg-white/90 p-6 shadow-[0_12px_40px_-12px_rgba(255,105,147,0.2)] backdrop-blur-sm sm:p-8">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100 text-rose-500">
            <Ticket className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-black text-choco-800 sm:text-xl">
              푸푸 &amp; 지유 사랑의 소원 쿠폰북 🎟️
            </h2>
            <p className="text-xs text-choco-600">
              원하는 쿠폰을 터치해서 사용 완료 도장을 찍거나 새 쿠폰을 만들어 보세요!
            </p>
          </div>
        </div>
        <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-extrabold text-rose-600 ring-1 ring-rose-200">
          유효기간: 평생 무제한 ♾️
        </span>
      </div>

      {/* Coupons Grid */}
      <div className="grid gap-3.5 sm:grid-cols-2">
        {coupons.map((coupon) => (
          <motion.div
            key={coupon.id}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toggleCouponUse(coupon.id)}
            className={`group relative cursor-pointer overflow-hidden rounded-3xl border-2 bg-gradient-to-br p-4 transition-all ${coupon.bgClass} ${
              coupon.used ? "opacity-75" : "shadow-sm hover:shadow-md"
            }`}
          >
            {/* Perforated Ticket Cutouts */}
            <div className=" absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-r-2 border-rose-200 bg-white" />
            <div className=" absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-l-2 border-rose-200 bg-white" />

            <div className="flex items-start justify-between gap-2 pl-2 pr-2">
              <div className="flex items-start gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                  {coupon.emoji}
                </span>
                <div>
                  <span className="inline-block rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-extrabold text-rose-500">
                    {coupon.target}
                  </span>
                  <h3 className="mt-1 text-sm font-black text-choco-800">{coupon.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-choco-600">{coupon.desc}</p>
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-dashed border-rose-200/80 pt-2.5 pl-2 pr-2 text-[11px] font-bold">
              <span className="text-choco-600">NO. LOVE-{coupon.id.toUpperCase()}</span>
              {coupon.used ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-500 px-2.5 py-0.5 text-white shadow-sm">
                  <CheckCircle2 className="h-3 w-3" /> 사용 완료 (다시 터치시 복구)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-rose-500 group-hover:underline">
                  <Sparkles className="h-3 w-3" /> 터치해서 쿠폰 사용하기
                </span>
              )}
            </div>

            {/* Big Stamp Overlay when Used */}
            {coupon.used && (
              <motion.div
                initial={{ scale: 2, opacity: 0, rotate: -15 }}
                animate={{ scale: 1, opacity: 1, rotate: -12 }}
                className="pointer-events-none absolute right-4 top-3 rounded-xl border-2 border-rose-500 bg-white/90 px-2.5 py-1 text-xs font-black text-rose-600 shadow"
              >
                💖 사용완료 쾅!
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Add Custom Wish Coupon */}
      <form
        onSubmit={handleAddCustomCoupon}
        className="mt-5 rounded-2xl border border-rose-200 bg-rose-50/50 p-4"
      >
        <div className="mb-2.5 text-xs font-extrabold text-choco-800">
          ✨ 나만의 소원 쿠폰 직접 만들어서 선물하기
        </div>
        <div className="grid gap-2 sm:grid-cols-5">
          <input
            type="text"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            placeholder="쿠폰 이름 (예: 지유가 골라주는 옷 입기권)"
            className="rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-bold text-choco-800 outline-none focus:border-rose-400 sm:col-span-2"
          />
          <input
            type="text"
            value={customDesc}
            onChange={(e) => setCustomDesc(e.target.value)}
            placeholder="쿠폰 설명 (예: 군말 없이 예쁘게 입고 인생네컷 찍기!)"
            className="rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-medium text-choco-800 outline-none focus:border-rose-400 sm:col-span-2"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1 rounded-xl bg-rose-500 px-3 py-2 text-xs font-black text-white shadow-sm transition hover:bg-rose-600"
          >
            <Plus className="h-4 w-4" /> 쿠폰 발행
          </button>
        </div>
      </form>
    </section>
  );
}
