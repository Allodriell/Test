<template>
  <div class="demo-shell" :style="demoShellStyle">
    <div class="demo-device">
      <div class="demo-device__inner">
        <img class="demo-device__mockup" :src="mockupScene" alt="" draggable="false" aria-hidden="true" />
        <div class="phone-frame" aria-label="iPhone 16 preview">
          <span class="phone-frame__island" aria-hidden="true"></span>
          <div
            ref="scrollViewport"
            class="phone-frame__screen"
            :class="{ 'is-loading': loadingMounted, 'is-case-open': caseDetailMounted }"
          >
            <div
              v-if="loadingMounted"
              class="loading-overlay"
              :class="{ 'is-leaving': loadingLeaving }"
              role="status"
              aria-live="polite"
            >
              <div class="loading-overlay__message">
                <div
                  class="loading-phrase"
                  :class="{
                    'is-visible': loadingGreetingVisible,
                  }"
                >
                  <p class="loading-greeting" :class="{ 'is-active': loadingActiveGreetingLayer === 'a' }">
                    {{ loadingGreetingLayerA }}
                  </p>
                  <p class="loading-greeting" :class="{ 'is-active': loadingActiveGreetingLayer === 'b' }">
                    {{ loadingGreetingLayerB }}
                  </p>
                </div>
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
      <div class="about__inner">
        <div class="section-title section-title--light">
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
            aria-label="Open case or swipe case image"
            @pointerdown="startDrag"
            @click="openCaseDetail"
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
        <p class="section-title__mono">Let's create it</p>
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

      <div class="contact-links">
        <span class="contact-link">
          <span class="badge badge--small">Email:</span>
          <a href="mailto:allodriell@gmail.com">allodriell@gmail.com</a>
        </span>
        <span class="contact-link">
          <span class="badge badge--small">Phone</span>
          <a href="tel:+79816847121">+7 981-684-71-21</a>
        </span>
      </div>
    </section>

    <footer class="footer" aria-label="Direct contacts">
      <AnimatedBadge
        v-for="social in footerAnimatedSocials"
        :key="social"
        class="badge--small"
        :label="social"
      />
    </footer>

    <span ref="measureTitle" class="measure measure--title"></span>
    <span ref="measureType" class="measure measure--type"></span>
    <span ref="measureTag" class="measure measure--tag"></span>
            </main>

            <div
              v-if="caseTransitionMounted"
              class="case-transition-clone"
              :class="caseTransitionClasses"
              :style="caseTransitionStyle"
              aria-hidden="true"
            >
              <img :src="openedCaseDetail.hero" alt="" draggable="false" />
            </div>

            <article
              v-if="caseDetailMounted"
              ref="caseDetailEl"
              class="case-detail"
              :class="{ 'is-visible': caseDetailVisible }"
              :style="caseOverlayStyle"
              aria-label="Case detail"
            >
              <section class="case-detail__hero">
                <div class="case-detail__visual" :class="{ 'is-ghosted': caseTransitionMounted }">
                  <img :src="openedCaseDetail.hero" alt="" draggable="false" />
                </div>
                <button class="case-detail__back" type="button" aria-label="Back to portfolio" @click="closeCaseDetail">
                  &lt;&lt; BACK
                </button>
                <div class="case-detail__title-row">
                  <span class="case-detail__title-pill">{{ openedCaseDetail.title }}</span>
                  <span class="case-detail__type-pill">{{ openedCaseDetail.type }}</span>
                </div>
                <div class="case-detail__tags">
                  <span v-for="tag in openedCaseDetail.tags" :key="tag" class="case-detail__tag">{{ tag }}</span>
                </div>
              </section>

              <section class="case-detail__text-block case-detail-reveal case-detail-reveal--text">
                <p class="case-detail__animated-copy">
                  <span
                    v-for="(line, index) in openedCaseDetail.leadLines"
                    :key="`lead-${index}-${line}`"
                    class="case-detail-line"
                    :style="{ '--line-delay': `${index * 62}ms` }"
                  >
                    <span>{{ line }}</span>
                  </span>
                </p>
              </section>

              <section v-if="openedCaseDetail.lendings" class="case-detail__media-band case-detail-reveal case-detail-reveal--image">
                <img :src="openedCaseDetail.lendings" alt="" draggable="false" />
              </section>

              <section class="case-detail__text-block case-detail-reveal case-detail-reveal--text">
                <p class="case-detail__animated-copy">
                  <span
                    v-for="(line, index) in openedCaseDetail.objectiveLines"
                    :key="`objective-${index}-${line}`"
                    class="case-detail-line"
                    :style="{ '--line-delay': `${index * 62}ms` }"
                  >
                    <span>{{ line }}</span>
                  </span>
                </p>
              </section>

              <section v-if="openedCaseDetail.gallery.length" class="case-detail__gallery">
                <div
                  v-for="shot in openedCaseDetail.gallery"
                  :key="shot.src"
                  class="case-detail__gallery-shot case-detail-reveal case-detail-reveal--image"
                  :class="shot.className"
                  :style="shot.style"
                >
                  <img :src="shot.src" :class="shot.imageClass" alt="" draggable="false" />
                </div>
              </section>

              <section class="contact contact--detail" aria-label="Contacts">
                <div class="section-title section-title--light contact__title">
                  <p class="section-title__script">Have an idea?</p>
                  <p class="section-title__mono">Let's create it</p>
                </div>

                <div class="contact-grid">
                  <a
                    v-for="tile in contactTiles"
                    :key="`detail-${tile.label}`"
                    class="contact-tile"
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

                <div class="contact-links">
                  <span class="contact-link">
                    <span class="badge badge--small">Email:</span>
                    <a href="mailto:allodriell@gmail.com">allodriell@gmail.com</a>
                  </span>
                  <span class="contact-link">
                    <span class="badge badge--small">Phone</span>
                    <a href="tel:+79816847121">+7 981-684-71-21</a>
                  </span>
                </div>
              </section>

              <footer class="footer" aria-label="Direct contacts">
                <AnimatedBadge
                  v-for="social in footerAnimatedSocials"
                  :key="`detail-${social}`"
                  class="badge--small"
                  :label="social"
                />
              </footer>
            </article>
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
import telegramIcon from "../assets/contact-telegram.svg";
import githubIcon from "../assets/contact-github.svg";
import linkedinIcon from "../assets/contact-linkedin.svg";
import hhIcon from "../assets/contact-hh.svg";
import nloDetailHero from "../assets/case-nlo-hero.png";
import nloDetailLendings from "../assets/case-nlo-lendings.png";
import nloDetailMain from "../assets/case-nlo-main.png";
import nloDetailMarket from "../assets/case-nlo-market.png";
import skillsDetailHero from "../assets/case-skills-hero.png";
import skillsDetailLendings from "../assets/case-skills-lendings.png";
import skillsDetailLogo from "../assets/case-skills-logo.png";
import skillsDetailMedia from "../assets/case-skills-media.png";
import skillsDetailMerch from "../assets/case-skills-merch.png";
import blendDetailHero from "../assets/case-blend-hero.png";
import blendDetailLendings from "../assets/case-blend-lendings.png";
import blendDetailCms from "../assets/case-blend-cms.png";
import blendDetailPreview from "../assets/case-blend-preview.png";
import blendDetailPage from "../assets/case-blend-page.png";

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

