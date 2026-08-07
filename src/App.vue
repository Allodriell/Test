<template>
  <div class="demo-shell" :style="demoShellStyle">
    <div class="demo-device">
      <div class="demo-device__inner">
        <img class="demo-device__mockup" :src="mockupScene" alt="" draggable="false" aria-hidden="true" />
        <div class="phone-frame" aria-label="iPhone 16 preview">
          <span class="phone-frame__island" aria-hidden="true"></span>
          <div ref="scrollViewport" class="phone-frame__screen" :class="{ 'is-loading': loadingMounted }">
            <div
              v-if="loadingMounted"
              class="loading-overlay"
              :class="{ 'is-leaving': loadingLeaving }"
              role="status"
              aria-live="polite"
            >
              <div class="loading-overlay__message">
                <p :key="loadingGreetingIndex" class="loading-greeting">{{ activeLoadingMessage }}</p>
              </div>
              <p class="loading-status" aria-label="Loading">
                Loading<span class="loading-dots" aria-hidden="true">
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </span>
              </p>
            </div>
            <main class="card-page" aria-label="Seraphim Belousov digital card">
    <section
      ref="heroShell"
      class="hero-shell"
      :style="heroShellStyle"
      aria-label="Intro fold stage"
    >
      <section
        ref="hero"
        class="hero"
        :class="{ 'is-folded': heroFolded }"
        :style="heroStyle"
        id="top"
        aria-label="Intro"
      >
        <div class="hero__media">
          <img
            ref="heroPhotoEl"
            class="hero__photo"
            :style="heroPhotoStyle"
            :src="heroPhoto"
            alt=""
            draggable="false"
          />
        </div>

        <div class="hero__identity reveal-on-scroll is-visible">
          <div class="hero__me">
            <div class="hero__subtitle" aria-label="Design Engineer">
              <img :src="designText" alt="Design" draggable="false" />
              <img :src="engineerText" alt="Engineer" draggable="false" />
            </div>
            <div class="hero__name" aria-label="Belousov Seraphim">
              <div class="hero__name-line hero__name-line--surname">
                <img :src="belousovText" alt="Belousov" draggable="false" />
              </div>
              <div class="hero__name-line hero__name-line--name">
                <img :src="seraphimText" alt="Seraphim" draggable="false" />
              </div>
            </div>
          </div>
          <p class="hero__caption">Building thoughtful digital experiences.</p>
        </div>
      </section>
    </section>

    <section class="stats" aria-label="Portfolio stats">
      <div
        v-for="(stat, index) in stats"
        :key="stat.label"
        class="stats__row reveal-on-scroll"
      >
        <AnimatedBadge class="stats__label" :label="stat.label" />
        <span class="stats__value" :data-stat-index="index">{{ stat.display }}</span>
      </div>
    </section>

    <section
      ref="aboutEl"
      class="about"
      :class="{ 'is-readable': aboutReadable }"
      :style="aboutStyle"
      id="about"
      aria-label="About me"
    >
      <div ref="aboutInnerEl" class="about__inner">
        <div ref="aboutTitleEl" class="section-title section-title--light reveal-on-scroll">
          <p class="section-title__script">A designer's soul.</p>
          <p class="section-title__mono">An engineer's mind.</p>
        </div>

        <div class="video-frame" aria-label="Video frame"></div>

        <p ref="aboutCopyEl" class="about__copy" aria-label="About text">
          <span
            v-for="(line, index) in aboutLines"
            :key="line"
            class="reveal-line"
            :style="{ '--i': index }"
          >
            <span>{{ line }}</span>
          </span>
        </p>
      </div>
    </section>

    <section class="cases" id="cases" aria-label="Selected cases">
      <article class="case-card" :data-case="currentCase.id">
        <div class="case-card__title-row">
          <div
            class="motion-pill title-pill"
            :class="{ 'is-changing-text': titlePill.changing, 'is-resetting': titlePill.resetting }"
          >
            <span class="pill-sizer" aria-hidden="true">{{ titlePill.changing ? titlePill.next : titlePill.current }}</span>
            <span class="pill-stack">
              <span class="pill-label pill-label--current">{{ titlePill.current }}</span>
              <span class="pill-label pill-label--next">{{ titlePill.next }}</span>
            </span>
          </div>
          <div
            class="motion-pill type-pill"
            :class="{ 'is-changing-text': typePill.changing, 'is-resetting': typePill.resetting }"
          >
            <span class="pill-sizer" aria-hidden="true">{{ typePill.changing ? typePill.next : typePill.current }}</span>
            <span class="pill-stack">
              <span class="pill-label pill-label--current">{{ typePill.current }}</span>
              <span class="pill-label pill-label--next">{{ typePill.next }}</span>
            </span>
          </div>
        </div>

        <div class="image-stage">
          <div
            class="case-visual case-visual--behind"
            :class="[`case-visual--${behindCase.id}`, { 'is-ready': behindReady }]"
          >
            <img :src="behindCase.image" alt="" draggable="false" />
          </div>
          <div
            ref="activeVisual"
            class="case-visual case-visual--active"
            :class="activeVisualClasses"
            :style="activeVisualStyle"
            role="button"
            tabindex="0"
            aria-label="Swipe case image"
            @pointerdown="startDrag"
            @keydown="handleCaseKey"
          >
            <img :src="currentCase.image" alt="" draggable="false" />
          </div>
          <div class="case-overlay" aria-hidden="false">
            <button class="swipe-button" type="button" aria-label="Next case" @click="goToNext(260, -150)">
              &lt;&lt; SWIPE &gt;&gt;
            </button>
            <span class="case-pagination" aria-label="Case pagination">{{ casePageLabel }}</span>
          </div>
        </div>

        <div class="tags-row" aria-label="Case tags">
          <div
            v-for="tag in tagSlots"
            :key="tag.key"
            class="motion-pill tag-pill"
            :class="{ 'is-changing-text': tag.changing, 'is-removing': tag.removing }"
            :style="{ opacity: tag.opacity }"
          >
            <span class="pill-sizer" aria-hidden="true">{{ tag.next || tag.current }}</span>
            <span class="pill-stack">
              <span class="pill-label pill-label--current">{{ tag.current }}</span>
              <span class="pill-label pill-label--next">{{ tag.next }}</span>
            </span>
          </div>
        </div>
      </article>

    </section>

    <section class="contact" id="contact" aria-label="Contacts">
      <div class="section-title section-title--light contact__title reveal-on-scroll">
        <p class="section-title__script">Have an idea?</p>
        <p class="section-title__mono">Let's build it</p>
      </div>

      <div class="contact-grid">
        <a
          v-for="tile in contactTiles"
          :key="tile.label"
          class="contact-tile reveal-on-scroll"
          href="#"
          :aria-label="tile.label"
          @click.prevent
        >
          <span class="contact-tile__icon" :class="tile.iconClass">
            <img v-if="tile.icon" :src="tile.icon" alt="" draggable="false" />
          </span>
          <span class="badge badge--small">{{ tile.label }}</span>
        </a>
      </div>
    </section>

    <footer class="footer" aria-label="Direct contacts">
      <div class="footer__contacts">
        <span class="footer__pair">
          <span class="badge badge--small">Email:</span>
          <a href="mailto:allodriell@gmail.com">allodriell@gmail.com</a>
        </span>
        <span class="footer__pair">
          <span class="badge badge--small">Phone:</span>
          <a href="tel:+79816847121">+7 981-684-71-21</a>
        </span>
      </div>
      <div class="footer__socials">
        <span class="badge badge--small">Telegram</span>
        <AnimatedBadge
          v-for="social in footerAnimatedSocials"
          :key="social"
          class="badge--small"
          :label="social"
        />
      </div>
    </footer>

    <span ref="measureTitle" class="measure measure--title"></span>
    <span ref="measureType" class="measure measure--type"></span>
    <span ref="measureTag" class="measure measure--tag"></span>
            </main>
          </div>
        </div>
        <div class="demo-caption" aria-hidden="true">
          <p>Test Task</p>
          <p>IT Solutions Management International Pte. Ltd.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineComponent, h, nextTick, onBeforeUnmount, onMounted, reactive, ref } from "vue";

