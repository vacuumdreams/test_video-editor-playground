import { useRef, useState, useEffect } from "react";

import { Progress } from "@/components/ui/progress";

import { Controls } from "./controls";
import { Attributes } from "./attributes";
import { VideoTrack } from "./tracks";
import { PlaySlider } from "./play-slider";

type VideoPlayerProps = {
  src: string;
  crop: [number, number];
  setCrop: (crop: [number, number]) => void;
};

export const VideoPlayer = ({
  src: sourceUrl,
  crop,
  setCrop,
}: VideoPlayerProps) => {
  const [src, setSrc] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showSubtitles, setSubtitles] = useState(false);
  const [addIntro, setIntro] = useState(false);
  const [logoPosition, setLogoPosition] = useState<null | string>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    videoRef.current?.addEventListener("loadeddata", (e) => {
      if (videoRef.current !== null) {
        setDuration(videoRef.current.duration);
        setCrop([0, videoRef.current.duration]);
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
        onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
      >
        {src && <source src={src} type="video/mp4" />}
        {showSubtitles && (
          <track
            kind="subtitles"
            src="defaults/trascript.txt"
            srcLang="en"
            label="English"
          />
        )}
      </video>
      <Progress
        value={(currentTime * 100) / duration}
        className="h-2 w-full rounded-none"
      />
      <Controls
        crop={crop}
        setCrop={setCrop}
        duration={duration}
        currentTime={currentTime}
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
      <Attributes
        showSubtitles={showSubtitles}
        setSubtitles={setSubtitles}
        addIntro={addIntro}
        setAddIntro={setIntro}
        logoPosition={logoPosition}
        setLogoPosition={setLogoPosition}
      />
      <div className="pl-8">
        <div className="relative">
          <VideoTrack
            src={sourceUrl}
            currentTime={currentTime}
            duration={duration}
            crop={crop}
            setCrop={setCrop}
          />
          <div className="absolute top-0 h-full w-full">
            <PlaySlider
              value={[(currentTime * 100) / duration]}
              onValueChange={([v]) => {
                if (videoRef.current) {
                  videoRef.current.currentTime = (v * duration) / 100;
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
