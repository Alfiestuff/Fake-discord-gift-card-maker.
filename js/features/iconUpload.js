import { $, on } from "../utils/dom.js";

export const initIconUpload =
  () => {
    on(
      "iconUpload",
      "change",
      (e) => {
        const file =
          e.target.files?.[0];

        if (!file) {
          return;
        }

        const reader =
          new FileReader();

        reader.onload = ({
          target,
        }) => {
          const oldImg =
            $("iconImg");

          const img =
            document.createElement(
              "img"
            );

          img.id = "iconImg";
          img.src = target.result;

          img.style.width =
            "100%";

          img.style.height =
            "100%";

          img.style.objectFit =
            "cover";

          oldImg.replaceWith(img);

          $("defaultIcon").style.display =
            "none";
        };

        reader.readAsDataURL(
          file
        );
      }
    );

    on(
      "resetIcon",
      "click",
      () => {
        const oldImg =
          $("iconImg");

        const img =
          document.createElement(
            "img"
          );

        img.id = "iconImg";
        img.style.display =
          "none";

        oldImg.replaceWith(img);

        $("defaultIcon").style.display =
          "block";

        $("iconUpload").value =
          "";
      }
    );
  };