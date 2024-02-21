import { useMemo } from "react";
import { SearchIcon, TrashIcon, XCircleIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { parseTranscript } from "@/lib/transcript";
import { cn, formatTime } from "@/lib/utils";
import { useVideo } from "../provider";

type TranscriptProps = {
  text: string;
};

export const Transcript = ({ text }: TranscriptProps) => {
  const { toast } = useToast();
  const { currentTime } = useVideo();
  const transcript = useMemo(() => {
    try {
      return parseTranscript(text);
    } catch (err) {
      toast({
        title: "Error parsing transcript",
        description: (
          <div>
            <div className="flex gap-2">
              <XCircleIcon />
              <span>Make sure your transcript has the correct format:</span>
            </div>
            <pre className="bg-slate-100 p-2 font-mono">
              {`[dd:dd-dd:dd]
                Person: Caption for the relevant time frame`}
            </pre>
          </div>
        ),
      });
    }
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
      <div className="pb-24 pt-4">
        {transcript.map((line, i) => (
          <div
            key={i}
            className={cn(
              "group my-2 rounded-lg p-2 transition-colors hover:bg-red-200",
              {
                "bg-purple-100":
                  currentTime * 1000 > line.start &&
                  currentTime * 1000 < line.end,
              },
            )}
          >
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
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
              <Button className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100">
                <TrashIcon size={12} />
              </Button>
            </div>
            <p className="pl-8">{line.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
