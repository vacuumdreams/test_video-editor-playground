import { useRef, useState, useEffect } from "react";

import { Controls } from "./controls";
import { Attributes } from "./attributes";
import { Tracks } from "./tracks";

type VideoPlayerProps = {
  src: string;
};

export const VideoPlayer = ({ src: sourceUrl }: VideoPlayerProps) => {
  const [src, setSrc] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    videoRef.current?.addEventListener("loadeddata", (e) => {
      if (videoRef.current !== null) {
        console.log("yoyoyo", videoRef.current.duration);
      }
    });

    setSrc(sourceUrl);
  }, [sourceUrl]);

  return (
    <div>
      <video
        preload="auto"
        ref={videoRef}
        className="aspect-video w-full"
        onEnded={() => setIsPlaying(false)}
      >
        {src && <source src={src} type="video/mp4" />}
        {
          <track
            kind="subtitles"
            src="defaults/trascript.txt"
            srcLang="en"
            label="English"
          />
        }
      </video>
      <Controls
        isPlaying={isPlaying}
        setPlaying={() => {
          if (isPlaying) {
            videoRef.current?.pause();
            setIsPlaying(false);
          } else {
            videoRef.current?.play();
            setIsPlaying(true);
          }
        }}
      />
      <Attributes />
      <Tracks src={sourceUrl} />
    </div>
  );
};
