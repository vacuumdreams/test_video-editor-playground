import { ReactNode, useState, useCallback, useEffect } from "react";
import {
  SearchIcon,
  TrashIcon,
  XCircleIcon,
  Loader2Icon,
  AlertTriangleIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TranscriptUpload } from "../upload/transcript";
import { useToast } from "@/components/ui/use-toast";
import {
  getText,
  getPersonName,
  parseTranscript,
  removeLinesFromTranscript,
  TranscriptLine,
} from "@/lib/transcript";
import { cn, formatTime } from "@/lib/utils";
import { doCrop, doConcat } from "@/lib/video";
import { useVideo } from "../provider";

const transcriptError = (details?: ReactNode) => ({
  title: (
    <div className="mb-2 flex gap-2">
      <XCircleIcon />
      <span>Error parsing transcript</span>
    </div>
  ),
  description: (
    <div>
      <div className="mb-4 text-slate-500">
        <p>
          Make sure your subtitles have the{" "}
          <a
            className="underline"
            href="https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API"
            target="_blank"
            rel="noreferrer noopener"
          >
            correct format
          </a>
          :
        </p>
      </div>
      <pre className="w-full overflow-x-scroll bg-slate-100 p-2 font-mono text-xs">
        {`id
hh:mm:ss.000 --> hh:mm:ss.000
<v Speaker>Caption for the above time frame.`}
      </pre>
      {details && (
        <Accordion type="single" collapsible className="mt-2 w-full">
          <AccordionItem value="details">
            <AccordionTrigger>more details</AccordionTrigger>
            <AccordionContent>{details}</AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  ),
});

const cutError = {
  title: (
    <div className="mb-2 flex gap-2">
      <XCircleIcon />
      <span>Error cutting video</span>
    </div>
  ),
  description: (
    <p className="mb-4 text-slate-500">
      Something went wrong while trying to apply the cut to the video.
    </p>
  ),
};

const Person = ({ line }: { line: TranscriptLine }) => {
  const name = getPersonName(line);

  return (
    <>
      <Avatar className="h-6 w-6 text-white">
        <AvatarFallback className="bg-teal-500 text-xs">
          {name
            ? name
                .split(" ")
                .slice(0, 2)
                .map((w) => w[0])
                .join("")
                .toUpperCase()
            : "A"}
        </AvatarFallback>
      </Avatar>
      <strong>{name || "Unknown speaker"}</strong>{" "}
    </>
  );
};

async function updateTranscript(
  transcript: string,
  setData: (data: TranscriptLine[]) => void,
  toast: ReturnType<typeof useToast>["toast"],
) {
  try {
    const result = await parseTranscript(transcript);
    if (result.errors.length > 0) {
      toast(
        // @ts-ignore
        transcriptError(
          <div className="bg-red-100 p-2 font-mono text-xs">
            {result.errors.map((e, i) => (
              <span key={i}>{`${e}`}</span>
            ))}
          </div>,
        ),
      );
      return;
    }

    if (result.cues.length === 0) {
      // @ts-ignore
      toast(transcriptError("No valid cues found in the transcript"));
      return;
    }
    setData(result.cues);
  } catch (err) {
    // @ts-ignore
    toast(transcriptError(`${err}`));
  }
}

type TranscriptProps = {
  transcript: string | null;
  setTranscript: (transcript: string | null) => void;
  setVideo: (url: string | null) => void;
};

export const Transcript = ({
  transcript,
  setVideo,
  setTranscript,
}: TranscriptProps) => {
  const [isLoading, setLoading] = useState(false);
  const [openConfirmIndex, setOpenConfirmIndex] = useState<null | string>(null);
  const { toast } = useToast();
  const { src, currentTime, duration } = useVideo();
  const [data, setData] = useState<TranscriptLine[]>([]);

  useEffect(() => {
    if (transcript) {
      updateTranscript(transcript, setData, toast);
    } else {
      setData([]);
    }
  }, [transcript, toast, setData]);

  const handleCut = useCallback(
    async (line: TranscriptLine) => {
      setLoading(true);
      if (src && transcript) {
        try {
          const [src1, src2] = await Promise.all([
            await doCrop(src, 0, line.startTime),
            await doCrop(src, line.endTime, duration),
          ]);

          const newSrc = await doConcat([src1, src2]);
          setVideo(newSrc);
          const newTranscript = await removeLinesFromTranscript(transcript, [
            line,
          ]);
          setTranscript(newTranscript);
          setLoading(false);
          setOpenConfirmIndex(null);
        } catch (err) {
          console.error(err);
          setLoading(false);
          setOpenConfirmIndex(null);
          // @ts-ignore
          toast(cutError);
        }
      }
    },
    [src, duration, transcript, toast, setVideo, setTranscript],
  );

  return (
    <div>
      {data.length > 0 && (
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
      )}
      <div className="pb-24 pt-4">
        {data.map((line, i) => (
          <div
            key={i}
            className={cn("group my-2 rounded-lg p-2 transition-colors", {
              "hover:bg-red-200": !!src,
              "bg-purple-100":
                currentTime > line.startTime && currentTime < line.endTime,
            })}
          >
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Person line={line} />
                <span className="text-sm text-slate-400">
                  {formatTime(line.startTime)}
                </span>
              </div>
              {src && (
                <Button
                  className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => setOpenConfirmIndex(i.toString())}
                >
                  <TrashIcon size={12} />
                </Button>
              )}
            </div>
            <p className="pl-8">{getText(line)}</p>
          </div>
        ))}
        {data && data.length > 0 && (
          <Button
            className="my-8 w-full gap-2"
            onClick={() => setTranscript(null)}
          >
            <TrashIcon size={16} />
            Delete transcript
          </Button>
        )}
        {data.length === 0 && (
          <div className="flex w-full justify-center overflow-y-auto pt-12">
            <TranscriptUpload
              onSubmit={({ transcript }) => setTranscript(transcript)}
            />
          </div>
        )}
      </div>
      <Dialog
        open={!!openConfirmIndex}
        onOpenChange={() => {
          if (!isLoading) {
            setOpenConfirmIndex(null);
          }
        }}
      >
        {openConfirmIndex && data && (
          <DialogContent className="sm:max-w-[425px]">
            {!isLoading && (
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangleIcon className="text-orange-400 " />
                  <span>Delete caption</span>
                </DialogTitle>
                <DialogDescription>
                  The time range from{" "}
                  {formatTime(data[Number(openConfirmIndex)]?.startTime)} to{" "}
                  {formatTime(data[Number(openConfirmIndex)]?.endTime)} will be
                  removed from the video.
                </DialogDescription>
              </DialogHeader>
            )}
            {isLoading && (
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="relative origin-center animate-spin text-slate-500">
                    <Loader2Icon />
                  </span>
                  <span>Processing</span>
                </DialogTitle>
                <DialogDescription>
                  Please wait while we cut the video. This may take a few
                  seconds.
                </DialogDescription>
              </DialogHeader>
            )}
            <DialogFooter>
              <Button
                disabled={isLoading}
                onClick={() => {
                  if (data && openConfirmIndex) {
                    handleCut(data[Number(openConfirmIndex)]);
                  }
                }}
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};
