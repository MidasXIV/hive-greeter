export const progressBar = (progress: number, length = 10): string =>
  `\`${Array.from({ length }, (_, i) =>
    progress > i / length ? "█" : " "
  ).join("")}\``;
