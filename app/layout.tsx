import type { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NaverAnalytics from '@/components/NaverAnalytics';
import FloatingNav from '@/components/FloatingNav';

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ilikeinterior.com"),
  title: {
    default: "별내목수 · 아이라이크 인테리어 | 남양주 별내 아파트 목공",
    template: "%s | 별내목수 · 아이라이크 인테리어",
  },
  description:
    "남양주 별내 중심 아파트 인테리어 목공. 비흡연 목수팀, 25년 경력, 30~40대 젊은 팀이 TV 가벽·히든도어·우물천장을 직접 시공합니다. 실제 시공 금액 공개. 전화 010-4551-9870",

  keywords: [
    "별내목수",
    "남양주 아파트 목공",
    "남양주 아파트 목수",
    "별내 아파트 목수",
    "비흡연 목수팀",
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
    title: "별내목수 · 아이라이크 인테리어 | 남양주 별내 아파트 목공",
    description:
      "남양주 별내 중심 아파트 인테리어 목공. 비흡연 목수팀, 25년 경력, 30~40대 젊은 팀이 직접 시공합니다. 실제 시공 금액 공개.",
    siteName: "아이라이크 인테리어",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/image.jpg",
        width: 1536,
        height: 1024,
        alt: "아이라이크 인테리어 로고",
      },
    ],
  },

  verification: {
    google: "FrlQ9gXFPxpx6twr0jQip5_eZ8AJijvTIdIdf5uUBxk",
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
        <NaverAnalytics />
        <FloatingNav />
      </body>
      <GoogleAnalytics gaId="G-XSN11FF3DF" />
    </html>
  );
}
