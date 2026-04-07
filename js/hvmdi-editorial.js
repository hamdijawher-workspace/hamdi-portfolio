const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const SESSION_KEY = "hvmdi-ui-session";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const elements = {
  loader: document.getElementById("loader"),
  loaderTokens: [...document.querySelectorAll(".loader__token")],
  cursor: document.getElementById("cursor"),
  cursorShape: document.querySelector(".cursor__shape"),
  cursorLabel: document.getElementById("cursor-label"),
  metaTime: document.getElementById("meta-time"),
  collabToggle: document.getElementById("collab-toggle"),
  collabLabel: document.getElementById("collab-label"),
  stage: document.querySelector("[data-stage]"),
  words: [...document.querySelectorAll("[data-word]")],
  driftItems: [...document.querySelectorAll("[data-drift]")],
  revealItems: [...document.querySelectorAll("[data-reveal]")],
  navLinks: [...document.querySelectorAll("[data-page-link]")],
  sectionLinks: [...document.querySelectorAll("[data-section-link]")],
  settingsTrigger: document.getElementById("settings-trigger"),
  settingsPanel: document.getElementById("settings-panel"),
  fontSizeButtons: [...document.querySelectorAll("[data-fontsize-option]")],
  themeButtons: [...document.querySelectorAll("[data-theme-option]")],
  contrastButtons: [...document.querySelectorAll("[data-contrast-option]")],
  settingsCollabToggle: document.getElementById("settings-collab-toggle"),
  mobileSettingsButton: null
};

const state = {
  collaboration: true,
  fontSize: "md",
  theme: "light",
  contrast: "normal"
};

const easterEggState = {
  dogFound: false,
  dogCursor: false
};

function getNavigationType() {
  const entry = performance.getEntriesByType?.("navigation")?.[0];
  return entry?.type || "navigate";
}

function loadSessionState() {
  if (getNavigationType() === "reload") {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch (_) {
      // no-op
    }
    return;
  }

  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (saved && typeof saved === "object") {
      if (["sm", "md", "lg"].includes(saved.fontSize)) state.fontSize = saved.fontSize;
      if (["light", "dark"].includes(saved.theme)) state.theme = saved.theme;
      if (["normal", "high"].includes(saved.contrast)) state.contrast = saved.contrast;
      if (typeof saved.collaboration === "boolean") state.collaboration = saved.collaboration;
    }
  } catch (_) {
    // no-op
  }
}

function saveSessionState() {
  try {
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        collaboration: state.collaboration,
        fontSize: state.fontSize,
        theme: state.theme,
        contrast: state.contrast
      })
    );
  } catch (_) {
    // no-op
  }
}

function injectSettings() {
  if (document.getElementById("settings-trigger")) return;

  const site = document.querySelector(".site");
  if (!site) return;

  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.id = "settings-trigger";
  trigger.className = "settings-trigger";
  trigger.setAttribute("aria-expanded", "false");
  trigger.setAttribute("aria-controls", "settings-panel");
  trigger.setAttribute("data-cursor", "");
  trigger.setAttribute("data-cursor-label", "Settings");
  trigger.innerHTML = '<i data-lucide="cog" aria-hidden="true"></i><span>Site settings</span>';

  const panel = document.createElement("aside");
  panel.id = "settings-panel";
  panel.className = "settings-panel";
  panel.setAttribute("aria-label", "Site settings");
  panel.innerHTML = `
    <p class="settings-panel__title">Settings</p>
    <div class="settings-group">
      <label>Text size</label>
      <div class="settings-row">
        <button type="button" class="settings-option" data-fontsize-option="sm">A-</button>
        <button type="button" class="settings-option" data-fontsize-option="md">A</button>
        <button type="button" class="settings-option" data-fontsize-option="lg">A+</button>
      </div>
    </div>
    <div class="settings-group">
      <label>Theme</label>
      <div class="settings-row">
        <button type="button" class="settings-option" data-theme-option="light">Light</button>
        <button type="button" class="settings-option" data-theme-option="dark">Dark</button>
      </div>
    </div>
    <div class="settings-group">
      <label>Contrast</label>
      <div class="settings-row">
        <button type="button" class="settings-option" data-contrast-option="normal">Normal</button>
        <button type="button" class="settings-option" data-contrast-option="high">High</button>
      </div>
    </div>
    <div class="settings-group">
      <label>Collaboration settings</label>
      <div class="settings-row">
        <button type="button" class="settings-toggle" id="settings-collab-toggle" aria-pressed="true">On</button>
      </div>
    </div>
  `;

  site.appendChild(trigger);
  site.appendChild(panel);

  elements.settingsTrigger = trigger;
  elements.settingsPanel = panel;
  elements.fontSizeButtons = [...panel.querySelectorAll("[data-fontsize-option]")];
  elements.themeButtons = [...panel.querySelectorAll("[data-theme-option]")];
  elements.contrastButtons = [...panel.querySelectorAll("[data-contrast-option]")];
  elements.settingsCollabToggle = panel.querySelector("#settings-collab-toggle");
}

