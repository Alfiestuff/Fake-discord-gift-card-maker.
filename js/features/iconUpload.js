import { $, on } from "../utils/dom.js";

const swapIcon = (src) => {
  const oldImg = $("iconImg");
  const img = document.createElement("img");
  img.id = "iconImg";
  img.alt = "";
  if (src) {
    img.src = src;
    img.style.display = "block";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";
  } else {
    img.style.display = "none";
  }
  oldImg.replaceWith(img);
  $("defaultIcon").style.display = src ? "none" : "block";
};

export const initIconUpload = () => {
  on("iconUpload", "change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ({ target }) => swapIcon(target.result);
    reader.readAsDataURL(file);
  });

  on("resetIcon", "click", () => {
    swapIcon(null);
    const upload = $("iconUpload");
    if (upload) upload.value = "";
  });
};