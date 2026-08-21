import React, { useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

export const ResearchPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-paper text-ink font-sans antialiased selection:bg-oxblood selection:text-white">
      <Navigation />

      <main className="flex-1 w-full">
        {/* HERO SECTION - DARK LUXURY EDITORIAL */}
        <section className="pt-36 pb-24 bg-ink text-paper border-b border-zinc-800 relative overflow-hidden">
          <div className="max-w-[1320px] mx-auto px-7 relative z-10">
            <span className="font-mono text-xs tracking-[0.22em] uppercase text-brass font-semibold block mb-3">
              VERTICAL 02 · RESEARCH & DEVELOPMENT
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-paper max-w-4xl mb-6">
              Research and Development
            </h1>
            <p className="font-serif text-lg sm:text-xl text-zinc-300 max-w-3xl leading-relaxed">
              Five centres of excellence sit inside Research and Development. Each supplies subject authority to every division and drives revenue in a partnership led mode, keeping the Institute's training current.
            </p>
          </div>
        </section>

        {/* CONTENT BLOCK */}
        <section className="py-24 bg-paper">
          <div className="max-w-[1320px] mx-auto px-7">
            {/* SUBNAV */}
            <div className="flex flex-wrap gap-2 pb-6 mb-12 border-b border-line">
              <a href="#coe-oilgas" className="font-mono text-xs uppercase tracking-wider px-3.5 py-2 border border-line rounded-sm text-muted-foreground hover:border-oxblood hover:text-oxblood transition-colors">Oil & Gas Tech</a>
              <a href="#coe-sustainability" className="font-mono text-xs uppercase tracking-wider px-3.5 py-2 border border-line rounded-sm text-muted-foreground hover:border-oxblood hover:text-oxblood transition-colors">Sustainability & Environment</a>
              <a href="#coe-energy" className="font-mono text-xs uppercase tracking-wider px-3.5 py-2 border border-line rounded-sm text-muted-foreground hover:border-oxblood hover:text-oxblood transition-colors">Energy & Power</a>
              <a href="#coe-digital" className="font-mono text-xs uppercase tracking-wider px-3.5 py-2 border border-line rounded-sm text-muted-foreground hover:border-oxblood hover:text-oxblood transition-colors">Digital Innovation & AI</a>
              <a href="#coe-agric" className="font-mono text-xs uppercase tracking-wider px-3.5 py-2 border border-line rounded-sm text-muted-foreground hover:border-oxblood hover:text-oxblood transition-colors">Smart Agriculture</a>
            </div>

            <p className="text-sm text-muted-foreground max-w-3xl mb-12 leading-relaxed">
              Every centre carries the same charter: a director, a standing advisory panel of operators and regulators, a research agenda approved on a three year cycle, a laboratory or testbed, a family of competence frameworks, a flagship annual publication, and a named funding line.
            </p>

            {/* CENTRES */}
            <div className="space-y-12 mb-20">
              <div className="anchor-head p-6 bg-paper border border-line" id="coe-oilgas">
                <span className="font-mono text-xs tracking-[0.22em] uppercase text-oxblood font-semibold block mb-2">Centre 01</span>
                <h2 className="font-serif text-2xl font-medium text-ink mb-3">Centre for Oil and Gas Technology</h2>
                <p className="text-sm text-ink-soft leading-relaxed">
                  Upstream and midstream operations, process safety, flow measurement and control, rotating equipment, welding and inspection, subsea, and petroleum economics. This centre anchors the NCDMB and OGTAN accredited work.
                </p>
              </div>

              <div className="anchor-head p-6 bg-paper border border-line" id="coe-sustainability">
                <span className="font-mono text-xs tracking-[0.22em] uppercase text-oxblood font-semibold block mb-2">Centre 02</span>
                <h2 className="font-serif text-2xl font-medium text-ink mb-3">Centre for Sustainability and Environment</h2>
                <p className="text-sm text-ink-soft leading-relaxed">
                  Emissions accounting and verification, life cycle assessment, environmental and social governance reporting, the circular economy, compliance, and host community social performance.
                </p>
              </div>

              <div className="anchor-head p-6 bg-paper border border-line" id="coe-energy">
                <span className="font-mono text-xs tracking-[0.22em] uppercase text-oxblood font-semibold block mb-2">Centre 03</span>
                <h2 className="font-serif text-2xl font-medium text-ink mb-3">Centre for Energy and Power</h2>
                <p className="text-sm text-ink-soft leading-relaxed">
                  Generation, transmission and distribution operations, grid modernisation, renewable integration, storage, mini grids and rural electrification, and energy efficiency.
                </p>
              </div>

              <div className="anchor-head p-6 bg-paper border border-line" id="coe-digital">
                <span className="font-mono text-xs tracking-[0.22em] uppercase text-oxblood font-semibold block mb-2">Centre 04</span>
                <h2 className="font-serif text-2xl font-medium text-ink mb-3">Centre for Digital Innovation and Artificial Intelligence</h2>
                <p className="text-sm text-ink-soft leading-relaxed">
                  Industrial data engineering, artificial intelligence applied to operations, cybersecurity for operational technology, cloud and platform skills, and the data refinery. It scales without adding physical capacity.
                </p>
              </div>

              <div className="anchor-head p-6 bg-paper border border-line" id="coe-agric">
                <span className="font-mono text-xs tracking-[0.22em] uppercase text-oxblood font-semibold block mb-2">Centre 05</span>
                <h2 className="font-serif text-2xl font-medium text-ink mb-3">Centre for Smart Agriculture</h2>
                <p className="text-sm text-ink-soft leading-relaxed">
                  Climate smart production, agri processing and post harvest systems, irrigation and water productivity, soil health and carbon, agrivoltaics, mechanisation skills, and climate risk in food value chains.
                </p>
              </div>
            </div>

            <div className="p-4 bg-paper-soft border-l-2 border-brass text-xs sm:text-sm text-muted-foreground max-w-3xl mb-16">
              Sponsored and customised centres follow a gate: a signed funding commitment covering three years of core cost, a named director, an approved research agenda, and proof the field does not duplicate an existing centre.
            </div>

            {/* ECOSYSTEM TABLE */}
            <div className="anchor-head mb-6">
              <span className="font-mono text-xs tracking-[0.22em] uppercase text-oxblood font-semibold block mb-2">
                Research and Development
              </span>
              <h2 className="font-serif text-3xl font-medium text-ink">From research to impact</h2>
            </div>

            <div className="overflow-x-auto border border-line">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-ink text-paper font-mono text-xs uppercase tracking-wider">
                    <th className="p-4">Input area</th>
                    <th className="p-4">Contribution</th>
                    <th className="p-4">Output to ecosystem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  <tr className="hover:bg-paper-soft transition-colors">
                    <td className="p-4 font-medium">Research</td>
                    <td className="p-4 text-muted-foreground">Faculty and student led projects, often across departments</td>
                    <td className="p-4 text-muted-foreground">Publications, prototypes, models and datasets</td>
                  </tr>
                  <tr className="hover:bg-paper-soft transition-colors">
                    <td className="p-4 font-medium">Innovation</td>
                    <td className="p-4 text-muted-foreground">Deep technology ideas through proofs of concept and pilots</td>
                    <td className="p-4 text-muted-foreground">Intellectual property, start ups and routes to market</td>
                  </tr>
                  <tr className="hover:bg-paper-soft transition-colors">
                    <td className="p-4 font-medium">Talent development</td>
                    <td className="p-4 text-muted-foreground">Students engaged in industry funded research</td>
                    <td className="p-4 text-muted-foreground">A skilled workforce</td>
                  </tr>
                  <tr className="hover:bg-paper-soft transition-colors">
                    <td className="p-4 font-medium">Policy impact</td>
                    <td className="p-4 text-muted-foreground">Data driven insight on sustainable transitions</td>
                    <td className="p-4 text-muted-foreground">Inputs to government, regulators and think tanks</td>
                  </tr>
                  <tr className="hover:bg-paper-soft transition-colors">
                    <td className="p-4 font-medium">Global partnerships</td>
                    <td className="p-4 text-muted-foreground">Links with international consortia and universities</td>
                    <td className="p-4 text-muted-foreground">Knowledge transfer and funding</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
