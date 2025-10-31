export function splitText(text: string, maxChunkSize: number): string[] {
  const parts: string[] = [];
  let temp = "";
  let i = 0;
  let j = 0;

  while (i < text.length) {
    for (j = i; j < text.length; j++) {
      if (text[j] === "." || text[j] === "!" || text[j] === "?") {
        break;
      }
    }

    const sentenceLength = j - i + 1;

    if (temp.length + sentenceLength > maxChunkSize) {
      parts.push(temp);
      temp = "";

      if (sentenceLength > maxChunkSize) {
        let space = i + maxChunkSize - 1;

        for (; space > i; space--) {
          if (text[space] === " " ||
              text[space] === "\t") {
            break;
          }
        }

        if (space > i) {
          j = space;
        } else {
          j = i + maxChunkSize - 1;
        }
      }
    }

    temp += text.substring(i, j + 1);
    i = j + 1;
  }

  if (temp.length !== 0) parts.push(temp);

  return parts;
}