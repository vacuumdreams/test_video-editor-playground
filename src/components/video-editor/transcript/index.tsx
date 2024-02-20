import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

type TranscriptProps = {
  text: string;
};

export const Transcript = ({ text }: TranscriptProps) => {
  return (
    <div>
      <div className="relative">
        <SearchIcon
          size="16"
          className="absolute left-3 top-3 text-slate-400"
        />
        <Input
          placeholder="Search"
          type="search"
          className="rounded-full pl-10"
        />
      </div>
      {text}
    </div>
  );
};
