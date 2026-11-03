"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Sparkles,
  Edit3,
  Share2,
  MessageSquareHeart,
  Send,
  Check,
  Trash2,
  Copy,
  X,
  Smartphone,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { fireHeartConfetti, fireSideCannons } from "@/lib/confetti";
import {
  copyTextWithFallback,
  encodeSharePayload,
  decodeSharePayload,
} from "@/lib/shareState";

interface WaxSealLetterProps {
  senderName: string;
  letterBody: string;
  startDateStr: string;
  onUpdateLetter: (newSender: string, newBody: string) => void;
}

export interface GuestNote {
  id: string;
  author: string;
  badge: string;
  content: string;
  color: string;
  createdAt?: string;
}

const DEFAULT_NOTES: GuestNote[] = [
  {
    id: "n1",
    author: "축하요정 단짝친구 🧚",
    badge: "1호 축복러",
    content:
      "푸푸야 지유야!! 11월 1일 커플 탄생 너무너무 축하해!! 광안리 바다보다 더 반짝이는 두 사람, 평생 알콩달콩 예쁘게 만나!! 💖",
    color: "bg-rose-50 border-rose-200",
    createdAt: "2026.11.01",
  },
  {
    id: "n2",
    author: "곰돌이 응원단 🐻",
    badge: "푸푸 지인",
    content:
      "세상 다정한 부산 사나이 푸푸랑 러블리한 지유님 조합이라니 반칙이야!! 전포동 맛집도 많이 다니고 행복한 추억 가득 쌓길 바라! 🎉",
    color: "bg-amber-50 border-amber-200",
    createdAt: "2026.11.01",
  },
  {
    id: "n3",
    author: "토끼 팬클럽 🐰",
    badge: "지유 지인",
    content:
      "우리 예쁜 지유 눈에서 꿀 떨어지는 거 봐!! 두 사람 1일 진심으로 축복하고 100일, 1주년까지 꽃길만 쭉 걷자!! 🌸",
    color: "bg-pink-50 border-pink-200",
    createdAt: "2026.11.01",
  },
];

const BADGE_OPTIONS = ["🧚 단짝친구", "🐻 푸푸", "🐰 지유", "🎉 축하객", "💖 1호 팬"];

const COLOR_OPTIONS = [
  { label: "🌸 핑크", value: "bg-rose-50 border-rose-200" },
  { label: "🍯 옐로", value: "bg-amber-50 border-amber-200" },
  { label: "🍑 피치", value: "bg-pink-50 border-pink-200" },
  { label: "💜 라벤더", value: "bg-purple-50 border-purple-200" },
  { label: "🌿 민트", value: "bg-emerald-50 border-emerald-200" },
];