function injectProgressMeta() {
  if (document.getElementById("progress-datetime")) return;
  const site = document.querySelector(".site");
  if (!site) return;
  const meta = document.createElement("div");
  meta.id = "progress-datetime";
  meta.className = "progress-datetime";
  meta.textContent = "23:16 / TUE, MAR 31";
  site.appendChild(meta);
}

function pagePrefix() {
  return window.location.pathname.includes("/work/") ? ".." : ".";
}

function injectMobileChrome() {
  const site = document.querySelector(".site");
  if (!site || document.querySelector(".mobile-tabbar")) return;

  const prefix = pagePrefix();
  const bar = document.createElement("nav");
  bar.className = "mobile-tabbar";
  bar.setAttribute("aria-label", "Mobile navigation");
  if (document.body.dataset.page === "home") {
    bar.innerHTML = `
      <a class="mobile-tabbar__link is-active" href="#hero-section" data-section-link="hero-section">Home</a>
      <a class="mobile-tabbar__link" href="#experience-section" data-section-link="experience-section">Experience</a>
      <a class="mobile-tabbar__link" href="#work-section" data-section-link="work-section">Work</a>
      <a class="mobile-tabbar__link" href="#contact-section" data-section-link="contact-section">Contact</a>
      <button type="button" class="mobile-tabbar__button" id="mobile-settings-toggle" data-cursor data-cursor-label="Settings">
        <i data-lucide="cog" aria-hidden="true"></i>
      </button>
    `;
  } else if (document.body.dataset.pageKind === "case") {
    bar.innerHTML = `
      <a class="mobile-tabbar__link is-active" href="#case-intro" data-section-link="case-intro">Intro</a>
      <a class="mobile-tabbar__link" href="#challenge-section" data-section-link="challenge-section">Challenge</a>
      <a class="mobile-tabbar__link" href="#process-section" data-section-link="process-section">Process</a>
      <a class="mobile-tabbar__link" href="#outcome-section" data-section-link="outcome-section">Outcome</a>
      <button type="button" class="mobile-tabbar__button" id="mobile-settings-toggle" data-cursor data-cursor-label="Settings">
        <i data-lucide="cog" aria-hidden="true"></i>
      </button>
    `;
  } else if (document.body.dataset.page === "work") {
    bar.innerHTML = `
      <a class="mobile-tabbar__link is-active" href="#work-hero" data-section-link="work-hero">Intro</a>
      <a class="mobile-tabbar__link" href="#featured-section" data-section-link="featured-section">Featured</a>
      <a class="mobile-tabbar__link" href="#archive-section" data-section-link="archive-section">Archive</a>
      <a class="mobile-tabbar__link" href="#positioning-section" data-section-link="positioning-section">Positioning</a>
      <button type="button" class="mobile-tabbar__button" id="mobile-settings-toggle" data-cursor data-cursor-label="Settings">
        <i data-lucide="cog" aria-hidden="true"></i>
      </button>
    `;
  } else {
    bar.innerHTML = `
      <a class="mobile-tabbar__link ${document.body.dataset.page === "home" ? "is-active" : ""}" href="${prefix}/index.html">Home</a>
      <a class="mobile-tabbar__link ${document.body.dataset.page === "work" ? "is-active" : ""}" href="${prefix}/work.html">Work</a>
      <a class="mobile-tabbar__link ${document.body.dataset.page === "approach" ? "is-active" : ""}" href="${prefix}/approach.html">Approach</a>
      <a class="mobile-tabbar__link ${document.body.dataset.page === "contact" ? "is-active" : ""}" href="${prefix}/contact.html">Contact</a>
      <button type="button" class="mobile-tabbar__button" id="mobile-settings-toggle" data-cursor data-cursor-label="Settings">
        <i data-lucide="cog" aria-hidden="true"></i>
      </button>
    `;
  }
  site.appendChild(bar);
  elements.mobileSettingsButton = bar.querySelector("#mobile-settings-toggle");
  elements.sectionLinks = [...document.querySelectorAll("[data-section-link]")];
}

