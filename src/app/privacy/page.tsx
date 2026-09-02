import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Xotik Frujus",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/" className="font-label text-ink underline-offset-2 hover:underline">
        ← Home
      </Link>
      <h1 className="font-display mt-8 text-4xl font-bold">Privacy Policy</h1>
      <p className="font-body mt-4 text-ink/80">
        Draft skeleton for legal review. This page will cover contact forms, careers
        applications, analytics, cookies, store-locator interactions, and data rights
        under India&apos;s Digital Personal Data Protection framework.
      </p>
      <p className="font-body mt-4 text-sm text-ink/60">
        Grievance contact: {` `}
        <a href="mailto:info@xotik.co.in" className="underline">
          info@xotik.co.in
        </a>
      </p>
    </main>
  );
}
