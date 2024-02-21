import { Progress } from "@/components/ui/progress";

import { Controls } from "./controls";
import { Attributes } from "./attributes";
import { VideoTrack } from "./tracks";
import { PlaySlider } from "./play-slider";
import { useVideo } from "../provider";

type VideoPlayerProps = {
  src: string;
};

export const VideoPlayer = ({ src: sourceUrl }: VideoPlayerProps) => {
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
            default
            kind="subtitles"
            src="defaults/transcript.txt"
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
              min={(crop[0] * 100) / duration}
              max={(crop[1] * 100) / duration}
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
