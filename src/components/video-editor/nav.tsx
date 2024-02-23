import { useCallback } from "react";
import { WandIcon, DownloadIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { parseTranscript, stringify, TranscriptResult } from "@/lib/transcript";

type VideoNavigationProps = {
  video: string | null;
  transcript: TranscriptResult | null;
  setVideo: (video: string | null) => void;
  setTranscript: (transcript: TranscriptResult | null) => void;
  defaults: {
    videoUrl: string;
    transcript: string;
  };
};

export const VideoNavigation = ({
  video,
  transcript,
  setVideo,
  setTranscript,
  defaults,
}: VideoNavigationProps) => {
  const handleDownloadTranscript = useCallback(() => {
    if (transcript) {
      const content = stringify(transcript);
      const url = window.URL.createObjectURL(new Blob([content]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `transcript.txt`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    }
  }, [transcript]);

  return (
    <div className="fixed bottom-0 left-0 z-30 flex w-full bg-slate-100 p-4">
      <div className="flex w-full justify-end gap-2">
        {!video && !transcript && (
          <Button
            className="flex gap-2"
            onClick={async () => {
              const transcript = await parseTranscript(defaults.transcript);
              setVideo(defaults.videoUrl);
              setTranscript(transcript);
            }}
          >
            <WandIcon />
            <span>Give me defaults</span>
          </Button>
        )}
        {video && (
          <a
            className={cn(
              "cursor-pointer gap-2",
              buttonVariants({ variant: "default" }),
            )}
            href={video}
            download
          >
            <DownloadIcon />
            <span>Download video</span>
          </a>
        )}
        {transcript && (
          <a
            className={cn(
              "cursor-pointer gap-2",
              buttonVariants({ variant: "default" }),
            )}
            download
            onClick={handleDownloadTranscript}
          >
            <DownloadIcon />
            <span>Download transcript</span>
          </a>
        )}
      </div>
    </div>
  );
};
