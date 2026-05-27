import { bindText, bindStyle, bindRange } from "./utils/bindings.js";
import { $, on } from "./utils/dom.js";
import { initTheme } from "./features/theme.js";
import { initIconUpload } from "./features/iconUpload.js";
import { exportCard } from "./features/export.js";
import { initCardActions } from "./features/cardActions.js";

initCardActions();
initTheme();
initIconUpload();

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

on("exportBtn", "click", async () => {
  try {
    await exportCard();
  } catch (err) {
    console.error(err);
    alert("Export failed");
  }
});