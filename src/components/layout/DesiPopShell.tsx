import type { ReactNode } from "react";

export type DesiPopScene =
  | "hero"
  | "street"
  | "factory"
  | "product"
  | "taste"
  | "manifesto"
  | "cta";

export type DesiPopChrome = "full" | "light" | "overlay" | "none";

type DesiPopShellProps = {
  scene: DesiPopScene;
  children?: ReactNode;
  ribbonText?: string;
  className?: string;
  chrome?: DesiPopChrome;
  /** Decorative layers only — content sits above */
  chromeOnly?: boolean;
};

const DEFAULT_RIBBON = "J BY JEERU · XOTIK FRUJUS · DESI POP · ";

/**
 * Shared billboard chrome — intensity varies per chapter (not every section is cobalt).
 */
export function DesiPopShell({
  scene,
  children,
  ribbonText = DEFAULT_RIBBON,
  className = "",
  chrome = "full",
  chromeOnly = false,
}: DesiPopShellProps) {
  const ribbonChunk = ribbonText.repeat(6);
  const showRibbons = chrome === "full";
  const showGrid = chrome === "full";
  const showChrome = chrome !== "none";

  const chromeLayers = showChrome ? (
    <>
      {showGrid && <div className="desi-pop-shell__bg" aria-hidden />}
      <div className="desi-pop-shell__glow" aria-hidden />
      <div className="desi-pop-shell__halftone" aria-hidden />
      <div className="desi-pop-shell__grain" aria-hidden />
      <div className="desi-pop-shell__rail desi-pop-shell__rail--left" aria-hidden />
      <div className="desi-pop-shell__rail desi-pop-shell__rail--right" aria-hidden />
      {showRibbons && (
        <>
          <div className="desi-pop-shell__ribbon desi-pop-shell__ribbon--a" aria-hidden>
            <span>{ribbonChunk}</span>
          </div>
          <div className="desi-pop-shell__ribbon desi-pop-shell__ribbon--b" aria-hidden>
            <span>{ribbonChunk}</span>
          </div>
        </>
      )}
    </>
  ) : null;

  if (chromeOnly) {
    return (
      <div
        className={`desi-pop-shell desi-pop-shell--chrome desi-pop-shell--${chrome} ${className}`}
        data-scene={scene}
      >
        {chromeLayers}
      </div>
    );
  }

  return (
    <div className={`desi-pop-shell desi-pop-shell--${chrome} ${className}`} data-scene={scene}>
      {chromeLayers}
      <div className="desi-pop-shell__content relative z-10">{children}</div>
    </div>
  );
}
