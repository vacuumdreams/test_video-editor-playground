import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export const Attributes = ({}) => {
  return (
    <div className="flex gap-4 bg-slate-200 p-4">
      <div className="flex cursor-pointer items-center space-x-2">
        <Checkbox id="subtitles" className="bg-white" />
        <Label
          htmlFor="subtitles"
          className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Show subtitles
        </Label>
      </div>
      <div className="flex cursor-pointer items-center space-x-2">
        <Checkbox id="intro" className="bg-white" />
        <Label
          htmlFor="intro"
          className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Add intro
        </Label>
      </div>
      <div className="flex cursor-pointer items-center space-x-2">
        <Checkbox id="logo" className="bg-white" />
        <Label
          htmlFor="logo"
          className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Add logo
        </Label>
      </div>
      <Select value="top-left" onValueChange={() => {}}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="top-left">Top left</SelectItem>
          <SelectItem value="top-right">Top right</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