const caseDetails = {
  nlo: {
    title: "NLO",
    type: "Internet Market",
    tags: ["Interface", "E-comerce", "CJM", "User Flow", "Mind Map"],
    hero: nloDetailHero,
    lead:
      "NLO Retail is an online store project for a brand-name sneaker retailer that previously operated via a Telegram shop.",
    leadLines: [
      "NLO Retail is an online store",
      "project for a brand-name sneaker",
      "retailer that previously operated",
      "via a Telegram shop.",
    ],
    objective:
      "The objective was to transition the business to a full-fledged e-commerce platform, ensuring external security, curating the product selection, and preparing the brand for scaling.",
    objectiveLines: [
      "The objective was to transition the",
      "business to a full-fledged",
      "e-commerce platform, ensuring",
      "external security, curating the",
      "product selection, and preparing",
      "the brand for scaling.",
    ],
    lendings: nloDetailLendings,
    gallery: [
      {
        src: nloDetailMain,
        className: "case-detail__shot--nlo-main",
        imageClass: "case-detail__image--nlo-main",
      },
      {
        src: nloDetailMarket,
        className: "case-detail__shot--nlo-market",
      },
    ],
  },
  skills: {
    title: "4Skills",
    type: "Cybersport Team",
    tags: ["Brand", "Logo", "Media", "Identity", "Merch"],
    hero: skillsDetailHero,
    lead:
      '4Skills is an esports team affiliated with the Financial University that participates in the "Moscow Esports" project.',
    leadLines: [
      "4Skills is an esports team",
      "affiliated with the Financial",
      "University that participates in",
      'the "Moscow Esports" project.',
    ],
    objective:
      "The task was to develop a visual identity that would work effectively across social media, streams, merchandise, and offline activities.",
    objectiveLines: [
      "The task was to develop a visual",
      "identity that would work effectively",
      "across social media, streams,",
      "merchandise, and offline activities.",
    ],
    lendings: skillsDetailLendings,
    gallery: [
      {
        src: skillsDetailLogo,
        className: "case-detail__shot--wide",
        style: { aspectRatio: "1920 / 1080" },
      },
      {
        src: skillsDetailMedia,
        className: "case-detail__shot--square",
        style: { aspectRatio: "1 / 1" },
      },
      {
        src: skillsDetailMerch,
        className: "case-detail__shot--merch",
        style: { aspectRatio: "1959 / 900" },
      },
    ],
  },
  blend: {
    title: "Blend",
    type: "Low-Code Platform",
    tags: ["UX-UI", "Inf.Architecture", "UX-Reserch", "A/B Test"],
    hero: blendDetailHero,
    lead:
      "Blend is a low-code platform for building and managing large-scale projects. The product integrates database management, business processes, APIs, and the application's visual interface, enabling teams to build, test, and evolve complex digital products more quickly.",
    leadLines: [
      "Blend is a low-code platform for",
      "building and managing large-scale",
      "projects. The product integrates",
      "database management, business",
      "processes, APIs, and the",
      "application's visual interface,",
      "enabling teams to build, test, and",
      "evolve complex digital products",
      "more quickly.",
    ],
    objective:
      'The project focused primarily on designing an interface that helps the user not merely "assemble a screen," but navigate the entire journey from the initial idea and hypothesis to data structures, process logic, and the product\'s visual design.',
    objectiveLines: [
      "The project focused primarily on",
      "designing an interface that helps",
      'the user not merely "assemble a',
      'screen," but navigate the entire',
      "journey from the initial idea and",
      "hypothesis to data structures,",
      "process logic, and the product's",
      "visual design.",
    ],
    lendings: blendDetailLendings,
    gallery: [
      {
        src: blendDetailCms,
        className: "case-detail__shot--wide",
        style: { aspectRatio: "2880 / 1620" },
      },
      {
        src: blendDetailPreview,
        className: "case-detail__shot--wide",
        style: { aspectRatio: "2880 / 1616" },
      },
      {
        src: blendDetailPage,
        className: "case-detail__shot--wide",
        style: { aspectRatio: "2880 / 1620" },
      },
    ],
  },
};

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
  { label: "Linkedin", icon: linkedinIcon, iconClass: "contact-tile__icon--linkedin" },
  { label: "HH.ru", icon: hhIcon, iconClass: "contact-tile__icon--hh" },
];

