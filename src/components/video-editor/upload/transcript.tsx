import { useRef, useCallback, FormEventHandler, ReactNode } from "react";
import { XCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/components/ui/use-toast";
import { parseTranscript, TranscriptResult } from "@/lib/transcript";

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

async function getTextContent(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === "string") {
        resolve(content);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = (e) => {
      reject(new Error(`Failed to read file: ${reader.error}`));
    };
    reader.readAsText(file);
  });
}

async function updateTranscript(
  file: File,
  setData: (transcript: TranscriptResult) => void,
  toast: ReturnType<typeof useToast>["toast"],
) {
  try {
    const text = await getTextContent(file);
    const result = await parseTranscript(text);
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
    setData(result);
  } catch (err) {
    // @ts-ignore
    toast(transcriptError(`${err}`));
  }
}

type TranscriptUploadProps = {
  onSubmit: (transcript: TranscriptResult) => void;
};

export const TranscriptUpload = ({ onSubmit }: TranscriptUploadProps) => {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const handleChange: FormEventHandler<HTMLFormElement> = useCallback(
    async (e) => {
      // @ts-ignore
      const file = e.target.files?.[0];
      if (file) {
        await updateTranscript(file, onSubmit, toast);
      }
    },
    [onSubmit, toast],
  );

  return (
    <form onChange={handleChange}>
      <input ref={inputRef} type="file" className="hidden" accept=".txt,.srt" />
      <Button
        type="button"
        onClick={() => {
          inputRef.current?.click();
        }}
      >
        Upload transcript
      </Button>
    </form>
  );
};
