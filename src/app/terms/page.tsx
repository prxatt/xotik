import Link from "next/link";

export const metadata = {
  title: "Terms of Use | Xotik Frujus",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/" className="font-label text-ink underline-offset-2 hover:underline">
        ← Home
      </Link>
      <h1 className="font-display mt-8 text-4xl font-bold">Terms of Use</h1>
      <p className="font-body mt-4 text-ink/80">
        Draft skeleton for legal review. This page will cover site ownership, intellectual
        property, acceptable use, external links, and limitation of liability for
        xotik.co.in digital properties.
      </p>
    </main>
  );
}