import heroPhoto from "../assets/hero-photo.png";
import mockupScene from "../Mockup.png";
import nloImage from "../assets/nlo.png";
import skillsImage from "../assets/skills.png";
import blendImage from "../assets/blend.png";
import designText from "../assets/design.svg";
import engineerText from "../assets/engineer.svg";
import belousovText from "../assets/belousov.svg";
import seraphimText from "../assets/seraphim.svg";
import telegramIcon from "../assets/telegram.svg";
import githubIcon from "../assets/github.svg";
import hhIcon from "../assets/hh.svg";

const timing = {
  resize: 190,
  textDelay: 210,
  text: 320,
  swipe: 460,
};

const cases = [
  {
    id: "nlo",
    title: "NLO",
    type: "Internet Market",
    tags: ["Interface", "E-comerce", "CJM", "User Flow", "Mind Map"],
    image: nloImage,
  },
  {
    id: "skills",
    title: "4Skills",
    type: "Cybersport Team",
    tags: ["Brand", "Logo", "Media", "Identity", "Merch"],
    image: skillsImage,
  },
  {
    id: "blend",
    title: "Blend",
    type: "Low-Code Platform",
    tags: ["UX-UI", "Inf.Architecture", "UX-Reserch", "A/B Test"],
    image: blendImage,
  },
];

