(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const body = document.body;
  const isSafari = /Safari/i.test(navigator.userAgent) && !/(Chrome|Chromium|CriOS|Edg|OPR|FxiOS)/i.test(navigator.userAgent);
  const header = document.querySelector(".site-header");
  const progress = document.querySelector(".site-progress");
  const menuButton = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  const lightbox = document.querySelector(".lightbox");
  const loader = document.querySelector(".loader");
  const loaderCount = document.querySelector(".loader__count");
  const loaderFill = document.querySelector(".loader__logo-fill");
  const loaderLine = document.querySelector(".loader__line i");
  const cursor = document.querySelector(".cursor-dot");
  const cursorLabel = cursor?.querySelector("span");
  const hoverPreview = document.querySelector(".hover-preview");
  let lastFocus = null;

  body.classList.toggle("is-safari", isSafari);
  body.classList.add("is-ready");

  if (body.classList.contains("home-v3")) {
    const practiceSection = document.querySelector("#practice");
    const workSection = document.querySelector("#work");
    if (practiceSection && workSection) workSection.before(practiceSection);
  }

  if (loader) {
    const startedAt = performance.now();
    const duration = reduced ? 50 : 1450;
    const countUp = (now) => {
      const progressValue = Math.min(1, (now - startedAt) / duration);
      const easedValue = 1 - Math.pow(1 - progressValue, 3);
      const percentage = Math.round(easedValue * 100);
      if (loaderCount) loaderCount.textContent = `${String(percentage).padStart(3, "0")}%`;
      if (loaderFill) loaderFill.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
      if (loaderLine) loaderLine.style.width = `${percentage}%`;
      if (progressValue < 1) requestAnimationFrame(countUp);
      else {
        body.classList.add("is-loaded");
        setTimeout(() => loader.remove(), 650);
      }
    };
    requestAnimationFrame(countUp);
  } else {
    body.classList.add("is-loaded");
  }

  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  const updateChrome = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const amount = max > 0 ? (scrollY / max) * 100 : 0;
    if (progress) progress.style.width = `${amount}%`;
    header?.classList.toggle("is-scrolled", scrollY > 32);
  };
  let chromeFrame = 0;
  const requestChromeUpdate = () => {
    if (chromeFrame) return;
    chromeFrame = requestAnimationFrame(() => {
      chromeFrame = 0;
      updateChrome();
    });
  };
  addEventListener("scroll", requestChromeUpdate, { passive: true });
  updateChrome();

  const setMenu = (open) => {
    mobileMenu?.classList.toggle("is-open", open);
    body.classList.toggle("menu-open", open);
    menuButton?.setAttribute("aria-expanded", String(open));
    menuButton?.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    const menuText = menuButton?.querySelector(":scope > span:first-child");
    if (menuText) menuText.textContent = open ? "Close" : "Menu";
    if (open) {
      lastFocus = document.activeElement;
      mobileMenu?.querySelector("a")?.focus();
    } else if (lastFocus instanceof HTMLElement) lastFocus.focus();
  };
  menuButton?.addEventListener("click", () => setMenu(!mobileMenu?.classList.contains("is-open")));
  mobileMenu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));

  if (!reduced && !isSafari && cursor && matchMedia("(pointer:fine)").matches) {
    let pointerX = -40;
    let pointerY = -40;
    let cursorX = -40;
    let cursorY = -40;
    let previewX = -500;
    let previewY = -500;

    addEventListener("pointermove", (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
    }, { passive: true });

    const renderPointer = () => {
      cursorX += (pointerX - cursorX) * .24;
      cursorY += (pointerY - cursorY) * .24;
      previewX += (pointerX + 28 - previewX) * .12;
      previewY += (pointerY + 28 - previewY) * .12;
      cursor.style.transform = `translate3d(${cursorX - cursor.offsetWidth / 2}px,${cursorY - cursor.offsetHeight / 2}px,0)`;
      if (hoverPreview) hoverPreview.style.transform = `translate3d(${previewX}px,${previewY}px,0) scale(${hoverPreview.classList.contains("is-visible") ? 1 : .86}) rotate(-2deg)`;
      requestAnimationFrame(renderPointer);
    };
    requestAnimationFrame(renderPointer);

    document.querySelectorAll("a, button, [data-cursor-label]").forEach((target) => {
      target.addEventListener("pointerenter", () => {
        const label = target.dataset.cursorLabel || "";
        cursor.classList.toggle("is-active", Boolean(label));
        if (cursorLabel) cursorLabel.textContent = label;
      });
      target.addEventListener("pointerleave", () => {
        cursor.classList.remove("is-active");
        if (cursorLabel) cursorLabel.textContent = "";
      });
    });

    document.querySelectorAll("[data-preview-src]").forEach((target) => {
      target.addEventListener("pointerenter", () => {
        if (!hoverPreview) return;
        const image = hoverPreview.querySelector("img");
        const video = hoverPreview.querySelector("video");
        const caption = hoverPreview.querySelector("span");
        const isVideo = target.dataset.previewType === "video";
        if (image) {
          image.style.display = isVideo ? "none" : "block";
          if (!isVideo) image.src = target.dataset.previewSrc || "";
        }
        if (video) {
          video.style.display = isVideo ? "block" : "none";
          if (isVideo) {
            video.src = target.dataset.previewSrc || "";
            video.play().catch(() => {});
          }
        }
        if (caption) caption.textContent = target.querySelector("h3")?.textContent || "Preview";
        hoverPreview.classList.add("is-visible");
      });
      target.addEventListener("pointerleave", () => {
        if (!hoverPreview) return;
        hoverPreview.classList.remove("is-visible");
        const video = hoverPreview.querySelector("video");
        video?.pause();
      });
    });

    document.querySelectorAll(".magnetic").forEach((target) => {
      target.addEventListener("pointermove", (event) => {
        const box = target.getBoundingClientRect();
        const x = (event.clientX - box.left - box.width / 2) * .18;
        const y = (event.clientY - box.top - box.height / 2) * .24;
        target.style.transform = `translate3d(${x}px,${y}px,0)`;
      });
      target.addEventListener("pointerleave", () => { target.style.transform = ""; });
    });
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -7%" });
  document.querySelectorAll("[data-reveal]").forEach((node) => {
    if (reduced) node.classList.add("is-visible");
    else revealObserver.observe(node);
  });

  const chapters = [...document.querySelectorAll("[data-chapter]")];
  const railLinks = [...document.querySelectorAll(".chapter-rail a")];
  const chapterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      railLinks.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`));
      body.classList.toggle("theme-light", entry.target.dataset.theme === "light");
    });
  }, { threshold: 0, rootMargin: "-42% 0px -42%" });
  chapters.forEach((chapter) => chapterObserver.observe(chapter));

  const videos = [...document.querySelectorAll("video[data-autoplay]")];
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      if (entry.isIntersecting && !reduced) video.play().catch(() => {});
      else video.pause();
    });
  }, { threshold: 0.35 });
  videos.forEach((video) => videoObserver.observe(video));
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) videos.forEach((video) => video.pause());
  });

  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.dataset.filter;
      document.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("is-active", item === button));
      document.querySelectorAll("[data-category]").forEach((card) => {
        card.hidden = value !== "all" && !card.dataset.category.split(" ").includes(value);
      });
    });
  });

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    body.classList.remove("modal-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.querySelector("img")?.removeAttribute("src");
    if (lastFocus instanceof HTMLElement) lastFocus.focus();
  };
  document.querySelectorAll("[data-lightbox]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!lightbox) return;
      lastFocus = button;
      const image = lightbox.querySelector("img");
      if (image) {
        image.src = button.dataset.lightbox || "";
        image.alt = button.querySelector("img")?.alt || "Expanded project image";
      }
      lightbox.classList.add("is-open");
      body.classList.add("modal-open");
      lightbox.setAttribute("aria-hidden", "false");
      lightbox.querySelector("button")?.focus();
    });
  });
  lightbox?.querySelector("button")?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (event) => { if (event.target === lightbox) closeLightbox(); });
  addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (lightbox?.classList.contains("is-open")) closeLightbox();
      else if (mobileMenu?.classList.contains("is-open")) setMenu(false);
    }
  });

  if (!reduced && !isSafari && window.Lenis) {
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 0.9 });
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const target = document.querySelector(link.getAttribute("href"));
        if (!target) return;
        event.preventDefault();
        const destination = link.getAttribute("href") === "#opening" ? 0 : target;
        lenis.scrollTo(destination, { offset: destination === 0 ? 0 : -68, duration: 1.1 });
      });
    });
  }

  if (!reduced && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true });
    const narrativeHero = document.querySelector(".hero-v2");
    const legacyHero = document.querySelector(".hero");
    if (narrativeHero) {
      const heroTimeline = gsap.timeline({ scrollTrigger: { trigger: narrativeHero, start: "top top", end: "+=190%", scrub: 0.65, pin: true, anticipatePin: 1 } });
      heroTimeline
        .to(".hero-v2__echo--left", { xPercent: -16, opacity: .04, ease: "none" }, 0)
        .to(".hero-v2__echo--right", { xPercent: 16, opacity: .04, ease: "none" }, 0)
        .to(".hero-v2__portrait", { clipPath: "inset(7% 16% 0 16%)", scale: .92, yPercent: 7, ease: "none" }, 0)
        .to("[data-hero-word]:first-child", { xPercent: -18, ease: "none" }, 0)
        .to("[data-hero-word]:last-child", { xPercent: 18, ease: "none" }, 0)
        .to(".hero-v2__copy h1", { yPercent: -90, opacity: 0, ease: "none" }, .08)
        .to(".hero-v2__role, .hero-v2__cta, .hero-v2__edition", { opacity: 0, ease: "none" }, .15)
        .to(".hero-v2__note span", { xPercent: -160, opacity: 0, stagger: .04, ease: "power1.in" }, .12)
        .to(".hero-scroll-hint", { y: 18, opacity: 0, ease: "none" }, .22)
        .to(narrativeHero, { backgroundColor: body.classList.contains("home-v3") ? "#ffffff" : "#0a0a0a", ease: "none" }, .58)
        .to(".hero-v2__portrait", { opacity: 0, ease: "none" }, .72)
        .to(".hero-v2__name", { color: body.classList.contains("home-v3") ? "#0a0a0a" : "#ffffff", opacity: .1, ease: "none" }, .62);
    } else if (legacyHero) {
      const timeline = gsap.timeline({ scrollTrigger: { trigger: legacyHero, start: "top top", end: "+=115%", scrub: 0.55, pin: true } });
      timeline.to(".hero__media video, .hero__media img", { scale: 1.08, opacity: 0.55, ease: "none" }, 0)
        .to(".hero__headline", { yPercent: -16, scale: 0.93, transformOrigin: "left bottom", ease: "none" }, 0)
        .to(".hero__support", { yPercent: 28, opacity: 0, ease: "none" }, 0.1);
    }

    const portraitStory = document.querySelector(".portrait-story");
    if (portraitStory) {
      const portraitTimeline = gsap.timeline({ scrollTrigger: { trigger: portraitStory, start: "top top", end: "bottom bottom", scrub: .7 } });
      portraitTimeline
        .fromTo(".portrait-story__title", { xPercent: -3, opacity: .58 }, { xPercent: 0, opacity: 1, duration: .2, ease: "none" }, 0)
        .fromTo(".portrait-story__copy", { yPercent: 24, opacity: .3 }, { yPercent: 0, opacity: 1, duration: .24, ease: "none" }, .03)
        .fromTo(".portrait-story__principles p", { xPercent: 10, opacity: 0 }, { xPercent: 0, opacity: 1, stagger: .06, duration: .24, ease: "none" }, .08)
        .to(".portrait-story__title", { yPercent: -13, opacity: .12, duration: .34, ease: "none" }, .56)
        .fromTo(".portrait-story__manifesto", { yPercent: 45, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .25, ease: "none" }, .66);
    }

    const workTrack = document.querySelector(".work-track");
    const workWrap = document.querySelector(".work-track-wrap");
    if (workTrack && workWrap && matchMedia("(min-width:901px)").matches) {
      if (body.classList.contains("home-v3")) {
        const panels = gsap.utils.toArray(".work-panel");
        const xPositions = [-.35, -.17, .01, .19, .36];
        const yPositions = [.12, -.08, .17, -.11, .09];
        const rotations = [-1.6, 1.1, -.8, 1.3, -1.1];

        gsap.set(workTrack, { transformStyle: isSafari ? "flat" : "preserve-3d" });
        panels.forEach((panel, index) => {
          panel.style.zIndex = String(index + 1);
          gsap.set(panel, {
            xPercent: -50,
            yPercent: -50,
            x: 0,
            y: 0,
            z: isSafari ? 0 : -900 - index * 90,
            scale: isSafari ? .56 : .72,
            rotationZ: 0,
            opacity: 0,
            transformOrigin: "50% 50%"
          });
        });

        const depthTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: workWrap,
            start: "top top",
            end: "bottom bottom",
            scrub: .8,
            invalidateOnRefresh: true
          }
        });
        panels.forEach((panel, index) => {
          const revealAt = .03 + index * .16;
          depthTimeline.to(panel, { z: 0, scale: 1, opacity: 1, duration: .11, ease: "power2.out" }, revealAt);
          depthTimeline.to(panel, {
            x: () => innerWidth * xPositions[index],
            y: () => innerHeight * yPositions[index],
            scale: .72,
            rotationZ: rotations[index],
            opacity: 1,
            duration: .22,
            ease: "power2.inOut"
          }, revealAt + .08);
        });
        depthTimeline.to(".work-archive-link", { opacity: 1, y: 0, duration: .12, ease: "none" }, .86);
      } else {
        const horizontalDistance = () => Math.max(0, workTrack.scrollWidth - innerWidth);
        gsap.to(workTrack, {
          x: () => -horizontalDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: workWrap,
            start: "top top",
            end: () => `+=${horizontalDistance()}`,
            pin: true,
            scrub: .65,
            anticipatePin: 1,
            invalidateOnRefresh: true
          }
        });
      }
    }

    if (workTrack && workWrap && matchMedia("(max-width:900px)").matches && body.classList.contains("home-v3")) {
      const mobilePanels = gsap.utils.toArray(".work-panel");

      mobilePanels.forEach((panel, index) => {
        const media = panel.querySelector(".work-panel__media");
        const info = panel.querySelector(".work-panel__info");
        const direction = index % 2 === 0 ? -1 : 1;

        gsap.set(panel, {
          y: 92,
          scale: .86,
          rotationZ: direction * 2.2,
          opacity: .08,
          transformOrigin: "50% 100%"
        });
        if (media) gsap.set(media, { clipPath: "inset(13% 6% 15% 6%)" });
        if (info) gsap.set(info, { y: 22, opacity: 0 });

        const mobilePanelTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: "top 96%",
            end: "top 35%",
            scrub: .78,
            invalidateOnRefresh: true
          }
        });

        mobilePanelTimeline
          .to(panel, { y: 0, scale: 1, rotationZ: 0, opacity: 1, duration: .72, ease: "power2.out" }, 0)
          .to(media, { clipPath: "inset(0% 0% 0% 0%)", duration: .7, ease: "power2.out" }, 0)
          .to(info, { y: 0, opacity: 1, duration: .28, ease: "none" }, .44);
      });

      gsap.fromTo(".work-archive-link", { y: 30, opacity: 0 }, {
        y: 0,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".work-archive-link",
          start: "top 96%",
          end: "top 78%",
          scrub: .65
        }
      });
    }

    const practiceGrid = document.querySelector(".practice-grid");
    if (practiceGrid) {
      const practiceEyebrow = practiceGrid.querySelector(".practice-grid__head .eyebrow");
      const practiceTitle = practiceGrid.querySelector(".practice-grid__head h2");
      const practiceBody = practiceGrid.querySelector(".practice-grid__head > p:last-child");
      const practiceItems = gsap.utils.toArray(".practice-list > *");
      const practiceMarquee = practiceGrid.querySelector(".practice-marquee");

      gsap.set(".practice-grid__lines", { opacity: 0, scale: .985, transformOrigin: "50% 0%" });
      gsap.set(practiceEyebrow, { x: -42, opacity: 0 });
      gsap.set(practiceTitle, { y: 112, opacity: 0, clipPath: "inset(0 0 100% 0)" });
      gsap.set(practiceBody, { y: 54, opacity: 0 });
      practiceItems.forEach((item, index) => {
        gsap.set(item, { y: 88, scale: .965, rotationZ: index % 2 === 0 ? -.45 : .45, opacity: 0, transformOrigin: "50% 100%" });
      });
      gsap.set(practiceMarquee, { y: 68, xPercent: 2.5, opacity: 0 });

      const practiceTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: practiceGrid,
          start: "top 94%",
          end: "center 48%",
          scrub: .82,
          invalidateOnRefresh: true
        }
      });

      practiceTimeline
        .to(".practice-grid__lines", { opacity: 1, scale: 1, duration: .18, ease: "none" }, 0)
        .to(practiceEyebrow, { x: 0, opacity: 1, duration: .16, ease: "power2.out" }, .02)
        .to(practiceTitle, { y: 0, opacity: 1, clipPath: "inset(0 0 0% 0)", duration: .28, ease: "power3.out" }, .06)
        .to(practiceBody, { y: 0, opacity: 1, duration: .2, ease: "power2.out" }, .15)
        .to(practiceItems, { y: 0, scale: 1, rotationZ: 0, opacity: 1, stagger: .065, duration: .24, ease: "power2.out" }, .22)
        .to(practiceMarquee, { y: 0, xPercent: 0, opacity: 1, duration: .18, ease: "none" }, .49);
    }

    const studioImage = document.querySelector(".studio-v2__image");
    if (studioImage) {
      gsap.fromTo(studioImage, { clipPath: "inset(100% 0 0)" }, { clipPath: "inset(0% 0 0)", ease: "none", scrollTrigger: { trigger: ".studio-v2", start: "top 80%", end: "center center", scrub: .6 } });
    }

    gsap.utils.toArray(".project-scene").forEach((scene) => {
      const media = scene.querySelector(".project-scene__media img, .project-scene__media video");
      if (!media) return;
      gsap.to(media, { scale: 1, yPercent: -3, ease: "none", scrollTrigger: { trigger: scene, start: "top bottom", end: "bottom top", scrub: 0.6 } });
    });
    gsap.utils.toArray(".case-hero__media img, .case-hero__media video").forEach((media) => {
      gsap.to(media, { scale: 1.08, yPercent: 5, ease: "none", scrollTrigger: { trigger: ".case-hero", start: "top top", end: "bottom top", scrub: 0.6 } });
    });

    if (body.classList.contains("case-study")) {
      gsap.from(".case-hero__meta > span", { y: 18, opacity: 0, stagger: .12, duration: .8, delay: .15, ease: "power3.out" });
      gsap.from(".case-hero h1", { yPercent: 24, opacity: 0, duration: 1.15, delay: .08, ease: "power3.out" });
      gsap.from(".case-hero__summary > *", { y: 26, opacity: 0, stagger: .12, duration: .9, delay: .32, ease: "power3.out" });
      gsap.to(".case-hero__content", { yPercent: -13, opacity: .18, ease: "none", scrollTrigger: { trigger: ".case-hero", start: "38% top", end: "bottom top", scrub: .65 } });

      gsap.utils.toArray(".case-section").forEach((section) => {
        const heading = section.querySelector("h2");
        const content = section.querySelectorAll(".case-section__content > p, .case-section__content > h3, .case-meta-grid > div, .progression > li");
        if (heading) gsap.from(heading, { yPercent: 28, opacity: 0, duration: 1.05, ease: "power3.out", scrollTrigger: { trigger: heading, start: "top 88%" } });
        if (content.length) gsap.from(content, { y: 34, opacity: 0, stagger: .07, duration: .8, ease: "power3.out", scrollTrigger: { trigger: content[0], start: "top 90%" } });
      });

      gsap.utils.toArray(".gallery figure, .media-wide").forEach((mediaBlock, index) => {
        gsap.fromTo(mediaBlock, { clipPath: "inset(12% 0 12% 0)", opacity: .45, y: 42 }, { clipPath: "inset(0% 0 0% 0)", opacity: 1, y: 0, duration: 1.1, delay: (index % 3) * .05, ease: "power3.out", scrollTrigger: { trigger: mediaBlock, start: "top 88%" } });
      });

      gsap.utils.toArray(".gallery figure img, .media-wide img, .media-wide video").forEach((media, index) => {
        gsap.fromTo(media, { scale: 1.035, yPercent: index % 2 ? 2 : -2 }, { scale: 1, yPercent: index % 2 ? -3 : 3, ease: "none", scrollTrigger: { trigger: media.closest("figure") || media, start: "top bottom", end: "bottom top", scrub: .65 } });
      });

      gsap.utils.toArray(".case-meta-grid").forEach((grid) => {
        gsap.from(grid, { scaleX: .65, opacity: .2, transformOrigin: "left top", duration: .9, ease: "power3.out", scrollTrigger: { trigger: grid, start: "top 90%" } });
      });

      gsap.from(".case-pagination__link", { y: 34, opacity: 0, stagger: .12, duration: .9, ease: "power3.out", scrollTrigger: { trigger: ".case-pagination", start: "top 82%" } });

      gsap.from(".portfolio-contact > .eyebrow", { y: 24, opacity: 0, duration: .8, ease: "power3.out", scrollTrigger: { trigger: ".portfolio-contact", start: "top 80%" } });
      gsap.from(".portfolio-contact > a > *", { yPercent: 48, opacity: 0, stagger: .1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".portfolio-contact > a", start: "top 86%" } });
      gsap.from(".portfolio-contact .contact-v2__meta > p", { y: 22, opacity: 0, stagger: .1, duration: .75, ease: "power3.out", scrollTrigger: { trigger: ".portfolio-contact .contact-v2__meta", start: "top 92%" } });
      gsap.from(".site-footer > div", { y: 14, opacity: 0, stagger: .08, duration: .7, ease: "power3.out", scrollTrigger: { trigger: ".site-footer", start: "top 96%" } });
    }

    if (body.classList.contains("work-index")) {
      gsap.from(".page-hero .eyebrow", { x: -24, opacity: 0, duration: .8, ease: "power3.out" });
      gsap.from(".page-hero h1", { yPercent: 22, opacity: 0, duration: 1.05, delay: .08, ease: "power3.out" });
      gsap.from(".page-hero__intro", { y: 24, opacity: 0, duration: .85, delay: .28, ease: "power3.out" });
      gsap.to(".page-hero__grid", { yPercent: -12, opacity: .16, ease: "none", scrollTrigger: { trigger: ".page-hero", start: "35% top", end: "bottom top", scrub: .65 } });
      gsap.from(".filters .filter", { y: 18, opacity: 0, stagger: .06, duration: .65, ease: "power3.out", scrollTrigger: { trigger: ".filters", start: "top 90%" } });

      gsap.utils.toArray(".work-tile").forEach((tile) => {
        const media = tile.querySelector(".work-tile__media img, .work-tile__media video");
        const info = tile.querySelector(".work-tile__info");
        if (media) gsap.fromTo(media, { scale: 1.1 }, { scale: 1, ease: "none", scrollTrigger: { trigger: tile, start: "top bottom", end: "bottom top", scrub: .55 } });
        if (info) gsap.from(info, { y: 20, opacity: 0, duration: .75, ease: "power3.out", scrollTrigger: { trigger: info, start: "top 94%" } });
      });

      gsap.from(".case-next .eyebrow", { x: -28, opacity: 0, duration: .8, ease: "power3.out", scrollTrigger: { trigger: ".case-next", start: "top 78%" } });
      gsap.from(".case-next h2", { yPercent: 32, opacity: 0, duration: 1.05, ease: "power3.out", scrollTrigger: { trigger: ".case-next", start: "top 76%" } });
      gsap.from(".portfolio-contact > .eyebrow", { y: 24, opacity: 0, duration: .8, ease: "power3.out", scrollTrigger: { trigger: ".portfolio-contact", start: "top 80%" } });
      gsap.from(".portfolio-contact > a > *", { yPercent: 48, opacity: 0, stagger: .1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".portfolio-contact > a", start: "top 86%" } });
      gsap.from(".portfolio-contact .contact-v2__meta > p", { y: 22, opacity: 0, stagger: .1, duration: .75, ease: "power3.out", scrollTrigger: { trigger: ".portfolio-contact .contact-v2__meta", start: "top 92%" } });
      gsap.from(".site-footer > div", { y: 14, opacity: 0, stagger: .08, duration: .7, ease: "power3.out", scrollTrigger: { trigger: ".site-footer", start: "top 96%" } });
    }
  }
})();
