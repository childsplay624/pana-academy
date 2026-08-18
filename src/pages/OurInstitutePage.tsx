import React, { useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Link } from 'react-router-dom';

export const OurInstitutePage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-paper text-ink font-sans antialiased selection:bg-oxblood selection:text-white">
      <Navigation />

      <main className="pt-6">
        {/* HERO SECTION */}
        <section className="pt-20 pb-12 relative overflow-hidden">
          <div className="max-w-[1200px] mx-auto px-7">
            <span className="font-mono text-xs tracking-[0.22em] uppercase text-oxblood font-semibold block mb-4">
              PANA Institute · Port Harcourt · Abuja
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium text-ink leading-[1.08] tracking-tight max-w-3xl mb-7">
              Building the standard against which competence is measured.
            </h1>
            <p className="font-serif text-xl sm:text-2xl text-ink-soft leading-relaxed max-w-2xl font-normal">
              PANA Institute develops and assesses competence for the petroleum, energy and power, and digital industries, and publishes research that informs the decisions taken in them.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 mt-14 border-t border-line">
              <div className="py-6 sm:pr-6 border-r border-line last:border-r-0">
                <span className="font-serif text-3xl sm:text-4xl text-oxblood font-medium block mb-1">2020</span>
                <span className="text-xs sm:text-sm text-muted-foreground">Founded as the capability arm of PANA Holdings</span>
              </div>
              <div className="py-6 sm:px-6 border-r border-line last:border-r-0">
                <span className="font-serif text-3xl sm:text-4xl text-oxblood font-medium block mb-1">5</span>
                <span className="text-xs sm:text-sm text-muted-foreground">Integrated verticals under one mandate</span>
              </div>
              <div className="py-6 sm:px-6 border-r border-line last:border-r-0">
                <span className="font-serif text-3xl sm:text-4xl text-oxblood font-medium block mb-1">9</span>
                <span className="text-xs sm:text-sm text-muted-foreground">Countries reached across four continents</span>
              </div>
              <div className="py-6 sm:pl-6">
                <span className="font-serif text-3xl sm:text-4xl text-oxblood font-medium block mb-1">2026</span>
                <span className="text-xs sm:text-sm text-muted-foreground">Elevated from Academy to Institute</span>
              </div>
            </div>
          </div>
        </section>

        {/* PILLARS STRIP */}
        <div className="border-t border-line bg-paper">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-line">
            <Link to="/competency" className="p-6 hover:bg-paper-soft transition-colors group">
              <span className="font-mono text-[11px] text-oxblood tracking-widest block mb-2 font-medium">Vertical 01</span>
              <div className="font-serif text-lg font-medium text-ink group-hover:text-oxblood transition-colors leading-tight mb-2">Competency Assessment</div>
              <div className="text-xs text-muted-foreground">Assess, then cultivate.</div>
            </Link>
            <Link to="/research" className="p-6 hover:bg-paper-soft transition-colors group">
              <span className="font-mono text-[11px] text-oxblood tracking-widest block mb-2 font-medium">Vertical 02</span>
              <div className="font-serif text-lg font-medium text-ink group-hover:text-oxblood transition-colors leading-tight mb-2">Research & Development</div>
              <div className="text-xs text-muted-foreground">Five centres of excellence.</div>
            </Link>
            <Link to="/consultancy" className="p-6 hover:bg-paper-soft transition-colors group">
              <span className="font-mono text-[11px] text-oxblood tracking-widest block mb-2 font-medium">Vertical 03</span>
              <div className="font-serif text-lg font-medium text-ink group-hover:text-oxblood transition-colors leading-tight mb-2">Consultancy & Advisory</div>
              <div className="text-xs text-muted-foreground">Industry and government.</div>
            </Link>
            <Link to="/sustainability" className="p-6 hover:bg-paper-soft transition-colors group">
              <span className="font-mono text-[11px] text-oxblood tracking-widest block mb-2 font-medium">Vertical 04</span>
              <div className="font-serif text-lg font-medium text-ink group-hover:text-oxblood transition-colors leading-tight mb-2">Sustainability & Climate</div>
              <div className="text-xs text-muted-foreground">Decarbonisation and ESG.</div>
            </Link>
            <Link to="/global" className="p-6 hover:bg-paper-soft transition-colors group">
              <span className="font-mono text-[11px] text-oxblood tracking-widest block mb-2 font-medium">Vertical 05</span>
              <div className="font-serif text-lg font-medium text-ink group-hover:text-oxblood transition-colors leading-tight mb-2">Global Engagements</div>
              <div className="text-xs text-muted-foreground">Partnerships and reach.</div>
            </Link>
          </div>
        </div>

        {/* MEASUREMENT SCALE SIGNATURE */}
        <div className="scale tall"></div>

        {/* OUR JOURNEY TIMELINE */}
        <section className="py-20">
          <div className="max-w-[1200px] mx-auto px-7">
            <div className="anchor-head mb-12" id="our-journey">
              <span className="font-mono text-xs tracking-[0.22em] uppercase text-oxblood font-semibold block mb-2">
                Our Institute · Our Journey
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-ink font-medium">From Academy to Institute</h2>
            </div>
            <p className="font-serif text-xl text-ink-soft max-w-3xl mb-12 leading-relaxed">
              PANA Academy grew from a corporate training arm into a centre of excellence with a broader remit across competency assessment and development, applied research, consultancy, global engagement, and sustainability.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line">
              <div className="bg-paper p-7">
                <span className="font-mono text-xs text-oxblood tracking-widest font-semibold block mb-3">2020 · FOUNDED</span>
                <h4 className="font-serif text-xl font-medium mb-3">The capability arm</h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Set up as the training and capability development arm of PANA Holdings, delivering technical and professional programmes aligned with corporate objectives.
                </p>
              </div>
              <div className="bg-paper p-7">
                <span className="font-mono text-xs text-oxblood tracking-widest font-semibold block mb-3">STAGE 02 · REACH</span>
                <h4 className="font-serif text-xl font-medium mb-3">Regional presence</h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Operating across two locations, Port Harcourt and Abuja, giving the Academy regional reach and a permanent institutional base.
                </p>
              </div>
              <div className="bg-paper p-7">
                <span className="font-mono text-xs text-oxblood tracking-widest font-semibold block mb-3">STAGE 03 · MANDATE</span>
                <h4 className="font-serif text-xl font-medium mb-3">A broadened mandate</h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Elevated to Institute status, taking on competency assessment and cultivation, applied research, international partnerships, consulting and sustainability.
                </p>
              </div>
              <div className="bg-paper p-7">
                <span className="font-mono text-xs text-oxblood tracking-widest font-semibold block mb-3">2026 · POSITIONED</span>
                <h4 className="font-serif text-xl font-medium mb-3">A centre of excellence</h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  PANA Institute now serves industry, government and community across Africa and beyond, working to one integrated management system aligned to ISO 21001:2025.
                </p>
              </div>
            </div>

            {/* WHO WE ARE */}
            <div className="anchor-head mt-24 mb-10">
              <span className="font-mono text-xs tracking-[0.22em] uppercase text-oxblood font-semibold block mb-2">
                Who we are
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-ink font-medium">Human capital for the industries that power the region</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-6">
                <p className="text-sm sm:text-base text-ink-soft leading-relaxed">
                  PANA Institute builds human capital for the petroleum, energy, power, and digital sectors. It delivers customised, experiential programmes on modern facilities, led by instructors who have run the jobs they teach.
                </p>
                <div className="space-y-4 pt-2">
                  <div className="p-4 bg-paper-soft border border-line rounded-sm">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-oxblood font-semibold mr-3">Vision</span>
                    <span className="text-sm text-ink-soft">To be Africa's competency solutions partner for the energy, power, and digital industries.</span>
                  </div>
                  <div className="p-4 bg-paper-soft border border-line rounded-sm">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-oxblood font-semibold mr-3">Mission</span>
                    <span className="text-sm text-ink-soft">To develop and upskill the workforce of these industries through training that cultivates practical competencies directly applicable to real job roles.</span>
                  </div>
                  <div className="p-4 bg-paper-soft border border-line rounded-sm">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-oxblood font-semibold mr-3">Purpose</span>
                    <span className="text-sm text-ink-soft">To drive competency assessment and development, and to create a pool of relevant talent for the energy, power, and digital industries.</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-line border border-line">
                <div className="bg-paper p-6">
                  <span className="font-mono text-[11px] text-brass uppercase tracking-widest block mb-2">Recognition</span>
                  <h3 className="font-serif text-lg font-medium mb-2">OGTAN Life Member</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">A life member of the Oil and Gas Trainers Association of Nigeria, and a presence at Sub Saharan Africa International Petroleum Exhibition.</p>
                </div>
                <div className="bg-paper p-6">
                  <span className="font-mono text-[11px] text-brass uppercase tracking-widest block mb-2">Accreditation</span>
                  <h3 className="font-serif text-lg font-medium mb-2">Accredited Service Provider</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">Guided by subject matter specialists and by experienced links across academia and industry.</p>
                </div>
                <div className="bg-paper p-6">
                  <span className="font-mono text-[11px] text-brass uppercase tracking-widest block mb-2">Legacy wins</span>
                  <h3 className="font-serif text-lg font-medium mb-2">Total & Chevron HCD</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">Delivered the Total and PIDWAL programmes and the Chevron Human Capital Development programme for Makaraba Utonana gas flare project.</p>
                </div>
                <div className="bg-paper p-6">
                  <span className="font-mono text-[11px] text-brass uppercase tracking-widest block mb-2">Group partners</span>
                  <h3 className="font-serif text-lg font-medium mb-2">PE Energy & AKD</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">A standing training partnership across the PANA Holdings group for a range of competency development work.</p>
                </div>
              </div>
            </div>

            {/* GOVERNANCE AND LEADERSHIP */}
            <div className="anchor-head mt-28 mb-8" id="leadership">
              <span className="font-mono text-xs tracking-[0.22em] uppercase text-oxblood font-semibold block mb-2">
                Our Institute · Leadership
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-ink font-medium mb-4">Governance and leadership</h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
                Authority over standards sits with governance, not with delivery. No person may both deliver a programme and decide the assessment outcome for the same candidate. That separation is what lets assessors of international standing trust a judgement made here.
              </p>
            </div>

            <div className="anchor-head mt-16 mb-6" id="gov-council">
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-oxblood font-semibold block mb-1">
                Leadership · Governing Council
              </span>
              <h3 className="font-serif text-2xl font-medium text-ink">The Governing Council</h3>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl mb-8">
              The Governing Council holds supreme oversight of the Institute and the PANA Holdings board seat. Four councils and committees report into it, each with a defined authority and a matching limit.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-line border border-line mb-10">
              <div className="bg-paper p-7">
                <span className="font-mono text-[11px] text-brass uppercase tracking-widest block mb-2">Curricula and standards</span>
                <h3 className="font-serif text-xl font-medium mb-3">Academic and Research Council</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">Approves curricula, competence frameworks, academic standards, research agendas and research ethics, and clears every think tank publication.</p>
              </div>
              <div className="bg-paper p-7">
                <span className="font-mono text-[11px] text-brass uppercase tracking-widest block mb-2">Assessment integrity</span>
                <h3 className="font-serif text-xl font-medium mb-3">Assessment Integrity Committee</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">Employers, practitioners, regulators and learners. Owns assessment design, examiner calibration and appeals, and can stop a result being released.</p>
              </div>
              <div className="bg-paper p-7">
                <span className="font-mono text-[11px] text-brass uppercase tracking-widest block mb-2">Fellowship</span>
                <h3 className="font-serif text-xl font-medium mb-3">Fellows Council</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">Governs the fellowship, the professorial chairs and the thought leadership mandate.</p>
              </div>
              <div className="bg-paper p-7">
                <span className="font-mono text-[11px] text-brass uppercase tracking-widest block mb-2">Assurance</span>
                <h3 className="font-serif text-xl font-medium mb-3">Risk, Audit and Ethics Committee</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">Assurance over hub governance, joint financing, research integrity and conflict of interest.</p>
              </div>
            </div>

            <div className="p-4 bg-paper-soft border-l-2 border-brass text-xs sm:text-sm text-muted-foreground max-w-2xl mb-16">
              ISO 21001:2025 requires assessment to be traceable, secure against malpractice and open to appeal, with grades tied back to evidence. The Assessment Integrity Committee holds those obligations and reports to the Council rather than to the executive.
            </div>

            {/* EXECUTIVE MANAGEMENT TEAM */}
            <div className="anchor-head mb-6" id="exec-team">
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-oxblood font-semibold block mb-1">
                Leadership · Executive Management
              </span>
              <h3 className="font-serif text-2xl font-medium text-ink">Executive Management Team</h3>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl mb-8">
              The executive runs delivery and research under the Founder and Group Chief Executive. Four delivery divisions sit under the Head of Programmes and Strategy; five centres of excellence sit under the Head of Research and Development.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line mb-12">
              <div className="bg-paper p-6">
                <h3 className="font-serif text-lg font-medium mb-2">Founder and GCEO</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">Sets direction for the Institute and holds the relationship with the Governing Council and the group.</p>
              </div>
              <div className="bg-paper p-6">
                <h3 className="font-serif text-lg font-medium mb-2">Senior Vice President</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">Oversees global strategic partnerships and the growth pipeline across the divisions.</p>
              </div>
              <div className="bg-paper p-6">
                <h3 className="font-serif text-lg font-medium mb-2">Chief of Administration</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">Registry, finance, legal, human resources, ICT, the learning platform and facilities.</p>
              </div>
              <div className="bg-paper p-6">
                <h3 className="font-serif text-lg font-medium mb-2">Head, Programmes & Strategy</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">The five delivery divisions, the growth pipeline and strategic planning.</p>
              </div>
              <div className="bg-paper p-6">
                <h3 className="font-serif text-lg font-medium mb-2">Head, Research & Development</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">The five centres of excellence, the chairs, laboratories, grants and licensing.</p>
              </div>
              <div className="bg-paper p-6">
                <h3 className="font-serif text-lg font-medium mb-2">Head, Quality & Standards</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">The management system, curriculum design, internal audit programme and accreditation.</p>
              </div>
            </div>

            {/* GOVERNING COUNCIL MEMBERS */}
            <div className="mb-16">
              <span className="font-mono text-xs uppercase tracking-widest text-brass font-semibold block mb-4">Governing Council</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line">
                <div className="bg-paper p-6">
                  <h3 className="font-serif text-base font-medium mb-1">Dr Daere Afonya-a Akobo</h3>
                  <p className="text-xs text-muted-foreground">Chairman and Chief Executive</p>
                </div>
                <div className="bg-paper p-6">
                  <h3 className="font-serif text-base font-medium mb-1">Iyenemi Akobo</h3>
                  <p className="text-xs text-muted-foreground">Executive Director, Research & Advisory</p>
                </div>
                <div className="bg-paper p-6">
                  <h3 className="font-serif text-base font-medium mb-1">Callista Azogu</h3>
                  <p className="text-xs text-muted-foreground">Global Business Services</p>
                </div>
                <div className="bg-paper p-6">
                  <h3 className="font-serif text-base font-medium mb-1">Kennedy Dike</h3>
                  <p className="text-xs text-muted-foreground">GM, Global Business Services</p>
                </div>
              </div>
            </div>

            {/* SAFETY AT PANA INSTITUTE */}
            <div className="anchor-head mt-24 mb-8" id="safety">
              <span className="font-mono text-xs tracking-[0.22em] uppercase text-oxblood font-semibold block mb-2">
                Our Institute · Safety
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-ink font-medium">Safety at PANA Institute</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-24">
              <div>
                <p className="text-sm sm:text-base text-ink-soft leading-relaxed mb-4">
                  Health, safety and environment standards are built into every programme, from curriculum design through to delivery on live equipment. Safety is taught the way it is practised on a working site, not as a separate module.
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Environmental and occupational health and safety certification is in progress under ISO 14001 and ISO 45001, targeted for completion in 2027, and folded into the single management system the Institute runs across all of its work.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-line border border-line">
                <div className="bg-paper p-6">
                  <span className="font-mono text-[11px] text-brass uppercase tracking-widest block mb-2">ISO 14001</span>
                  <h3 className="font-serif text-base font-medium mb-1">Environment</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">Environmental management, in progress across the Institute.</p>
                </div>
                <div className="bg-paper p-6">
                  <span className="font-mono text-[11px] text-brass uppercase tracking-widest block mb-2">ISO 45001</span>
                  <h3 className="font-serif text-base font-medium mb-1">Health & Safety</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">Worker safety management, in progress alongside environment scope.</p>
                </div>
                <div className="bg-paper p-6">
                  <span className="font-mono text-[11px] text-brass uppercase tracking-widest block mb-2">Practice</span>
                  <h3 className="font-serif text-base font-medium mb-1">Train for prevention</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">Programmes train for performance, prevention and sustainability across all work.</p>
                </div>
                <div className="bg-paper p-6">
                  <span className="font-mono text-[11px] text-brass uppercase tracking-widest block mb-2">Assurance</span>
                  <h3 className="font-serif text-base font-medium mb-1">One system</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">Safety obligations sit inside the same document control as the rest of the Institute.</p>
                </div>
              </div>
            </div>

            {/* JOIN OUR TEAM */}
            <div className="anchor-head mb-8" id="join">
              <span className="font-mono text-xs tracking-[0.22em] uppercase text-oxblood font-semibold block mb-2">
                Our Institute · Join Our Team
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-ink font-medium">Join our team</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-24">
              <div id="careers">
                <span className="font-mono text-xs uppercase tracking-widest text-oxblood font-semibold block mb-2">Careers</span>
                <h3 className="font-serif text-2xl font-medium mb-4">Build the Institute with us</h3>
                <p className="text-sm text-ink-soft mb-4 leading-relaxed">
                  The Institute is appointing principal officers, directors, centre directors, faculty and assessors as it builds out its five pillars. Open roles are posted here as each is confirmed.
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  To register your interest, send a short profile and CV to <a href="mailto:info@pana-institute.com" className="text-oxblood font-medium underline underline-offset-4">info@pana-institute.com</a> with the domain or centre you want to work in.
                </p>
              </div>

              <div id="culture">
                <span className="font-mono text-xs uppercase tracking-widest text-oxblood font-semibold block mb-2">Our People and Culture</span>
                <h3 className="font-serif text-2xl font-medium mb-4">The five Ps</h3>
                <p className="text-sm text-ink-soft mb-4 leading-relaxed">
                  The operating maxim runs through how the Institute hires and how it works: purpose for a sustainable enterprise, philosophy and process supported by technology, products and platforms that solve real problems, people and talent measured by performance, and prosperity shared with employees and shareholders.
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  People are supported to grow through a staff development programme, and alumni carry a standing relationship with the Institute for the length of their careers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* DARK QUOTE & 6 COMMITMENTS SECTION */}
        <section className="py-20 bg-ink text-paper">
          <div className="max-w-[1200px] mx-auto px-7 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal leading-tight">
              Six things the Institute is set up to do, and nothing else.
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-zinc-800 border border-zinc-800">
              <div className="bg-ink-soft p-6">
                <span className="font-mono text-xs text-brass tracking-widest block mb-2">01</span>
                <h3 className="font-serif text-lg font-medium mb-2">Accelerated competency</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">Experiential learning on live equipment, workshops, plant and simulators.</p>
              </div>
              <div className="bg-ink-soft p-6">
                <span className="font-mono text-xs text-brass tracking-widest block mb-2">02</span>
                <h3 className="font-serif text-lg font-medium mb-2">Assessment & profiling</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">Evidence based statements of what a person can do, judged independently.</p>
              </div>
              <div className="bg-ink-soft p-6">
                <span className="font-mono text-xs text-brass tracking-widest block mb-2">03</span>
                <h3 className="font-serif text-lg font-medium mb-2">Customised learning</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">Client and product specific programmes, local content and executive education.</p>
              </div>
              <div className="bg-ink-soft p-6">
                <span className="font-mono text-xs text-brass tracking-widest block mb-2">04</span>
                <h3 className="font-serif text-lg font-medium mb-2">Applied research</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">Five centres of excellence, funded chairs, labs and working pilots.</p>
              </div>
              <div className="bg-ink-soft p-6">
                <span className="font-mono text-xs text-brass tracking-widest block mb-2">05</span>
                <h3 className="font-serif text-lg font-medium mb-2">Sustainability & Climate</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">Value driven through decarbonisation, ESG and green innovation.</p>
              </div>
              <div className="bg-ink-soft p-6">
                <span className="font-mono text-xs text-brass tracking-widest block mb-2">06</span>
                <h3 className="font-serif text-lg font-medium mb-2">Capability advisory</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">Long term workforce planning and operating model implementation support.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
