"use client";

import { site } from "@/lib/site-data";

export default function FloatingNav() {
  const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const toBottom = () =>
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });

  return (
    <div className="fnav" aria-label="바로가기">
      <a className="fnav-btn fnav-kakao" href={site.kakao} target="_blank" rel="noopener noreferrer" aria-label="카카오톡 상담">
        <span>카톡</span>
      </a>
      <a className="fnav-btn fnav-tel" href={site.phoneHref} aria-label="전화하기">
        <span>전화</span>
      </a>
      <button type="button" className="fnav-btn fnav-move" onClick={toTop} aria-label="맨 위로">
        <span>▲<small>맨 위</small></span>
      </button>
      <button type="button" className="fnav-btn fnav-move" onClick={toBottom} aria-label="맨 아래로">
        <span>▼<small>맨 아래</small></span>
      </button>
      <style>{`
        .fnav{position:fixed;right:14px;bottom:18px;z-index:90;display:flex;flex-direction:column;gap:8px}
        .fnav-btn{width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;
          border:1px solid rgba(0,0,0,.12);box-shadow:0 4px 12px rgba(0,0,0,.18);font-weight:700;font-size:13px;
          cursor:pointer;text-decoration:none;line-height:1.1;text-align:center;padding:0}
        .fnav-btn span{display:flex;flex-direction:column;align-items:center}
        .fnav-btn small{font-size:10px;font-weight:600;margin-top:1px}
        .fnav-kakao{background:#FEE500;color:#3A1D1D}
        .fnav-tel{background:#1f3a68;color:#fff}
        .fnav-move{background:#fff;color:#1c1b19}
        .fnav-btn:hover{transform:translateY(-2px)}
        @media (max-width:640px){.fnav{right:10px;bottom:14px;gap:6px}.fnav-btn{width:46px;height:46px;font-size:12px}}
      `}</style>
    </div>
  );
}
