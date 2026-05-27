import { $, on } from "../utils/dom.js";

const toggleTheme = () => {
  const html = document.documentElement;
  const next = html.dataset.theme === "dark" ? "light" : "dark";
  html.dataset.theme = next;
  $("themeToggle").textContent = next === "dark" ? "🌙" : "☀️";
};

export const initTheme = () => {
  on("themeToggle", "click", toggleTheme);
};