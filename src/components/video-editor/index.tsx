"use client";

import { useState } from "react";
import { InfoIcon, PlayIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { VideoNavigation } from "./nav";
import { TranscriptResult } from "@/lib/transcript";

type VideoEditorProps = {
  videoUrl: string;
  transcript: string;
};

export const VideoEditor = ({
  videoUrl: defaultVideo,
  transcript: defaultTranscript,
}: VideoEditorProps) => {
  const [video, setVideo] = useState<null | string>(null);
  const [transcript, setTranscript] = useState<null | TranscriptResult>(null);

  return (
    <VideoProvider src={video}>
      <div className="grid h-screen items-start overflow-hidden md:grid-cols-3">
        <div className="bg-slate-200 md:col-span-2">
          {video && (
            <VideoPlayer
              transcript={transcript}
              setVideo={setVideo}
              setTranscript={setTranscript}
            />
          )}
          {!video && (
            <div>
              <div className="flex aspect-video w-full items-center justify-center p-4">
                <VideoUpload onSubmit={({ videoUrl }) => setVideo(videoUrl)}>
                  Upload video
                </VideoUpload>
              </div>
              <div className="items-center justify-between border-x border-b border-slate-200 bg-white p-4 sm:flex">
                <div className="mb-4 sm:mb-0">
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
        <div className="flex h-screen justify-center overflow-scroll p-4 md:col-span-1">
          <Tabs defaultValue="transcript" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="transcript">Transcript</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
            </TabsList>
            <TabsContent value="transcript">
              <Transcript
                transcript={transcript}
                setTranscript={setTranscript}
                setVideo={setVideo}
              />
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
      <VideoNavigation
        video={video}
        transcript={transcript}
        setVideo={setVideo}
        setTranscript={setTranscript}
        defaults={{
          videoUrl: defaultVideo,
          transcript: defaultTranscript,
        }}
      />
    </VideoProvider>
  );
};