const stats = reactive([
  { label: "Years Experience", target: 3, suffix: "+", display: "3+", counted: false },
  { label: "Projects", target: 21, suffix: "+", display: "21+", counted: false },
  { label: "Design Systems", target: 5, suffix: "", display: "5", counted: false },
]);

const aboutLines = [
  "I discovered design at sixteen and",
  "never stopped exploring it. While",
  "studying Software Engineering at",
  "university, I continued designing,",
  "gradually developing an",
  "understanding of both creative and",
  "technical disciplines. Today, that",
  "journey shapes the way I approach",
  "every product, balancing",
  "aesthetics with feasibility and",
  "creativity with engineering thinking.",
];

const contactTiles = [
  { label: "Telegram", icon: telegramIcon, iconClass: "contact-tile__icon--telegram" },
  { label: "GitHub", icon: githubIcon, iconClass: "contact-tile__icon--github" },
  { label: "Linkedin", icon: "", iconClass: "contact-tile__icon--linkedin" },
  { label: "HH.ru", icon: hhIcon, iconClass: "contact-tile__icon--hh" },
];

const footerAnimatedSocials = ["Instagram", "VK"];
const loadingMessages = ["Hello", "Welcome to", "Digital Card"];
const loadingStepDuration = 2598;
const loadingExitDuration = 600;

const heroShell = ref(null);
const hero = ref(null);
const heroPhotoEl = ref(null);
const scrollViewport = ref(null);
const aboutEl = ref(null);
const aboutInnerEl = ref(null);
const aboutTitleEl = ref(null);
const aboutCopyEl = ref(null);
const activeVisual = ref(null);
const measureTitle = ref(null);
const measureType = ref(null);
const measureTag = ref(null);

const reduceMotion = ref(false);
const loadingMounted = ref(true);
const loadingLeaving = ref(false);
const loadingGreetingIndex = ref(0);
const current = ref(0);
const behindIndex = ref(1);
const locked = ref(false);
const dragging = ref(false);
const swiping = ref(false);
const behindReady = ref(false);
const resettingVisual = ref(false);
const heroFolded = ref(false);
const heroHeight = ref(null);
const heroShellHeight = ref(null);
const heroShift = ref(0);
const deviceScale = ref(1);
const frameActive = ref(false);
const aboutReveal = ref(0);
const aboutVideoReveal = ref(0);
const aboutClosedHeight = ref(145);
const aboutFullHeight = ref(560);
const aboutReadable = ref(false);

