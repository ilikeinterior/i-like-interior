"use client";

import { useEffect } from "react";

// 새 메인 디자인의 스크롤 효과 (진행 막대, 글자 채움, 진행 단계, 사진 띠 시차, 등장 효과)
export default function HomeEffects() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("nw-js");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: Array<() => void> = [];
    // 숫자 3D 장면: 화면 가까이 왔을 때만 불러온다(첫 화면을 가볍게)
    {
      const sec = document.getElementById("ss-num");
      if (sec && "IntersectionObserver" in window) {
        let stop: (() => void) | undefined;
        let gone = false;
        const lio = new IntersectionObserver(
          (es) => {
            if (!es.some((e) => e.isIntersecting)) return;
            lio.disconnect();
            import("./numbers3d").then((m) => {
              if (!gone) stop = m.initNumbers3D();
            });
          },
          { rootMargin: "1500px 0px" }
        );
        lio.observe(sec);
        cleanups.push(() => {
          gone = true;
          lio.disconnect();
          if (stop) stop();
        });
      }
    }

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



    // 사진 구역: 3장이 계속 돌아가며 바뀐다(사진 풀에서 현재 보이지 않는 것으로 교체)
    {
      const pool = ["strip-1", "strip-2", "strip-3", "hero-1", "hero-2", "hero-3", "hero-4", "hero-5", "hero-6", "hero-7"];
      const imgs = Array.from(document.querySelectorAll<HTMLImageElement>(".nw-ph img"));
      const shown: string[] = [];
      const order = pool.slice();
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
      imgs.forEach((img, i) => {
        shown[i] = order[i];
        img.src = "/images/hero/" + order[i] + ".jpg";
        img.style.transition = "opacity .5s ease";
      });
      if (!reduce && imgs.length) {
        let slot = 0;
        const swap = () => {
          const img = imgs[slot % imgs.length];
          const idx = slot % imgs.length;
          const cand = pool.filter((n) => shown.indexOf(n) < 0);
          const next = cand[Math.floor(Math.random() * cand.length)];
          slot++;
          if (!next) return;
          const pre = new Image();
          pre.onload = () => {
            img.style.opacity = "0";
            window.setTimeout(() => {
              img.src = pre.src;
              shown[idx] = next;
              img.style.opacity = "1";
            }, 500);
          };
          pre.src = "/images/hero/" + next + ".jpg";
        };
        const timer = window.setInterval(swap, 3500);
        cleanups.push(() => window.clearInterval(timer));
      }
    }

    // 줄바꿈: 쉼표·마침표 단위로 묶어서 글자 수로 중간에 끊기지 않게
    {
      const sel = ".section-head h2, .section-head p, .feature-card h3, .feature-card .desc, .work-card h4, .work-card .desc, .b-title, .nw-sub, .nw-body, .nw-lead, .nw-proof, .pl-list li, .nw-h";
      document.querySelectorAll<HTMLElement>(sel).forEach((el) => {
        if (el.dataset.nwCl) return;
        el.dataset.nwCl = "1";
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        const nodes: Text[] = [];
        let n: Node | null;
        while ((n = walker.nextNode())) nodes.push(n as Text);
        nodes.forEach((tn) => {
          const par = tn.parentElement;
          if (!par || par.closest(".nw-amt, .nw-cnt, .nw-w, .nw-cycle, [data-scrub]")) return;
          const txt = tn.textContent || "";
          const parts = txt.split(/(?<=[,.!?])\s+/);
          if (parts.length < 2) return;
          const frag = document.createDocumentFragment();
          parts.forEach((s, i) => {
            const sp = document.createElement("span");
            sp.className = "nw-cl";
            sp.textContent = s;
            frag.appendChild(sp);
            if (i < parts.length - 1) frag.appendChild(document.createTextNode(" "));
          });
          tn.replaceWith(frag);
        });
      });
    }

    // 금액 숫자가 올라가는 효과
    if (!reduce && "IntersectionObserver" in window) {
      const money = Array.from(
        document.querySelectorAll<HTMLElement>(".feature-card .price, .work-card .price-tag, .blog-item .b-price, .work-card .nw-amt, .nw-cnt")
      );
      let alive = true;
      const mio = new IntersectionObserver(
        (es) => {
          es.forEach((e) => {
            if (!e.isIntersecting) return;
            mio.unobserve(e.target);
            const el = e.target as HTMLElement;
            const tn = Array.from(el.childNodes).find(
              (n) => n.nodeType === 3 && /\d/.test(n.textContent || "")
            ) as Text | undefined;
            const m = tn && (tn.textContent || "").match(/^(\s*)(\d[\d,]*)([\s\S]*)$/);
            if (!tn || !m) return;
            const target = parseInt(m[2].replace(/,/g, ""), 10);
            if (!isFinite(target) || target <= 0) return;
            const t0 = performance.now();
            const dur = 1200;
            const step = (now: number) => {
              if (!alive) return;
              const k = Math.min(1, (now - t0) / dur);
              const v = target * (1 - Math.pow(1 - k, 3));
              tn.textContent = m[1] + Math.round(v).toLocaleString("ko-KR") + m[3];
              if (k < 1) requestAnimationFrame(step);
              else el.classList.add("nw-done");
            };
            tn.textContent = m[1] + "0" + m[3];
            requestAnimationFrame(step);
          });
        },
        { threshold: 0.6 }
      );
      money.forEach((el) => {
        el.classList.add("nw-money");
        mio.observe(el);
      });
      cleanups.push(() => {
        alive = false;
        mio.disconnect();
      });
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
