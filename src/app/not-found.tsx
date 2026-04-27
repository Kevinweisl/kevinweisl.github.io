import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section
      className="flex flex-col items-center justify-center text-center px-6 py-[96px]"
      style={{ background: 'var(--bg-primary)', minHeight: 'calc(100vh - 200px)' }}
    >
      <div
        className="font-serif leading-none select-none"
        style={{ fontSize: '80px', color: 'var(--accent)', opacity: 0.25, marginBottom: '-8px' }}
        aria-hidden="true"
      >
        “
      </div>

      <h1
        className="font-serif italic text-[var(--text-primary)]"
        style={{ fontSize: '32px', lineHeight: 1.4, maxWidth: '520px', marginBottom: '20px' }}
      >
        This page appears to be a hallucination.
      </h1>

      <p
        className="text-[13px] text-[var(--text-muted)]"
        style={{ marginBottom: '36px', letterSpacing: '0.04em' }}
      >
        —{' '}
        <code
          className="font-mono"
          style={{
            background: 'var(--accent-light)',
            color: 'var(--accent)',
            padding: '2px 6px',
            borderRadius: '3px',
            fontSize: '12px',
          }}
        >
          404 NOT_FOUND
        </code>{' '}
        · likely a broken link from an old URL
      </p>

      <div className="flex gap-3 flex-wrap justify-center">
        <Link
          href="/"
          className="text-[14px] font-medium text-white no-underline transition-transform duration-200 hover:-translate-y-px"
          style={{
            background: 'var(--accent)',
            padding: '11px 24px',
            borderRadius: 'var(--radius)',
            boxShadow: '0 4px 12px color-mix(in srgb, var(--accent) 30%, transparent)',
          }}
        >
          Back to homepage
        </Link>
        <Link
          href="/notes"
          className="text-[14px] font-medium text-[var(--text-body)] no-underline transition-colors duration-200 hover:text-[var(--accent)]"
          style={{
            border: '1px solid var(--border)',
            padding: '11px 24px',
            borderRadius: 'var(--radius)',
          }}
        >
          Browse notes
        </Link>
      </div>
    </section>
  );
}