const drag = reactive({
  pointerId: null,
  tracking: false,
  startX: 0,
  startY: 0,
  x: 0,
  y: 0,
  rotate: 0,
  scale: 1,
  startedAt: 0,
});

const exit = reactive({
  x: 260,
  y: -150,
  rotate: 15,
});

const titlePill = reactive({
  current: "",
  next: "",
  width: 39,
  changing: false,
  resetting: false,
});

const typePill = reactive({
  current: "",
  next: "",
  width: 112,
  changing: false,
  resetting: false,
});

const tagSlots = ref([]);
let tagKey = 0;
let revealObserver;
let countObserver;
let scrollFrame = 0;
let motionQuery;
let motionListener;
let frameQuery;
let frameListener;
const loadingTimers = [];

const demoMetrics = {
  width: 1920,
  height: 1080,
};

const currentCase = computed(() => cases[current.value]);
const behindCase = computed(() => cases[behindIndex.value]);
const casePageLabel = computed(() => `${current.value + 1}/${cases.length}`);
const activeLoadingMessage = computed(() => loadingMessages[loadingGreetingIndex.value] || loadingMessages[0]);

const demoShellStyle = computed(() => ({
  "--device-scale": deviceScale.value.toFixed(3),
  "--device-width": `${(demoMetrics.width * deviceScale.value).toFixed(2)}px`,
  "--device-height": `${(demoMetrics.height * deviceScale.value).toFixed(2)}px`,
}));

const heroShellStyle = computed(() => {
  if (!heroShellHeight.value) return {};
  return { height: `${heroShellHeight.value}px` };
});

const heroStyle = computed(() => {
  if (!heroHeight.value) return {};
  return { "--hero-current-height": `${heroHeight.value}px` };
});

const heroPhotoStyle = computed(() => ({
  "--hero-shift": `${heroShift.value}px`,
}));

const aboutStyle = computed(() => ({
  "--reveal": aboutReveal.value.toFixed(3),
  "--video-reveal": aboutVideoReveal.value.toFixed(3),
  "--video-scale": (0.84 + aboutVideoReveal.value * 0.16).toFixed(3),
  "--video-opacity": (0.68 + aboutVideoReveal.value * 0.32).toFixed(3),
  "--video-y": `${((1 - aboutVideoReveal.value) * 22).toFixed(2)}px`,
  "--about-current-height": `${getAboutHeight().toFixed(2)}px`,
}));

const activeVisualClasses = computed(() => [
  `case-visual--${currentCase.value.id}`,
  {
    "is-dragging": dragging.value,
    "is-swiping": swiping.value,
    "is-resetting": resettingVisual.value,
  },
]);

const activeVisualStyle = computed(() => ({
  "--drag-x": `${drag.x}px`,
  "--drag-y": `${drag.y}px`,
  "--drag-rotate": `${drag.rotate}deg`,
  "--drag-scale": String(drag.scale),
  "--exit-x": `${exit.x}px`,
  "--exit-y": `${exit.y}px`,
  "--exit-rotate": `${exit.rotate}deg`,
}));

function modulo(value, length) {
  return ((value % length) + length) % length;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, reduceMotion.value ? 1 : ms));
}

function waitForPaint() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  });
}

function queueLoadingTimer(callback, delay) {
  const timer = window.setTimeout(callback, reduceMotion.value ? Math.min(delay, 180) : delay);
  loadingTimers.push(timer);
  return timer;
}

function clearLoadingTimers() {
  while (loadingTimers.length) {
    window.clearTimeout(loadingTimers.pop());
  }
}

