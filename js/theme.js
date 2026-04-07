const STORAGE_KEY = "hvmd-theme";

function createToggleButton() {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "btn btn--secondary theme-toggle";
  button.setAttribute("data-theme-toggle", "");
  button.setAttribute("aria-live", "polite");
  button.innerHTML = "<span>Toggle theme</span>";
  return button;
}

function updateToggleLabels(theme) {
  const nextTheme = theme === "dark" ? "light" : "dark";
  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.dataset.themeTarget = nextTheme;
    button.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
    button.setAttribute("title", `Switch to ${nextTheme} mode`);
  });
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  updateToggleLabels(theme);
}

function insertToggle(selector, beforeSelector) {
  const container = document.querySelector(selector);
  if (!container || container.querySelector("[data-theme-toggle]")) return;

  const button = createToggleButton();
  const beforeElement = beforeSelector ? container.querySelector(beforeSelector) : null;
  if (beforeElement) {
    container.insertBefore(button, beforeElement);
    return;
  }

  container.append(button);
}

export function initTheme() {
  const storedTheme = window.localStorage.getItem(STORAGE_KEY);
  const initialTheme = storedTheme || "dark";

  insertToggle(".nav-actions", ".btn--secondary");
  insertToggle(".nav-drawer .button-row");
  applyTheme(initialTheme);

  document.addEventListener("click", (event) => {
    const toggle = event.target.closest("[data-theme-toggle]");
    if (!toggle) return;

    const currentTheme = document.documentElement.dataset.theme === "light" ? "light" : "dark";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
  });
}
