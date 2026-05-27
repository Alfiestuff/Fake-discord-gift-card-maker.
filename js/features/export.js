import { $ } from "../utils/dom.js";
import { sanitizeCardClone } from "./cardActions.js";
import { pngToWebp } from "../converters/webp.js";
import { pngToGif } from "../converters/png.js";

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
  const prepared = prepareClone();
  if (!prepared) return;
  const { clone, wrapper } = prepared;
  await new Promise((r) => requestAnimationFrame(r));

  const format = $("exportFormat")?.value || "png";
  const scale = parseInt($("exportScale")?.value, 10) || 2;
  const options = {
    pixelRatio: scale,
    width: clone.offsetWidth,
    height: clone.offsetHeight,
    canvasWidth: clone.offsetWidth * scale,
    canvasHeight: clone.offsetHeight * scale,
    cacheBust: true,
    backgroundColor: null,
  };

  let dataUrl;
  let blob;
  const ext = format === "jpeg" ? "jpg" : format;

  if (format === "png") {
    dataUrl = await htmlToImage.toPng(clone, options);
  } else if (format === "jpeg") {
    dataUrl = await htmlToImage.toJpeg(clone, {
      ...options,
      quality: 0.95,
      backgroundColor: "#ffffff",
    });
  } else if (format === "svg") {
    dataUrl = await htmlToImage.toSvg(clone, { cacheBust: true });
  } else if (format === "webp") {
    const png = await htmlToImage.toPng(clone, options);
    dataUrl = await pngToWebp(png);
  } else if (format === "gif") {
    const png = await htmlToImage.toPng(clone, options);
    blob = await pngToGif(png);
  }

  const link = document.createElement("a");
  const href = blob ? URL.createObjectURL(blob) : dataUrl;
  link.href = href;
  link.download = `gift-card.${ext}`;
  link.target = "_blank";
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Sandboxed iframes (like the Lovable preview) block <a download>.
  // Detect that we're in an iframe and open the file in a new tab as a fallback
  // so the user can save it manually.
  const inIframe = window.self !== window.top;
  if (inIframe) {
    const win = window.open();
    if (win) {
      if (format === "svg" || format === "gif" || format === "webp" || format === "png" || format === "jpeg") {
        win.document.write(
          `<title>gift-card.${ext}</title><body style="margin:0;background:#222;display:flex;align-items:center;justify-content:center;min-height:100vh"><img src="${href}" style="max-width:100%;max-height:100vh" alt="Right click to save as gift-card.${ext}"></body>`
        );
        win.document.close();
      } else {
        win.location.href = href;
      }
    }
  }

  if (blob) setTimeout(() => URL.revokeObjectURL(href), 60_000);
  wrapper.remove();
};