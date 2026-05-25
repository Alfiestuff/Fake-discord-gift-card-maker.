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

const bindRange = (
  inputId,
  valueId,
  targetId,
  prop,
  unit = "px"
) => {
  const input = $(inputId);
  const value = $(valueId);
  const target = $(targetId);

  if (!input || !value || !target) return;

  const update = () => {
    const v = input.value;

    value.textContent = v;

    if (prop) {
      target.style[prop] = v + unit;
    }
  };

  input.addEventListener("input", update);

  update();
};

const setTheme = () => {
  const html = document.documentElement;

  const next =
    html.dataset.theme === "dark"
      ? "light"
      : "dark";

  html.dataset.theme = next;

  $("themeToggle").textContent =
    next === "dark" ? "🌙" : "☀️";
};

on("themeToggle", "click", setTheme);

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

bindRange(
  "cardWidth",
  "cardWidthVal",
  "card",
  "width"
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

on("iconSize2", "input", (e) => {
  const size = e.target.value + "px";

  $("iconSize2Val").textContent =
    e.target.value;

  $("iconBox").style.width = size;
  $("iconBox").style.height = size;
});

on("exportScale", "input", (e) => {
  $("scaleVal").textContent =
    e.target.value;
});

on("iconUpload", "change", (e) => {
  const file = e.target.files?.[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = ({ target }) => {
    const oldImg = $("iconImg");

    const img =
      document.createElement("img");

    img.id = "iconImg";
    img.alt = "";
    img.src = target.result;

    img.style.display = "block";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";

    oldImg.replaceWith(img);

    $("defaultIcon").style.display =
      "none";
  };

  reader.readAsDataURL(file);
});

on("resetIcon", "click", () => {
  const oldImg = $("iconImg");

  const img =
    document.createElement("img");

  img.id = "iconImg";
  img.alt = "";

  img.style.display = "none";

  oldImg.replaceWith(img);

  $("defaultIcon").style.display =
    "block";

  $("iconUpload").value = "";
});

const exportCard = async () => {
  const card = $("card");

  if (!card) return;

  const clone =
    card.cloneNode(true);

  clone.style.margin = "0";
  clone.style.transform = "none";
  clone.style.scale = "1";

  const img =
    clone.querySelector("#iconImg");

  if (
    img &&
    (!img.getAttribute("src") ||
      img.style.display === "none")
  ) {
    img.remove();
  }

  const wrapper =
    document.createElement("div");

  wrapper.style.position = "fixed";
  wrapper.style.left = "-99999px";
  wrapper.style.top = "0";
  wrapper.style.padding = "0";
  wrapper.style.margin = "0";

  wrapper.appendChild(clone);

  document.body.appendChild(wrapper);

  await new Promise((r) =>
    requestAnimationFrame(r)
  );

  const format =
    $("exportFormat").value;

  const scale =
    parseInt(
      $("exportScale").value,
      10
    ) || 2;

  let dataUrl;

  if (format === "png") {
    dataUrl =
      await htmlToImage.toPng(
        clone,
        {
          pixelRatio: scale,
          canvasWidth:
            clone.offsetWidth * scale,
          canvasHeight:
            clone.offsetHeight *
            scale,
          backgroundColor: null,
          cacheBust: true
        }
      );
  }

  else if (format === "jpeg") {
    dataUrl =
      await htmlToImage.toJpeg(
        clone,
        {
          pixelRatio: scale,
          canvasWidth:
            clone.offsetWidth * scale,
          canvasHeight:
            clone.offsetHeight *
            scale,
          quality: 0.95,
          backgroundColor:
            "#ffffff",
          cacheBust: true
        }
      );
  }

  else if (format === "svg") {
    dataUrl =
      await htmlToImage.toSvg(
        clone,
        {
          cacheBust: true
        }
      );
  }

  else if (format === "webp") {
    const png =
      await htmlToImage.toPng(
        clone,
        {
          pixelRatio: scale,
          canvasWidth:
            clone.offsetWidth * scale,
          canvasHeight:
            clone.offsetHeight *
            scale,
          cacheBust: true
        }
      );

    dataUrl =
      await pngToWebp(png);
  }

  const link =
    document.createElement("a");

  link.href = dataUrl;

  link.download =
    `gift-card.${
      format === "jpeg"
        ? "jpg"
        : format
    }`;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

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
      const canvas =
        document.createElement(
          "canvas"
        );

      canvas.width = img.width;
      canvas.height = img.height;

      const ctx =
        canvas.getContext("2d");

      ctx.drawImage(img, 0, 0);

      resolve(
        canvas.toDataURL(
          "image/webp",
          0.95
        )
      );
    };

    img.src = dataUrl;
  });
}