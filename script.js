const $ = (id) => document.getElementById(id);

// Theme toggle
const themeBtn = $("themeToggle");
themeBtn.addEventListener("click", () => {
  const html = document.documentElement;
  const next = html.dataset.theme === "dark" ? "light" : "dark";
  html.dataset.theme = next;
  themeBtn.textContent = next === "dark" ? "🌙" : "☀️";
});

// Text bindings
const bindText = (inputId, targetId) => {
  $(inputId).addEventListener("input", (e) => {
    $(targetId).textContent = e.target.value;
  });
};
bindText("headerText", "cardHeader");
bindText("nameText", "cardName");
bindText("subText", "cardSub");
bindText("buttonText", "cardBtn");

// Color bindings (style property)
const bindStyle = (inputId, targetId, prop) => {
  $(inputId).addEventListener("input", (e) => {
    $(targetId).style[prop] = e.target.value;
  });
};
bindStyle("cardBg", "card", "background");
bindStyle("headerColor", "cardHeader", "color");
bindStyle("nameColor", "cardName", "color");
bindStyle("subColor", "cardSub", "color");
bindStyle("btnBg", "cardBtn", "background");
bindStyle("btnText", "cardBtn", "color");
bindStyle("iconBg", "iconBox", "background");

// Range bindings with unit + value display
const bindRange = (inputId, valId, targetId, prop, unit = "px") => {
  const input = $(inputId);
  const val = $(valId);
  input.addEventListener("input", (e) => {
    const v = e.target.value;
    val.textContent = v;
    $(targetId).style[prop] = v + unit;
  });
};
bindRange("cardWidth", "cardWidthVal", "card", "maxWidth");
bindRange("cardRadius", "cardRadiusVal", "card", "borderRadius");
bindRange("nameSize", "nameSizeVal", "cardName", "fontSize");
bindRange("headerSize", "headerSizeVal", "cardHeader", "fontSize");
bindRange("btnRadius", "btnRadiusVal", "cardBtn", "borderRadius");
bindRange("iconRadius", "iconRadiusVal", "iconBox", "borderRadius");

// Icon size affects width + height
$("iconSize2").addEventListener("input", (e) => {
  const v = e.target.value + "px";
  $("iconSize2Val").textContent = e.target.value;
  $("iconBox").style.width = v;
  $("iconBox").style.height = v;
});

// Export scale display
$("exportScale").addEventListener("input", (e) => {
  $("scaleVal").textContent = e.target.value;
});

// Icon upload
$("iconUpload").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = $("iconImg");
    img.src = ev.target.result;
    img.style.display = "block";
    $("defaultIcon").style.display = "none";
  };
  reader.readAsDataURL(file);
});

$("resetIcon").addEventListener("click", () => {
  $("iconImg").src = "";
  $("iconImg").style.display = "none";
  $("defaultIcon").style.display = "block";
  $("iconUpload").value = "";
});

// Export
$("exportBtn").addEventListener("click", async () => {
  const card = $("card");
  const fmt = $("exportFormat").value;
  const scale = parseInt($("exportScale").value, 10) || 2;
  const opts = { pixelRatio: scale, backgroundColor: null };
  try {
    let dataUrl;
    if (fmt === "png") dataUrl = await htmlToImage.toPng(card, opts);
    else if (fmt === "jpeg") dataUrl = await htmlToImage.toJpeg(card, { ...opts, quality: 0.95, backgroundColor: "#ffffff" });
    else if (fmt === "webp") {
      const png = await htmlToImage.toPng(card, opts);
      dataUrl = await pngToWebp(png);
    } else if (fmt === "svg") {
      dataUrl = await htmlToImage.toSvg(card, opts);
    }
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `troll-gift.${fmt === "jpeg" ? "jpg" : fmt}`;
    a.click();
  } catch (err) {
    alert("Export failed: " + err.message);
  }
});

function pngToWebp(pngDataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.width;
      c.height = img.height;
      c.getContext("2d").drawImage(img, 0, 0);
      resolve(c.toDataURL("image/webp", 0.95));
    };
    img.src = pngDataUrl;
  });
}