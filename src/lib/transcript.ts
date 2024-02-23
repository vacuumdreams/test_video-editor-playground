import {
  parseText,
  tokenizeVTTCue,
  ParsedCaptionsResult,
  VTTCue,
  VTTNode,
} from "media-captions";

import { formatTime } from "@/lib/utils";

export type TranscriptResult = ParsedCaptionsResult;
export type TranscriptLine = VTTCue;

export async function parseTranscript(
  input: string,
): Promise<ParsedCaptionsResult> {
  const r = await parseText(input);

  return r;
}

export const getPersonName = (cue: VTTCue) => {
  const tokens = tokenizeVTTCue(cue);
  // for the sake of simplicity, we consider only cues with a single speaker, wrapping around the entirity of the given text
  if (tokens[0].type === "v") {
    return tokens[0].voice;
  }

  return undefined;
};

const extractText = (tokens: VTTNode[], data: string[]) => {
  for (const token of tokens) {
    if (token.type === "text") {
      data.push(token.data);
    } else {
      extractText(token.children, data);
    }
  }
};

export const getText = (cue: VTTCue) => {
  const tokens = tokenizeVTTCue(cue);
  const data: string[] = [];
  extractText(tokens, data);
  return data.join("");
};

type FilterFnResult = {
  isMatch: boolean;
  offset: number;
};

export async function filterTranscript(
  transcript: TranscriptResult,
  filterFn: (cue: VTTCue) => FilterFnResult,
) {
  const cues = transcript.cues.reduce<VTTCue[]>((acc, cue) => {
    const { isMatch, offset } = filterFn(cue);
    if (isMatch) {
      return acc;
    }
    acc.push(
      new VTTCue(
        Math.max(0, cue.startTime - offset),
        cue.endTime - offset,
        cue.text,
      ),
    );
    return acc;
  }, []);
  return { ...transcript, cues };
}

// custom stringifier as there's absolutely nothing in the library to do this :(
export function stringify(transcript: ParsedCaptionsResult) {
  return `WEBVTT
${Object.keys(transcript.metadata)
  .map((k) => `${k}: ${transcript.metadata[k]}\n`)
  .join("")}
${transcript.cues.map((cue) => `${cue.id ? `${cue.id}\n` : ""}${formatTime(cue.startTime)}.000 --> ${formatTime(cue.endTime)}.000\n${cue.text}\n\n`).join("")}
`;
}
