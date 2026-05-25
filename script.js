const $ = (id) => document.getElementById(id);

// Safe event helper
const on = (id, event, handler) => {
  const el = $(id);

  if (el) {
    el.addEventListener(event, handler);
  } else {
    console.warn(`Element #${id} not found`);
  }
};

// Theme toggle
const themeBtn = $("themeToggle");

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const html = document.documentElement;

    const next =
      html.dataset.theme === "dark"
        ? "light"
        : "dark";

    html.dataset.theme = next;

    themeBtn.textContent =
      next === "dark" ? "🌙" : "☀️";
  });
}

// Text bindings
const bindText = (inputId, targetId) => {
  on(inputId, "input", (e) => {
    const target = $(targetId);

    if (target) {
      target.textContent = e.target.value;
    }
  });
};

bindText("headerText", "cardHeader");
bindText("nameText", "cardName");
bindText("subText", "cardSub");
bindText("buttonText", "cardBtn");

// Style bindings
const bindStyle = (inputId, targetId, prop) => {
  on(inputId, "input", (e) => {
    const target = $(targetId);

    if (target) {
      target.style[prop] = e.target.value;
    }
  });
};

bindStyle("cardBg", "card", "background");
bindStyle("headerColor", "cardHeader", "color");
bindStyle("nameColor", "cardName", "color");
bindStyle("subColor", "cardSub", "color");
bindStyle("btnBg", "cardBtn", "background");
bindStyle("btnText", "cardBtn", "color");
bindStyle("iconBg", "iconBox", "background");

// Range bindings
const bindRange = (
  inputId,
  valId,
  targetId,
  prop,
  unit = "px"
) => {
  const input = $(inputId);
  const val = $(valId);
  const target = $(targetId);

  if (!input || !val || !target) {
    console.warn(`Missing range binding: ${inputId}`);
    return;
  }

  input.addEventListener("input", (e) => {
    const v = e.target.value;

    val.textContent = v;

    target.style[prop] = v + unit;
  });
};

bindRange(
  "cardWidth",
  "cardWidthVal",
  "card",
  "maxWidth"
);

bindRange(
  "cardRadius",
  "cardRadiusVal",
  "card",
  "borderRadius"
);

bindRange(
  "nameSize",
  "nameSizeVal",
  "cardName",
  "fontSize"
);

bindRange(
  "headerSize",
  "headerSizeVal",
  "cardHeader",
  "fontSize"
);

bindRange(
  "btnRadius",
  "btnRadiusVal",
  "cardBtn",
  "borderRadius"
);

bindRange(
  "iconRadius",
  "iconRadiusVal",
  "iconBox",
  "borderRadius"
);

// Icon size
on("iconSize2", "input", (e) => {
  const v = e.target.value + "px";

  $("iconSize2Val").textContent =
    e.target.value;

  $("iconBox").style.width = v;
  $("iconBox").style.height = v;
});

// Export scale display
on("exportScale", "input", (e) => {
  $("scaleVal").textContent =
    e.target.value;
});

// Icon upload
on("iconUpload", "change", (e) => {
  const file = e.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = (ev) => {
    const img = $("iconImg");

    img.src = ev.target.result;

    img.style.display = "block";

    $("defaultIcon").style.display =
      "none";
  };

  reader.readAsDataURL(file);
});

// Reset icon
on("resetIcon", "click", () => {
  $("iconImg").src = "";

  $("iconImg").style.display = "none";

  $("defaultIcon").style.display =
    "block";

  $("iconUpload").value = "";
});

// Export button
on("exportBtn", "click", async () => {
  const card = $("card");

  if (!card) {
    alert("Card element not found");
    return;
  }

  // Check library
  if (typeof htmlToImage === "undefined") {
    alert(
      "htmlToImage library missing.\n\nAdd this to HTML:\n<script src='https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.min.js'></script>"
    );

    return;
  }

  const fmt =
    $("exportFormat")?.value || "png";

  const scale =
    parseInt(
      $("exportScale")?.value,
      10
    ) || 2;

  const opts = {
    pixelRatio: scale,
    cacheBust: true,
    backgroundColor: null
  };

  try {
    let blob;

    // PNG
    if (fmt === "png") {
      blob = await htmlToImage.toBlob(
        card,
        opts
      );
    }

    // JPEG
    else if (fmt === "jpeg") {
      blob = await htmlToImage.toBlob(
        card,
        {
          ...opts,
          quality: 0.95,
          backgroundColor: "#ffffff"
        }
      );
    }

    // SVG
    else if (fmt === "svg") {
      const svgUrl =
        await htmlToImage.toSvg(
          card,
          opts
        );

      downloadDataUrl(
        svgUrl,
        "troll-gift.svg"
      );

      return;
    }

    // WEBP
    else if (fmt === "webp") {
      const pngBlob =
        await htmlToImage.toBlob(
          card,
          opts
        );

      blob = await blobToWebp(
        pngBlob
      );
    }

    if (!blob) {
      throw new Error(
        "Image generation failed"
      );
    }

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;

    a.download =
      `troll-gift.${
        fmt === "jpeg"
          ? "jpg"
          : fmt
      }`;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);

  } catch (err) {
    console.error(err);

    alert(
      "Export failed:\n\n" +
      (err?.message ||
        JSON.stringify(err) ||
        "Unknown error")
    );
  }
});

// SVG download helper
function downloadDataUrl(
  dataUrl,
  filename
) {
  const a =
    document.createElement("a");

  a.href = dataUrl;

  a.download = filename;

  document.body.appendChild(a);

  a.click();

  document.body.removeChild(a);
}

// Convert PNG blob → WEBP blob
function blobToWebp(blob) {
  return new Promise(
    (resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        const canvas =
          document.createElement(
            "canvas"
          );

        canvas.width = img.width;
        canvas.height = img.height;

        const ctx =
          canvas.getContext("2d");

        ctx.drawImage(
          img,
          0,
          0
        );

        canvas.toBlob(
          (webpBlob) => {
            if (webpBlob) {
              resolve(webpBlob);
            } else {
              reject(
                new Error(
                  "WEBP conversion failed"
                )
              );
            }
          },
          "image/webp",
          0.95
        );
      };

      img.onerror = reject;

      img.src =
        URL.createObjectURL(blob);
    }
  );
}