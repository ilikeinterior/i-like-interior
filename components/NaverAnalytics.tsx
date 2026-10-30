'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

declare global {
  interface Window {
    wcs?: unknown;
    wcs_add?: Record<string, string>;
    wcs_do?: () => void;
  }
}

const NAVER_WA_ID = 'bdacc379f63c18';

export default function NaverAnalytics() {
  const pathname = usePathname();
  const ready = useRef(false);
  const firstRender = useRef(true);

  // 페이지를 이동할 때마다 네이버 분석에 조회를 알린다 (첫 접속은 onLoad에서 처리)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (ready.current && window.wcs_do) {
      window.wcs_do();
    }
  }, [pathname]);

  return (
    <Script
      src="https://wcs.pstatic.net/wcslog.js"
      strategy="afterInteractive"
      onLoad={() => {
        window.wcs_add = window.wcs_add || {};
        window.wcs_add['wa'] = NAVER_WA_ID;
        if (window.wcs && window.wcs_do) {
          window.wcs_do();
          ready.current = true;
        }
      }}
    />
  );
}