function injectDog() {
  const site = document.querySelector(".site");
  if (document.body.dataset.page !== "home" || !site || document.querySelector(".dog-easter-egg")) return;

  const dog = document.createElement("aside");
  dog.className = "dog-easter-egg";
  dog.innerHTML = `
    <div class="dog-easter-egg__note">You found Dante.</div>
    <button type="button" class="dog-easter-egg__button" data-cursor data-cursor-label="Dante" aria-label="You found Dante">
      <img src="assets/hvmdi/dog_no_bg.png" class="dog-easter-egg__image" alt="" draggable="false" />
    </button>
  `;
  site.appendChild(dog);

  const button = dog.querySelector(".dog-easter-egg__button");
  const note = dog.querySelector(".dog-easter-egg__note");
  let activeTargetId = "hero-name";
  let moveTimer = 0;
  let hideTimer = 0;
  let showTimer = 0;

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  const targetFromElement = (element, id, offsetX = 0, offsetY = 0) => {
    if (!element) return null;
    const rect = element.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return null;
    return {
      id,
      x: rect.left + rect.width / 2 + offsetX,
      y: rect.top + rect.height / 2 + offsetY
    };
  };

  const getTargets = () => {
    const heroCta = document.querySelector(".page-hero__cta");
    const settingsTrigger = document.getElementById("settings-trigger");
    const mobileSettingsTrigger = document.getElementById("mobile-settings-toggle");
    const topMeta = document.querySelector(".top-meta");

    return [
      { id: "top-left", x: 42, y: 126 },
      { id: "top-right", x: window.innerWidth - 42, y: 126 },
      { id: "left-middle", x: 38, y: window.innerHeight * 0.45 },
      { id: "right-middle", x: window.innerWidth - 38, y: window.innerHeight * 0.45 },
      { id: "bottom-left", x: 68, y: window.innerHeight - 118 },
      { id: "bottom-right", x: window.innerWidth - 68, y: window.innerHeight - 118 },
      targetFromElement(heroCta, "hero-cta", 0, -42),
      targetFromElement(settingsTrigger, "settings", 0, -34),
      targetFromElement(mobileSettingsTrigger, "mobile-settings", 0, -42),
      targetFromElement(topMeta, "meta", 0, 38)
    ].filter(Boolean);
  };

  const moveDogTo = (target, immediate = false) => {
    if (!target) return;

    const width = dog.offsetWidth || 48;
    const height = dog.offsetHeight || 56;
    const left = clamp(target.x - width / 2, 10, window.innerWidth - width - 10);
    const top = clamp(target.y - height / 2, 10, window.innerHeight - height - 10);

    if (immediate) {
      dog.classList.add("is-snapping");
    }

    dog.style.left = `${left}px`;
    dog.style.top = `${top}px`;
    dog.classList.toggle("is-flipped", left + width / 2 > window.innerWidth / 2);
    activeTargetId = target.id;

    if (immediate) {
      requestAnimationFrame(() => {
        dog.classList.remove("is-snapping");
      });
    }
  };

  const pickNextTarget = (immediate = false) => {
    const targets = getTargets();
    if (targets.length === 0) return null;

    let nextTarget = targets.find((target) => target.id === activeTargetId) || targets[0];
    if (!immediate) {
      const nextOptions = targets.filter((target) => target.id !== activeTargetId);
      nextTarget = nextOptions[Math.floor(Math.random() * nextOptions.length)] || nextTarget;
    }

    return nextTarget;
  };

  const hideDog = () => {
    if (easterEggState.dogFound) return;
    dog.classList.remove("is-visible", "is-found");
    window.clearTimeout(showTimer);
    showTimer = window.setTimeout(() => {
      showDog();
    }, 14000);
  };

  const showDog = ({ immediate = false } = {}) => {
    if (easterEggState.dogFound) return;
    const nextTarget = pickNextTarget(immediate);
    if (!nextTarget) return;
    moveDogTo(nextTarget, immediate);
    dog.classList.add("is-visible");
    window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(() => {
      hideDog();
    }, 4000);
  };

  button.addEventListener("click", () => {
    if (easterEggState.dogFound || !dog.classList.contains("is-visible")) return;
    easterEggState.dogFound = true;
    if (note) note.textContent = "Small easter egg found";
    dog.classList.add("is-found");
    window.clearTimeout(hideTimer);
    window.clearTimeout(showTimer);
    launchDogFireworks();
    window.setTimeout(() => {
      dog.remove();
      activateDogCursor();
    }, 2400);
  });

  window.addEventListener("resize", () => {
    window.clearTimeout(moveTimer);
    moveTimer = window.setTimeout(() => {
      if (easterEggState.dogFound) return;
      const currentTarget = pickNextTarget(true);
      moveDogTo(currentTarget, true);
    }, 90);
  });

  showTimer = window.setTimeout(() => {
    showDog({ immediate: true });
  }, 14000);
}

