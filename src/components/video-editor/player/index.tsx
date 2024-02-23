import { TrashIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

import { Controls } from "./controls";
import { Attributes } from "./attributes";
import { VideoTrack } from "./tracks";
import { PlaySlider } from "./play-slider";
import { useVideo } from "../provider";
import { doCrop } from "@/lib/video";
import {
  filterTranscript,
  TranscriptResult,
  TranscriptLine,
} from "@/lib/transcript";
import { useCallback } from "react";

type VideoPlayerProps = {
  transcript: TranscriptResult | null;
  setVideo: (url: string | null) => void;
  setTranscript: (transcript: TranscriptResult | null) => void;
};

const createCueFilter =
  (ranges: Array<[number, number]>) => (cue: TranscriptLine) => {
    return ranges.reduce<{
      isMatch: boolean;
      offset: number;
    }>(
      (acc, r) => {
        if (cue.startTime >= r[0] && cue.endTime <= r[1]) {
          acc.isMatch = true;
        }

        if (r[1] < cue.endTime) {
          acc.offset = acc.offset + (r[1] - r[0]);
        }

        return acc;
      },
      {
        isMatch: false,
        offset: 0,
      },
    );
  };

export const VideoPlayer = ({
  transcript,
  setVideo,
  setTranscript,
}: VideoPlayerProps) => {
  const {
    src,
    videoRef,
    crop,
    setCrop,
    setPlaying,
    duration,
    currentTime,
    setCurrentTime,
    showSubtitles,
  } = useVideo();

  const handleCrop = useCallback(async () => {
    if (src) {
      const newSrc = await doCrop(src, crop[0], crop[1]);

      if (transcript) {
        const filterFn = createCueFilter([
          [0, crop[0]],
          [crop[1], duration],
        ]);
        const newTranscript = await filterTranscript(transcript, filterFn);
        setTranscript(newTranscript);
      }

      setVideo(newSrc);
    }
  }, [src, transcript, duration, setTranscript, setVideo, crop]);

  return (
    <div className="relative">
      <div className="group relative aspect-video w-full">
        <video
          preload="auto"
          ref={videoRef}
          className="aspect-video w-full"
          onEnded={() => setPlaying(false)}
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
      <Controls transcript={transcript} />
      <Attributes
        transcript={transcript}
        setVideo={setVideo}
        setTranscript={setTranscript}
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
