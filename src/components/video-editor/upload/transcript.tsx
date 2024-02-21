import { useRef, useCallback, FormEventHandler } from "react";
import { Button } from "@/components/ui/button";

function getTextContent(file: File): Promise<string> {
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

type TranscriptUploadProps = {
  onSubmit: (p: { transcript: string }) => void;
};

export const TranscriptUpload = ({ onSubmit }: TranscriptUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleChange: FormEventHandler<HTMLFormElement> = useCallback(
    async (e) => {
      // eslint-disable-next-line
      const file = e.target.files?.[0];
      if (file) {
        const transcript = await getTextContent(file);
        onSubmit({ transcript });
      }
    },
    [],
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
