import React, { useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import ScrollReveal from '@/components/ui/ScrollReveal';

export const CompetencyPage: React.FC = () => {
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
              VERTICAL 01 · COMPETENCY ASSESSMENT & DEVELOPMENT
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-paper max-w-4xl mb-6">
              Competency Assessment and Development
            </h1>
            <p className="font-serif text-lg sm:text-xl text-zinc-300 max-w-3xl leading-relaxed">
              A capability development hub delivering accredited training, leadership development and practical skills aligned with real operational needs, and an assessment function that judges competence on evidence alone.
            </p>
          </div>
        </section>

        {/* CONTENT BLOCK */}
        <section className="py-24 bg-paper">
          <div className="max-w-[1320px] mx-auto px-7">
            {/* SUBNAV */}
            <div className="flex flex-wrap gap-2 pb-6 mb-12 border-b border-line">
              <a href="#programmes" className="font-mono text-xs uppercase tracking-wider px-3.5 py-2 border border-line rounded-sm text-muted-foreground hover:border-oxblood hover:text-oxblood transition-colors">Programmes</a>
              <a href="#faculty" className="font-mono text-xs uppercase tracking-wider px-3.5 py-2 border border-line rounded-sm text-muted-foreground hover:border-oxblood hover:text-oxblood transition-colors">Faculty</a>
              <a href="#labs" className="font-mono text-xs uppercase tracking-wider px-3.5 py-2 border border-line rounded-sm text-muted-foreground hover:border-oxblood hover:text-oxblood transition-colors">Labs</a>
              <a href="#roar-club" className="font-mono text-xs uppercase tracking-wider px-3.5 py-2 border border-line rounded-sm text-muted-foreground hover:border-oxblood hover:text-oxblood transition-colors">Roar Club</a>
            </div>

            {/* PROGRAMMES */}
            <ScrollReveal direction="up" delay={0.1}>
              <div className="anchor-head mb-8" id="programmes">
                <span className="font-mono text-xs tracking-[0.22em] uppercase text-oxblood font-semibold block mb-2">
                  Competency · Programmes
                </span>
                <h2 className="font-serif text-3xl font-medium text-ink mb-4">Programmes</h2>
                <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                  We train for performance, prevention and sustainability, across tailored, product specific and NCDMB stipulated Human Capital Development programmes. Thirteen categories of training solution sit under the pillar.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line mb-16">
              <div className="bg-paper p-6">
                <h3 className="font-serif text-lg font-medium mb-2">Technical, operations & maintenance</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">Power and drives, valves and actuation, measurement and management, instrumentation and automation, welding and NDT, marine and subsea, E&P, renewable energy.</p>
              </div>
              <div className="bg-paper p-6">
                <h3 className="font-serif text-lg font-medium mb-2">Digitalisation & transformation</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">Smart grid, SCADA, artificial intelligence, the internet of things, and drones.</p>
              </div>
              <div className="bg-paper p-6">
                <h3 className="font-serif text-lg font-medium mb-2">Safety & sustainability</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">Industrial safety, environmental compliance and sustainable practice.</p>
              </div>
              <div className="bg-paper p-6">
                <h3 className="font-serif text-lg font-medium mb-2">Project management</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">Project management and project development for capital and operational work.</p>
              </div>
              <div className="bg-paper p-6">
                <h3 className="font-serif text-lg font-medium mb-2">Leadership & management</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">Leadership, management and professional development courses.</p>
              </div>
              <div className="bg-paper p-6">
                <h3 className="font-serif text-lg font-medium mb-2">Trades & site skills</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">Scaffolding, rigging and lifting, welding and pipe fitting.</p>
              </div>
              <div className="bg-paper p-6">
                <h3 className="font-serif text-lg font-medium mb-2">Human capital development</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">Nigerian Content HCD, collaborative HCD, project based HCD, remedial HCD, and community impact work.</p>
              </div>
              <div className="bg-paper p-6">
                <h3 className="font-serif text-lg font-medium mb-2">Digital literacy & social impact</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">Digital literacy, IT skills, youth and host community development, and career fairs.</p>
              </div>
              <div className="bg-paper p-6">
                <h3 className="font-serif text-lg font-medium mb-2">Customised & specialist</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">Customer specific, product specific and specialist courses, onboarding, sales, and asset management.</p>
              </div>
            </div>

            {/* FACULTY */}
            <div className="anchor-head mb-8" id="faculty">
              <span className="font-mono text-xs tracking-[0.22em] uppercase text-oxblood font-semibold block mb-2">
                Competency · Faculty
              </span>
              <h2 className="font-serif text-3xl font-medium text-ink mb-4">Faculty</h2>
              <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                Programmes are led by instructors who have run the jobs they teach, connected to academic partners and to the subject authority held in the centres.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line mb-16">
              <div className="bg-paper p-6">
                <span className="font-mono text-[11px] text-brass uppercase tracking-widest block mb-2">People</span>
                <h3 className="font-serif text-lg font-medium mb-2">Industry leading faculty</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">Guided by experts who help shape industry standards.</p>
              </div>
              <div className="bg-paper p-6">
                <span className="font-mono text-[11px] text-brass uppercase tracking-widest block mb-2">Partners</span>
                <h3 className="font-serif text-lg font-medium mb-2">Global partnerships</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">Connected to leading organisations, innovators and OEMs worldwide.</p>
              </div>
              <div className="bg-paper p-6">
                <span className="font-mono text-[11px] text-brass uppercase tracking-widest block mb-2">Design</span>
                <h3 className="font-serif text-lg font-medium mb-2">Custom learning solutions</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">Courses built to address specific job roles and in country skills gaps.</p>
              </div>
              <div className="bg-paper p-6">
                <span className="font-mono text-[11px] text-brass uppercase tracking-widest block mb-2">Support</span>
                <h3 className="font-serif text-lg font-medium mb-2">Lifetime alumni support</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">Continuing mentorship for sustained professional growth.</p>
              </div>
              <div className="bg-paper p-6">
                <span className="font-mono text-[11px] text-brass uppercase tracking-widest block mb-2">Proof</span>
                <h3 className="font-serif text-lg font-medium mb-2">Verifiable digital credentials</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">Recognised certifications with secure verification an employer can check.</p>
              </div>
              <div className="bg-paper p-6">
                <span className="font-mono text-[11px] text-brass uppercase tracking-widest block mb-2">Integrity</span>
                <h3 className="font-serif text-lg font-medium mb-2">Independent assessment</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">No commercial relationship changes a judgement about what a person can do.</p>
              </div>
            </div>

            {/* LABS */}
            <div className="anchor-head mb-8" id="labs">
              <span className="font-mono text-xs tracking-[0.22em] uppercase text-oxblood font-semibold block mb-2">
                Competency · Labs
              </span>
              <h2 className="font-serif text-3xl font-medium text-ink mb-4">Labs</h2>
              <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed mb-6">
                Learning happens in environments that mirror real operations: live equipment, workshops, plant and simulators. The technical domains below anchor the laboratories, the curriculum and the assessment centres.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-line border border-line mb-16">
              <div className="bg-paper p-6"><h3 className="font-serif text-base font-medium">Power & Drives</h3></div>
              <div className="bg-paper p-6"><h3 className="font-serif text-base font-medium">Valves & Actuation</h3></div>
              <div className="bg-paper p-6"><h3 className="font-serif text-base font-medium">Measurement & Management</h3></div>
              <div className="bg-paper p-6"><h3 className="font-serif text-base font-medium">Integrated Automation</h3></div>
              <div className="bg-paper p-6"><h3 className="font-serif text-base font-medium">Supply Chain Management</h3></div>
              <div className="bg-paper p-6"><h3 className="font-serif text-base font-medium">Exploration & Production</h3></div>
              <div className="bg-paper p-6"><h3 className="font-serif text-base font-medium">Marine & Subsea</h3></div>
              <div className="bg-paper p-6"><h3 className="font-serif text-base font-medium">Digitalisation & Digitisation</h3></div>
            </div>

            {/* ROAR CLUB */}
            <div className="anchor-head mb-8" id="roar-club">
              <span className="font-mono text-xs tracking-[0.22em] uppercase text-oxblood font-semibold block mb-2">
                Competency · Roar Club
              </span>
              <h2 className="font-serif text-3xl font-medium text-ink mb-4">Roar Club</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <p className="text-sm sm:text-base text-ink-soft leading-relaxed mb-4">
                  Roar Club is the learner and alumni community of PANA Institute. It carries the lifetime relationship the Institute keeps with everyone who trains and is assessed here, from a first certificate course through to the fellowship.
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Members stay connected through mentorship, continuing development, and access to events, career fairs and the Institute's partner network. The alumni base is being built toward a standing fellowship with a defined membership.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-line border border-line">
                <div className="bg-paper p-6">
                  <span className="font-mono text-[11px] text-brass uppercase tracking-widest block mb-2">Belong</span>
                  <h3 className="font-serif text-lg font-medium mb-1">Alumni network</h3>
                  <p className="text-xs text-muted-foreground">A lasting membership for graduates of every programme.</p>
                </div>
                <div className="bg-paper p-6">
                  <span className="font-mono text-[11px] text-brass uppercase tracking-widest block mb-2">Grow</span>
                  <h3 className="font-serif text-lg font-medium mb-1">Mentorship</h3>
                  <p className="text-xs text-muted-foreground">Continuing guidance and professional development.</p>
                </div>
                <div className="bg-paper p-6">
                  <span className="font-mono text-[11px] text-brass uppercase tracking-widest block mb-2">Connect</span>
                  <h3 className="font-serif text-lg font-medium mb-1">Events & fairs</h3>
                  <p className="text-xs text-muted-foreground">Career fairs, community development and partner sessions.</p>
                </div>
                <div className="bg-paper p-6">
                  <span className="font-mono text-[11px] text-brass uppercase tracking-widest block mb-2">Advance</span>
                  <h3 className="font-serif text-lg font-medium mb-1">Fellowship pathway</h3>
                  <p className="text-xs text-muted-foreground">A route from alumnus to fellow as fellowship stands up.</p>
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
