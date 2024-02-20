import { useState, useEffect } from "react";

import { getFrames } from "@/lib/frame";

import { FilmIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type VideoTrackProps = {
  src: string | null;
};

const createThumbList = async (
  videoUrl: string,
  setImages: (images: string[]) => void,
  setLoading: (loading: boolean) => void,
) => {
  setLoading(true);
  try {
    const images = await getFrames(videoUrl, 30);
    setImages(images);
    setLoading(false);
  } catch (e) {
    setLoading(false);
    console.error(e);
  }
};

export const VideoTrack = ({ src }: VideoTrackProps) => {
  const [isLoading, setLoading] = useState(true);
  const [thumbs, setThumbs] = useState<string[]>([]);

  useEffect(() => {
    if (src) {
      createThumbList(src, setThumbs, setLoading);
    }
  }, [src]);

  return (
    <div className="relative py-2">
      <div className="fixed flex h-20 w-8 items-center justify-center bg-black text-white">
        <FilmIcon size={12} />
      </div>
      <div className="flex h-20 w-full gap-1 overflow-x-scroll pl-8">
        {isLoading &&
          Array(6)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="aspect-video h-full" />
            ))}
        {thumbs.map((img, i) => (
          <img key={i} className="h-full" src={img} />
        ))}
      </div>
    </div>
  );
};
