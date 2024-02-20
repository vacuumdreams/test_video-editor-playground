import { VideoTrack } from "./video";

type TracksProps = {
  src: string | null;
};

export const Tracks = ({ src }: TracksProps) => {
  return (
    <div>
      <VideoTrack src={src} />
    </div>
  );
};
