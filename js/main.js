import { initAnimations } from "./animations.js";
import { initClock } from "./clock.js";
import { initCursor } from "./cursor.js";
import { initNav } from "./nav.js";

function enforceLightTheme() {
  document.documentElement.setAttribute("data-theme", "light");
  window.localStorage.removeItem("hvmd-theme");
}

function initAccordions() {
  document.querySelectorAll("[data-accordion]").forEach((accordion) => {
    accordion.querySelectorAll(".accordion-item").forEach((item) => {
      const trigger = item.querySelector(".accordion-trigger");
      if (!trigger) return;

      trigger.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");
        accordion.querySelectorAll(".accordion-item").forEach((entry) => {
          entry.classList.remove("is-open");
          entry.querySelector(".accordion-trigger")?.setAttribute("aria-expanded", "false");
        });

        if (!isOpen) {
          item.classList.add("is-open");
          trigger.setAttribute("aria-expanded", "true");
        }
      });
    });

    const first = accordion.querySelector(".accordion-item");
    if (first) {
      first.classList.add("is-open");
      first.querySelector(".accordion-trigger")?.setAttribute("aria-expanded", "true");
    }
  });
}

function initContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = [data.get("first_name"), data.get("last_name")].filter(Boolean).join(" ");
    const enquiry = data.get("enquiry_type") || "New enquiry";
    const email = data.get("email") || "";
    const message = data.get("message") || "";

    const subject = encodeURIComponent(`${enquiry} from ${name || "Portfolio Visitor"}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nEnquiry: ${enquiry}\n\nMessage:\n${message}`
    );

    window.location.href = `mailto:hamdijawher@icloud.com?subject=${subject}&body=${body}`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  enforceLightTheme();
  initNav();
  initClock();
  initCursor();
  initAnimations();
  initAccordions();
  initContactForm();
});
