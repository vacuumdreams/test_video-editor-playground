import { Controls } from "./controls";
import { Attributes } from "./attributes";
import { Tracks } from "./tracks";

type VideoPlayerProps = {
  src: string;
};

export const VideoPlayer = ({ src }: VideoPlayerProps) => {
  return (
    <div>
      <video className="aspect-video w-full" autoPlay>
        <source src={src} type="video/mp4" />
      </video>
      <Controls />
      <Attributes />
      <Tracks />
    </div>
  );
};
