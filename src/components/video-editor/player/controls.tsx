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
import { formatTime } from "@/lib/utils";

type ControlsProps = {
  currentTime: number;
  duration: number;
  crop: [number, number];
  setCrop: (crop: [number, number]) => void;
  isPlaying: boolean;
  setPlaying: (playing: boolean) => void;
};

export const Controls = ({
  crop,
  currentTime,
  isPlaying,
  setPlaying,
}: ControlsProps) => {
  return (
    <div className="flex items-center justify-between border-x border-slate-200 bg-white p-4">
      <div>
        <Button
          className="flex w-32 gap-4"
          onClick={() => setPlaying(!isPlaying)}
        >
          {!isPlaying && <PlayIcon />}
          {isPlaying && <PauseIcon />}
          {formatTime(currentTime)}
        </Button>
      </div>
      <div className="flex gap-2">
        <div className="flex items-center space-x-2">
          <Label htmlFor="auto-crop">Auto-crop</Label>
          <Switch id="auto-crop" disabled />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="text-slate-200" />
              </TooltipTrigger>
              <TooltipContent>
                This feature is not available. Mwahahaha.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex gap-2">
          <Input className="w-16" value={formatTime(crop[0])} disabled />
          <Input className="w-16" value={formatTime(crop[1])} disabled />
        </div>
      </div>
    </div>
  );
};
