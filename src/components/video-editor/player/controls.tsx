import { PlayIcon, InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const Controls = () => {
  return (
    <div className="flex items-center justify-between bg-white p-4">
      <div>
        <Button>
          <PlayIcon />
        </Button>
      </div>
      <div className="flex gap-2">
        <div className="flex items-center space-x-2">
          <Label htmlFor="auto-crop">Auto-crop</Label>
          <Switch id="auto-crop" disabled />
          <InfoIcon className="text-slate-200" />
        </div>
        <div className="flex gap-2">
          <div>
            <Input
              value="00:00"
              type="time"
              step="10"
              min="00:00"
              max="00:53"
            />
          </div>
          <div>
            <Input
              value="00:53"
              type="time"
              step="10"
              min="00:00"
              max="00:53"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
