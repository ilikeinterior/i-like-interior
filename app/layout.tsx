import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: "별내목수 · 아이라이크 인테리어",
  description:
    "운정·파주 인테리어 전문. TV벽, 히든도어, 우물천장, 맞춤 목공 시공.",

  keywords: [
    "파주 인테리어",
    "운정 인테리어",
    "별내목수",
    "아이라이크 인테리어",
    "TV벽 시공",
    "히든도어",
    "우물천장",
    "목공 인테리어",
    "상가 인테리어",
    "아파트 인테리어"
  ],

  openGraph: {
    title: "별내목수 · 아이라이크 인테리어",
    description:
      "운정·파주 인테리어 전문. TV벽, 히든도어, 우물천장, 맞춤 목공 시공.",
    siteName: "아이라이크 인테리어",
    locale: "ko_KR",
    type: "website",
  },

  verification: {
    other: {
      "naver-site-verification": "1720cc600690f9c8a3282168fc7ecec8bb3a8a5b",
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}