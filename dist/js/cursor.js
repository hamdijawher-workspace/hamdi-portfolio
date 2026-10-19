const DEFAULT_SIZE = 16;
const LERP = 0.14;

function isTouchDevice() {
  return (
    window.matchMedia("(pointer: coarse)").matches ||
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0
  );
}

export function initCursor() {
  if (isTouchDevice()) {
    document.body.classList.remove("has-custom-cursor");
    const staleCursor = document.getElementById("custom-cursor");
    staleCursor?.remove();
    return;
  }

  if (document.getElementById("custom-cursor")) {
    return;
  }

  document.body.classList.add("has-custom-cursor");

  const cursor = document.createElement("div");
  cursor.id = "custom-cursor";
  cursor.dataset.state = "default";
  cursor.innerHTML = '<span class="cursor-label"></span>';
  document.body.append(cursor);

  const label = cursor.querySelector(".cursor-label");

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;
  let isLocked = false;
  let lockRect = null;
  let hoverState = "default";
  let animationFrame = null;

  const setDefault = () => {
    hoverState = "default";
    isLocked = false;
    lockRect = null;
    cursor.dataset.state = "default";
    cursor.dataset.showLabel = "false";
    label.textContent = "";
    cursor.style.width = `${DEFAULT_SIZE}px`;
    cursor.style.height = `${DEFAULT_SIZE}px`;
    cursor.style.borderRadius = "0px";
    cursor.style.backgroundColor = "transparent";
    cursor.style.transform = "translate3d(-50%, -50%, 0)";
  };

  const applyLockRect = (element, state, customLabel = "") => {
    const rect = element.getBoundingClientRect();
    const computed = window.getComputedStyle(element);

    hoverState = state;
    isLocked = true;
    lockRect = rect;
    cursor.dataset.state = state;
    cursor.dataset.showLabel = customLabel ? "true" : "false";
    label.textContent = customLabel;

    if (state === "button") {
      cursor.style.width = `${rect.width}px`;
      cursor.style.height = `${rect.height}px`;
      cursor.style.borderRadius = computed.borderRadius;
      cursor.style.backgroundColor = "rgba(255,255,255,0.08)";
    } else if (state === "card") {
      cursor.style.width = `${rect.width}px`;
      cursor.style.height = `${rect.height}px`;
      cursor.style.borderRadius = computed.borderRadius;
      cursor.style.backgroundColor = "rgba(255,255,255,0.04)";
    }
  };

  const applyLinkState = (element) => {
    const rect = element.getBoundingClientRect();
    hoverState = "link";
    isLocked = true;
    lockRect = {
      left: rect.left,
      top: rect.bottom - 2,
      width: rect.width,
      height: 4
    };
    cursor.dataset.state = "link";
    cursor.dataset.showLabel = "false";
    label.textContent = "";
    cursor.style.width = `${Math.max(48, rect.width)}px`;
    cursor.style.height = "4px";
    cursor.style.borderRadius = "999px";
    cursor.style.backgroundColor = "currentColor";
  };

  const applyTextState = () => {
    hoverState = "text";
    isLocked = false;
    lockRect = null;
    cursor.dataset.state = "text";
    cursor.dataset.showLabel = "false";
    label.textContent = "";
    cursor.style.width = "2px";
    cursor.style.height = "24px";
    cursor.style.borderRadius = "999px";
    cursor.style.backgroundColor = "currentColor";
  };

  const animate = () => {
    if (isLocked && lockRect) {
      targetX = lockRect.left + lockRect.width / 2;
      targetY = lockRect.top + lockRect.height / 2;
    }

    currentX += (targetX - currentX) * LERP;
    currentY += (targetY - currentY) * LERP;

    cursor.style.left = `${currentX}px`;
    cursor.style.top = `${currentY}px`;

    animationFrame = window.requestAnimationFrame(animate);
  };

  const handlePointerMove = (event) => {
    cursor.classList.remove("is-hidden");

    if (hoverState === "text") {
      targetX = event.clientX;
      targetY = event.clientY;
      return;
    }

    if (!isLocked) {
      targetX = event.clientX;
      targetY = event.clientY;
    }
  };

  const handleMouseOver = (event) => {
    const target = event.target;

    const buttonTarget = target.closest(".btn, button, [role='button']");
    if (buttonTarget && !buttonTarget.closest(".nav-toggle")) {
      applyLockRect(buttonTarget, "button", buttonTarget.dataset.cursorLabel || "");
      return;
    }

    const cardTarget = target.closest("[data-cursor='card'], .project-card, .work-card, .support-card");
    if (cardTarget) {
      applyLockRect(cardTarget, "card", cardTarget.dataset.cursorLabel || "View ->");
      return;
    }

    const linkTarget = target.closest("a");
    if (linkTarget) {
      applyLinkState(linkTarget);
      return;
    }

    const textTarget = target.closest("p, h1, h2, h3, h4, h5, h6, label, li");
    if (textTarget) {
      applyTextState();
      return;
    }

    setDefault();
  };

  const handleMouseOut = (event) => {
    if (!event.relatedTarget || !document.body.contains(event.relatedTarget)) {
      setDefault();
      cursor.classList.add("is-hidden");
      return;
    }

    const stillInsideInteractive = event.relatedTarget.closest(
      ".btn, button, [role='button'], [data-cursor='card'], .project-card, .work-card, .support-card, a, p, h1, h2, h3, h4, h5, h6, label, li"
    );

    if (!stillInsideInteractive) {
      setDefault();
    }
  };

  document.addEventListener("mousemove", handlePointerMove, { passive: true });
  document.addEventListener("mouseover", handleMouseOver);
  document.addEventListener("mouseout", handleMouseOut);
  document.addEventListener("mousedown", () => cursor.classList.add("is-pressed"));
  document.addEventListener("mouseup", () => cursor.classList.remove("is-pressed"));
  document.addEventListener("mouseleave", () => cursor.classList.add("is-hidden"));
  document.addEventListener("mouseenter", () => cursor.classList.remove("is-hidden"));

  window.addEventListener(
    "resize",
    () => {
      if (hoverState !== "default") {
        setDefault();
      }
    },
    { passive: true }
  );

  setDefault();
  animate();

  window.addEventListener("pagehide", () => {
    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
    }
  });
}
