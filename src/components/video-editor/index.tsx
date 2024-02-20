"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Transcript } from "./transcript";
import { VideoPlayer } from "./player";

type VideoEditorProps = {
  transcript: string;
};

export const VideoEditor = ({
  transcript: defaultTranscript,
}: VideoEditorProps) => {
  const [video, setVideo] = useState("/defaults/video.mp4");
  const [transcript, setTranscript] = useState(defaultTranscript);

  return (
    <div className="grid grid-cols-3">
      <div className="col-span-2 h-full bg-slate-200">
        <VideoPlayer src={video} />
      </div>
      <div className="col-span-1 flex justify-center p-4">
        <Tabs defaultValue="transcript" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transcript">Transcript</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>
          <TabsContent value="transcript">
            {!transcript && (
              <div className="flex w-full justify-center pt-12">
                <Button>Upload transcript</Button>
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
