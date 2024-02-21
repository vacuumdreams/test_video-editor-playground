import { useState, useEffect } from "react";

import { getFrames } from "@/lib/frame";

import { FilmIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TrackSlider } from "./track-slider";

const THUMBS_LENGTH = 15;

const createThumbList = async (
  videoUrl: string,
  setImages: (images: string[]) => void,
  setLoading: (loading: boolean) => void,
) => {
  setLoading(true);
  try {
    const images = await getFrames(videoUrl, THUMBS_LENGTH);
    setImages(images);
    setLoading(false);
  } catch (e) {
    setLoading(false);
    console.error(e);
  }
};

type VideoTrackProps = {
  src: string | null;
  duration: number;
  currentTime: number;
  crop: [number, number];
  setCrop: (props: [number, number]) => void;
};

export const VideoTrack = ({
  src,
  duration,
  crop,
  setCrop,
}: VideoTrackProps) => {
  const [isLoading, setLoading] = useState(true);
  const [thumbs, setThumbs] = useState<string[]>([]);

  useEffect(() => {
    if (src) {
      createThumbList(src, setThumbs, setLoading);
    }
  }, [src]);

  return (
    <div>
      <div className="absolute -left-8 flex h-[5.5rem] w-8 items-center justify-center bg-black text-white">
        <FilmIcon size={12} />
      </div>
      <div>
        <div className="relative flex h-[5.45rem] w-full gap-1 overflow-x-hidden">
          {!isLoading && (
            <TrackSlider
              className="absolute left-0 z-10 h-full w-full overflow-x-scroll"
              value={[(crop[0] * 100) / duration, (crop[1] * 100) / duration]}
              onValueChange={([start, end]) => {
                setCrop([(start * duration) / 100, (end * duration) / 100]);
              }}
            />
          )}
          {isLoading &&
            Array(THUMBS_LENGTH)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="aspect-[3/5] h-full" />
              ))}
          {thumbs.map((img, i) => (
            <img
              key={i}
              className="aspect-[3/5] h-full object-cover"
              src={img}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
