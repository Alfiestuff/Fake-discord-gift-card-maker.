export function pngToGif(
    dataUrl
  ) {
    return new Promise(
      (resolve, reject) => {
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
  
          ctx.fillStyle =
            "#ffffff";
  
          ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
          );
  
          ctx.drawImage(img, 0, 0);
  
          const gif = new GIF({
            workers: 2,
            quality: 10,
  
            width: canvas.width,
            height:
              canvas.height,
  
            workerScript:
              "https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js",
          });
  
          gif.addFrame(canvas, {
            delay: 200,
          });
  
          gif.on(
            "finished",
            (blob) =>
              resolve(blob)
          );
  
          gif.on(
            "abort",
            () =>
              reject(
                new Error(
                  "GIF aborted"
                )
              )
          );
  
          gif.render();
        };
  
        img.onerror = () =>
          reject(
            new Error(
              "Image load failed"
            )
          );
  
        img.src = dataUrl;
      }
    );
  }