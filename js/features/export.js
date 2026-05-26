import { $ } from "../utils/dom.js";
import { sanitizeCardClone } from "./cardActions.js";

const prepareClone = () => {
  const card = $("card");
  if (!card) return null;

  const clone = sanitizeCardClone(card.cloneNode(true));

  clone.style.margin = "0";
  clone.style.transform = "none";
  clone.style.scale = "1";

  const wrapper = document.createElement("div");

  wrapper.style.position = "fixed";
  wrapper.style.left = "-99999px";
  wrapper.style.top = "0";

  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  return { clone, wrapper };
};

export const exportCard = async () => {
  const result = prepareClone();
  if (!result) throw new Error("Card not found");

  const { wrapper } = result;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const rect = wrapper.firstChild.getBoundingClientRect();

  canvas.width = rect.width;
  canvas.height = rect.height;

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  document.body.removeChild(wrapper);

  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/png")
  );

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "card.png";
  a.click();

  URL.revokeObjectURL(url);
};