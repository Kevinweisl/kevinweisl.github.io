import Image from 'next/image';
import Link from 'next/link';

const Hero = () => {
  return (
    <section
      id="home"
      className="relative overflow-hidden px-6 py-[72px]"
      style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #1e3a5f 100%)',
      }}
    >
      {/* Decorative gradient blobs */}
      <div
        className="absolute -top-1/2 -right-[20%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-[30%] left-[10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)' }}
      />

      {/* Inner grid */}
      <div className="relative z-10 max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_280px] gap-12 items-center">

        {/* Left column — hero text */}
        <div>
          <h1 className="font-serif text-[34px] md:text-[44px] font-bold text-white leading-[1.15] mb-2">
            Sheng-Lun (Kevin) Wei
          </h1>

          <p className="text-[16px] text-[#a5b4fc] font-medium mb-5">
            CS PhD Candidate @ National Taiwan University
          </p>

          <p className="text-[15px] leading-[1.8] text-white/75 mb-7">
            Focusing on NLP and Large Language Models. 6+ years as ML Engineer at{' '}
            <Link
              href="https://www.shopback.sg/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#c7d2fe] font-semibold no-underline border-b border-[#c7d2fe]/30 hover:border-[#c7d2fe] transition-colors"
            >
              ShopBack
            </Link>
            ,{' '}
            <Link
              href="https://www.junyiacademy.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#c7d2fe] font-semibold no-underline border-b border-[#c7d2fe]/30 hover:border-[#c7d2fe] transition-colors"
            >
              Junyi Academy
            </Link>
            , and{' '}
            <Link
              href="https://blendvision.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#c7d2fe] font-semibold no-underline border-b border-[#c7d2fe]/30 hover:border-[#c7d2fe] transition-colors"
            >
              KKStream
            </Link>
            . Founder of{' '}
            <Link
              href="https://www.ccclub.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#c7d2fe] font-semibold no-underline border-b border-[#c7d2fe]/30 hover:border-[#c7d2fe] transition-colors"
            >
              ccClub
            </Link>
            , teaching 3,000+ people to code.
          </p>

          {/* CTA group */}
          <div className="flex gap-3 justify-center md:justify-start flex-wrap">
            <Link
              href="#contact"
              className="bg-white text-[#312e81] px-7 py-3 rounded-[var(--radius)] font-bold text-[15px] hover:-translate-y-[2px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.2)] transition-all"
            >
              Contact Me
            </Link>
            <Link
              href="/experience"
              className="inline-flex items-center gap-2 bg-white/10 text-[#e0e7ff] px-7 py-3 rounded-[var(--radius)] font-semibold text-[15px] border border-white/20 hover:bg-white/20 hover:-translate-y-[2px] transition-all"
            >
              About Me
            </Link>
          </div>
        </div>

        {/* Right column — glass card */}
        <div className="max-w-[260px] mx-auto md:max-w-none">
          <div className="bg-white/[0.08] backdrop-blur-[12px] border border-white/[0.12] rounded-[var(--radius)] overflow-hidden">
            <Image
              src="/favicon.ico"
              alt="Kevin Wei"
              width={256}
              height={256}
              className="w-full aspect-square object-contain bg-white/5 p-8"
              unoptimized
              priority
            />
            <div className="p-3.5">
              <p className="text-[10px] font-bold uppercase tracking-[1px] text-[#a5b4fc]/70 mb-1.5">
                Research Interests
              </p>
              <div className="flex flex-wrap gap-1">
                {['LLM Robustness & Fairness', 'Multimodal AI', 'LLM-as-a-Judge', 'Information Retrieval'].map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2 py-[3px] rounded-[var(--radius)] bg-white/10 text-[#c7d2fe] font-medium border border-white/[0.08]"
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
