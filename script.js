const cases = [
  {
    id: "nlo",
    title: "NLO",
    type: "Internet Market",
    tags: ["Interface", "E-comerce", "CJM", "User Flow", "Mind Map"],
    image: "./assets/nlo.png",
  },
  {
    id: "skills",
    title: "4Skills",
    type: "Cybersport Team",
    tags: ["Brand", "Logo", "Media", "Identity", "Merch"],
    image: "./assets/skills.png",
  },
  {
    id: "blend",
    title: "Blend",
    type: "Low-Code Platform",
    tags: ["UX-UI", "Inf.Architecture", "UX-Reserch", "A/B Test"],
    image: "./assets/blend.png",
  },
];

const timing = {
  resize: 190,
  textDelay: 210,
  text: 320,
  swipe: 460,
};

const state = {
  current: 0,
  locked: false,
  dragging: false,
  startX: 0,
  startY: 0,
  x: 0,
  y: 0,
  startedAt: 0,
  reduceMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
};

const els = {
  page: document.querySelector(".card-page"),
  hero: document.querySelector(".hero"),
  heroShell: document.querySelector(".hero-shell"),
  heroPhoto: document.querySelector(".hero__photo"),
  about: document.querySelector(".about"),
  activeVisual: document.getElementById("activeVisual"),
  behindVisual: document.getElementById("behindVisual"),
  caseCard: document.getElementById("caseCard"),
  titlePill: document.getElementById("titlePill"),
  titleCurrent: document.getElementById("titleCurrent"),
  titleNext: document.getElementById("titleNext"),
  typePill: document.getElementById("typePill"),
  typeCurrent: document.getElementById("typeCurrent"),
  typeNext: document.getElementById("typeNext"),
  tagsRow: document.getElementById("tagsRow"),
  nextButton: document.getElementById("nextButton"),
  pager: document.getElementById("pager"),
  measureTitle: document.getElementById("measureTitle"),
  measureType: document.getElementById("measureType"),
  measureTag: document.getElementById("measureTag"),
};

function modulo(value, length) {
  return ((value % length) + length) % length;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, state.reduceMotion ? 1 : ms));
}

function measurePill(text, type) {
  const measure = type === "title" ? els.measureTitle : type === "type" ? els.measureType : els.measureTag;
  const padding = 12;
  const min = type === "title" ? 24 : type === "type" ? 24 : 14;
  measure.textContent = text || "";
  return Math.max(min, Math.ceil(measure.getBoundingClientRect().width + padding));
}

function setPillText(config, item) {
  config.current.textContent = item[config.key];
  config.next.textContent = "";
  config.pill.classList.remove("is-changing-text");
  config.pill.style.width = `${measurePill(item[config.key], config.type)}px`;
}

function settlePill(config, item) {
  config.pill.classList.add("is-resetting");
  config.pill.classList.remove("is-changing-text");
  config.current.textContent = item[config.key];
  config.next.textContent = "";
  config.pill.style.width = `${measurePill(item[config.key], config.type)}px`;
  config.pill.offsetHeight;
  config.pill.classList.remove("is-resetting");
}

async function morphPill(config, fromItem, toItem) {
  config.current.textContent = fromItem[config.key];
  config.next.textContent = toItem[config.key];
  config.pill.classList.remove("is-changing-text");
  config.pill.style.width = `${measurePill(toItem[config.key], config.type)}px`;

  await wait(timing.textDelay);
  config.pill.classList.add("is-changing-text");
  await wait(timing.text);
  settlePill(config, toItem);
}

const titleConfig = {
  pill: els.titlePill,
  current: els.titleCurrent,
  next: els.titleNext,
  key: "title",
  type: "title",
};

const typeConfig = {
  pill: els.typePill,
  current: els.typeCurrent,
  next: els.typeNext,
  key: "type",
  type: "type",
};

function createTagPill(currentText, nextText, width) {
  const pill = document.createElement("div");
  pill.className = "motion-pill tag-pill";
  pill.style.width = `${width}px`;
  pill.innerHTML = `
    <span class="pill-stack">
      <span class="pill-label pill-label--current">${currentText || ""}</span>
      <span class="pill-label pill-label--next">${nextText || ""}</span>
    </span>
  `;
  return pill;
}

function renderTags(item) {
  els.tagsRow.innerHTML = "";
  item.tags.forEach((tag) => {
    els.tagsRow.appendChild(createTagPill(tag, "", measurePill(tag, "tag")));
  });
}

