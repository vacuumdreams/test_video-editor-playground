import { TrashIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

import { Controls } from "./controls";
import { Attributes } from "./attributes";
import { VideoTrack } from "./tracks";
import { PlaySlider } from "./play-slider";
import { useVideo } from "../provider";
import { doCrop } from "@/lib/video";
import { removeRangesFromTranscript } from "@/lib/transcript";
import { useCallback } from "react";

type VideoPlayerProps = {
  transcript: string | null;
  setVideo: (url: string | null) => void;
  setTranscript: (transcript: string | null) => void;
};

export const VideoPlayer = ({
  transcript,
  setVideo,
  setTranscript,
}: VideoPlayerProps) => {
  const {
    src,
    videoRef,
    isPlaying,
    setIsPlaying,
    crop,
    setCrop,
    duration,
    currentTime,
    setCurrentTime,
    logoPosition,
    setLogoPosition,
    addIntro,
    setIntro,
    showSubtitles,
    setSubtitles,
  } = useVideo();

  const handleCrop = useCallback(async () => {
    if (src) {
      const newSrc = await doCrop(src, crop[0], crop[1]);

      if (transcript) {
        const newTranscript = await removeRangesFromTranscript(transcript, [
          [0, crop[0]],
          [crop[1], duration],
        ]);
        setTranscript(newTranscript);
      }

      setVideo(newSrc);
    }
  }, [transcript, duration, src, crop[0], crop[1]]);

  return (
    <div className="relative">
      <div className="group relative aspect-video w-full">
        <video
          preload="auto"
          ref={videoRef}
          className="aspect-video w-full"
          onEnded={() => setIsPlaying(false)}
          onTimeUpdate={() =>
            setCurrentTime(videoRef.current?.currentTime || 0)
          }
        >
          {src && <source src={src} type="video/mp4" />}
          {showSubtitles && (
            <track
              default
              kind="subtitles"
              src="/defaults/transcript.txt"
              srcLang="en"
              label="English"
            />
          )}
        </video>
        <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-white bg-opacity-80 opacity-0 transition-opacity group-hover:opacity-100">
          <Button className="gap-2" onClick={() => setVideo(null)}>
            <TrashIcon size={16} />
            <span>Delete video</span>
          </Button>
        </div>
      </div>
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
            src={src}
            currentTime={currentTime}
            duration={duration}
            crop={crop}
            setCrop={setCrop}
          />
          <div className="absolute top-0 h-full w-full">
            <PlaySlider
              value={duration ? [(currentTime * 100) / duration] : [0]}
              onValueChange={([v]) => {
                if (videoRef.current) {
                  videoRef.current.currentTime = (v * duration) / 100;
                }
              }}
            />
          </div>
        </div>
      </div>

      {src && (crop[0] > 0 || crop[1] < duration) && (
        <div className="absolute mt-12 flex w-full justify-center p-4">
          <Button onClick={handleCrop}>Apply crop</Button>
        </div>
      )}
    </div>
  );
};
