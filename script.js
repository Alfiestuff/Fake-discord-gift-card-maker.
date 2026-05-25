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

// Export scale
on("exportScale", "input", (e) => {
  $("scaleVal").textContent =
    e.target.value;
});

// ICON UPLOAD
on("iconUpload", "change", (e) => {
  const file = e.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = (ev) => {
    const oldImg = $("iconImg");

    // CREATE NEW IMAGE
    const newImg =
      document.createElement("img");

    newImg.id = "iconImg";

    newImg.alt = "";

    newImg.style.display = "block";

    newImg.src = ev.target.result;

    // REPLACE OLD IMAGE
    oldImg.replaceWith(newImg);

    // HIDE DEFAULT SVG
    $("defaultIcon").style.display =
      "none";
  };

  reader.readAsDataURL(file);
});

// RESET ICON
on("resetIcon", "click", () => {
  const oldImg = $("iconImg");

  const newImg =
    document.createElement("img");

  newImg.id = "iconImg";

  newImg.alt = "";

  newImg.style.display = "none";

  oldImg.replaceWith(newImg);

  $("defaultIcon").style.display =
    "block";

  $("iconUpload").value = "";
});

// EXPORT
on("exportBtn", "click", async () => {
  try {
    if (
      typeof htmlToImage === "undefined"
    ) {
      throw new Error(
        "html-to-image library missing"
      );
    }

    const card = $("card");

    if (!card) {
      throw new Error(
        "Card element missing"
      );
    }

    // CLONE CARD
    const clone =
      card.cloneNode(true);

    // FIX IMAGE ISSUE
    const img =
      clone.querySelector("#iconImg");

    if (
      img &&
      (!img.getAttribute("src") ||
        img.style.display === "none")
    ) {
      img.remove();
    }

    // TEMP WRAPPER
    const wrapper =
      document.createElement("div");

    wrapper.style.position =
      "fixed";

    wrapper.style.left = "-99999px";

    wrapper.style.top = "0";

    wrapper.appendChild(clone);

    document.body.appendChild(wrapper);

    // WAIT
    await new Promise((r) =>
      setTimeout(r, 50)
    );

    const format =
      $("exportFormat")?.value ||
      "png";

    const scale =
      parseInt(
        $("exportScale")?.value,
        10
      ) || 2;

    let dataUrl;

    // PNG
    if (format === "png") {
      dataUrl =
        await htmlToImage.toPng(
          clone,
          {
            pixelRatio: scale,
            cacheBust: true,
            backgroundColor: null
          }
        );
    }

    // JPG
    else if (format === "jpeg") {
      dataUrl =
        await htmlToImage.toJpeg(
          clone,
          {
            pixelRatio: scale,
            quality: 0.95,
            backgroundColor:
              "#ffffff",
            cacheBust: true
          }
        );
    }

    // SVG
    else if (format === "svg") {
      dataUrl =
        await htmlToImage.toSvg(
          clone,
          {
            cacheBust: true
          }
        );
    }

    // WEBP
    else if (format === "webp") {
      const png =
        await htmlToImage.toPng(
          clone,
          {
            pixelRatio: scale,
            cacheBust: true
          }
        );

      dataUrl =
        await pngToWebp(png);
    }

    // DOWNLOAD
    const a =
      document.createElement("a");

    a.href = dataUrl;

    a.download =
      `gift-card.${
        format === "jpeg"
          ? "jpg"
          : format
      }`;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    // CLEANUP
    document.body.removeChild(
      wrapper
    );

  } catch (err) {
    console.error(
      "EXPORT ERROR:",
      err
    );

    alert(
      err?.message ||
      "Export failed"
    );
  }
});

// PNG -> WEBP
function pngToWebp(pngDataUrl) {
  return new Promise((resolve) => {
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

      resolve(
        canvas.toDataURL(
          "image/webp",
          0.95
        )
      );
    };

    img.src = pngDataUrl;
  });
}