function launchDogFireworks() {
  const canvas = document.createElement("canvas");
  canvas.className = "dog-fireworks";
  document.body.appendChild(canvas);

  const context = canvas.getContext("2d");
  if (!context) {
    canvas.remove();
    return;
  }

  const particles = [];
  const colors = ["#ff6a00", "#4f6bff", "#101010", "#ffd166", "#ffffff"];
  const gravity = 0.05;
  const friction = 0.985;
  let rafId = 0;

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  const createBurst = (x, y, count = 28) => {
    for (let index = 0; index < count; index += 1) {
      const angle = (Math.PI * 2 * index) / count;
      const speed = 2 + Math.random() * 3.2;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 1.2,
        life: 1,
        decay: 0.012 + Math.random() * 0.014,
        color: colors[Math.floor(Math.random() * colors.length)],
        radius: 1.8 + Math.random() * 2.8
      });
    }
  };

  resize();
  const bursts = [
    { x: window.innerWidth * 0.24, y: window.innerHeight * 0.28 },
    { x: window.innerWidth * 0.52, y: window.innerHeight * 0.2 },
    { x: window.innerWidth * 0.76, y: window.innerHeight * 0.34 },
    { x: window.innerWidth * 0.34, y: window.innerHeight * 0.54 },
    { x: window.innerWidth * 0.68, y: window.innerHeight * 0.48 }
  ];

  bursts.forEach((burst, index) => {
    window.setTimeout(() => {
      createBurst(burst.x, burst.y);
    }, index * 180);
  });

  const render = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let index = particles.length - 1; index >= 0; index -= 1) {
      const particle = particles[index];
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= friction;
      particle.vy = particle.vy * friction + gravity;
      particle.life -= particle.decay;

      if (particle.life <= 0) {
        particles.splice(index, 1);
        continue;
      }

      context.globalAlpha = particle.life;
      context.fillStyle = particle.color;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
    }

    context.globalAlpha = 1;

    if (particles.length > 0) {
      rafId = window.requestAnimationFrame(render);
    } else {
      window.cancelAnimationFrame(rafId);
      canvas.remove();
    }
  };

  window.requestAnimationFrame(render);
  window.addEventListener("resize", resize, { once: true });
}

function activateDogCursor() {
  if (!elements.cursor || !window.matchMedia("(pointer: fine)").matches) return;
  easterEggState.dogCursor = true;
  document.body.classList.add("dog-cursor-active");
  elements.cursor.classList.add("is-visible");
  elements.cursor.classList.remove("is-active", "has-label");
  elements.cursorLabel.textContent = "";
}

function prepareLoader() {
  if (!elements.loader) return [];

  const rawTokens = [...elements.loader.querySelectorAll(".loader__token")];
  rawTokens.forEach((token) => {
    const value = token.textContent.trim();
    if (value === "|") {
      token.remove();
      return;
    }
    token.dataset.token = value;
  });

  if (!elements.loader.querySelector(".loader__subline")) {
    const subline = document.createElement("div");
    subline.className = "loader__subline";
    subline.textContent = "Product systems for ambitious teams";
    elements.loader.appendChild(subline);
  }

  return [...elements.loader.querySelectorAll(".loader__token")];
}

