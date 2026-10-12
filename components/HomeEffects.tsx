"use client";

import { useEffect } from "react";

// 새 메인 디자인의 스크롤 효과 (진행 막대, 글자 채움, 진행 단계, 사진 띠 시차, 등장 효과)
export default function HomeEffects() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("nw-js");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: Array<() => void> = [];

    // 제목은 줄 단위로 나눠서 마스크 등장
    document.querySelectorAll<HTMLElement>("h2.nw-h.nw-rv").forEach((h) => {
      if (h.dataset.nwSplit) return;
      h.dataset.nwSplit = "1";
      const parts = h.innerHTML.split(/<br\s*\/?>/i);
      h.innerHTML = parts
        .map((p) => '<span class="nw-ln"><span class="nw-li">' + p + "</span></span>")
        .join("");
    });

    // 단어별 글자 채움
    const sc = document.querySelector<HTMLElement>("[data-scrub]");
    let words: HTMLElement[] = [];
    if (sc && !sc.dataset.nwSplit) {
      sc.dataset.nwSplit = "1";
      const lines = sc.querySelectorAll<HTMLElement>(".nw-scl");
      lines.forEach((ln) => {
        const txt = (ln.textContent || "").trim().split(/\s+/);
        ln.innerHTML = txt.map((w) => '<span class="nw-w">' + w + "</span>").join(" ");
      });
      words = Array.from(sc.querySelectorAll<HTMLElement>(".nw-w"));
    }

    // 등장 효과
    const els = Array.from(document.querySelectorAll<HTMLElement>(".nw-rv"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("nw-in"));
    } else {
      const io = new IntersectionObserver(
        (es) => {
          es.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("nw-in");
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
      );
      els.forEach((e) => io.observe(e));
      cleanups.push(() => io.disconnect());
    }

    const prog = document.querySelector<HTMLElement>(".nw-progress");
    const slides = document.querySelector<HTMLElement>(".nw-slides");
    const phs = Array.from(document.querySelectorAll<HTMLElement>(".nw-ph"));
    const steps = Array.from(document.querySelectorAll<HTMLElement>(".nw-step"));
    const stl = document.querySelector<HTMLElement>(".nw-stline b");
    const stol = document.querySelector<HTMLElement>(".nw-steps");
    const spd = [-0.12, -0.2, -0.07];
    let base: number[] = [];
    let vh = window.innerHeight;
    let cur = window.scrollY;
    let on = -1;
    let raf = 0;

    const measure = () => {
      vh = window.innerHeight;
      base = phs.map((p) => {
        const s = p.style.translate;
        p.style.translate = "";
        const r = p.getBoundingClientRect();
        const o = r.top + window.scrollY + r.height / 2;
        p.style.translate = s;
        return o;
      });
    };
    measure();
    window.addEventListener("load", measure);
    window.addEventListener("resize", measure);

    const scrub = () => {
      if (!sc) return;
      const r = sc.getBoundingClientRect();
      let p = (vh * 0.82 - r.top) / (vh * 0.5 + r.height * 0.6);
      p = Math.max(0, Math.min(1, p));
      const n = reduce ? words.length : Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle("nw-on", i < n));
    };

    const frame = () => {
      const t = window.scrollY;
      cur += (t - cur) * (reduce ? 1 : 0.085);
      if (Math.abs(t - cur) < 0.05) cur = t;
      const H = document.documentElement.scrollHeight - vh;
      if (prog) prog.style.transform = "scaleX(" + (H > 0 ? cur / H : 0) + ")";
      if (!reduce) {
        if (slides) slides.style.translate = "0 " + -Math.min(cur, 800) * 0.06 + "px";
        phs.forEach((p, i) => {
          const off = cur + vh / 2 - base[i];
          p.style.translate = "0 " + (off * spd[i % 3]).toFixed(1) + "px";
        });
      }
      if (stol && stl) {
        const r = stol.getBoundingClientRect();
        const k = Math.max(0, Math.min(1, (vh * 0.55 - r.top) / (r.height * 0.9)));
        stl.style.transform = "scaleY(" + k.toFixed(4) + ")";
        let best = -1;
        steps.forEach((s, i) => {
          if (s.getBoundingClientRect().top < vh * 0.62) best = i;
        });
        if (best !== on) {
          on = best;
          steps.forEach((s, i) => s.classList.toggle("nw-on", i === best));
        }
      }
      scrub();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", measure);
      window.removeEventListener("resize", measure);
      cleanups.forEach((c) => c());
      root.classList.remove("nw-js");
    };
  }, []);

  return null;
}
