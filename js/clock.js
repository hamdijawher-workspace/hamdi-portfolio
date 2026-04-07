const TUNIS_TIMEZONE = "Africa/Tunis";

function getTimeParts() {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: TUNIS_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });

  const parts = formatter.formatToParts(now);
  const get = (type) => parts.find((part) => part.type === type)?.value || "00";

  return {
    hours: get("hour"),
    minutes: get("minute"),
    seconds: get("second"),
    year: now.getFullYear()
  };
}

function renderClockMarkup(parts) {
  return `
    <span>${parts.hours}</span>
    <span class="clock__separator">:</span>
    <span>${parts.minutes}</span>
    <span class="clock__separator">:</span>
    <span>${parts.seconds}</span>
    <span>&nbsp;GMT+1</span>
  `;
}

export function initClock() {
  const timeTargets = document.querySelectorAll("[data-clock-time], [data-dynamic-time]");
  const statusTargets = document.querySelectorAll("[data-clock-status], [data-dynamic-status]");
  const yearTargets = document.querySelectorAll("[data-dynamic-year]");

  if (!timeTargets.length && !statusTargets.length && !yearTargets.length) {
    return;
  }

  const update = () => {
    const parts = getTimeParts();

    timeTargets.forEach((target) => {
      target.classList.add("clock");
      target.classList.add("clock-text");
      target.innerHTML = renderClockMarkup(parts);
    });

    statusTargets.forEach((target) => {
      target.classList.add("clock-text");
      target.textContent = "(Online)";
    });

    yearTargets.forEach((target) => {
      target.textContent = String(parts.year);
    });
  };

  update();
  window.setInterval(update, 1000);
}
