import type { ReactNode } from "react";

/** Split a line into per-word spans for GSAP stagger (no SplitText plugin). */
export function splitWords(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

export type WordSplitProps = {
  text: string;
  wordClassName?: string;
  lineClassName?: string;
  /** false for Devanagari — avoids clipping matras above the em box */
  clip?: boolean;
};

export function WordSplit({
  text,
  wordClassName = "kinetic-word",
  lineClassName,
  clip = true,
}: WordSplitProps) {
  const words = splitWords(text);

  return (
    <span className={lineClassName}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className={clip ? "inline-block overflow-hidden align-top" : "inline-block align-baseline"}
        >
          <span className={`${wordClassName} inline-block will-change-transform`}>
            {word}
            {index < words.length - 1 ? "\u00a0" : ""}
          </span>
        </span>
      ))}
    </span>
  );
}

export function splitLinesToNodes(
  lines: readonly string[],
  renderLine: (line: string, index: number) => ReactNode,
): ReactNode[] {
  return lines.map((line, index) => renderLine(line, index));
}
