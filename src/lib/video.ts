import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { formatTime } from "@/lib/utils";
import { nanoid } from "nanoid";

export async function doCrop(videoUrl: string, start: number, end: number) {
  const ffmpeg = new FFmpeg();
  await ffmpeg.load();

  const TMP_FILE = `temp-${nanoid()}.mp4`;
  const TMP_FILE_2 = `temp-${nanoid()}.mp4`;

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
    TMP_FILE_2,
  ]);
  const newContent = await ffmpeg.readFile(TMP_FILE_2);

  await ffmpeg.deleteFile(TMP_FILE);
  await ffmpeg.deleteFile(TMP_FILE_2);

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
