import React, { useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

export const SustainabilityPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-paper text-ink font-sans antialiased selection:bg-oxblood selection:text-white">
      <Navigation />

      <main className="pt-6">
        {/* HERO SECTION - DARK THEME */}
        <section className="py-20 bg-ink text-paper border-b border-zinc-800">
          <div className="max-w-[1200px] mx-auto px-7">
            <span className="font-mono text-xs tracking-[0.22em] uppercase text-brass font-semibold block mb-3">
              Vertical 04 · Sustainability Solutions & Climate Services
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium max-w-3xl mb-6">
              Sustainability Solutions and Climate Services
            </h1>
            <p className="font-serif text-xl text-zinc-300 max-w-3xl leading-relaxed">
              Driving value through decarbonisation, ESG and green innovation. A move from compliance to execution, delivering measurable environmental and financial value.
            </p>
          </div>
        </section>

        {/* CONTENT BLOCK */}
        <section className="py-16">
          <div className="max-w-[1200px] mx-auto px-7">
            <div className="anchor-head mb-8">
              <span className="font-mono text-xs tracking-[0.22em] uppercase text-oxblood font-semibold block mb-2">
                Sustainability · Why now
              </span>
              <h2 className="font-serif text-3xl font-medium text-ink mb-4">From commitments to action</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
              <div>
                <p className="text-sm sm:text-base text-ink-soft leading-relaxed mb-4">
                  Sustainability is now a core business driver, not just a compliance task. Climate risk is becoming financial risk, disclosure frameworks are widening, and investors are asking for measurable, auditable performance.
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  PANA Institute translates corporate sustainability commitments into operational reality, providing decarbonisation roadmap design, ESG verification, and greenhouse gas inventory audits.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-line border border-line">
                <div className="bg-paper p-6">
                  <h3 className="font-serif text-lg font-medium mb-2">Decarbonisation</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">Emissions baselining, reduction pathways, and carbon accounting.</p>
                </div>
                <div className="bg-paper p-6">
                  <h3 className="font-serif text-lg font-medium mb-2">ESG Integration</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">Framework reporting (GRI, ISSB, TCFD) and governance structures.</p>
                </div>
                <div className="bg-paper p-6">
                  <h3 className="font-serif text-lg font-medium mb-2">SustainaCore</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">Proprietary platform for tracking workforce ESG competency.</p>
                </div>
                <div className="bg-paper p-6">
                  <h3 className="font-serif text-lg font-medium mb-2">Climate Risk</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">Physical and transition risk assessments for asset owners.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
