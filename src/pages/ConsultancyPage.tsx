import React, { useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

export const ConsultancyPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-paper text-ink font-sans antialiased selection:bg-oxblood selection:text-white">
      <Navigation />

      <main className="pt-6">
        {/* HERO SECTION */}
        <section className="py-16 bg-paper-soft border-b border-line">
          <div className="max-w-[1200px] mx-auto px-7">
            <span className="font-mono text-xs tracking-[0.22em] uppercase text-oxblood font-semibold block mb-3">
              Vertical 03 · Consultancy and Advisory
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-ink max-w-3xl mb-6">
              Consultancy and Advisory
            </h1>
            <p className="font-serif text-xl text-ink-soft max-w-3xl leading-relaxed">
              Technical advisory and consulting for industry and government clients, built on the same competence frameworks and evidence the Institute uses to assess people.
            </p>
          </div>
        </section>

        {/* CONTENT BLOCK */}
        <section className="py-16">
          <div className="max-w-[1200px] mx-auto px-7 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <span className="font-mono text-xs tracking-[0.22em] uppercase text-oxblood font-semibold block mb-4">
                What we deliver
              </span>
              <div className="space-y-px bg-line border border-line">
                <div className="bg-paper p-6">
                  <h3 className="font-serif text-lg font-medium mb-2">Workforce & capability development</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">Long term workforce planning and the capability a client needs to run its own operations.</p>
                </div>
                <div className="bg-paper p-6">
                  <h3 className="font-serif text-lg font-medium mb-2">Organisational & operating model design</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">Operating model transformation for enterprises and institutions.</p>
                </div>
                <div className="bg-paper p-6">
                  <h3 className="font-serif text-lg font-medium mb-2">Technology adoption & training strategy</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">Choosing, adopting and embedding technology, with the training strategy to make it stick.</p>
                </div>
                <div className="bg-paper p-6">
                  <h3 className="font-serif text-lg font-medium mb-2">Tailored advisory</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">Advisory shaped to the client rather than to a fixed template.</p>
                </div>
              </div>
            </div>

            <div>
              <span className="font-mono text-xs tracking-[0.22em] uppercase text-oxblood font-semibold block mb-4">
                How we work
              </span>
              <p className="text-sm text-ink-soft mb-6 leading-relaxed">
                Evidence from advisory work and research returns to the competence frameworks and the assessment instruments, so the advice and the standards stay in step.
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                <span className="font-mono text-xs uppercase px-3 py-1.5 border border-line rounded-full text-oxblood">Personalised approach</span>
                <span className="font-mono text-xs uppercase px-3 py-1.5 border border-line rounded-full text-oxblood">Product expertise</span>
                <span className="font-mono text-xs uppercase px-3 py-1.5 border border-line rounded-full text-oxblood">Experienced professionals</span>
                <span className="font-mono text-xs uppercase px-3 py-1.5 border border-line rounded-full text-oxblood">Preventive options</span>
                <span className="font-mono text-xs uppercase px-3 py-1.5 border border-line rounded-full text-oxblood">Proactive advice</span>
              </div>

              <div className="grid grid-cols-2 gap-px bg-line border border-line">
                <div className="bg-paper p-6">
                  <span className="font-serif text-3xl font-medium text-oxblood block mb-1">22</span>
                  <span className="text-xs text-muted-foreground">Major category certifications</span>
                </div>
                <div className="bg-paper p-6">
                  <span className="font-serif text-3xl font-medium text-oxblood block mb-1">52</span>
                  <span className="text-xs text-muted-foreground">NIPEX codes</span>
                </div>
                <div className="bg-paper p-6">
                  <span className="font-serif text-2xl font-medium text-oxblood block mb-1">ISO 9001</span>
                  <span className="text-xs text-muted-foreground">Quality management, certified</span>
                </div>
                <div className="bg-paper p-6">
                  <span className="font-serif text-2xl font-medium text-oxblood block mb-1">PwC</span>
                  <span className="text-xs text-muted-foreground">Audited accounts</span>
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
