import type { ReactNode } from "react";

export type DesiPopScene =
  | "hero"
  | "street"
  | "factory"
  | "product"
  | "taste"
  | "manifesto"
  | "cta";

type DesiPopShellProps = {
  scene: DesiPopScene;
  children?: ReactNode;
  ribbonText?: string;
  className?: string;
  /** Decorative layers only — content sits above */
  chromeOnly?: boolean;
};

const DEFAULT_RIBBON = "J BY JEERU · XOTIK FRUJUS · DESI POP · ";

/**
 * Shared Maaza-style billboard chrome — cobalt grid, pink rails, ribbons, halftone.
 * Used by hero and every post-hero chapter for visual continuity.
 */
export function DesiPopShell({
  scene,
  children,
  ribbonText = DEFAULT_RIBBON,
  className = "",
  chromeOnly = false,
}: DesiPopShellProps) {
  const ribbonChunk = ribbonText.repeat(6);

  const chrome = (
  <>
      <div className="desi-pop-shell__bg" aria-hidden />
      <div className="desi-pop-shell__glow" aria-hidden />
      <div className="desi-pop-shell__halftone" aria-hidden />
      <div className="desi-pop-shell__grain" aria-hidden />
      <div className="desi-pop-shell__rail desi-pop-shell__rail--left" aria-hidden />
      <div className="desi-pop-shell__rail desi-pop-shell__rail--right" aria-hidden />
      <div className="desi-pop-shell__ribbon desi-pop-shell__ribbon--a" aria-hidden>
        <span>{ribbonChunk}</span>
      </div>
      <div className="desi-pop-shell__ribbon desi-pop-shell__ribbon--b" aria-hidden>
        <span>{ribbonChunk}</span>
      </div>
    </>
  );

  if (chromeOnly) {
    return (
      <div className={`desi-pop-shell desi-pop-shell--chrome ${className}`} data-scene={scene}>
        {chrome}
      </div>
    );
  }

  return (
    <div className={`desi-pop-shell ${className}`} data-scene={scene}>
      {chrome}
      <div className="desi-pop-shell__content relative z-10">{children}</div>
    </div>
  );
}