async function runLoader() {
  if (!elements.loader) return;
  const loaderTokens = prepareLoader();

  elements.loader.classList.add("is-drawing");

  if (prefersReducedMotion) {
    loaderTokens.forEach((token) => token.classList.add("is-visible"));
    await sleep(260);
  } else {
    await sleep(220);
    for (const token of loaderTokens) {
      token.classList.add("is-visible");
      await sleep(70);
    }
    await sleep(620);
  }

  elements.loader.classList.add("is-hidden");
  await sleep(420);
}

function updateTime() {
  if (!elements.metaTime) return;
  const now = new Date();
  const pageNameMap = {
    home: "HOME",
    work: "WORK",
    approach: "APPROACH",
    contact: "CONTACT"
  };
  const day = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "Africa/Tunis"
  }).format(now);
  const month = new Intl.DateTimeFormat("en-US", {
    month: "short",
    timeZone: "Africa/Tunis"
  }).format(now);
  const date = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    timeZone: "Africa/Tunis"
  }).format(now);
  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Africa/Tunis"
  }).format(now);

  const pageKey = document.body.dataset.page || "home";
  elements.metaTime.textContent = `HVMDI / ${pageNameMap[pageKey] || pageKey.toUpperCase()}`;
  const progressMeta = document.getElementById("progress-datetime");
  if (progressMeta) {
    progressMeta.textContent = `${time} / ${day}, ${month} ${date}`;
  }
}