async function morphTags(fromItem, toItem) {
  const slots = Math.max(fromItem.tags.length, toItem.tags.length);
  els.tagsRow.innerHTML = "";

  for (let index = 0; index < slots; index += 1) {
    const current = fromItem.tags[index] || "";
    const next = toItem.tags[index] || "";
    const startWidth = current ? measurePill(current, "tag") : 0;
    const pill = createTagPill(current, next, startWidth);
    if (!current) pill.style.opacity = "0";
    els.tagsRow.appendChild(pill);
  }

  window.getComputedStyle(els.tagsRow).width;

  [...els.tagsRow.children].forEach((pill, index) => {
    const next = toItem.tags[index] || "";
    const targetWidth = next ? measurePill(next, "tag") : 0;
    pill.style.width = `${targetWidth}px`;
    pill.style.opacity = next ? "1" : "0";
    pill.classList.toggle("is-removing", !next);
  });

  await wait(timing.textDelay);

  [...els.tagsRow.children].forEach((pill, index) => {
    if (toItem.tags[index]) pill.classList.add("is-changing-text");
  });

  await wait(timing.text);
  renderTags(toItem);
}

function setVisual(el, item) {
  cases.forEach((caseItem) => el.classList.remove(`case-visual--${caseItem.id}`));
  el.classList.add(`case-visual--${item.id}`);
  el.innerHTML = `<img src="${item.image}" alt="" draggable="false" />`;

  const img = el.querySelector("img");
  img.addEventListener(
    "error",
    () => {
      el.innerHTML = `<span class="case-fallback">${item.title}</span>`;
    },
    { once: true },
  );
}

function buildPager() {
  els.pager.innerHTML = cases.map(() => "<span></span>").join("");
}

function updatePager() {
  [...els.pager.children].forEach((dot, index) => {
    dot.classList.toggle("is-active", index === state.current);
  });
  els.caseCard.dataset.case = cases[state.current].id;
}

function setDrag(x, y) {
  const rotate = clamp(x / 12, -17, 17);
  const distance = Math.min(180, Math.hypot(x, y));
  const scale = 1 - distance / 1800;

  state.x = x;
  state.y = y;
  els.activeVisual.style.setProperty("--drag-x", `${x}px`);
  els.activeVisual.style.setProperty("--drag-y", `${y}px`);
  els.activeVisual.style.setProperty("--drag-rotate", `${rotate}deg`);
  els.activeVisual.style.setProperty("--drag-scale", String(scale));
}

function resetDrag() {
  setDrag(0, 0);
  els.activeVisual.classList.remove("is-dragging");
}

function settleActiveVisual(item) {
  els.activeVisual.classList.add("is-resetting");
  setVisual(els.activeVisual, item);
  els.activeVisual.classList.remove("is-swiping");
  resetDrag();
  els.activeVisual.style.removeProperty("--exit-x");
  els.activeVisual.style.removeProperty("--exit-y");
  els.activeVisual.style.removeProperty("--exit-rotate");
  els.activeVisual.offsetHeight;
  els.activeVisual.classList.remove("is-resetting");
}

function startDrag(event) {
  if (state.locked) return;
  state.dragging = true;
  state.startX = event.clientX;
  state.startY = event.clientY;
  state.startedAt = performance.now();
  els.activeVisual.classList.add("is-dragging");
  els.activeVisual.setPointerCapture(event.pointerId);
}

function moveDrag(event) {
  if (!state.dragging) return;
  event.preventDefault();
  setDrag(event.clientX - state.startX, event.clientY - state.startY);
}

function endDrag(event) {
  if (!state.dragging) return;
  state.dragging = false;
  const elapsed = Math.max(1, performance.now() - state.startedAt);
  const velocity = Math.hypot(state.x, state.y) / elapsed;
  const shouldSwipe = Math.abs(state.x) > 92 || Math.hypot(state.x, state.y) > 118 || velocity > 0.65;

  if (event.pointerId !== undefined && els.activeVisual.hasPointerCapture(event.pointerId)) {
    els.activeVisual.releasePointerCapture(event.pointerId);
  }

  if (shouldSwipe) {
    const exitX = state.x === 0 ? 260 : Math.sign(state.x) * Math.max(260, Math.abs(state.x) * 2.4);
    const exitY = state.y === 0 ? -150 : state.y * 2.1;
    goToNext(exitX, exitY);
    return;
  }

  resetDrag();
}