function finishLoading() {
  loadingLeaving.value = true;
  queueLoadingTimer(() => {
    loadingMounted.value = false;
    document.body.classList.remove("is-loading-card");
  }, loadingExitDuration);
}

function startLoadingSequence() {
  clearLoadingTimers();
  loadingMounted.value = true;
  loadingLeaving.value = false;
  loadingGreetingIndex.value = 0;
  document.body.classList.add("is-loading-card");
  scrollViewport.value?.scrollTo?.({ top: 0, behavior: "instant" });
  window.scrollTo?.({ top: 0, behavior: "instant" });

  if (reduceMotion.value) {
    queueLoadingTimer(finishLoading, 420);
    return;
  }

  loadingMessages.forEach((_, index) => {
    if (index === 0) return;
    queueLoadingTimer(() => {
      loadingGreetingIndex.value = index;
    }, index * loadingStepDuration);
  });

  queueLoadingTimer(finishLoading, (loadingMessages.length - 0.2303) * loadingStepDuration);
}

function isFrameScrollerActive() {
  return frameActive.value && scrollViewport.value;
}

function getScrollTop() {
  if (isFrameScrollerActive()) return scrollViewport.value.scrollTop;
  return window.scrollY || document.documentElement.scrollTop || 0;
}

function getMotionViewportHeight() {
  if (isFrameScrollerActive()) return scrollViewport.value.clientHeight;
  return window.innerHeight || document.documentElement.clientHeight;
}

function getRelativeTop(element) {
  const rect = element.getBoundingClientRect();
  if (!isFrameScrollerActive()) return rect.top;

  const screenRect = scrollViewport.value.getBoundingClientRect();
  return rect.top - screenRect.top;
}

function getAboutHeight() {
  if (reduceMotion.value) return Math.max(aboutFullHeight.value, aboutClosedHeight.value);

  const closedHeight = aboutClosedHeight.value;
  const fullHeight = Math.max(aboutFullHeight.value, closedHeight);
  return closedHeight + (fullHeight - closedHeight) * aboutReveal.value;
}

function measureAbout() {
  if (!aboutInnerEl.value || !aboutTitleEl.value) return;

  const styles = window.getComputedStyle(aboutInnerEl.value);
  const paddingTop = Number.parseFloat(styles.paddingTop) || 0;
  const paddingBottom = Number.parseFloat(styles.paddingBottom) || 0;
  const closedHeight = Math.ceil(paddingTop + aboutTitleEl.value.offsetHeight + paddingBottom);
  const fullHeight = Math.ceil(aboutInnerEl.value.scrollHeight);

  aboutClosedHeight.value = Math.max(1, closedHeight);
  aboutFullHeight.value = Math.max(aboutClosedHeight.value, fullHeight);
}

function updateDeviceScale() {
  const availableWidth = Math.max(320, window.innerWidth);
  const availableHeight = Math.max(560, window.innerHeight);
  const nextScale = Math.min(availableWidth / demoMetrics.width, availableHeight / demoMetrics.height);

  deviceScale.value = clamp(nextScale, 0.34, 1.5);
}

function setupFramePreference() {
  frameQuery = window.matchMedia?.("(min-width: 720px)");
  frameActive.value = Boolean(frameQuery?.matches);
  updateDeviceScale();

  if (!frameQuery) return;

  frameListener = (event) => {
    frameActive.value = event.matches;
    updateDeviceScale();
    requestScrollTick();
  };

  frameQuery.addEventListener?.("change", frameListener);
}

function measurePill(text, type) {
  const measure = type === "title" ? measureTitle.value : type === "type" ? measureType.value : measureTag.value;
  const padding = 12;
  const min = type === "tag" ? 14 : 24;

  if (!measure) return min;

  measure.textContent = text || "";
  return Math.max(min, Math.ceil(measure.getBoundingClientRect().width + padding));
}

function setPillText(pill, item, key, type) {
  pill.current = item[key];
  pill.next = "";
  pill.changing = false;
  pill.width = measurePill(item[key], type);
}

