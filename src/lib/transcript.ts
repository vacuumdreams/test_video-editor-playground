type TranscriptLine = {
  start: number;
  end: number;
  text: string;
  person: string;
};

function timeToMs(time: string): number {
  const [minutes, seconds] = time.split(":").map(Number);
  return minutes * 60 + seconds * 1000;
}

export function parseTranscript(input: string): TranscriptLine[] {
  const lines = input.split("\n").filter((line) => line.trim().length > 0);
  const transcriptLines: TranscriptLine[] = [];

  lines.forEach((line, i) => {
    if (line.startsWith("[")) {
      const [start, end] = line
        .replace("[", "")
        .replace("]", "")
        .split("-")
        .map((t) => timeToMs(t));
      const [person, text] = lines[i + 1].split(":");
      transcriptLines.push({
        start,
        end,
        text,
        person,
      });
    }
  });

  return transcriptLines;
}
