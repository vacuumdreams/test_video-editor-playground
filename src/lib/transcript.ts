import {
  parseText,
  tokenizeVTTCue,
  ParsedCaptionsResult,
  VTTCue,
  VTTNode,
} from "media-captions";

import { formatTime } from "@/lib/utils";

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

export async function removeRangesFromTranscript(
  text: string,
  ranges: Array<[number, number]>,
) {
  const transcript = await parseTranscript(text);

  const cues = transcript.cues.reduce<VTTCue[]>((acc, cue) => {
    const { isMatch, offset } = ranges.reduce<{
      isMatch: boolean;
      offset: number;
    }>(
      (acc, r) => {
        if (cue.startTime >= r[0] && cue.endTime <= r[1]) {
          acc.isMatch = true;
        }

        if (r[1] < cue.endTime) {
          acc.offset = acc.offset + (r[1] - r[0]);
        }

        return acc;
      },
      {
        isMatch: false,
        offset: 0,
      },
    );

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
  return stringify({ ...transcript, cues });
}

export async function removeLinesFromTranscript(
  text: string,
  data: TranscriptLine[],
) {
  const transcript = await parseTranscript(text);

  const cues = transcript.cues.reduce<VTTCue[]>((acc, cue) => {
    const { isMatch, offset } = data.reduce<{
      isMatch: boolean;
      offset: number;
    }>(
      (acc, d) => {
        if (cue.startTime === d.startTime && cue.endTime === d.endTime) {
          acc.isMatch = true;
        }

        if (d.endTime < cue.startTime) {
          acc.offset = acc.offset + (d.endTime - d.startTime);
        }

        return acc;
      },
      {
        isMatch: false,
        offset: 0,
      },
    );

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
  return stringify({ ...transcript, cues });
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
