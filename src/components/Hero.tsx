import Image from 'next/image';
import Link from 'next/link';

const heroLinkClass = 'font-semibold no-underline border-b border-[#7cc0d6]/30 hover:border-[#7cc0d6] transition-colors gradient-text italic';

function HeroLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} target="_blank" rel="noopener noreferrer" className={heroLinkClass}>{children}</Link>;
}

const Hero = () => {
  return (
    <section
      id="home"
      className="relative overflow-hidden px-6 py-[72px]"
      style={{
        background: 'linear-gradient(135deg, #0c1820 0%, #1a3444 40%, #102838 100%)',
      }}
    >
      {/* Decorative gradient blobs */}
      <div
        className="absolute -top-1/2 -right-[20%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(90,154,176,0.15) 0%, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-[30%] left-[10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(124,192,214,0.12) 0%, transparent 70%)' }}
      />

      {/* Inner grid */}
      <div className="relative z-10 max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_280px] gap-12 items-center">

        {/* Left column — hero text */}
        <div>
          <h1
            className="font-serif font-bold text-white leading-[1.15] mb-2"
            style={{ fontSize: 'clamp(34px, 5vw, 48px)' }}
          >
            Sheng-Lun (Kevin) Wei
          </h1>

          <p className="text-[16px] text-[#7cc0d6] font-medium mb-5">
            CS PhD Candidate @ National Taiwan University
          </p>

          <p className="text-[16px] leading-[1.8] text-white/75 mb-7 max-w-[60ch]">
            I am a CS PhD candidate at <span className="gradient-text italic">National Taiwan University</span>, working on LLM biases & fairness, multimodal AI, and LLM evaluation.
            With 6+ years of industry experience at{' '}
            <HeroLink href="https://www.shopback.sg/">ShopBack</HeroLink>,{' '}
            <HeroLink href="https://www.junyiacademy.org/">Junyi Academy</HeroLink>, and{' '}
            <HeroLink href="https://blendvision.com/">KKStream</HeroLink>,
            I bridge the gap between research and real-world applications.
            I also serve as an adjunct instructor at NTU&apos;s <span className="gradient-text italic">Center of General Education</span> and <span className="gradient-text italic">Department of Economics</span>,
            and founded <HeroLink href="https://www.ccclub.io/">ccClub</HeroLink> (社團法人攜曦程式推廣學會),
            a non-profit organization dedicated to programming education, serving 4,000+ learners since 2016.
          </p>

          {/* CTA group */}
          <div className="flex gap-3 justify-center md:justify-start flex-wrap">
            <Link
              href="#contact"
              className="bg-white text-[#1a3040] px-7 py-3 rounded-[var(--radius)] font-bold text-[16px] hover:-translate-y-[2px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.2)] transition-all"
            >
              Contact Me
            </Link>
            <Link
              href="/experience"
              className="inline-flex items-center gap-2 bg-white/10 text-[#b0cfd8] px-7 py-3 rounded-[var(--radius)] font-semibold text-[16px] border border-white/20 hover:bg-white/20 hover:-translate-y-[2px] transition-all"
            >
              About Me
            </Link>
          </div>
        </div>

        {/* Right column — glass card */}
        <div className="max-w-[260px] mx-auto md:max-w-none">
          <div className="bg-white/[0.08] backdrop-blur-[12px] border border-white/[0.12] rounded-[var(--radius)] overflow-hidden">
            <Image
              src="/avatar.ico"
              alt="Kevin Wei"
              width={256}
              height={256}
              className="w-full aspect-square object-contain bg-white/5 p-8"
              unoptimized
              priority
            />
            <div className="p-3.5">
              <p className="text-[13px] font-bold uppercase tracking-[1px] text-[#7cc0d6]/80 mb-1.5">
                Research Interests
              </p>
              <div className="flex flex-wrap gap-1">
                {['LLM Biases & Fairness', 'LLM-as-a-Judge', 'Multimodal LLMs', 'Trustworthy NLP'].map((tag) => (
                  <span
                    key={tag}
                    className="text-[13px] px-2 py-[3px] rounded-[var(--radius)] bg-white/10 text-[#b0cfd8] font-medium border border-white/[0.08]"
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