async function settlePill(pill, item, key, type) {
  pill.resetting = true;
  pill.changing = false;
  pill.current = item[key];
  pill.next = "";
  pill.width = measurePill(item[key], type);
  await nextTick();
  await waitForPaint();
  pill.resetting = false;
}

async function morphPill(pill, key, type, fromItem, toItem) {
  pill.current = fromItem[key];
  pill.next = toItem[key];
  pill.changing = false;
  pill.width = measurePill(toItem[key], type);

  await wait(timing.textDelay);
  pill.changing = true;
  await wait(timing.text);
  await settlePill(pill, toItem, key, type);
}

function makeTagSlot(currentText, nextText, width, opacity = 1) {
  tagKey += 1;
  return {
    key: tagKey,
    current: currentText || "",
    next: nextText || "",
    width,
    opacity,
    changing: false,
    removing: false,
  };
}

function renderTags(item) {
  tagSlots.value = item.tags.map((tag) => makeTagSlot(tag, "", measurePill(tag, "tag")));
}

async function morphTags(fromItem, toItem) {
  const slots = Math.max(fromItem.tags.length, toItem.tags.length);

  tagSlots.value = Array.from({ length: slots }, (_, index) => {
    const currentText = fromItem.tags[index] || "";
    const nextText = toItem.tags[index] || "";
    const width = currentText ? measurePill(currentText, "tag") : 0;
    return makeTagSlot(currentText, nextText, width, currentText ? 1 : 0);
  });

  await nextTick();

  tagSlots.value.forEach((tag, index) => {
    const nextText = toItem.tags[index] || "";
    tag.width = nextText ? measurePill(nextText, "tag") : 0;
    tag.opacity = nextText ? 1 : 0;
    tag.removing = !nextText;
  });

  await wait(timing.textDelay);

  tagSlots.value.forEach((tag, index) => {
    if (toItem.tags[index]) tag.changing = true;
  });

  await wait(timing.text);
  renderTags(toItem);
}

function setDrag(x, y) {
  const rotate = clamp(x / 12, -17, 17);
  const distance = Math.min(180, Math.hypot(x, y));
  const scale = 1 - distance / 1800;

  drag.x = x;
  drag.y = y;
  drag.rotate = rotate;
  drag.scale = scale;
}

function resetDrag() {
  setDrag(0, 0);
  dragging.value = false;
  drag.tracking = false;
  drag.pointerId = null;
}

function startDrag(event) {
  if (locked.value || (event.pointerType === "mouse" && event.button !== 0)) return;

  resetDrag();
  drag.tracking = true;
  drag.pointerId = event.pointerId;
  drag.startX = event.clientX;
  drag.startY = event.clientY;
  drag.startedAt = performance.now();

  if (event.pointerType === "mouse") {
    dragging.value = true;
    activeVisual.value?.setPointerCapture?.(event.pointerId);
  }
}

function moveDrag(event) {
  if (!drag.tracking || (drag.pointerId !== null && event.pointerId !== drag.pointerId)) return;

  const deltaX = event.clientX - drag.startX;
  const deltaY = event.clientY - drag.startY;

  if (!dragging.value) {
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (absX < 10 && absY < 10) return;

    if (absY > 10 && absY > absX * 1.12) {
      resetDrag();
      return;
    }

    if (absX < 16 || absX < absY * 1.25) return;

    dragging.value = true;
    drag.startedAt = performance.now();
    activeVisual.value?.setPointerCapture?.(event.pointerId);
  }

  event.preventDefault();
  setDrag(deltaX, deltaY);
}

