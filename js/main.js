import {
    bindText,
    bindStyle,
    bindRange,
  } from "./utils/bindings.js";
  
  import {
    on,
    $,
  } from "./utils/dom.js";
  
  import {
    initTheme,
  } from "./features/theme.js";
  
  import {
    initIconUpload,
  } from "./features/iconUpload.js";
  
  import {
    exportCard,
  } from "./features/export.js";
  
  import {
    initCardActions,
  } from "./features/cardActions.js";
  
  initCardActions();
  initTheme();
  initIconUpload();
  
  bindText("headerText", "cardHeader");
  bindText("nameText", "cardName");
  bindText("subText", "cardSub");
  bindText("buttonText", "cardBtn");
  
  bindStyle("cardBg", "card", "background");
  bindStyle("btnBg", "cardBtn", "background");
  
  bindRange("cardWidth", "cardWidthVal", "card", "width");
  bindRange("cardRadius", "cardRadiusVal", "card", "borderRadius");
  
  on("exportBtn", "click", async () => {
    try {
      await exportCard();
    } catch (err) {
      console.error(err);
      alert("Export failed");
    }
  });
  
  document.addEventListener("click", (e) => {
    if (e.target?.id === "cardBtn") {
      alert("Haha noob its fake!!!");
    }
  });