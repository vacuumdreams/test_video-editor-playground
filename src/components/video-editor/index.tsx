"use client";

import { useState } from "react";
import {
  InfoIcon,
  PlayIcon,
  FilmIcon,
  ScrollTextIcon,
  WandIcon,
  DownloadIcon,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VideoProvider } from "./provider";
import { Transcript } from "./transcript";
import { VideoPlayer } from "./player";
import { VideoUpload } from "./upload/video";
import { TranscriptUpload } from "./upload/transcript";
import { cn } from "@/lib/utils";

type VideoEditorProps = {
  videoUrl: string;
  transcript: string;
};

export const VideoEditor = ({
  videoUrl: defaultVideo,
  transcript: defaultTranscript,
}: VideoEditorProps) => {
  const [video, setVideo] = useState<null | string>(null);
  const [transcript, setTranscript] = useState<null | string>(null);

  return (
    <VideoProvider src={video}>
      <div className="grid h-screen grid-cols-3 items-start overflow-hidden">
        <div className="col-span-2 bg-slate-200">
          {video && <VideoPlayer src={video} />}
          {!video && (
            <div>
              <div className="flex aspect-video w-full items-center justify-center p-4">
                <VideoUpload onSubmit={({ videoUrl }) => setVideo(videoUrl)} />
              </div>
              <div className="flex items-center justify-between border-x border-b border-slate-200 bg-white p-4">
                <div>
                  <Button className="flex w-32 gap-4" disabled>
                    <PlayIcon />
                    {"00:00"}
                  </Button>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="auto-crop">Auto-crop</Label>
                    <Switch id="auto-crop" disabled />
                    <InfoIcon className="text-slate-200" />
                    <div className="flex gap-2">
                      <Input className="w-16" value={"00:00"} disabled />
                      <Input className="w-16" value={"00:00"} disabled />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="col-span-1 flex h-screen justify-center overflow-scroll p-4">
          <Tabs defaultValue="transcript" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="transcript">Transcript</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
            </TabsList>
            <TabsContent value="transcript">
              {!transcript && (
                <div className="flex w-full justify-center overflow-y-auto pt-12">
                  <TranscriptUpload
                    onSubmit={({ transcript }) => setTranscript(transcript)}
                  />
                </div>
              )}
              {transcript && <Transcript text={transcript} />}
            </TabsContent>
            <TabsContent value="summary">
              <Card>
                <CardHeader>
                  <CardTitle>Coming soon!</CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    (just kidding)
                  </CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 flex w-full bg-slate-100 p-4">
        <div className="flex gap-2">
          {video && (
            <Button className="flex gap-2" onClick={() => setVideo(null)}>
              <FilmIcon />
              <span>Delete video</span>
            </Button>
          )}
          {transcript && (
            <Button className="flex gap-2" onClick={() => setTranscript(null)}>
              <ScrollTextIcon />
              <span>Delete transcript</span>
            </Button>
          )}
        </div>
        <div className="flex w-full justify-end gap-2">
          {!video && !transcript && (
            <Button
              className="flex gap-2"
              onClick={() => {
                setVideo(defaultVideo);
                setTranscript(defaultTranscript);
              }}
            >
              <WandIcon />
              <span>Give me defaults</span>
            </Button>
          )}
          {video && (
            <a
              className={cn("gap-2", buttonVariants({ variant: "default" }))}
              href={video}
              download
            >
              <DownloadIcon />
              <span>Download video</span>
            </a>
          )}
          {transcript && (
            <a
              className={cn("gap-2", buttonVariants({ variant: "default" }))}
              href={transcript}
              download
            >
              <DownloadIcon />
              <span>Download transcript</span>
            </a>
          )}
        </div>
      </div>
    </VideoProvider>
  );
};