async function goToNext(exitX = 260, exitY = -150) {
  if (state.locked) return;
  state.locked = true;

  const fromItem = cases[state.current];
  const nextIndex = modulo(state.current + 1, cases.length);
  const toItem = cases[nextIndex];
  const exitRotate = clamp(exitX / 18, -18, 18);

  setVisual(els.behindVisual, toItem);
  els.behindVisual.classList.add("is-ready");

  els.activeVisual.classList.remove("is-dragging");
  els.activeVisual.style.setProperty("--exit-x", `${exitX}px`);
  els.activeVisual.style.setProperty("--exit-y", `${exitY}px`);
  els.activeVisual.style.setProperty("--exit-rotate", `${exitRotate}deg`);
  els.activeVisual.classList.add("is-swiping");

  const titleMotion = morphPill(titleConfig, fromItem, toItem);
  const typeMotion = morphPill(typeConfig, fromItem, toItem);
  const tagsMotion = morphTags(fromItem, toItem);

  await Promise.all([wait(timing.swipe), titleMotion, typeMotion, tagsMotion]);
  state.current = nextIndex;
  settleActiveVisual(toItem);
  els.behindVisual.classList.remove("is-ready");
  updatePager();

  await wait(80);
  setVisual(els.behindVisual, cases[modulo(state.current + 1, cases.length)]);
  state.locked = false;
}

function handleKey(event) {
  if (event.key === "Enter" || event.key === " " || event.key === "ArrowRight") {
    event.preventDefault();
    goToNext(260, -150);
  }
}

function setupScrollAnimations() {
  const revealItems = document.querySelectorAll(".reveal-on-scroll");
  const counters = document.querySelectorAll("[data-count]");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.18 },
  );

  revealItems.forEach((item) => observer.observe(item));

  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.6 },
  );

  counters.forEach((counter) => countObserver.observe(counter));
}

function animateCount(el) {
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  if (state.reduceMotion || !Number.isFinite(target)) {
    el.textContent = `${target}${suffix}`;
    return;
  }

  const duration = 760;
  const start = performance.now();

  function tick(now) {
    const progress = clamp((now - start) / duration, 0, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = `${Math.round(target * eased)}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

function updateScrollMotion() {
  const viewport = window.innerHeight || document.documentElement.clientHeight;

  if (els.hero && els.heroShell) {
    const fullHeight = Math.max(viewport, 548);
    const foldedHeight = Math.min(548, fullHeight);
    const foldDistance = Math.max(1, fullHeight - foldedHeight);
    const shellRect = els.heroShell.getBoundingClientRect();
    const heroProgress = state.reduceMotion ? 0 : clamp(-shellRect.top / foldDistance, 0, 1);
    const heroHeight = fullHeight - (fullHeight - foldedHeight) * heroProgress;

    els.heroShell.style.height = `${fullHeight}px`;
    els.hero.style.setProperty("--hero-current-height", `${heroHeight}px`);
    els.hero.classList.toggle("is-folded", heroProgress > 0.98);

    if (els.heroPhoto && !state.reduceMotion) {
      els.heroPhoto.style.setProperty("--hero-shift", `${heroProgress * 18}px`);
    }
  }

  if (els.about) {
    const rect = els.about.getBoundingClientRect();
    const start = viewport * 0.92;
    const end = viewport * 0.45;
    const progress = clamp((start - rect.top) / Math.max(1, start - end), 0, 1);
    els.about.style.setProperty("--reveal", progress.toFixed(3));
    els.about.classList.toggle("is-readable", progress > 0.88 || state.reduceMotion);
  }

}

function setupScrollMotion() {
  let ticking = false;

  function requestTick() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateScrollMotion();
      ticking = false;
    });
  }

  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", requestTick);
  updateScrollMotion();
}

function setupContactLinks() {
  document.querySelectorAll('.contact-tile[href="#"]').forEach((link) => {
    link.addEventListener("click", (event) => event.preventDefault());
  });
}

function setupAnimatedBadges() {
  document.querySelectorAll(".badge--animated").forEach((badge) => {
    badge.addEventListener("click", () => {
      if (state.reduceMotion) return;
      badge.classList.remove("is-playing");
      badge.offsetHeight;
      badge.classList.add("is-playing");
      window.setTimeout(() => badge.classList.remove("is-playing"), 340);
    });
  });
}

function initCases() {
  buildPager();
  const item = cases[state.current];
  setPillText(titleConfig, item);
  setPillText(typeConfig, item);
  renderTags(item);
  setVisual(els.activeVisual, item);
  setVisual(els.behindVisual, cases[1]);
  updatePager();

  els.activeVisual.addEventListener("pointerdown", startDrag);
  window.addEventListener("pointermove", moveDrag, { passive: false });
  window.addEventListener("pointerup", endDrag);
  window.addEventListener("pointercancel", endDrag);
  els.activeVisual.addEventListener("keydown", handleKey);
  els.nextButton.addEventListener("click", () => goToNext(260, -150));
}

function init() {
  initCases();
  setupScrollAnimations();
  setupScrollMotion();
  setupAnimatedBadges();
  setupContactLinks();
}

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(init);
} else {
  init();
}
