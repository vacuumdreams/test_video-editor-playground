// based on https://codesandbox.io/p/sandbox/extract-frames-from-video-cts1w?file=%2Fsrc%2Findex.js%3A10%2C17

function getVideoFrame(
  video: HTMLVideoElement,
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  time: number,
): Promise<string> {
  return new Promise(
    (resolve: (frame: string) => void, reject: (error: string) => void) => {
      let eventCallback = () => {
        video.removeEventListener("seeked", eventCallback);
        storeFrame(video, context, canvas, resolve);
      };
      video.addEventListener("seeked", eventCallback);
      video.currentTime = time;
    },
  );
}

function storeFrame(
  video: HTMLVideoElement,
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  resolve: (frame: string) => void,
) {
  context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
  resolve(canvas.toDataURL());
}

export async function getFrames(
  videoUrl: string,
  amount: number,
  type: "fps" | "total" = "total",
) {
  return new Promise(
    (resolve: (frames: string[]) => void, reject: (error: string) => void) => {
      let frames: string[] = [];
      let canvas: HTMLCanvasElement = document.createElement("canvas");
      let context = canvas.getContext("2d") as CanvasRenderingContext2D;
      let duration: number;

      let video = document.createElement("video");
      video.preload = "auto";
      console.log("waiting begins");
      video.addEventListener("loadeddata", async function () {
        console.log("oh well");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        duration = video.duration;

        let totalFrames: number = amount;
        if (type === "fps") {
          totalFrames = duration * amount;
        }
        for (let time = 0; time < duration; time += duration / totalFrames) {
          frames.push(await getVideoFrame(video, context, canvas, time));
        }
        resolve(frames);
      });
      video.src = videoUrl;
      video.load();
    },
  );
}