function endDrag(event) {
  if (!drag.tracking || (drag.pointerId !== null && event.pointerId !== drag.pointerId)) return;

  if (!dragging.value) {
    resetDrag();
    return;
  }

  dragging.value = false;
  drag.tracking = false;
  const elapsed = Math.max(1, performance.now() - drag.startedAt);
  const velocity = Math.abs(drag.x) / elapsed;
  const shouldSwipe = Math.abs(drag.x) > 92 || (Math.abs(drag.x) > 54 && velocity > 0.42);

  if (event.pointerId !== undefined && activeVisual.value?.hasPointerCapture?.(event.pointerId)) {
    activeVisual.value.releasePointerCapture(event.pointerId);
  }
  drag.pointerId = null;

  if (shouldSwipe) {
    const exitX = drag.x === 0 ? 260 : Math.sign(drag.x) * Math.max(260, Math.abs(drag.x) * 2.4);
    const exitY = drag.y === 0 ? -150 : drag.y * 2.1;
    goToNext(exitX, exitY);
    return;
  }

  resetDrag();
}

async function settleActiveVisual(nextIndex) {
  resettingVisual.value = true;
  current.value = nextIndex;
  swiping.value = false;
  resetDrag();
  await nextTick();
  activeVisual.value?.offsetHeight;
  resettingVisual.value = false;
}

async function goToNext(exitX = 260, exitY = -150) {
  if (locked.value) return;

  locked.value = true;
  const fromItem = currentCase.value;
  const nextIndex = modulo(current.value + 1, cases.length);
  const toItem = cases[nextIndex];

  behindIndex.value = nextIndex;
  behindReady.value = true;
  exit.x = exitX;
  exit.y = exitY;
  exit.rotate = clamp(exitX / 18, -18, 18);
  dragging.value = false;
  swiping.value = true;

  const titleMotion = morphPill(titlePill, "title", "title", fromItem, toItem);
  const typeMotion = morphPill(typePill, "type", "type", fromItem, toItem);
  const tagsMotion = morphTags(fromItem, toItem);

  await Promise.all([wait(timing.swipe), titleMotion, typeMotion, tagsMotion]);
  await settleActiveVisual(nextIndex);
  behindReady.value = false;
  behindIndex.value = modulo(current.value + 1, cases.length);
  await wait(80);
  locked.value = false;
}

function handleCaseKey(event) {
  if (event.key === "Enter" || event.key === " " || event.key === "ArrowRight") {
    event.preventDefault();
    goToNext(260, -150);
  }
}

