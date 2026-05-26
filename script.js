const $ = (id) => document.getElementById(id);

const on = (id, event, handler) => {
  const el = $(id);
  if (el) el.addEventListener(event, handler);
};

const bindText = (inputId, targetId) => {
  on(inputId, "input", (e) => {
    const target = $(targetId);
    if (target) target.textContent = e.target.value;
  });
};

const bindStyle = (inputId, targetId, prop) => {
  on(inputId, "input", (e) => {
    const target = $(targetId);
    if (target) target.style[prop] = e.target.value;
  });
};

const bindRange = (inputId, valueId, targetId, prop, unit = "px") => {
  const input = $(inputId);
  const value = $(valueId);
  const target = $(targetId);
  if (!input || !value || !target) return;
  const update = () => {
    const v = input.value;
    value.textContent = v;
    if (prop) target.style[prop] = v + unit;
  };
  input.addEventListener("input", update);
  update();
};

const toggleTheme = () => {
  const html = document.documentElement;
  const next = html.dataset.theme === "dark" ? "light" : "dark";
  html.dataset.theme = next;
  $("themeToggle").textContent = next === "dark" ? "🌙" : "☀️";
};

on("themeToggle", "click", toggleTheme);

document.addEventListener("click", (e) => {
  if (e.target.id === "cardBtn") {
    alert("Haha noob its fake!!!");
  }
});

bindText("headerText", "cardHeader");
bindText("nameText", "cardName");
bindText("subText", "cardSub");
bindText("buttonText", "cardBtn");

bindStyle("cardBg", "card", "background");
bindStyle("headerColor", "cardHeader", "color");
bindStyle("nameColor", "cardName", "color");
bindStyle("subColor", "cardSub", "color");
bindStyle("btnBg", "cardBtn", "background");
bindStyle("btnText", "cardBtn", "color");
bindStyle("iconBg", "iconBox", "background");

bindRange("cardWidth", "cardWidthVal", "card", "width");
bindRange("cardRadius", "cardRadiusVal", "card", "borderRadius");
bindRange("nameSize", "nameSizeVal", "cardName", "fontSize");
bindRange("headerSize", "headerSizeVal", "cardHeader", "fontSize");
bindRange("btnRadius", "btnRadiusVal", "cardBtn", "borderRadius");
bindRange("iconRadius", "iconRadiusVal", "iconBox", "borderRadius");

on("iconSize2", "input", (e) => {
  const size = e.target.value + "px";
  $("iconSize2Val").textContent = e.target.value;
  $("iconBox").style.width = size;
  $("iconBox").style.height = size;
});

on("exportScale", "input", (e) => {
  $("scaleVal").textContent = e.target.value;
});

on("iconUpload", "change", (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ({ target }) => {
    const oldImg = $("iconImg");
    const img = document.createElement("img");
    img.id = "iconImg";
    img.alt = "";
    img.src = target.result;
    img.style.display = "block";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";
    oldImg.replaceWith(img);
    $("defaultIcon").style.display = "none";
  };
  reader.readAsDataURL(file);
});

on("resetIcon", "click", () => {
  const oldImg = $("iconImg");
  const img = document.createElement("img");
  img.id = "iconImg";
  img.alt = "";
  img.style.display = "none";
  oldImg.replaceWith(img);
  $("defaultIcon").style.display = "block";
  $("iconUpload").value = "";
});

const prepareClone = () => {
  const card = $("card");
  if (!card) return null;
  const clone = card.cloneNode(true);
  clone.style.margin = "0";
  clone.style.transform = "none";
  clone.style.scale = "1";
  const button = clone.querySelector("#cardBtn");
  if (button) button.replaceWith(button.cloneNode(true));
  const img = clone.querySelector("#iconImg");
  if (img && (!img.getAttribute("src") || img.style.display === "none")) {
    img.remove();
  }
  const wrapper = document.createElement("div");
  wrapper.style.position = "fixed";
  wrapper.style.left = "-99999px";
  wrapper.style.top = "0";
  wrapper.style.padding = "0";
  wrapper.style.margin = "0";
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);
  return { clone, wrapper };
};

const exportCard = async () => {
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
  let ext = format === "jpeg" ? "jpg" : format;

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
  if (blob) {
    link.href = URL.createObjectURL(blob);
  } else {
    link.href = dataUrl;
  }
  link.download = `gift-card.${ext}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  if (blob) setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  wrapper.remove();
};

on("exportBtn", "click", async () => {
  try {
    await exportCard();
  } catch (err) {
    console.error(err);
    alert("Export failed");
  }
});

function pngToWebp(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/webp", 0.95));
    };
    img.src = dataUrl;
  });
}

function pngToGif(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const gif = new GIF({
        workers: 2,
        quality: 10,
        width: canvas.width,
        height: canvas.height,
        workerScript:
          "https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js",
      });
      gif.addFrame(canvas, { delay: 200 });
      gif.on("finished", (blob) => resolve(blob));
      gif.on("abort", () => reject(new Error("GIF aborted")));
      gif.render();
    };
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = dataUrl;
  });
}