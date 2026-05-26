export function pngToWebp(
    dataUrl
  ) {
    return new Promise(
      (resolve) => {
        const img = new Image();
  
        img.onload = () => {
          const canvas =
            document.createElement(
              "canvas"
            );
  
          canvas.width = img.width;
          canvas.height =
            img.height;
  
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
      }
    );
  }