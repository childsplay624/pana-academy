import React, { useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

export const GlobalEngagementsPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-paper text-ink font-sans antialiased selection:bg-oxblood selection:text-white">
      <Navigation />

      <main className="flex-1 w-full">
        {/* HERO SECTION - DARK LUXURY EDITORIAL */}
        <section className="pt-36 pb-24 bg-ink text-paper border-b border-zinc-800">
          <div className="max-w-[1320px] mx-auto px-7">
            <span className="font-mono text-xs tracking-[0.22em] uppercase text-brass font-semibold block mb-3">
              VERTICAL 05 · GLOBAL ENGAGEMENTS
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-paper max-w-4xl mb-6">
              Global Engagements and Strategic Partnerships
            </h1>
            <p className="font-serif text-lg sm:text-xl text-zinc-300 max-w-3xl leading-relaxed">
              Connecting African energy and technology talent with international institutions, original equipment manufacturers, research consortia, and global trade delegations.
            </p>
          </div>
        </section>

        {/* CONTENT BLOCK */}
        <section className="py-24 bg-paper">
          <div className="max-w-[1320px] mx-auto px-7">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line border border-line mb-16">
              <div className="bg-paper p-7">
                <span className="font-mono text-xs text-oxblood tracking-widest font-semibold block mb-3">01 · REACH</span>
                <h3 className="font-serif text-xl font-medium mb-3">International Consortia</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Collaborative research partnerships and joint workforce initiatives with global universities and policy think tanks.
                </p>
              </div>
              <div className="bg-paper p-7">
                <span className="font-mono text-xs text-oxblood tracking-widest font-semibold block mb-3">02 · OEM ALIGNMENT</span>
                <h3 className="font-serif text-xl font-medium mb-3">Technology Partners</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Direct alliances with original equipment manufacturers for certified training on live operational hardware and software.
                </p>
              </div>
              <div className="bg-paper p-7">
                <span className="font-mono text-xs text-oxblood tracking-widest font-semibold block mb-3">03 · DIPLOMACY</span>
                <h3 className="font-serif text-xl font-medium mb-3">Trade & Policy Delegations</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Representation at regional energy summits, sub-Saharan petroleum conferences, and international trade missions.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
