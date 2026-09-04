import Image from "next/image";
import Link from "next/link";

/**
 * Temporary shape map for the J by Jeeru presentation.
 * Drink placeholders are live; final photo / video / 3D come later.
 * Full xotik.co.in rebrand is out of scope here.
 */
const CHAPTERS = [
  {
    id: "00-hero",
    title: "00 · Hero",
    status: "IN SCOPE · J presentation",
    need: "J leads. Cobalt billboard. Not the company catalog home.",
    assets: [{ src: "/assets/products/xotik-jeeru-can.jpg", label: "Flagship can placeholder" }],
  },
  {
    id: "01-street",
    title: "01 · Street",
    status: "IN SCOPE",
    need: "Cricket / ride energy. Keep current stills + video until new plates.",
    assets: [
      { src: "/assets/hero/street-sea-link.jpg", label: "Street poster" },
      { src: "/assets/hero/street-monsoon-market.jpg", label: "Monsoon still" },
    ],
  },
  {
    id: "02-factory",
    title: "02 · Factory",
    status: "MOTION NOW · 3D LATER",
    need: "Empty bay. Procedural line OK. Blender Jeeru can is later.",
    assets: [{ src: "", label: "LATER · Blender slim can" }],
  },
  {
    id: "03-product",
    title: "03 · Meet J",
    status: "DRINK PLACEHOLDERS ON",
    need: "Use every Xotik drink still we have. Final pack shots later.",
    assets: [
      { src: "/assets/products/xotik-jeeru-can.jpg", label: "Jeeru Masala" },
      { src: "/assets/products/xotik_cola_real.jpg", label: "Xotik Cola" },
      { src: "/assets/products/xotik-jeeru-clear-lemon.jpg", label: "Clear Lemon" },
      { src: "/assets/products/Xotic-Jeeru-pet-real-label.png", label: "Jeeru PET" },
    ],
  },
  {
    id: "04-taste",
    title: "04 · Taste",
    status: "CARDS OK",
    need: "Ingredient story. Pour photography later — not blocking.",
    assets: [{ src: "", label: "LATER · taste photography" }],
  },
  {
    id: "05-attitude",
    title: "05 · Attitude",
    status: "COPY PATH",
    need: "Manifesto path. Character cast optional later — not required for presentation.",
    assets: [{ src: "", label: "OPTIONAL LATER · characters" }],
  },
  {
    id: "06-find",
    title: "06 · Find J",
    status: "CONTACT · HONEST",
    need: "Presentation soft close: email / call. Full store map = company rebuild.",
    assets: [{ src: "/assets/reference/brand/xotik-logo.png", label: "Parent credit" }],
  },
] as const;

export default function ShapePage() {
  return (
    <main className="min-h-screen bg-[#0b0b0c] px-5 py-10 text-[#f4efe4] md:px-10">
      <div className="mx-auto max-w-[1100px]">
        <p className="font-mono text-[10px] tracking-[0.24em] text-[#e99d25]">
          J BY JEERU PRESENTATION · /shape · not the company rebrand
        </p>
        <h1 className="mt-3 font-sans text-3xl font-semibold tracking-tight md:text-5xl">
          Website shape map
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
          This site is a standalone J by Jeeru presentation. xotik.co.in full rebuild comes later and
          will include J. Images / video / 3D polish are planned later — drink placeholders are fine
          now.
        </p>
        <p className="mt-4 font-mono text-[11px] text-white/45">
          <Link href="/" className="underline underline-offset-2">
            ← presentation home
          </Link>
          {" · "}
          plan: <code>docs/PLAN-J-BY-JEERU.md</code>
        </p>

        <div className="mt-10 space-y-8">
          {CHAPTERS.map((chapter) => (
            <section
              key={chapter.id}
              className="border border-white/15 bg-[#141210] p-4 md:p-6"
              id={chapter.id}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="text-xl font-semibold tracking-tight md:text-2xl">{chapter.title}</h2>
                <span className="font-mono text-[10px] tracking-[0.16em] text-[#e99d25]">
                  {chapter.status}
                </span>
              </div>
              <p className="mt-2 max-w-3xl text-sm text-white/65">{chapter.need}</p>

              <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                {chapter.assets.map((asset) =>
                  asset.src ? (
                    <figure key={asset.label} className="overflow-hidden border border-white/10 bg-black/40">
                      <div className="relative aspect-square">
                        <Image
                          src={asset.src}
                          alt={asset.label}
                          fill
                          className="object-cover"
                          sizes="180px"
                        />
                      </div>
                      <figcaption className="px-2 py-2 font-mono text-[9px] leading-snug tracking-wide text-white/55">
                        {asset.label}
                      </figcaption>
                    </figure>
                  ) : (
                    <div
                      key={asset.label}
                      className="flex aspect-square items-center justify-center border border-dashed border-white/25 bg-[#1a0f08] p-3 text-center font-mono text-[10px] tracking-wide text-white/45"
                    >
                      {asset.label}
                    </div>
                  ),
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
