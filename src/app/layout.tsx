import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "푸푸 🐻 ♥ 🐰 지유 오늘부터 1일! | 커플 탄생 축하 선물 포털",
  description:
    "세상에서 제일 잘 어울리는 곰돌이 푸푸와 토끼 지유의 설레는 1일차를 축하하는 스페셜 러브 포털 💝",
  openGraph: {
    title: "푸푸 🐻 ♥ 🐰 지유 오늘부터 1일 축하해! 💝",
    description:
      "친구가 준비한 1일차 커플 선물 상자가 도착했어요! 연애계약서, 소원쿠폰북, 데이트 뽑기까지 지금 열어보세요 ✨",
    images: ["/hero-couple.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen antialiased selection:bg-rose-200 selection:text-rose-900">
        {children}
      </body>
    </html>
  );
}
