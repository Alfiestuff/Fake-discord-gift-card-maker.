import { $, on } from "./dom.js";

export const bindText = (
  inputId,
  targetId
) => {
  on(inputId, "input", (e) => {
    const target = $(targetId);

    if (target) {
      target.textContent =
        e.target.value;
    }
  });
};

export const bindStyle = (
  inputId,
  targetId,
  prop
) => {
  on(inputId, "input", (e) => {
    const target = $(targetId);

    if (target) {
      target.style[prop] =
        e.target.value;
    }
  });
};

export const bindRange = (
  inputId,
  valueId,
  targetId,
  prop,
  unit = "px"
) => {
  const input = $(inputId);
  const value = $(valueId);
  const target = $(targetId);

  if (!input || !value || !target) {
    return;
  }

  const update = () => {
    value.textContent =
      input.value;

    if (prop) {
      target.style[prop] =
        input.value + unit;
    }
  };

  input.addEventListener(
    "input",
    update
  );

  update();
};