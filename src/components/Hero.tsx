import Image from 'next/image';
import Link from 'next/link';
import { fullName, siteName, jobTitle, affiliation, affiliationShort, phdYear, researchSummary, researchInterests } from '@/data/profile';

function HeroLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-semibold no-underline hero-link transition-colors italic"
    >
      {children}
    </Link>
  );
}

const Hero = () => {
  return (
    <section
      id="home"
      className="relative overflow-hidden px-6 py-[72px]"
      style={{ background: 'var(--hero-bg)' }}
    >
      {/* Decorative gradient blobs */}
      <div
        className="absolute -top-1/2 -right-[20%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, var(--hero-blob-1) 0%, transparent 70%)` }}
      />
      <div
        className="absolute -bottom-[30%] left-[10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, var(--hero-blob-2) 0%, transparent 70%)` }}
      />

      {/* Inner grid */}
      <div className="relative z-10 max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_280px] gap-12 items-center">

        {/* Left column — hero text */}
        <div>
          <h1
            className="font-serif leading-[1.15] mb-2"
            style={{ fontSize: 'clamp(34px, 5vw, 48px)', color: 'var(--hero-heading)' }}
          >
            {fullName}
          </h1>

          <p className="text-[16px] font-medium mb-5" style={{ color: 'var(--hero-subtitle)' }}>
            {jobTitle} @ {affiliation}
          </p>

          <p className="text-[16px] leading-[1.8] mb-7 max-w-[60ch]" style={{ color: 'var(--hero-body)' }}>
            I received my PhD in Computer Science from <span className="italic">{affiliation}</span> in {phdYear}, with research on {researchSummary}.
            With 6+ years of industry experience at{' '}
            <HeroLink href="https://www.shopback.sg/">ShopBack</HeroLink>,{' '}
            <HeroLink href="https://www.junyiacademy.org/">Junyi Academy</HeroLink>, and{' '}
            <HeroLink href="https://blendvision.com/">KKStream</HeroLink>,
            I bridge the gap between research and real-world applications.
            I currently serve as an {jobTitle.toLowerCase()} at {affiliationShort}&apos;s <span className="italic">Center of General Education</span> and <span className="italic">Department of Economics</span>,
            and founded <HeroLink href="https://www.ccclub.io/">ccClub</HeroLink> (社團法人攜曦程式推廣學會),
            a non-profit organization dedicated to programming education, serving 4,000+ learners since 2016.
          </p>

          {/* CTA group */}
          <div className="flex gap-3 justify-center md:justify-start flex-wrap">
            <Link
              href="#contact"
              className="px-7 py-3 rounded-[var(--radius)] font-bold text-[16px] hover:-translate-y-[2px] transition-transform duration-200"
              style={{ background: 'var(--hero-cta-bg)', color: 'var(--hero-cta-text)', boxShadow: `0 2px 8px var(--hero-cta-shadow)` }}
            >
              Contact Me
            </Link>
            <Link
              href="/experience"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-[var(--radius)] font-semibold text-[16px] border hover:-translate-y-[2px] transition-transform duration-200"
              style={{ background: 'var(--hero-cta2-bg)', color: 'var(--hero-cta2-text)', borderColor: 'var(--hero-cta2-border)' }}
            >
              About Me
            </Link>
          </div>
        </div>

        {/* Right column — card */}
        <div className="max-w-[260px] mx-auto md:max-w-none">
          <div
            className="rounded-[var(--radius)] overflow-hidden"
            style={{ background: 'var(--hero-card-bg)', border: '1px solid var(--hero-card-border)' }}
          >
            <Image
              src="/avatar.ico"
              alt={siteName}
              width={256}
              height={256}
              className="w-full aspect-square object-contain p-8"
              style={{ background: 'var(--hero-card-img-bg)' }}
              unoptimized
              priority
            />
            <div className="p-3.5">
              <p
                className="label mb-1.5"
                style={{ color: 'var(--hero-label)' }}
              >
                Research Interests
              </p>
              <div className="flex flex-wrap gap-1">
                {researchInterests.map((tag) => (
                  <span
                    key={tag}
                    className="text-[13px] px-2 py-[3px] rounded-[var(--radius)] font-medium"
                    style={{ background: 'var(--hero-tag-bg)', color: 'var(--hero-tag-text)', border: '1px solid var(--hero-tag-border)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
