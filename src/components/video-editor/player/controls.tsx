import { PlayIcon, PauseIcon, InfoIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type ControlsProps = {
  isPlaying: boolean;
  setPlaying: (playing: boolean) => void;
};

export const Controls = ({ isPlaying, setPlaying }: ControlsProps) => {
  return (
    <div className="flex items-center justify-between border-x border-slate-200 bg-white p-4">
      <div>
        <Button onClick={() => setPlaying(!isPlaying)}>
          {!isPlaying && <PlayIcon />}
          {isPlaying && <PauseIcon />}
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
          <div>
            <Input
              value="00:00"
              type="time"
              step="10"
              min="00:00"
              max="00:53"
              onChange={() => {}}
            />
          </div>
          <div>
            <Input
              value="00:53"
              type="time"
              step="10"
              min="00:00"
              max="00:53"
              onChange={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