export default function WaxSealLetterAndGuestbook({
  senderName,
  letterBody,
  startDateStr,
  onUpdateLetter,
}: WaxSealLetterProps) {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [isEditingLetter, setIsEditingLetter] = useState(false);
  const [tempSender, setTempSender] = useState(senderName);
  const [tempBody, setTempBody] = useState(letterBody);

  // Share Modal & Copy states
  const [copiedLink, setCopiedLink] = useState(false);
  const [shareModalUrl, setShareModalUrl] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Guestbook notes
  const [notes, setNotes] = useState<GuestNote[]>(DEFAULT_NOTES);
  const [noteAuthor, setNoteAuthor] = useState("");
  const [noteBadge, setNoteBadge] = useState(BADGE_OPTIONS[0]);
  const [noteColor, setNoteColor] = useState(COLOR_OPTIONS[0].value);
  const [noteContent, setNoteContent] = useState("");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  useEffect(() => {
    setTempSender(senderName);
    setTempBody(letterBody);
  }, [senderName, letterBody]);

  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem("lovepotal_guestbook_v2");
      if (savedNotes) {
        const parsed = JSON.parse(savedNotes);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNotes(parsed);
        }
      }

      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const sParam = params.get("s");
        if (sParam) {
          const decoded = decodeSharePayload<{ notes?: GuestNote[] }>(sParam);
          if (decoded?.notes && Array.isArray(decoded.notes) && decoded.notes.length > 0) {
            setNotes(decoded.notes);
            localStorage.setItem("lovepotal_guestbook_v2", JSON.stringify(decoded.notes));
          }
        }
      }
    } catch {}
  }, []);

  const saveNotes = (updated: GuestNote[]) => {
    setNotes(updated);
    try {
      localStorage.setItem("lovepotal_guestbook_v2", JSON.stringify(updated));
    } catch {}
  };

  const handleOpenEnvelope = () => {
    if (!isEnvelopeOpen) {
      setIsEnvelopeOpen(true);
      sound.playFanfare();
      fireHeartConfetti();
      fireSideCannons();
    } else {
      setIsEnvelopeOpen(false);
      sound.playPop(1);
    }
  };

  const handleSaveCustomLetter = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSender = tempSender.trim() || "너희를 아끼는 단짝 친구";
    const finalBody = tempBody.trim() || letterBody;
    onUpdateLetter(finalSender, finalBody);
    setIsEditingLetter(false);
    setIsEnvelopeOpen(true);
    sound.playChime();
    fireHeartConfetti();
    showToast("💌 축하 편지 내용이 저장되었어요! 이제 카톡 공유 링크를 복사해 보세요.");
  };

  const buildFullShareUrl = (): string => {
    if (typeof window === "undefined") return "";

    // If the user is currently editing the letter, commit their edits automatically
    const activeSender = isEditingLetter ? tempSender.trim() || senderName : senderName;
    const activeBody = isEditingLetter ? tempBody.trim() || letterBody : letterBody;
    if (isEditingLetter) {
      onUpdateLetter(activeSender, activeBody);
      setIsEditingLetter(false);
    }

    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set("from", activeSender);
    url.searchParams.set("msg", activeBody);
    url.searchParams.set("date", startDateStr);

    // Pack rolling paper notes & bucket list into `s`
    let savedBuckets: unknown = undefined;
    let savedCaption: string | undefined = undefined;
    try {
      const rawB = localStorage.getItem("lovepotal_buckets_v2");
      if (rawB) savedBuckets = JSON.parse(rawB);
      const rawC = localStorage.getItem("lovepotal_polaroid_caption_v2");
      if (rawC) savedCaption = rawC;
    } catch {}

    const encoded = encodeSharePayload({
      notes,
      buckets: savedBuckets,
      caption: savedCaption,
    });
    if (encoded) {
      url.searchParams.set("s", encoded);
    }

    return url.toString();
  };

  const handleCopyShareUrl = () => {
    const shareUrl = buildFullShareUrl();
    if (!shareUrl) return;

    copyTextWithFallback(shareUrl);
    setCopiedLink(true);
    setShareModalUrl(shareUrl);
    sound.playFanfare();
    fireHeartConfetti();
    showToast("✅ 축하 링크가 클립보드에 복사되었어요! 카카오톡에 붙여넣기 하세요 💕");
    setTimeout(() => setCopiedLink(false), 3500);
  };

  const handleNativeShare = async () => {
    if (!shareModalUrl) return;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "푸푸 🐻 ♥ 🐰 지유 1일 축하 선물 포털 💝",
          text: `${senderName}가 보낸 푸푸♥지유 커플 탄생 축하 선물이 도착했어요!`,
          url: shareModalUrl,
        });
      } catch {}
    } else {
      copyTextWithFallback(shareModalUrl);
      showToast("📋 클립보드에 링크가 복사되었어요!");
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) {
      showToast("✏️ 롤링페이퍼에 남길 축하 메시지를 입력해 주세요!");
      return;
    }

    const today = new Date();
    const dateLabel = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}.${String(today.getDate()).padStart(2, "0")}`;

    const newNote: GuestNote = {
      id: `note-${Date.now()}`,
      author: noteAuthor.trim() || "익명의 축하요정 💕",
      badge: noteBadge,
      content: noteContent.trim(),
      color: noteColor,
      createdAt: dateLabel,
    };
    const updated = [newNote, ...notes];
    saveNotes(updated);
    setNoteAuthor("");
    setNoteContent("");
    sound.playChime();
    fireHeartConfetti();
    showToast("🎉 롤링페이퍼에 따뜻한 축하 메시지가 등록되었어요!");
  };

  const handleDeleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    saveNotes(updated);
    sound.playPop(0);
    showToast("🗑️ 롤링페이퍼 메모를 삭제했어요.");
  };

  return (
    <section className="relative rounded-[2rem] border-2 border-rose-200/80 bg-white/90 p-6 shadow-[0_12px_40px_-12px_rgba(255,105,147,0.2)] backdrop-blur-sm sm:p-8">
      {/* Toast Feedback Banner */}
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

      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100 text-rose-500">
            <Mail className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-black text-choco-800 sm:text-xl">
              진심을 담은 1일 축하 편지 &amp; 롤링페이퍼 💌
            </h2>
            <p className="text-xs text-choco-600">
              봉투의 하트 씰링 왁스를 터치해서 편지를 열고, 롤링페이퍼도 남겨보세요!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setIsEditingLetter(!isEditingLetter);
              sound.playPop(1);
            }}
            className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 ring-1 ring-rose-200 transition hover:bg-rose-100"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>{isEditingLetter ? "편지 편집 닫기" : "편지 내용 수정"}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyShareUrl}
            className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-3.5 py-1.5 text-xs font-black text-white shadow-sm transition hover:brightness-105 active:scale-95"
          >
            {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
            <span>{copiedLink ? "링크 복사 완료!" : "카톡 공유 링크 복사"}</span>
          </button>
        </div>
      </div>

      {/* Edit Letter Drawer */}
      <AnimatePresence>
        {isEditingLetter && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleSaveCustomLetter}
            className="mb-6 overflow-hidden rounded-2xl border-2 border-rose-200 bg-rose-50/70 p-4"
          >
            <div className="mb-2 text-xs font-black text-choco-800">
              ✏️ 친구에게 보낼 축하 편지 수정하기 (저장 후 &#39;카톡 공유 링크 복사&#39;를 누르면 편지+롤링페이퍼+버킷리스트가 링크에 그대로 담겨요!)
            </div>
            <div className="space-y-2.5">
              <input
                type="text"
                value={tempSender}
                onChange={(e) => setTempSender(e.target.value)}
                placeholder="보내는 사람 이름 (예: 너희의 단짝 친구가)"
                className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-bold text-choco-800 outline-none focus:border-rose-400"
              />
              <textarea
                rows={4}
                value={tempBody}
                onChange={(e) => setTempBody(e.target.value)}
                placeholder="푸푸와 지유에게 전하고 싶은 축하 편지를 적어주세요!"
                className="w-full rounded-xl border border-rose-200 bg-white p-3 text-xs leading-relaxed text-choco-800 outline-none focus:border-rose-400"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingLetter(false)}
                  className="rounded-xl bg-white px-3.5 py-1.5 text-xs font-bold text-choco-600 ring-1 ring-rose-200"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-rose-500 px-4 py-1.5 text-xs font-black text-white shadow-sm hover:bg-rose-600"
                >
                  편지 저장하기 💕
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Wax-Sealed Interactive Envelope */}
      <div className="mx-auto max-w-lg">
        {!isEnvelopeOpen ? (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleOpenEnvelope}
            className="group relative cursor-pointer overflow-hidden rounded-3xl border-2 border-rose-200 bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50 p-8 text-center shadow-md transition"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-rose-200/50 to-transparent" />

            <p className="text-xs font-extrabold tracking-widest text-rose-500">
              TO. PUPU 🐻 &amp; JIYU 🐰
            </p>
            <h3 className="mt-1 text-lg font-black text-choco-800">
              {senderName}가 보낸 특별한 축하 편지가 도착했어요
            </h3>

            {/* Glowing Wax Seal Button */}
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
              className="mx-auto my-6 flex h-24 w-24 flex-col items-center justify-center rounded-full border-4 border-rose-300 bg-gradient-to-br from-rose-500 via-red-500 to-pink-600 text-white shadow-[0_10px_25px_-5px_rgba(225,29,72,0.65)] ring-4 ring-rose-200"
            >
              <span className="text-2xl">💌</span>
              <span className="mt-0.5 text-[10px] font-black tracking-tighter">SEAL OF LOVE</span>
            </motion.div>

            <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-4 py-1 text-xs font-extrabold text-rose-600 shadow-sm group-hover:bg-white">
              <Sparkles className="h-3.5 w-3.5" /> 씰링 왁스를 터치해서 편지 뜯기
            </span>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="relative overflow-hidden rounded-3xl border-2 border-rose-200 bg-[#fffdf9] p-6 shadow-lg sm:p-8"
          >
            <div className="flex items-center justify-between border-b border-dashed border-rose-200 pb-3">
              <span className="text-sm font-black text-rose-600">
                To. 부산에서 제일 예쁜 커플, 푸푸 🐻 &amp; 지유 🐰에게
              </span>
              <button
                type="button"
                onClick={handleOpenEnvelope}
                className="rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-500 hover:bg-rose-100"
              >
                봉투 닫기
              </button>
            </div>

            <p className="mt-4 whitespace-pre-line text-sm font-medium leading-7 text-choco-800 sm:text-base">
              {letterBody}
            </p>

            <div className="mt-6 flex items-center justify-between border-t border-dashed border-rose-200 pt-4 text-xs font-extrabold text-choco-700">
              <span>{startDateStr.replace(/-/g, ".")} (설레는 1일 기념)</span>
              <span className="text-rose-600">From. {senderName} 💖</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Rolling Paper / Congratulatory Sticky Notes */}
      <div className="mt-8 border-t border-rose-100 pt-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-sm font-black text-choco-800">
            <MessageSquareHeart className="h-4 w-4 text-rose-500" />
            <span>푸푸♥지유 1일 축하 롤링페이퍼 보드 📝 ({notes.length}개)</span>
          </div>
          <span className="text-[11px] font-bold text-rose-500">
            ✨ 메모를 남긴 뒤 &#39;카톡 공유 링크 복사&#39;를 누르면 롤링페이퍼도 함께 공유됩니다!
          </span>
        </div>

        {/* Sticky Notes Grid */}
        <div className="grid gap-3 sm:grid-cols-3">
          {notes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`group relative flex flex-col justify-between rounded-2xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${note.color}`}
            >
              <button
                type="button"
                onClick={() => handleDeleteNote(note.id)}
                className="absolute right-2.5 top-2.5 rounded-full bg-white/70 p-1 text-choco-600 opacity-60 transition hover:bg-rose-500 hover:text-white group-hover:opacity-100"
                title="메모 삭제"
              >
                <Trash2 className="h-3 w-3" />
              </button>

              <p className="pr-5 text-xs font-medium leading-relaxed text-choco-800">
                {note.content}
              </p>

              <div className="mt-3 flex items-center justify-between border-t border-black/5 pt-2 text-[11px] font-bold">
                <span className="text-choco-700">{note.author}</span>
                <span className="rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-extrabold text-rose-500 shadow-sm">
                  {note.badge}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add Rolling Paper Form */}
        <form
          onSubmit={handleAddNote}
          className="mt-5 rounded-2xl border border-rose-200 bg-rose-50/40 p-4"
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-black text-choco-800">
              💌 새 롤링페이퍼 포스트잇 붙이기
            </span>

            {/* Color selector */}
            <div className="flex flex-wrap items-center gap-1">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setNoteColor(c.value)}
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold transition ${
                    noteColor === c.value
                      ? "bg-rose-500 text-white shadow-sm"
                      : "bg-white text-choco-700 ring-1 ring-rose-200 hover:bg-rose-50"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Badge Selector */}
          <div className="mb-2.5 flex flex-wrap gap-1.5">
            {BADGE_OPTIONS.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setNoteBadge(b)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-extrabold transition ${
                  noteBadge === b
                    ? "bg-amber-400 text-choco-800 shadow-sm"
                    : "bg-white text-choco-600 ring-1 ring-rose-100 hover:bg-rose-50"
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={noteAuthor}
              onChange={(e) => setNoteAuthor(e.target.value)}
              placeholder="작성자 이름 (예: 단짝친구 / 푸푸 / 지유)"
              className="rounded-xl border border-rose-200 bg-white px-3 py-2.5 text-xs font-bold text-choco-800 outline-none focus:border-rose-400 sm:w-48"
            />
            <input
              type="text"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="푸푸와 지유에게 귀여운 축하 한마디나 다짐을 남겨보세요! 💕"
              className="flex-1 rounded-xl border border-rose-200 bg-white px-3.5 py-2.5 text-xs font-medium text-choco-800 outline-none focus:border-rose-400"
            />
            <button
              type="submit"
              className="inline-flex shrink-0 items-center justify-center gap-1 rounded-xl bg-rose-500 px-5 py-2.5 text-xs font-black text-white shadow-sm transition hover:bg-rose-600 active:scale-95"
            >
              <Send className="h-3.5 w-3.5" /> 롤링페이퍼 등록
            </button>
          </div>
        </form>
      </div>

      {/* Share Link Modal */}
      <AnimatePresence>
        {shareModalUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
            onClick={() => setShareModalUrl(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 16 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-3xl border-2 border-rose-200 bg-white p-6 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setShareModalUrl(null)}
                className="absolute right-4 top-4 rounded-full bg-rose-50 p-1.5 text-choco-600 hover:bg-rose-100"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-2xl">
                  💝
                </div>
                <h3 className="mt-2.5 text-lg font-black text-choco-800">
                  카카오톡 공유 링크가 준비되었어요!
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-choco-600">
                  아래 링크가 클립보드에 자동 복사되었습니다.<br />
                  <b>축하 편지 + 롤링페이퍼({notes.length}개) + 버킷리스트</b>가 모두 포함되어 있어요!
                </p>
              </div>

              <div className="mt-4">
                <input
                  type="text"
                  readOnly
                  value={shareModalUrl}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                  className="w-full rounded-xl border border-rose-200 bg-rose-50/60 px-3 py-2.5 text-xs font-mono text-choco-700 outline-none"
                />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    copyTextWithFallback(shareModalUrl);
                    showToast("✅ 링크가 다시 복사되었어요! 카톡 채팅방에 붙여넣기 하세요.");
                  }}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-500 py-3 text-xs font-black text-white shadow-sm hover:bg-rose-600"
                >
                  <Copy className="h-4 w-4" /> 링크 복사하기
                </button>

                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-400 py-3 text-xs font-black text-choco-800 shadow-sm hover:bg-amber-500"
                >
                  <Smartphone className="h-4 w-4" /> 카톡/모바일 공유창 열기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
