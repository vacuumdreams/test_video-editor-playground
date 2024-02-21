import { useMemo } from "react";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { parseTranscript } from "@/lib/transcript";
import { formatTime } from "@/lib/utils";

type TranscriptProps = {
  text: string;
};

export const Transcript = ({ text }: TranscriptProps) => {
  const transcript = useMemo(() => {
    return parseTranscript(text);
  }, [text]);

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
          disabled
        />
      </div>
      <div className="pb-8 pt-4">
        {transcript.map((line, i) => (
          <div key={i}>
            <div className="my-2 flex items-center gap-2">
              <Avatar className="h-6 w-6 text-white">
                <AvatarFallback className="bg-teal-500 text-xs">
                  {line.person
                    .split(" ")
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <strong>{line.person}</strong>
              <span className="text-sm text-slate-400">
                {formatTime(line.start / 1000)}
              </span>
            </div>
            <p className="mb-4 pl-8">{line.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
