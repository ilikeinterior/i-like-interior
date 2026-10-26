// @ts-nocheck
// 숫자 3D 장면: 3대째 · 18세 · 25년차 · 흡연자 0명 · 실제 시공 금액
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import font from "three/examples/fonts/helvetiker_bold.typeface.json";

const JOBS = [
  [700, "700만원 · 목공 6일", "운정 해링턴 플레이스 GTX 24평", "히든 도어·MDF 입체 벽·TV 가벽·우물천장까지 한 번에"],
  [410, "410만원 · 목공 3일", "파주 운정 가람마을 44평", "아트월·선반·아치 게이트"],
  [360, "360만원 · 목공 3일", "남양주 별내 리슈빌 33평", "대리석 TV 벽 반매립 가벽·메지·점검구·문선"],
  [110, "110만원 · 목공 1일", "송파 헬리오시티", "대리석 철거 후 바탕부터 · 거실 조명박스·아트월"],
  [860, "860만원 · 목공 7일", "의정부 신곡동 아파트", "TV가벽·MDF패널·마이너스몰딩"],
  [280, "280만원 · 목공 2일", "서울교통공사 지축차량기지 직원 휴게실", "평상마루 · 관공서"],
];
// 숫자 안에 채우는 사진 번호(public/images/num/n<번호>.jpg), JOBS 순서와 같다
const PH = [1, 2, 4, 5, 6, 7];
const SEG = [0, 0.15, 0.3, 0.45, 0.6, 0.92, 1];
const sm = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export function initNumbers3D() {
  const sec = document.getElementById("ss-num");
  if (!sec || sec.dataset.nmInit) return () => {};
  sec.dataset.nmInit = "1";
  const cv = sec.querySelector(".nm-gl");
  const chs = [...sec.querySelectorAll(".nm-ch")];
  const dots = [...sec.querySelectorAll(".nm-dots i")];
  const bar = sec.querySelector(".nm-bar");
  const nm = sec.querySelector(".nm-pname");
  const pd = sec.querySelector(".nm-pdesc");
  const pa = sec.querySelector(".nm-pamt");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const skipBtn = sec.querySelector(".nm-skip");
  const onSkip = () => {
    const y = sec.getBoundingClientRect().top + window.scrollY + sec.offsetHeight;
    window.scrollTo(0, y);
  };
  if (skipBtn) skipBtn.addEventListener("click", onSkip);

  const S = { p: 0 };
  let last = -1,
    lastIdx = -1,
    raf = 0,
    alive = true;
  let inView = false;
  const io = new IntersectionObserver((es) => es.forEach((e) => (inView = e.isIntersecting)), { rootMargin: "100px" });
  io.observe(sec);

  const target = () => {
    const r = sec.getBoundingClientRect();
    const span = Math.max(1, sec.offsetHeight - innerHeight);
    return Math.min(1, Math.max(0, -r.top / span));
  };
  const setText = (p, act) => {
    const ch = p < SEG[1] ? 0 : p < SEG[2] ? 1 : p < SEG[3] ? 2 : p < SEG[4] ? 3 : p < SEG[5] ? 4 : 5;
    if (ch !== last) {
      last = ch;
      chs.forEach((c, i) => c.classList.toggle("on", i === ch));
      dots.forEach((d, i) => d.classList.toggle("on", i === ch));
    }
    if (ch === 4 && act != null && act !== lastIdx) {
      lastIdx = act;
      nm.textContent = JOBS[act][2];
      pd.textContent = JOBS[act][3];
      pa.textContent = JOBS[act][1];
    }
    bar.style.width = p * 100 + "%";
  };

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
  } catch (e) {
    renderer = null;
  }
  if (!renderer) {
    // 3D를 못 쓰는 환경: 글만 단계별로 보여준다
    sec.classList.add("nm-nogl");
    const tick = () => {
      if (!alive) return;
      if (inView) {
        S.p = target();
        const ch = S.p < SEG[5] ? 0 : 5;
        setText(S.p, S.p > SEG[4] ? Math.min(JOBS.length - 1, Math.floor(((S.p - SEG[4]) / (SEG[5] - SEG[4])) * JOBS.length)) : null);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      alive = false;
      if (skipBtn) skipBtn.removeEventListener("click", onSkip);
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }

  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  const scene = new THREE.Scene();
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  const cam = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(-4, 7, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -14;
  key.shadow.camera.right = 14;
  key.shadow.camera.top = 8;
  key.shadow.camera.bottom = -8;
  key.shadow.radius = 6;
  key.shadow.bias = -0.0004;
  scene.add(key);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 40), new THREE.ShadowMaterial({ opacity: 0.22 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.15;
  floor.receiveShadow = true;
  scene.add(floor);
  const f = new FontLoader().parse(font);
  const mat = (c, m = 0.3, r = 0.26) =>
    new THREE.MeshPhysicalMaterial({ color: c, metalness: m, roughness: r, clearcoat: 1, clearcoatRoughness: 0.1 });
  function num(t, size, color) {
    const g = new TextGeometry(t, { font: f, size, depth: size * 0.42, curveSegments: 14, bevelEnabled: true, bevelThickness: size * 0.035, bevelSize: size * 0.025, bevelSegments: 5 });
    g.computeBoundingBox();
    const b = g.boundingBox;
    g.translate(-(b.max.x + b.min.x) / 2, -(b.max.y + b.min.y) / 2, -(b.max.z + b.min.z) / 2);
    const m = new THREE.Mesh(g, mat(color));
    m.castShadow = true;
    m.visible = false;
    scene.add(m);
    return m;
  }
  const NAVY = 0x1f3a68;
  const H = [num("3", 2.7, NAVY), num("18", 2.7, NAVY), num("25", 2.7, NAVY), num("0", 3.2, NAVY)];
  scene.add(cam);
  const TL = new THREE.TextureLoader();
  const TEX = JOBS.map((_, i) => {
    const t = TL.load((window.__NUMPHOTOS && window.__NUMPHOTOS[PH[i] - 1]) || "/images/num/n" + PH[i] + ".jpg");
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  });
  const P = JOBS.map((j, ji) => {
    const grp = new THREE.Group();
    scene.add(grp);
    grp.visible = false;
    const txt = String(j[0]),
      size = 1.5,
      gap = size * 0.1;
    const geos = [];
    let x = 0;
    for (const ch of txt) {
      const g = new TextGeometry(ch, { font: f, size, depth: size * 0.45, curveSegments: 14, bevelEnabled: true, bevelThickness: size * 0.035, bevelSize: size * 0.025, bevelSegments: 5 });
      g.computeBoundingBox();
      const bb = g.boundingBox;
      g.translate(x - bb.min.x, 0, 0);
      x += bb.max.x - bb.min.x + gap;
      geos.push(g);
    }
    const Wt = x - gap,
      Hh = size * 0.74;
    const dm = [];
    geos.forEach((g) => {
      g.translate(-Wt / 2, -Hh / 2, -size * 0.22);
      const pos = g.attributes.position,
        uv = g.attributes.uv;
      for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) + Wt / 2) / Wt, 0.5 + (pos.getY(i) + Hh / 2 - Hh / 2) / (Wt * 0.75));
      uv.needsUpdate = true;
      const m = new THREE.Mesh(g, [
        new THREE.MeshPhysicalMaterial({ map: TEX[ji], color: 0x8a8a8a, roughness: 0.35, metalness: 0, clearcoat: 0.5, clearcoatRoughness: 0.2, envMapIntensity: 0.3 }),
        mat(NAVY),
      ]);
      m.castShadow = true;
      grp.add(m);
      dm.push(m);
    });
    grp.userData = { dm, t0: -1, Wt };
    return grp;
  });

  const SP = 6.2;
  let VW = 1,
    VH = 1;
  function resize() {
    const w = sec.clientWidth || innerWidth,
      h = innerHeight;
    VW = w;
    VH = h;
    renderer.setSize(w, h, false);
    cam.aspect = w / h;
    const mob = w / h < 0.9;
    cam.userData.mob = mob;
    if (mob) cam.setViewOffset(w, h, 0, h * 0.2, w, h);
    else cam.setViewOffset(w, h, -w * 0.22, 0, w, h);
    cam.updateProjectionMatrix();
  }
  addEventListener("resize", resize);
  resize();
  const t0 = performance.now();

  function pose(p, time) {
    const mob = cam.userData.mob,
      k = mob ? 0.62 : 1;
    const W = [[0, 0.15], [0.15, 0.3], [0.3, 0.45], [0.45, 0.6]];
    H.forEach((m, i) => {
      const [a, b] = W[i];
      const inn = sm(a - 0.05, a + 0.02, p),
        out = sm(b - 0.01, b + 0.05, p);
      const vis = inn * (1 - out);
      m.visible = vis > 0.01;
      const hold = (p - a) * 5.5;
      m.rotation.y = (1 - inn) * -2.6 + out * 2.4 + Math.sin(time * 0.6) * 0.22 + hold * 0.35;
      m.rotation.x = Math.sin(time * 0.45) * 0.07;
      m.scale.setScalar(Math.max(0.001, (0.35 + 0.65 * vis) * k));
      m.position.set(0, Math.sin(time * 0.8 + i) * 0.07, (1 - inn) * -4 + out * -3);
    });
    const NP = P.length;
    const tt = Math.min(1, Math.max(0, (p - 0.62) / 0.29));
    const ur = 0.5 + tt * (NP - 1);
    const cc = ur - 0.5,
      ck = Math.floor(cc),
      cI = ck + sm(0.3, 0.7, cc - ck);
    const u = cI + 0.5;
    const act = Math.max(0, Math.min(NP - 1, Math.round(cI)));
    const camXpos = (u - 0.5 - (NP - 1) / 2) * SP * k;
    P.forEach((g, i) => {
      const vis = sm(0.585, 0.64, p);
      g.visible = vis > 0.01;
      const d = Math.abs(u - 0.5 - i);
      const near = Math.max(0, 1 - d * 1.0);
      const fin = 0;
      const left = !mob && i < u - 0.5 ? 1 - sm(0.12, 0.7, d) : 1;
      const sc = (d > 1.4 ? 0 : d > 1.0 ? 1 - (d - 1.0) / 0.4 : 1) * (0.2 + 0.85 * near) * vis * k * left;
      const sc2 = fin > 0 ? Math.max(sc, 0.55 * vis * k * fin) : sc;
      g.scale.setScalar(Math.max(0.001, sc2));
      g.position.set((i - (NP - 1) / 2) * SP * k, Math.sin(time * 0.9 + i * 1.3) * 0.07 + near * 0.1, (1 - vis) * -5);
      const on = near > 0.85 && vis > 0.9;
      if (on && g.userData.t0 < 0) g.userData.t0 = time;
      if (near < 0.3) g.userData.t0 = -1;
      const el = g.userData.t0 < 0 ? 0 : time - g.userData.t0;
      g.userData.dm.forEach((m, di) => {
        const t = Math.min(1, Math.max(0, (el - di * 0.14) / 1.0));
        const e = 1 - Math.pow(1 - t, 3);
        const roll = g.userData.t0 < 0 ? 0 : (1 - e) * Math.PI * 2 * (di % 2 ? -1 : 1);
        m.rotation.x = roll + Math.sin(time * 0.8 + di) * 0.05;
        m.rotation.y = (i - (u - 0.5)) * -0.3 + Math.sin(time * 0.6 + i) * 0.08;
      });
    });
    const inPrice = sm(0.6, 0.64, p),
      fin = 0;
    const cx = inPrice * camXpos * (1 - fin);
    const cz = (mob ? 16 : 12.5) + fin * (mob ? 14 : 26) + inPrice * (mob ? -2 : -0.5);
    if (!cam.userData.mob) cam.setViewOffset(VW, VH, -VW * 0.22 * (1 - fin), 0, VW, VH);
    cam.position.set(cx, 0.4 + fin * 2, cz);
    cam.lookAt(cx * 0.98, fin * 2.6, 0);
    setText(p, act);
  }

  function frame(now) {
    if (!alive) return;
    if (inView) {
      const tg = reduce ? 0.7 : target();
      S.p += (tg - S.p) * (reduce ? 1 : 0.1);
      if (Math.abs(tg - S.p) < 0.0004) S.p = tg;
      pose(S.p, (now - t0) / 1000);
      renderer.render(scene, cam);
    }
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  return () => {
    alive = false;
    if (skipBtn) skipBtn.removeEventListener("click", onSkip);
    cancelAnimationFrame(raf);
    removeEventListener("resize", resize);
    io.disconnect();
    renderer.dispose();
  };
}
