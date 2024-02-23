import { useState, useCallback } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { doConcat, getDuration } from "@/lib/video";
import { filterTranscript } from "@/lib/transcript";
import { useVideo } from "../provider";
import { VideoUpload } from "../upload/video";
import { TranscriptResult } from "@/lib/transcript";

const introError = {
  title: "Something went wrong",
  description:
    "There was an unexpected error when adding the intro to your video.",
};

type AttributesProps = {
  transcript: null | TranscriptResult;
  setVideo: (video: string) => void;
  setTranscript: (transcript: TranscriptResult) => void;
};

export const Attributes = ({
  transcript,
  setVideo,
  setTranscript,
}: AttributesProps) => {
  const { toast } = useToast();
  const [isLoading, setLoading] = useState(false);
  const { src, showSubtitles, setSubtitles, logoPosition, setLogoPosition } =
    useVideo();

  const handleAddIntro = useCallback(
    async ({ videoUrl }: { videoUrl: string }) => {
      if (src) {
        setLoading(true);
        try {
          const introDuration = await getDuration(videoUrl);
          const newUrl = await doConcat([videoUrl, src]);
          if (transcript) {
            const newTranscript = await filterTranscript(transcript, () => ({
              isMatch: false,
              offset: introDuration * -1,
            }));
            setTranscript(newTranscript);
          }
          setVideo(newUrl);
        } catch (err) {
          console.error(err);
          toast(introError);
        }
      }
    },
    [toast, transcript, src, setVideo, setTranscript],
  );

  return (
    <div className="flex gap-4 bg-slate-200 p-4">
      <div className="flex cursor-pointer items-center space-x-2">
        <Checkbox
          id="subtitles"
          className="bg-white"
          checked={showSubtitles}
          onCheckedChange={(val) => {
            setSubtitles(!!val);
          }}
        />
        <Label
          htmlFor="subtitles"
          className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Show subtitles
        </Label>
      </div>
      <div className="flex cursor-pointer items-center space-x-2">
        <Checkbox
          id="logo"
          className="bg-white"
          checked={logoPosition !== null}
          onCheckedChange={(val) => setLogoPosition(val ? "top-left" : null)}
        />
        <Label
          htmlFor="logo"
          className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Add logo
        </Label>
      </div>
      <Select
        value={logoPosition || "top-left"}
        disabled={logoPosition === null}
        onValueChange={setLogoPosition}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="top-left">Top left</SelectItem>
          <SelectItem value="top-right">Top right</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex cursor-pointer items-center space-x-2">
        <VideoUpload disabled={isLoading} onSubmit={handleAddIntro}>
          Add intro
        </VideoUpload>
      </div>
    </div>
  );
};
