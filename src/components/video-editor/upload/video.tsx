import { useRef, useCallback, FormEventHandler, ReactNode } from "react";
import { Button } from "@/components/ui/button";

function getVideoUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result;
      if (typeof url === "string") {
        resolve(url);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = (e) => {
      reject(new Error(`Failed to read file: ${reader.error}`));
    };
    reader.readAsDataURL(file);
  });
}

type VideoUploadProps = {
  children: ReactNode;
  disabled?: boolean;
  onSubmit: (p: { videoUrl: string }) => void;
};

export const VideoUpload = ({
  children,
  disabled,
  onSubmit,
}: VideoUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleChange: FormEventHandler<HTMLFormElement> = useCallback(
    async (e) => {
      // @ts-ignore
      const file = e.target.files?.[0];
      if (file) {
        const videoUrl = await getVideoUrl(file);
        onSubmit({ videoUrl });
      }
    },
    [onSubmit],
  );

  return (
    <form onChange={handleChange}>
      <input ref={inputRef} type="file" className="hidden" accept="video/*" />
      <Button
        disabled={disabled}
        type="button"
        onClick={() => {
          inputRef.current?.click();
        }}
      >
        {children}
      </Button>
    </form>
  );
};
