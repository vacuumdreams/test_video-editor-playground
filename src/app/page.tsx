import fs from "node:fs/promises";
import path from "node:path";
import getConfig from "next/config";
import { Page } from "@/components/page";
import { VideoEditor } from "@/components/video-editor";

export default async function Home() {
  const { serverRuntimeConfig } = getConfig();
  const transcript = await fs.readFile(
    path.join(
      serverRuntimeConfig.PROJECT_ROOT,
      "public",
      "defaults",
      "transcript.txt",
    ),
  );

  return (
    <Page>
      <VideoEditor
        videoUrl="/defaults/video.mp4"
        transcript={transcript.toString()}
      />
    </Page>
  );
}