function initRevealObserver() {
  if (prefersReducedMotion) {
    elements.revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.16 }
  );

  elements.revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 35, 180)}ms`;
    observer.observe(item);
  });
}

function initPageNav() {
  const currentPage = document.body.dataset.page || "home";
  elements.navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.pageLink === currentPage);
  });
}

function initSectionNav() {
  if (elements.sectionLinks.length === 0) return;

  const sections = [...document.querySelectorAll("[data-observe-section]")];
  if (sections.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const active = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!active) return;

      elements.sectionLinks.forEach((link) => {
        link.classList.toggle("is-active", link.dataset.sectionLink === active.target.id);
      });
    },
    {
      threshold: [0.2, 0.45, 0.6],
      rootMargin: "-20% 0px -35% 0px"
    }
  );

  sections.forEach((section) => observer.observe(section));
}

function syncUiState() {
  document.documentElement.dataset.fontsize = state.fontSize;
  document.documentElement.dataset.theme = state.theme;
  document.documentElement.dataset.contrast = state.contrast;
  saveSessionState();

  if (elements.collabToggle) {
    elements.collabToggle.setAttribute("aria-pressed", String(state.collaboration));
  }
  if (elements.collabLabel) {
    elements.collabLabel.textContent = state.collaboration ? "Collaboration settings on" : "Collaboration settings off";
  }
  if (elements.settingsCollabToggle) {
    elements.settingsCollabToggle.classList.toggle("is-active", state.collaboration);
    elements.settingsCollabToggle.setAttribute("aria-pressed", String(state.collaboration));
    elements.settingsCollabToggle.textContent = state.collaboration ? "On" : "Off";
  }
  if (elements.mobileSettingsButton) {
    elements.mobileSettingsButton.classList.toggle("is-active", elements.settingsPanel?.classList.contains("is-open"));
  }

  elements.fontSizeButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.fontsizeOption === state.fontSize);
  });
  elements.themeButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.themeOption === state.theme);
  });
  elements.contrastButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.contrastOption === state.contrast);
  });
}

function initScrollProgress() {
  const update = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const ratio = Math.min(1, Math.max(0, window.scrollY / max));
    document.documentElement.style.setProperty("--progress", `${ratio * 100}%`);
    document.body.dataset.progressLabel = `${Math.round(ratio * 100)}%`;
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

function initSettings() {
  syncUiState();

  if (!elements.settingsTrigger || !elements.settingsPanel) return;

  const togglePanel = () => {
    elements.settingsPanel.classList.toggle("is-open");
    elements.settingsTrigger.setAttribute(
      "aria-expanded",
      String(elements.settingsPanel.classList.contains("is-open"))
    );
    if (elements.mobileSettingsButton) {
      elements.mobileSettingsButton.classList.toggle("is-active", elements.settingsPanel.classList.contains("is-open"));
    }
  };

  elements.settingsTrigger.addEventListener("click", (event) => {
    event.stopPropagation();
    togglePanel();
  });

  elements.settingsPanel.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  document.addEventListener("click", () => {
    elements.settingsPanel.classList.remove("is-open");
    elements.settingsTrigger.setAttribute("aria-expanded", "false");
    if (elements.mobileSettingsButton) {
      elements.mobileSettingsButton.classList.remove("is-active");
    }
  });

  if (elements.mobileSettingsButton) {
    elements.mobileSettingsButton.addEventListener("click", (event) => {
      event.stopPropagation();
      togglePanel();
    });
  }

  elements.fontSizeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.fontSize = button.dataset.fontsizeOption;
      syncUiState();
    });
  });

  elements.themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.theme = button.dataset.themeOption;
      syncUiState();
    });
  });

  elements.contrastButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.contrast = button.dataset.contrastOption;
      syncUiState();
    });
  });

  if (elements.settingsCollabToggle) {
    elements.settingsCollabToggle.addEventListener("click", () => {
      state.collaboration = !state.collaboration;
      syncUiState();
    });
  }
}

function initCursor() {
  if (!elements.cursor || !window.matchMedia("(pointer: fine)").matches) return;

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let tx = x;
  let ty = y;
  let width = 12;
  let height = 12;
  let targetWidth = 12;
  let targetHeight = 12;
  let radius = 3;
  let targetRadius = 3;
  let hovered = null;
  let hoveredGeometry = null;
  let locked = false;
  let rafId = null;
  const dogCursorSize = 22;
  const maxCursorWidth = 220;
  const maxCursorHeight = 72;

  const getCursorGeometryTarget = (el) => {
    if (!el) return null;
    if (el.matches?.(".list-row")) {
      return el.querySelector(".list-row__action") || el.querySelector(".list-row__title") || el;
    }
    return el;
  };

  const getTargetRect = (el) => {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left,
      top: rect.top,
      width: Math.min(rect.width, maxCursorWidth),
      height: Math.min(rect.height, maxCursorHeight)
    };
  };

  const resetDogCursor = () => {
    targetWidth = 0;
    targetHeight = 0;
    targetRadius = 0;
    elements.cursor.classList.remove("is-active", "has-label");
    elements.cursorLabel.textContent = "";
  };

  const resetCursor = () => {
    hovered = null;
    hoveredGeometry = null;
    locked = false;
    if (easterEggState.dogCursor) {
      resetDogCursor();
      return;
    }
    targetWidth = 12;
    targetHeight = 12;
    targetRadius = 3;
    elements.cursor.classList.remove("is-active", "has-label");
    elements.cursorLabel.textContent = "HVMDI";
  };

  const morph = (el) => {
    const geometryTarget = getCursorGeometryTarget(el);
    const rect = getTargetRect(geometryTarget);
    const style = getComputedStyle(geometryTarget);
    hovered = el;
    hoveredGeometry = geometryTarget;
    locked = true;
    if (easterEggState.dogCursor) {
      tx = rect.left;
      ty = rect.top;
      targetWidth = Math.max(18, rect.width);
      targetHeight = Math.max(18, rect.height);
      targetRadius = parseFloat(style.borderTopLeftRadius) || 3;
    } else {
      tx = rect.left + rect.width / 2;
      ty = rect.top + rect.height / 2;
      targetWidth = Math.max(18, rect.width);
      targetHeight = Math.max(18, rect.height);
      targetRadius = parseFloat(style.borderTopLeftRadius) || 3;
    }
    elements.cursor.classList.add("is-active");
    if (easterEggState.dogCursor) {
      elements.cursor.classList.remove("has-label");
      elements.cursorLabel.textContent = "";
      return;
    }
    const label = el.dataset.cursorLabel;
    if (label) {
      elements.cursor.classList.add("has-label");
      elements.cursorLabel.textContent = label;
    } else {
      elements.cursor.classList.remove("has-label");
      elements.cursorLabel.textContent = "HVMDI";
    }
  };

  const step = () => {
    const dogDocked = easterEggState.dogCursor && locked && hovered;
    if (locked && hovered && hoveredGeometry) {
      const rect = getTargetRect(hoveredGeometry);
      if (easterEggState.dogCursor) {
        tx = rect.left;
        ty = rect.top;
      } else {
        tx = rect.left + rect.width / 2;
        ty = rect.top + rect.height / 2;
      }
      targetWidth = Math.max(18, rect.width);
      targetHeight = Math.max(18, rect.height);
    }

    x += (tx - x) * 0.14;
    y += (ty - y) * 0.14;
    width += (targetWidth - width) * 0.18;
    height += (targetHeight - height) * 0.18;
    radius += (targetRadius - radius) * 0.18;

    elements.cursor.classList.toggle("is-docked", dogDocked);
    elements.cursor.style.transform = dogDocked
      ? `translate3d(${x}px, ${y}px, 0)`
      : `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    elements.cursorShape.style.width = `${width}px`;
    elements.cursorShape.style.height = `${height}px`;
    elements.cursorShape.style.borderRadius = `${radius}px`;
    rafId = requestAnimationFrame(step);
  };

  document.addEventListener("mousemove", (event) => {
    if (!locked || easterEggState.dogCursor) {
      tx = event.clientX;
      ty = event.clientY;
    }
    elements.cursor.classList.add("is-visible");
    if (!rafId) step();
  });

  document.addEventListener("mouseover", (event) => {
    const interactive = event.target.closest("[data-cursor], a, button");
    if (interactive) {
      morph(interactive);
    } else {
      resetCursor();
    }
  });

  document.addEventListener("mouseout", (event) => {
    if (hovered && event.target.closest("[data-cursor], a, button") === hovered) {
      const next = event.relatedTarget?.closest?.("[data-cursor], a, button");
      if (next) {
        morph(next);
      } else {
        resetCursor();
      }
    }
  });

  document.addEventListener("mousedown", () => {
    if (easterEggState.dogCursor) {
      document.body.classList.add("dog-cursor-pressed");
    }
  });

  document.addEventListener("mouseup", () => {
    document.body.classList.remove("dog-cursor-pressed");
  });
}

