import { $ } from "../utils/dom.js";

const initFakeButton = () => {
  document.addEventListener("click", (e) => {
    if (e.target.id === "cardBtn") {
      alert("Haha noob its fake!!!");
    }
  });
};

const initButtonTextFallback = () => {
  const btn = $("cardBtn");
  if (btn && !btn.textContent.trim()) {
    btn.textContent = "Accept";
  }
};

export const sanitizeCardClone = (clone) => {
  const button = clone.querySelector("#cardBtn");
  if (button) button.replaceWith(button.cloneNode(true));
  const img = clone.querySelector("#iconImg");
  if (img && (!img.getAttribute("src") || img.style.display === "none")) {
    img.remove();
  }
  return clone;
};

export const initCardActions = () => {
  initFakeButton();
  initButtonTextFallback();
};