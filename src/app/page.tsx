import Link from "next/link";

/** Phase 0 placeholder homepage — replaced by HomeShell in Phase 1.1 */
export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[1280px] flex-col justify-center px-[var(--section-pad-x)] py-16 md:px-[var(--section-pad-x-desktop)]">
      <p className="font-label text-j-coral">Phase 0</p>
      <h1 className="font-display mt-4 text-5xl font-bold">Xotik / J</h1>
      <p className="font-body mt-4 max-w-md text-ink/75">
        Foundation scaffold. Design tokens, tier detection, and legal skeleton are in
        place.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link href="/tokens" className="btn-primary">
          Design tokens
        </Link>
        <Link href="/privacy" className="font-body text-ink underline-offset-2 hover:underline">
          Privacy
        </Link>
        <Link href="/terms" className="font-body text-ink underline-offset-2 hover:underline">
          Terms
        </Link>
      </div>
    </main>
  );
}