const footerAnimatedSocials = ["Instagram", "VK", "Twitter"];
const loadingMessages = ["Hello", "Welcome to", "Digital Card"];
const loadingStepDuration = 2400;
const loadingCrossfadeDuration = 820;
const loadingExitDuration = 520;

const heroShell = ref(null);
const hero = ref(null);
const heroPhotoEl = ref(null);
const scrollViewport = ref(null);
const aboutEl = ref(null);
const aboutCopyEl = ref(null);
const activeVisual = ref(null);
const measureTitle = ref(null);
const measureType = ref(null);
const measureTag = ref(null);

const reduceMotion = ref(false);
const loadingMounted = ref(true);
const loadingLeaving = ref(false);
const loadingGreetingIndex = ref(0);
const loadingActiveGreetingLayer = ref("a");
const loadingGreetingLayerA = ref(loadingMessages[0]);
const loadingGreetingLayerB = ref("");
const loadingGreetingVisible = ref(false);
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
const aboutVideoReveal = ref(0);
const aboutReadable = ref(false);
const caseDetailEl = ref(null);
const caseDetailMounted = ref(false);
const caseDetailVisible = ref(false);
const caseTransitionMounted = ref(false);
const caseTransitionPhase = ref("origin");
const openedCaseIndex = ref(0);
const caseOverlay = reactive({
  left: 0,
  top: 0,
  width: 393,
  height: 700,
  heroHeight: 403,
});
const caseTransition = reactive({
  fromLeft: 0,
  fromTop: 0,
  fromWidth: 311,
  fromHeight: 349,
  fullLeft: 0,
  fullTop: 0,
  fullWidth: 393,
  fullHeight: 700,
  toLeft: 0,
  toTop: 0,
  toWidth: 393,
  toHeight: 403,
});

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
let caseRevealObserver;
let scrollFrame = 0;
let motionQuery;
let motionListener;
let frameQuery;
let frameListener;
let lastDragDistance = 0;
let lastDragAt = 0;
let caseTransitionRun = 0;
const loadingTimers = [];

