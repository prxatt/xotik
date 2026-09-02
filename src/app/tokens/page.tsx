import Link from "next/link";

export default function TokensPage() {
  const colors = [
    ["paper", "#FFF9E9"],
    ["ink", "#173F2C"],
    ["line", "#D7D0BF"],
    ["j-coral", "#E84A3A"],
    ["j-orange", "#F28C28"],
    ["j-yellow", "#F3C743"],
    ["j-green", "#2E9B66"],
    ["j-blue", "#2D5BE3"],
    ["j-violet", "#AE3FB6"],
  ] as const;

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="font-label text-ink underline-offset-2 hover:underline">
        ← Home
      </Link>
      <h1 className="font-display mt-8 text-4xl font-bold">Design tokens</h1>
      <p className="font-body mt-2 text-ink/70">Phase 0.2 verification page.</p>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {colors.map(([name, hex]) => (
          <div key={name} className="overflow-hidden rounded-2xl border border-line">
            <div className="h-20" style={{ backgroundColor: hex }} />
            <div className="bg-white p-3">
              <p className="font-label text-[10px]">{name}</p>
              <p className="font-body text-sm">{hex}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 space-y-4">
        <p className="font-display text-5xl font-bold">Display Fraunces</p>
        <p className="font-body text-lg">Body Manrope 400/500/600</p>
        <p className="font-label">Label IBM Plex Mono</p>
        <p className="font-hindi text-2xl">हिंदी Noto Sans Devanagari</p>
        <button type="button" className="btn-primary">
          Primary CTA
        </button>
      </div>
    </main>
  );
}
