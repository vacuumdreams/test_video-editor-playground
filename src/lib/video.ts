import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { formatTime } from "@/lib/utils";
import { nanoid } from "nanoid";

export const LOGO_URL = "http://localhost:3000/defaults/logo.png";

export async function doCrop(videoUrl: string, start: number, end: number) {
  const ffmpeg = new FFmpeg();
  await ffmpeg.load();

  const TMP_FILE = `temp-${nanoid()}.mp4`;
  const OUTPUT_FILE = `temp-${nanoid()}.mp4`;

  const content = await fetchFile(videoUrl);
  await ffmpeg.writeFile(TMP_FILE, content);

  await ffmpeg.exec([
    "-ss",
    `${formatTime(start)}`,
    "-to",
    `${formatTime(end)}`,
    "-i",
    TMP_FILE,
    "-c",
    "copy",
    OUTPUT_FILE,
  ]);
  const newContent = await ffmpeg.readFile(OUTPUT_FILE);

  Promise.all([
    await ffmpeg.deleteFile(TMP_FILE),
    await ffmpeg.deleteFile(OUTPUT_FILE),
  ]);

  const url = URL.createObjectURL(
    new Blob([newContent], { type: "video/mp4" }),
  );
  return url;
}

export async function doConcat(sources: string[]) {
  const ffmpeg = new FFmpeg();
  await ffmpeg.load();

  const tmp = sources.map(() => nanoid());

  await Promise.all(
    sources.map(async (s, i) => {
      const content = await fetchFile(s);
      await ffmpeg.writeFile(`temp-${tmp[i]}.mp4`, content);
    }),
  );

  const fileList = tmp.map((id) => `file 'temp-${id}.mp4'`).join("\n");
  const fileListName = "text.txt";
  await ffmpeg.writeFile(fileListName, new TextEncoder().encode(fileList));

  const OUTPUT_FILE = `out-${nanoid()}.mp4`;

  await ffmpeg.exec([
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    fileListName,
    "-c",
    "copy",
    OUTPUT_FILE,
  ]);

  const newContent = await ffmpeg.readFile(OUTPUT_FILE);

  Promise.all([
    await ffmpeg.deleteFile(OUTPUT_FILE),
    ...tmp.map((id) => ffmpeg.deleteFile(`temp-${id}.mp4`)),
  ]);

  const url = URL.createObjectURL(
    new Blob([newContent], { type: "video/mp4" }),
  );
  return url;
}

const getLogoFilter = (position: string) => {
  switch (position) {
    case "top-left":
      return "overlay=8:8";
    case "top-right":
      return "overlay=main_w-overlay_w-8:8";
    case "bottom-left":
      return "overlay=8:main_h-overlay_h-8";
    case "bottom-right":
      return "overlay=main_w-overlay_w-8:main_h-overlay_h-8";
  }
  throw new Error("Invalid logo position");
};

export async function addLogo(videoUrl: string, position: string) {
  const ffmpeg = new FFmpeg();
  await ffmpeg.load();

  const TMP_FILE = `temp-${nanoid()}.mp4`;
  const OUTPUT_FILE = `out-${nanoid()}.mp4`;

  const content = await fetchFile(videoUrl);
  await ffmpeg.writeFile(TMP_FILE, content);
  ffmpeg.on("log", (msg) => console.log(msg));

  await ffmpeg.exec([
    "-i",
    TMP_FILE,
    "-i",
    LOGO_URL,
    "-filter_complex",
    getLogoFilter(position),
    "-codec:a",
    "copy",
    OUTPUT_FILE,
  ]);

  const newContent = await ffmpeg.readFile(OUTPUT_FILE);

  Promise.all([
    await ffmpeg.deleteFile(TMP_FILE),
    await ffmpeg.deleteFile(OUTPUT_FILE),
  ]);

  const url = URL.createObjectURL(
    new Blob([newContent], { type: "video/mp4" }),
  );
  return url;
}

export async function getDuration(src: string): Promise<number> {
  return new Promise((resolve, reject) => {
    // Create a new video element
    const video = document.createElement("video");

    // Set the video source
    video.src = src;

    // Event listener for when the video's metadata has loaded
    const onMetadataLoaded = () => {
      // Resolve the promise with the video duration
      resolve(video.duration);
    };

    const onError = () => {
      reject("Error loading video");
    };

    // Add event listeners
    video.addEventListener("loadedmetadata", onMetadataLoaded);
    video.addEventListener("error", onError);

    return () => {
      video.removeEventListener("loadedmetadata", onMetadataLoaded);
      video.removeEventListener("error", onError);
    };
  });
}