function animateStat(index) {
  const stat = stats[index];
  if (!stat || stat.counted) return;

  stat.counted = true;
  if (reduceMotion.value || !Number.isFinite(stat.target)) {
    stat.display = `${stat.target}${stat.suffix}`;
    return;
  }

  const duration = 760;
  const start = performance.now();

  function tick(now) {
    const progress = clamp((now - start) / duration, 0, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    stat.display = `${Math.round(stat.target * eased)}${stat.suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  }

  stat.display = `0${stat.suffix}`;
  requestAnimationFrame(tick);
}

function setupScrollAnimations() {
  const revealItems = document.querySelectorAll(".reveal-on-scroll");
  const counterItems = document.querySelectorAll("[data-stat-index]");

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    stats.forEach((_, index) => animateStat(index));
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.18 },
  );

  countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateStat(Number(entry.target.dataset.statIndex));
        countObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.6 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
  counterItems.forEach((item) => countObserver.observe(item));
}

function updateScrollMotion() {
  const viewport = getMotionViewportHeight();

  if (hero.value && heroShell.value) {
    const fullHeight = Math.max(viewport, 548);
    const foldedHeight = Math.min(548, fullHeight);
    const foldDistance = Math.max(1, fullHeight - foldedHeight);
    const progress = reduceMotion.value ? 0 : clamp(getScrollTop() / foldDistance, 0, 1);
    const nextHeight = fullHeight - (fullHeight - foldedHeight) * progress;

    heroShellHeight.value = fullHeight;
    heroHeight.value = nextHeight;
    heroFolded.value = progress > 0.98;
    heroShift.value = 0;
  }

  if (aboutEl.value) {
    const top = getRelativeTop(aboutEl.value);
    const start = viewport * 0.9;
    const end = viewport * 0.38;
    const progress = clamp((start - top) / Math.max(1, start - end), 0, 1);
    const copyTop = aboutCopyEl.value ? getRelativeTop(aboutCopyEl.value) : viewport;

    aboutReveal.value = progress;
    aboutVideoReveal.value = clamp((progress - 0.48) / 0.52, 0, 1);
    aboutReadable.value = reduceMotion.value || (progress > 0.98 && copyTop < viewport * 0.45);
  }
}

function requestScrollTick() {
  if (scrollFrame) return;

  scrollFrame = requestAnimationFrame(() => {
    updateScrollMotion();
    scrollFrame = 0;
  });
}

function initCases() {
  const item = currentCase.value;

  setPillText(titlePill, item, "title", "title");
  setPillText(typePill, item, "type", "type");
  renderTags(item);
  behindIndex.value = modulo(current.value + 1, cases.length);
}

function setupMotionPreference() {
  motionQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  reduceMotion.value = Boolean(motionQuery?.matches);

  if (!motionQuery) return;

  motionListener = (event) => {
    reduceMotion.value = event.matches;
    updateScrollMotion();
  };

  motionQuery.addEventListener?.("change", motionListener);
}

const AnimatedBadge = defineComponent({
  name: "AnimatedBadge",
  props: {
    label: {
      type: String,
      required: true,
    },
  },
  setup(props, { attrs }) {
    function play(event) {
      if (reduceMotion.value) return;

      const badge = event.currentTarget;
      badge.classList.remove("is-playing");
      badge.offsetHeight;
      badge.classList.add("is-playing");
      window.setTimeout(() => badge.classList.remove("is-playing"), 340);
    }

    function onKeydown(event) {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      play(event);
    }

    return () =>
      h(
        "span",
        {
          ...attrs,
          class: ["badge", "badge--animated", attrs.class],
          tabindex: 0,
          "aria-label": props.label,
          onClick: play,
          onKeydown,
        },
        [
          h("span", { class: "badge__sizer" }, props.label),
          h("span", { class: "badge__stack", "aria-hidden": "true" }, [
            h("span", props.label),
            h("span", props.label),
          ]),
        ],
      );
  },
});

onMounted(async () => {
  setupFramePreference();
  setupMotionPreference();
  startLoadingSequence();

  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  initCases();
  await nextTick();
  measureAbout();
  setupScrollAnimations();
  updateScrollMotion();

  window.addEventListener("scroll", requestScrollTick, { passive: true });
  window.addEventListener("resize", requestScrollTick);
  window.addEventListener("resize", updateDeviceScale);
  window.addEventListener("resize", measureAbout);
  scrollViewport.value?.addEventListener("scroll", requestScrollTick, { passive: true });
  window.addEventListener("pointermove", moveDrag, { passive: false });
  window.addEventListener("pointerup", endDrag);
  window.addEventListener("pointercancel", endDrag);
});

onBeforeUnmount(() => {
  clearLoadingTimers();
  document.body.classList.remove("is-loading-card");
  revealObserver?.disconnect();
  countObserver?.disconnect();
  window.removeEventListener("scroll", requestScrollTick);
  window.removeEventListener("resize", requestScrollTick);
  window.removeEventListener("resize", updateDeviceScale);
  window.removeEventListener("resize", measureAbout);
  scrollViewport.value?.removeEventListener("scroll", requestScrollTick);
  window.removeEventListener("pointermove", moveDrag);
  window.removeEventListener("pointerup", endDrag);
  window.removeEventListener("pointercancel", endDrag);

  if (scrollFrame) cancelAnimationFrame(scrollFrame);
  if (motionQuery && motionListener) {
    motionQuery.removeEventListener?.("change", motionListener);
  }
  if (frameQuery && frameListener) {
    frameQuery.removeEventListener?.("change", frameListener);
  }
});
</script>