function initWordSystem() {
  if (!elements.stage || elements.words.length === 0) return;

  const defaults = elements.words.map((word, index) => {
    const baseX = Number(word.dataset.baseX || 0);
    const baseY = Number(word.dataset.baseY || 0);
    word.style.setProperty("--offset-x", `${baseX}px`);
    word.style.setProperty("--offset-y", `${baseY}px`);
    return {
      word,
      index,
      baseX,
      baseY,
      offsetX: 0,
      offsetY: 0,
      pinnedUntil: 0
    };
  });

  const writeOffset = (item) => {
    item.word.style.setProperty("--offset-x", `${item.baseX + item.offsetX}px`);
    item.word.style.setProperty("--offset-y", `${item.baseY + item.offsetY}px`);
  };

  let active = null;

  defaults.forEach((item) => {
    item.word.addEventListener("pointerdown", (event) => {
    if (!state.collaboration || window.innerWidth < 821) return;
      active = {
        item,
        startX: event.clientX,
        startY: event.clientY,
        offsetX: item.offsetX,
        offsetY: item.offsetY
      };
      item.word.classList.add("is-dragging");
      document.body.classList.add("dragging");
      item.word.setPointerCapture(event.pointerId);
    });
  });

  window.addEventListener("pointermove", (event) => {
    if (active) {
      active.item.offsetX = active.offsetX + (event.clientX - active.startX);
      active.item.offsetY = active.offsetY + (event.clientY - active.startY);
      active.item.pinnedUntil = Date.now() + 7000;
      writeOffset(active.item);
      return;
    }

    if (!state.collaboration || prefersReducedMotion || window.innerWidth < 821) return;

    const rect = elements.stage.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;

    defaults.forEach((item, index) => {
      if (Date.now() < item.pinnedUntil) return;
      const strength = (index + 1) * 6;
      item.offsetX += (px * strength - item.offsetX) * 0.08;
      item.offsetY += (py * strength - item.offsetY) * 0.08;
      writeOffset(item);
    });
  });

  window.addEventListener("pointerup", () => {
    if (!active) return;
    active.item.word.classList.remove("is-dragging");
    document.body.classList.remove("dragging");
    active = null;
  });

  if (elements.collabToggle) {
    elements.collabToggle.addEventListener("click", () => {
      state.collaboration = !state.collaboration;
      syncUiState();

      if (!state.collaboration) {
        defaults.forEach((item) => {
          item.offsetX = 0;
          item.offsetY = 0;
          item.pinnedUntil = 0;
          writeOffset(item);
        });
      }
    });
  }
}

