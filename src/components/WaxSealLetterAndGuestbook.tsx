"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Sparkles, Edit3, Share2, MessageSquareHeart, Send, Check } from "lucide-react";
import { sound } from "@/lib/sound";
import { fireHeartConfetti, fireSideCannons } from "@/lib/confetti";

interface WaxSealLetterProps {
  senderName: string;
  letterBody: string;
  startDateStr: string;
  onUpdateLetter: (newSender: string, newBody: string) => void;
}

interface GuestNote {
  id: string;
  author: string;
  badge: string;
  content: string;
  color: string;
}

const DEFAULT_NOTES: GuestNote[] = [
  {
    id: "n1",
    author: "축하요정 친구 🧚",
    badge: "1호 축복러",
    content: "푸푸야 지유야!! 드디어 1일이구나 너무너무 축하해!! 둘이 웃는 모습만 봐도 꿀이 뚝뚝 떨어진다 평생 예쁘게 만나!! 💖",
    color: "bg-rose-50 border-rose-200",
  },
  {
    id: "n2",
    author: "곰돌이 응원단 🐻",
    badge: "푸푸 지인",
    content: "세상 다정한 푸푸랑 러블리한 지유님 조합이라니 반칙이야!! 맛있는 거 많이 먹고 행복한 추억 가득 쌓길 바라! 🎉",
    color: "bg-amber-50 border-amber-200",
  },
  {
    id: "n3",
    author: "토끼 팬클럽 🐰",
    badge: "지유 지인",
    content: "우리 예쁜 지유 눈에서 하트 나오는 거 처음 봐!! 두 사람 오늘부터 1일 진심으로 축복하고 100일, 1주년까지 쭉 가자!! 🌸",
    color: "bg-pink-50 border-pink-200",
  },
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
  const [copiedLink, setCopiedLink] = useState(false);

  // Guestbook notes
  const [notes, setNotes] = useState<GuestNote[]>(DEFAULT_NOTES);
  const [noteAuthor, setNoteAuthor] = useState("");
  const [noteContent, setNoteContent] = useState("");

  useEffect(() => {
    setTempSender(senderName);
    setTempBody(letterBody);
  }, [senderName, letterBody]);

  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem("lovepotal_guestbook_v1");
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch {}
  }, []);

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
    onUpdateLetter(tempSender.trim() || "친구가", tempBody.trim() || letterBody);
    setIsEditingLetter(false);
    setIsEnvelopeOpen(true);
    sound.playChime();
    fireHeartConfetti();
  };

  const handleCopyShareUrl = () => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("from", senderName);
    url.searchParams.set("msg", letterBody);
    url.searchParams.set("date", startDateStr);

    navigator.clipboard.writeText(url.toString()).catch(() => {});
    setCopiedLink(true);
    sound.playChime();
    fireHeartConfetti();
    setTimeout(() => setCopiedLink(false), 2800);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    const colors = [
      "bg-rose-50 border-rose-200",
      "bg-amber-50 border-amber-200",
      "bg-pink-50 border-pink-200",
    ];
    const newNote: GuestNote = {
      id: `note-${Date.now()}`,
      author: noteAuthor.trim() || "익명의 축하요정 💕",
      badge: "NEW 메시지",
      content: noteContent.trim(),
      color: colors[notes.length % colors.length],
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    setNoteAuthor("");
    setNoteContent("");
    sound.playChime();
    fireHeartConfetti();
    try {
      localStorage.setItem("lovepotal_guestbook_v1", JSON.stringify(updated));
    } catch {}
  };

  return (
    <section className="rounded-[2rem] border-2 border-rose-200/80 bg-white/90 p-6 shadow-[0_12px_40px_-12px_rgba(255,105,147,0.2)] backdrop-blur-sm sm:p-8">
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
              봉투의 하트 씰링 왁스를 터치해서 편지를 열어보세요!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsEditingLetter(!isEditingLetter)}
            className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 ring-1 ring-rose-200 transition hover:bg-rose-100"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>편지 수정</span>
          </button>

          <button
            onClick={handleCopyShareUrl}
            className="inline-flex items-center gap-1 rounded-full bg-rose-500 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-rose-600"
          >
            {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
            <span>{copiedLink ? "축하 링크 복사 완료!" : "카톡 공유 링크 복사"}</span>
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
              ✏️ 친구에게 보낼 축하 편지 커스텀하기 (저장 후 상단 &#39;카톡 공유 링크 복사&#39;를 누르면 내용 그대로 전달돼요!)
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
            {/* Envelope Flap Lines */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-rose-200/50 to-transparent" />

            <p className="text-xs font-extrabold tracking-widest text-rose-500">
              TO. PUPU 🐻 &amp; JIYU 🐰
            </p>
            <h3 className="mt-1 text-lg font-black text-choco-800">
              {senderName} 보낸 특별한 축하 편지가 도착했어요
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
                To. 세상에서 제일 예쁜 커플, 푸푸 🐻 &amp; 지유 🐰에게
              </span>
              <button
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
              <span>{startDateStr.replace(/-/g, ".")} (설레는 1일차에)</span>
              <span className="text-rose-600">From. {senderName} 💖</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Rolling Paper / Congratulatory Sticky Notes */}
      <div className="mt-8 border-t border-rose-100 pt-6">
        <div className="mb-4 flex items-center gap-1.5 text-sm font-black text-choco-800">
          <MessageSquareHeart className="h-4 w-4 text-rose-500" />
          <span>푸푸♥지유 1일 축하 롤링페이퍼 보드 📝</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {notes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`flex flex-col justify-between rounded-2xl border p-4 shadow-sm ${note.color}`}
            >
              <p className="text-xs font-medium leading-relaxed text-choco-800">{note.content}</p>
              <div className="mt-3 flex items-center justify-between border-t border-black/5 pt-2 text-[11px] font-bold">
                <span className="text-choco-700">{note.author}</span>
                <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] text-rose-500">
                  {note.badge}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add Note Form */}
        <form onSubmit={handleAddNote} className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={noteAuthor}
            onChange={(e) => setNoteAuthor(e.target.value)}
            placeholder="작성자 (예: 친구/푸푸/지유)"
            className=" rounded-xl border border-rose-200 bg-rose-50/40 px-3 py-2 text-xs font-bold text-choco-800 outline-none focus:border-rose-400 sm:w-40"
          />
          <input
            type="text"
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="두 사람에게 귀여운 축하 한마디나 다짐을 남겨보세요! 💕"
            className="flex-1 rounded-xl border border-rose-200 bg-rose-50/40 px-3.5 py-2 text-xs font-medium text-choco-800 outline-none focus:border-rose-400"
          />
          <button
            type="submit"
            className="inline-flex shrink-0 items-center justify-center gap-1 rounded-xl bg-rose-500 px-4 py-2 text-xs font-black text-white shadow-sm transition hover:bg-rose-600"
          >
            <Send className="h-3.5 w-3.5" /> 한마디 남기기
          </button>
        </form>
      </div>
    </section>
  );
}
