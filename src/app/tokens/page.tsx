import Link from "next/link";
import {
  cinePalette,
  jSpectrum,
  retroPalette,
  sceneTokens,
} from "@/lib/scene-tokens";

function Swatch({
  name,
  hex,
  dark = false,
}: {
  name: string;
  hex: string;
  dark?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl border-2 border-ink/10">
      <div className="h-16 sm:h-20" style={{ backgroundColor: hex }} />
      <div className={`p-2.5 ${dark ? "bg-cine-jaguar text-paper" : "bg-white text-ink"}`}>
        <p className="font-receipt text-[9px]">{name}</p>
        <p className="font-body text-xs opacity-80">{hex}</p>
      </div>
    </div>
  );
}

export default function TokensPage() {
  return (
    <main className="min-h-dvh bg-paper text-ink">
      <div className="border-b-2 border-ink bg-cine-jaguar px-[var(--section-pad-x)] py-6 text-paper md:px-[var(--section-pad-x-desktop)]">
        <Link href="/" className="font-receipt text-cine-gold underline-offset-2 hover:underline">
          ← Home
        </Link>
        <p className="font-receipt mt-4 text-cine-olive">Phase 1.5a · Design system v2</p>
        <h1 className="font-condensed mt-2 text-[clamp(3rem,12vw,6rem)] leading-[0.85]">
          XOTIK
          <span className="block text-cine-gold">FLAVOUR TOKENS</span>
        </h1>
      </div>

      <section className="px-[var(--section-pad-x)] py-12 md:px-[var(--section-pad-x-desktop)]">
        <h2 className="font-receipt text-retro-royal">Scene palettes</h2>
        <p className="font-body mt-2 max-w-xl text-sm text-ink/70">
          Each scroll chapter gets its own full-bleed mood — desi pop + retro 70s + cinematic
          contrast.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(sceneTokens).map(([key, scene]) => (
            <article
              key={scene.id}
              className="scene-shell texture-grain overflow-hidden rounded-2xl border-2 border-ink/15"
              data-scene={key}
            >
              <div className="p-5">
                <p className="font-receipt opacity-70">
                  {scene.chapter} — {scene.label}
                </p>
                <p className="font-condensed mt-2 text-4xl leading-none">
                  {scene.label.toUpperCase()}
                </p>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div>
                    <div className="h-10 rounded-md border border-current/20" style={{ background: scene.bg }} />
                    <p className="font-receipt mt-1 text-[8px] opacity-60">bg</p>
                  </div>
                  <div>
                    <div className="h-10 rounded-md border border-current/20" style={{ background: scene.surface }} />
                    <p className="font-receipt mt-1 text-[8px] opacity-60">surface</p>
                  </div>
                  <div>
                    <div className="h-10 rounded-md border border-current/20" style={{ background: scene.accent }} />
                    <p className="font-receipt mt-1 text-[8px] opacity-60">accent</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-white px-[var(--section-pad-x)] py-12 md:px-[var(--section-pad-x-desktop)]">
        <h2 className="font-receipt">J spectrum + retro 70s + cinematic</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {jSpectrum.map((c) => (
            <Swatch key={c.name} name={`j-${c.name}`} hex={c.hex} />
          ))}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {retroPalette.map((c) => (
            <Swatch key={c.name} name={c.name} hex={c.hex} />
          ))}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {cinePalette.map((c) => (
            <Swatch key={c.name} name={c.name} hex={c.hex} dark={c.name === "jaguar"} />
          ))}
        </div>
      </section>

      <section className="scene-shell border-t border-line px-[var(--section-pad-x)] py-12 md:px-[var(--section-pad-x-desktop)]" data-scene="product">
        <h2 className="font-receipt opacity-80">Type stack</h2>
        <p className="font-devanagari-display mt-4 text-[clamp(2.5rem,10vw,5rem)] text-scene-surface">
          जेब में J
        </p>
        <p className="font-condensed mt-2 text-[clamp(3rem,14vw,7rem)] leading-[0.82] text-scene-surface">
          POCKET-SIZED
          <span className="block text-white">PRIDE.</span>
        </p>
        <p className="font-body mt-6 max-w-md text-sm text-white/85">
          Condensed EN for billboards · Devanagari for desi pop layers · Receipt mono for
          ingredients and barcodes.
        </p>
        <div className="stamp-edge mt-8 inline-block bg-scene-surface px-4 py-3 text-scene-ink">
          <p className="font-receipt">Receipt meta</p>
          <p className="font-receipt mt-1 text-[9px] opacity-70">
            FSSAI · HALAL · BATCH NO. 001
          </p>
        </div>
      </section>

      <section className="border-t border-line px-[var(--section-pad-x)] py-12 md:px-[var(--section-pad-x-desktop)]">
        <h2 className="font-receipt">Buttons</h2>
        <div className="mt-6 flex flex-wrap gap-4">
          <button type="button" className="btn-primary">
            Classic CTA
          </button>
          <button type="button" className="btn-pop">
            Desi Pop CTA
          </button>
        </div>
      </section>
    </main>
  );
}