const caseTransitionTiming = {
  startDelay: 110,
  expand: 760,
  hold: 160,
  pageFade: 220,
  settle: 460,
};

const demoMetrics = {
  width: 1920,
  height: 1080,
};

const currentCase = computed(() => cases[current.value]);
const behindCase = computed(() => cases[behindIndex.value]);
const casePageLabel = computed(() => `${current.value + 1}/${cases.length}`);
const openedCase = computed(() => cases[openedCaseIndex.value] || currentCase.value);
const openedCaseDetail = computed(() => {
  const item = openedCase.value;
  return (
    caseDetails[item.id] || {
      title: item.title,
      type: item.type,
      tags: item.tags,
      hero: item.image,
      lead: `${item.title} case detail is being assembled.`,
      leadLines: [`${item.title} case detail is being assembled.`],
      objective: "The transition animation is available for this selected case card.",
      objectiveLines: ["The transition animation is available for this selected case card."],
      lendings: "",
      gallery: [],
    }
  );
});

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
  "--video-reveal": aboutVideoReveal.value.toFixed(3),
  "--video-scale": (0.62 + aboutVideoReveal.value * 0.38).toFixed(3),
  "--video-opacity": (0.72 + aboutVideoReveal.value * 0.28).toFixed(3),
  "--video-y": `${((1 - aboutVideoReveal.value) * 18).toFixed(2)}px`,
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

const caseOverlayStyle = computed(() => ({
  "--case-overlay-left": `${caseOverlay.left}px`,
  "--case-overlay-top": `${caseOverlay.top}px`,
  "--case-overlay-width": `${caseOverlay.width}px`,
  "--case-overlay-height": `${caseOverlay.height}px`,
  "--case-detail-hero-image-height": `${caseOverlay.heroHeight}px`,
}));

