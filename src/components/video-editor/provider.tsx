import {
  ReactNode,
  createContext,
  useState,
  useEffect,
  useRef,
  useContext,
} from "react";

type State = {
  videoRef: React.MutableRefObject<HTMLVideoElement | null>;
  src: string | null;
  isPlaying: boolean;
  togglePlaying: () => void;
  setPlaying: (isPlaying: boolean) => void;
  crop: [number, number];
  setCrop: (crop: [number, number]) => void;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  duration: number;
  logoPosition: null | string;
  setLogoPosition: (position: null | string) => void;
  showSubtitles: boolean;
  setSubtitles: (showSubtitles: boolean) => void;
};

const VideoContext = createContext<State>({} as State);

type VideoProviderProps = {
  src: string | null;
  children: ReactNode;
};

export const VideoProvider = ({
  src: sourceUrl,
  children,
}: VideoProviderProps) => {
  const [src, setSrc] = useState(sourceUrl);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showSubtitles, setSubtitles] = useState(false);
  const [logoPosition, setLogoPosition] = useState<null | string>(null);
  const [crop, setCrop] = useState<[number, number]>([0, 0]);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    videoRef.current?.addEventListener("loadeddata", (e) => {
      if (videoRef.current !== null) {
        setDuration(videoRef.current.duration);
        setCrop([0, videoRef.current.duration]);
      }
    });
    setSrc(sourceUrl);
    videoRef.current?.load();
  }, [sourceUrl]);

  return (
    <VideoContext.Provider
      value={{
        src,
        videoRef,
        isPlaying,
        togglePlaying: () => {
          if (isPlaying) {
            videoRef.current?.pause();
            setIsPlaying(false);
          } else {
            videoRef.current?.play();
            setIsPlaying(true);
          }
        },
        setPlaying: (isPlaying: boolean) => {
          if (isPlaying) {
            videoRef.current?.pause();
            setIsPlaying(false);
          } else {
            videoRef.current?.play();
            setIsPlaying(true);
          }
        },
        crop,
        setCrop,
        currentTime,
        setCurrentTime,
        duration,
        logoPosition,
        setLogoPosition,
        showSubtitles,
        setSubtitles,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export function useVideo() {
  return useContext(VideoContext);
}
