import { PlayIcon, PauseIcon, InfoIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn, formatTime } from "@/lib/utils";
import { TranscriptResult } from "@/lib/transcript";
import { useVideo } from "../provider";

type ControlsProps = {
  transcript: null | TranscriptResult;
};

export const Controls = ({ transcript }: ControlsProps) => {
  const { crop, setCrop, duration, currentTime, isPlaying, togglePlaying } =
    useVideo();

  return (
    <div className="items-center justify-between border-x border-slate-200 bg-white p-4 md:flex">
      <div className="mb-4 md:mb-0">
        <Button className="flex w-32 gap-4" onClick={() => togglePlaying()}>
          {!isPlaying && <PlayIcon />}
          {isPlaying && <PauseIcon />}
          {formatTime(currentTime)}
        </Button>
      </div>
      <div className="flex gap-2">
        <div className="flex items-center space-x-2">
          <Label htmlFor="auto-crop">Auto-crop</Label>
          <Switch
            id="auto-crop"
            disabled={!transcript}
            onCheckedChange={(v) => {
              if (v) {
                const start = transcript?.cues[0]?.startTime || 0;
                const end =
                  transcript?.cues[transcript?.cues.length - 1]?.endTime || 0;
                setCrop([start, end]);
              } else {
                setCrop([0, duration]);
              }
            }}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className={cn({ "text-slate-200": !!transcript })} />
              </TooltipTrigger>
              <TooltipContent>
                {transcript && "Crop your video content to fit the subtitles."}
                {!transcript && "This feature is not available."}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex gap-2">
          <Input className="w-24" value={formatTime(crop[0] || 0)} disabled />
          <Input className="w-24" value={formatTime(crop[1] || 0)} disabled />
        </div>
      </div>
    </div>
  );
};
