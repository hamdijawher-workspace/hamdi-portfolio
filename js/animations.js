function splitWords(element) {
  const text = element.textContent?.trim();
  if (!text || element.dataset.splitReady === "true") {
    return [];
  }

  element.dataset.splitReady = "true";
  const words = text.split(/\s+/);
  element.innerHTML = words
    .map(
      (word) =>
        `<span class="split-word" style="display:inline-block;will-change:transform,opacity,filter;">${word}&nbsp;</span>`
    )
    .join("");

  return [...element.querySelectorAll(".split-word")];
}

function initHeroAnimation() {
  const gsap = window.gsap;
  if (!gsap) return;

  const heroWords = document.querySelectorAll("[data-split='words']");
  heroWords.forEach((element) => {
    const words = splitWords(element);
    if (!words.length) return;

    gsap.from(words, {
      y: 26,
      opacity: 0,
      filter: "blur(8px)",
      duration: 0.85,
      stagger: 0.035,
      ease: "power2.out",
      delay: 0.45
    });
  });

  gsap.from("[data-animate='hero'] > *:not([data-split='words'])", {
    y: 22,
    opacity: 0,
    filter: "blur(8px)",
    duration: 0.8,
    stagger: 0.08,
    ease: "power2.out",
    delay: 0.6
  });
}

function initScrollAnimations() {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll("[data-reveal='card']").forEach((card, index) => {
    gsap.from(card, {
      y: 32,
      opacity: 0,
      filter: "blur(8px)",
      duration: 0.85,
      ease: "power2.out",
      delay: index < 2 ? 0.15 * index : 0,
      scrollTrigger: {
        trigger: card,
        start: "top 88%"
      }
    });
  });

  document.querySelectorAll(".divider").forEach((divider) => {
    gsap.fromTo(
      divider,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: divider,
          start: "top 92%"
        }
      }
    );
  });

  const footer = document.querySelector(".footer-card");
  if (footer) {
    gsap.from(footer, {
      y: 28,
      opacity: 0,
      filter: "blur(10px)",
      duration: 0.9,
      ease: "power2.out",
      scrollTrigger: {
        trigger: footer,
        start: "top bottom"
      }
    });
  }
}

function initPreloaderAndTransition() {
  const gsap = window.gsap;
  const preloader = document.querySelector(".preloader");
  const transition = document.querySelector(".page-transition");
  if (!gsap || !preloader || !transition || preloader.dataset.ready === "true") return;

  preloader.dataset.ready = "true";

  gsap.set(transition, { opacity: 0, pointerEvents: "none" });
  gsap
    .timeline({ defaults: { ease: "power3.inOut" } })
    .fromTo(preloader.querySelector(".preloader__mark"), { yPercent: 100, opacity: 0, filter: "blur(8px)" }, {
      yPercent: 0,
      opacity: 1,
      filter: "blur(0px)",
      duration: 0.55
    })
    .to(preloader.querySelector(".preloader__mark"), {
      yPercent: -100,
      opacity: 0,
      filter: "blur(8px)",
      duration: 0.35,
      delay: 0.3
    })
    .to(preloader, {
      yPercent: 100,
      duration: 0.5,
      onComplete: () => {
        preloader.style.display = "none";
      }
    }, "-=0.1");

  const internalLinks = document.querySelectorAll("a[href]");
  internalLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("http") || link.target === "_blank") {
      return;
    }

    link.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      event.preventDefault();
      gsap.to(transition, {
        opacity: 1,
        pointerEvents: "auto",
        duration: 0.32,
        onComplete: () => {
          window.location.href = href;
        }
      });
    });
  });
}

export function initAnimations() {
  let attempts = 0;

  const boot = () => {
    if (window.gsap) {
      initPreloaderAndTransition();
      initHeroAnimation();
      initScrollAnimations();
      return;
    }

    attempts += 1;

    if (attempts < 80) {
      window.requestAnimationFrame(boot);
      return;
    }

    const preloader = document.querySelector(".preloader");
    if (preloader) {
      preloader.style.display = "none";
    }
  };

  boot();
}