const caseTransitionStyle = computed(() => ({
  "--case-from-left": `${caseTransition.fromLeft}px`,
  "--case-from-top": `${caseTransition.fromTop}px`,
  "--case-from-width": `${caseTransition.fromWidth}px`,
  "--case-from-height": `${caseTransition.fromHeight}px`,
  "--case-full-left": `${caseTransition.fullLeft}px`,
  "--case-full-top": `${caseTransition.fullTop}px`,
  "--case-full-width": `${caseTransition.fullWidth}px`,
  "--case-full-height": `${caseTransition.fullHeight}px`,
  "--case-to-left": `${caseTransition.toLeft}px`,
  "--case-to-top": `${caseTransition.toTop}px`,
  "--case-to-width": `${caseTransition.toWidth}px`,
  "--case-to-height": `${caseTransition.toHeight}px`,
}));

const caseTransitionClasses = computed(() => ({
  "is-fullscreen": caseTransitionPhase.value === "fullscreen",
  "is-settled": caseTransitionPhase.value === "settled",
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

function switchLoadingMessage(index) {
  if (index === loadingGreetingIndex.value) return;
  const nextLayer = loadingActiveGreetingLayer.value === "a" ? "b" : "a";
  if (nextLayer === "a") {
    loadingGreetingLayerA.value = loadingMessages[index] || "";
  } else {
    loadingGreetingLayerB.value = loadingMessages[index] || "";
  }
  loadingGreetingIndex.value = index;
  loadingActiveGreetingLayer.value = nextLayer;
}

function startLoadingSequence() {
  clearLoadingTimers();
  loadingMounted.value = true;
  loadingLeaving.value = false;
  loadingGreetingIndex.value = 0;
  loadingActiveGreetingLayer.value = "a";
  loadingGreetingLayerA.value = loadingMessages[0];
  loadingGreetingLayerB.value = "";
  loadingGreetingVisible.value = false;
  document.body.classList.add("is-loading-card");
  scrollViewport.value?.scrollTo?.({ top: 0, behavior: "instant" });
  window.scrollTo?.({ top: 0, behavior: "instant" });

  if (reduceMotion.value) {
    queueLoadingTimer(finishLoading, 420);
    return;
  }

  queueLoadingTimer(() => {
    loadingGreetingVisible.value = true;
  }, 120);

  loadingMessages.forEach((_, index) => {
    if (index === 0) return;
    queueLoadingTimer(
      () => switchLoadingMessage(index),
      index * loadingStepDuration - loadingCrossfadeDuration / 2,
    );
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

function getCaseOverlayMetrics() {
  const screen = scrollViewport.value;
  const visualScale = frameActive.value ? deviceScale.value || 1 : 1;
  const screenRect = screen?.getBoundingClientRect() || {
    left: 0,
    top: 0,
    width: window.innerWidth || 393,
    height: window.innerHeight || 700,
  };
  const cardRect = document.querySelector(".card-page")?.getBoundingClientRect() || screenRect;
  const scrollTop = getScrollTop();
  const screenWidth = screen?.clientWidth || screenRect.width / visualScale;
  const targetWidth = Math.min((cardRect.width || screenRect.width) / visualScale, screenWidth);
  const targetLeft = ((cardRect.left || screenRect.left) - screenRect.left) / visualScale;
  const targetHeight = getMotionViewportHeight();
  const heroHeight = Math.min(targetHeight * 0.72, targetWidth * (403 / 393));

  return {
    left: targetLeft,
    top: scrollTop,
    width: targetWidth,
    height: targetHeight,
    heroHeight: Math.max(320, heroHeight),
    screenRect,
    visualScale,
  };
}

function getScreenContentRect(rect, metrics) {
  const relativeTop = (rect.top - metrics.screenRect.top) / metrics.visualScale;

  return {
    left: (rect.left - metrics.screenRect.left) / metrics.visualScale,
    top: isFrameScrollerActive() ? metrics.top + relativeTop : relativeTop,
    width: rect.width / metrics.visualScale,
    height: rect.height / metrics.visualScale,
  };
}

function preloadImage(src) {
  if (!src) return Promise.resolve();

  return new Promise((resolve) => {
    const image = new Image();
    image.onload = resolve;
    image.onerror = resolve;
    image.src = src;
  });
}

function preloadCaseAssets(detail) {
  const gallerySources = detail.gallery?.map((shot) => shot.src) || [];
  return Promise.all([detail.hero, detail.lendings, ...gallerySources].map(preloadImage));
}

function clearCaseDetailReveals() {
  caseRevealObserver?.disconnect();
  caseRevealObserver = null;
}

async function setupCaseDetailReveals() {
  clearCaseDetailReveals();
  await nextTick();

  const root = caseDetailEl.value;
  const revealItems = root ? Array.from(root.querySelectorAll(".case-detail-reveal")) : [];
  if (!revealItems.length) return;

  revealItems.forEach((item, index) => {
    item.classList.remove("is-visible");
    item.style.setProperty("--case-reveal-delay", `${Math.min(index * 70, 280)}ms`);
  });

  if (reduceMotion.value || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  caseRevealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        caseRevealObserver?.unobserve(entry.target);
      });
    },
    {
      root,
      threshold: 0.16,
      rootMargin: "0px 0px -10% 0px",
    },
  );

  revealItems.forEach((item) => caseRevealObserver.observe(item));
}

function getRelativeTop(element) {
  const rect = element.getBoundingClientRect();
  if (!isFrameScrollerActive()) return rect.top;

  const screenRect = scrollViewport.value.getBoundingClientRect();
  return rect.top - screenRect.top;
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

function setCaseMetrics(metrics) {
  caseOverlay.left = metrics.left;
  caseOverlay.top = metrics.top;
  caseOverlay.width = metrics.width;
  caseOverlay.height = metrics.height;
  caseOverlay.heroHeight = metrics.heroHeight;
}

async function openCaseDetail(event) {
  if (locked.value || swiping.value || dragging.value || drag.tracking || caseDetailMounted.value) return;

  if (performance.now() - lastDragAt < 240 && lastDragDistance > 8) return;

  const sourceRect = activeVisual.value?.getBoundingClientRect();
  if (!sourceRect) return;

  openedCaseIndex.value = current.value;
  const detail = openedCaseDetail.value;
  const assetsReady = preloadCaseAssets(detail);
  const metrics = getCaseOverlayMetrics();
  const source = getScreenContentRect(sourceRect, metrics);
  setCaseMetrics(metrics);

  caseTransition.fromLeft = source.left;
  caseTransition.fromTop = source.top;
  caseTransition.fromWidth = source.width;
  caseTransition.fromHeight = source.height;
  caseTransition.fullLeft = metrics.left;
  caseTransition.fullTop = metrics.top;
  caseTransition.fullWidth = metrics.width;
  caseTransition.fullHeight = metrics.height;
  caseTransition.toLeft = metrics.left;
  caseTransition.toTop = metrics.top;
  caseTransition.toWidth = metrics.width;
  caseTransition.toHeight = metrics.heroHeight;

  locked.value = true;
  const run = ++caseTransitionRun;
  caseDetailMounted.value = true;
  caseDetailVisible.value = false;
  caseTransitionMounted.value = !reduceMotion.value;
  caseTransitionPhase.value = "origin";
  document.body.classList.add("is-case-detail-open");

  if (event?.currentTarget?.blur) event.currentTarget.blur();

  await nextTick();
  caseDetailEl.value?.scrollTo?.({ top: 0, behavior: "instant" });

  if (reduceMotion.value) {
    caseDetailVisible.value = true;
    await setupCaseDetailReveals();
    caseTransitionMounted.value = false;
    locked.value = false;
    return;
  }

  await waitForPaint();
  if (run !== caseTransitionRun) return;

  await wait(caseTransitionTiming.startDelay);
  if (run !== caseTransitionRun) return;
  caseTransitionPhase.value = "fullscreen";

  await wait(caseTransitionTiming.expand);
  if (run !== caseTransitionRun) return;

  await Promise.all([assetsReady, wait(caseTransitionTiming.hold)]);
  if (run !== caseTransitionRun) return;
  caseDetailVisible.value = true;
  await setupCaseDetailReveals();

  await wait(caseTransitionTiming.pageFade);
  if (run !== caseTransitionRun) return;
  caseTransitionPhase.value = "settled";

  await wait(caseTransitionTiming.settle);
  if (run !== caseTransitionRun) return;
  caseTransitionMounted.value = false;
  caseTransitionPhase.value = "origin";
  locked.value = false;
}

function closeCaseDetail() {
  if (!caseDetailMounted.value) return;

  caseTransitionRun += 1;
  clearCaseDetailReveals();
  locked.value = false;
  caseDetailVisible.value = false;

  window.setTimeout(
    () => {
      caseDetailMounted.value = false;
      caseTransitionMounted.value = false;
      caseTransitionPhase.value = "origin";
      document.body.classList.remove("is-case-detail-open");
    },
    reduceMotion.value ? 1 : 360,
  );
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
    lastDragDistance = Math.hypot(drag.x, drag.y);
    lastDragAt = performance.now();
    resetDrag();
    return;
  }

  dragging.value = false;
  drag.tracking = false;
  lastDragDistance = Math.hypot(drag.x, drag.y);
  lastDragAt = performance.now();
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
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openCaseDetail(event);
    return;
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    goToNext(260, -150);
  }
}

function handleWindowKeydown(event) {
  if (event.key === "Escape") closeCaseDetail();
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

  if (caseDetailMounted.value) {
    setCaseMetrics(getCaseOverlayMetrics());
  }

  if (aboutEl.value) {
    const top = getRelativeTop(aboutEl.value);
    const start = viewport * 0.9;
    const end = viewport * 0.28;
    const progress = clamp((start - top) / Math.max(1, start - end), 0, 1);
    const copyTop = aboutCopyEl.value ? getRelativeTop(aboutCopyEl.value) : viewport;

    aboutVideoReveal.value = reduceMotion.value ? 1 : clamp((progress - 0.12) / 0.72, 0, 1);
    aboutReadable.value = reduceMotion.value || progress > 0.62 || copyTop < viewport * 0.86;
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
  setupScrollAnimations();
  updateScrollMotion();

  window.addEventListener("scroll", requestScrollTick, { passive: true });
  window.addEventListener("resize", requestScrollTick);
  window.addEventListener("resize", updateDeviceScale);
  scrollViewport.value?.addEventListener("scroll", requestScrollTick, { passive: true });
  window.addEventListener("pointermove", moveDrag, { passive: false });
  window.addEventListener("pointerup", endDrag);
  window.addEventListener("pointercancel", endDrag);
  window.addEventListener("keydown", handleWindowKeydown);
});

onBeforeUnmount(() => {
  clearLoadingTimers();
  document.body.classList.remove("is-loading-card");
  document.body.classList.remove("is-case-detail-open");
  revealObserver?.disconnect();
  countObserver?.disconnect();
  clearCaseDetailReveals();
  window.removeEventListener("scroll", requestScrollTick);
  window.removeEventListener("resize", requestScrollTick);
  window.removeEventListener("resize", updateDeviceScale);
  scrollViewport.value?.removeEventListener("scroll", requestScrollTick);
  window.removeEventListener("pointermove", moveDrag);
  window.removeEventListener("pointerup", endDrag);
  window.removeEventListener("pointercancel", endDrag);
  window.removeEventListener("keydown", handleWindowKeydown);

  if (scrollFrame) cancelAnimationFrame(scrollFrame);
  if (motionQuery && motionListener) {
    motionQuery.removeEventListener?.("change", motionListener);
  }
  if (frameQuery && frameListener) {
    frameQuery.removeEventListener?.("change", frameListener);
  }
});
</script>
