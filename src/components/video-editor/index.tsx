"use client";

import { useState, useRef } from "react";
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
import { Transcript } from "./transcript";
import { VideoPlayer } from "./player";
import { VideoUpload } from "./upload/video";
import { TranscriptUpload } from "./upload/transcript";

type VideoEditorProps = {
  transcript: string;
};

export const VideoEditor = ({
  transcript: defaultTranscript,
}: VideoEditorProps) => {
  const [crop, setCrop] = useState<[number, number]>([0, 0]);
  // const [video, setVideo] = useState("/defaults/video.mp4");
  // const [transcript, setTranscript] = useState(defaultTranscript);
  const [video, setVideo] = useState<null | string>(null);
  const [transcript, setTranscript] = useState<null | string>(null);

  return (
    <div className="grid h-screen grid-cols-3 items-start overflow-hidden">
      <div className="col-span-2 bg-slate-200">
        {video && <VideoPlayer src={video} crop={crop} setCrop={setCrop} />}
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
  );
};
