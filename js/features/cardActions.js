import { $ } from "../utils/dom.js";

const initFakeButton = () => {
  const btn = $("cardBtn");

  if (!btn) return;

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    alert("Haha noob its fake!!!");
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

  if (button) {
    const newBtn = button.cloneNode(true);

    newBtn.addEventListener("click", (e) => {
      e.preventDefault();
      alert("Haha noob its fake!!!");
    });

    button.replaceWith(newBtn);
  }

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