function initDriftItems() {
  if (elements.driftItems.length === 0) return;

  const items = elements.driftItems.map((node, index) => {
    const baseX = Number(node.dataset.baseX || 0);
    const baseY = Number(node.dataset.baseY || 0);
    node.style.setProperty("--offset-x", `${baseX}px`);
    node.style.setProperty("--offset-y", `${baseY}px`);
    return {
      node,
      index,
      baseX,
      baseY,
      offsetX: 0,
      offsetY: 0,
      targetX: 0,
      targetY: 0,
      pinnedUntil: 0
    };
  });

  const writeOffset = (item) => {
    item.node.style.setProperty("--offset-x", `${item.baseX + item.offsetX}px`);
    item.node.style.setProperty("--offset-y", `${item.baseY + item.offsetY}px`);
  };

  let active = null;

  items.forEach((item) => {
    item.node.addEventListener("pointerdown", (event) => {
      if (!state.collaboration || window.innerWidth < 821) return;
      active = {
        item,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        offsetX: item.offsetX,
        offsetY: item.offsetY
      };
      item.node.classList.add("is-dragging");
      document.body.classList.add("dragging");
      item.node.setPointerCapture(event.pointerId);
    });
  });

  window.addEventListener("pointermove", (event) => {
    if (active) {
      if (event.pointerId !== active.pointerId) return;
      active.item.offsetX = active.offsetX + (event.clientX - active.startX);
      active.item.offsetY = active.offsetY + (event.clientY - active.startY);
      active.item.targetX = active.item.offsetX;
      active.item.targetY = active.item.offsetY;
      active.item.pinnedUntil = Date.now() + 7000;
      writeOffset(active.item);
      return;
    }

    if (!state.collaboration || prefersReducedMotion || window.innerWidth < 821) return;
    const px = event.clientX / window.innerWidth - 0.5;
    const py = event.clientY / window.innerHeight - 0.5;

    items.forEach((item, index) => {
      if (Date.now() < item.pinnedUntil) return;
      const strength = 5 + index * 1.4;
      item.targetX = px * strength;
      item.targetY = py * strength;
    });
  });

  window.addEventListener("pointerup", (event) => {
    if (!active || event.pointerId !== active.pointerId) return;
    active.item.node.classList.remove("is-dragging");
    document.body.classList.remove("dragging");
    active = null;
  });

  const tick = () => {
    items.forEach((item) => {
      if (!state.collaboration || window.innerWidth < 821) {
        item.targetX = 0;
        item.targetY = 0;
        item.pinnedUntil = 0;
      } else if (Date.now() >= item.pinnedUntil && !active) {
        item.targetX *= 0.92;
        item.targetY *= 0.92;
      }

      item.offsetX += (item.targetX - item.offsetX) * 0.12;
      item.offsetY += (item.targetY - item.offsetY) * 0.12;
      writeOffset(item);
    });

    window.requestAnimationFrame(tick);
  };

  window.requestAnimationFrame(tick);
}

async function boot() {
  loadSessionState();
  document.documentElement.dataset.theme = state.theme;
  document.documentElement.dataset.fontsize = state.fontSize;
  document.documentElement.dataset.contrast = state.contrast;
  injectSettings();
  injectProgressMeta();
  injectMobileChrome();
  injectDog();
  updateTime();
  setInterval(updateTime, 1000);
  if (window.lucide) {
    window.lucide.createIcons();
  }
  initPageNav();
  initSectionNav();
  initSettings();
  initScrollProgress();
  await runLoader();
  initRevealObserver();
  initCursor();
  initWordSystem();
  initDriftItems();
}

boot();
