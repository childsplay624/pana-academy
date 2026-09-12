import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { FontAwesomeIcon } from "@/components/ui/FontAwesomeIcon";
import { Button } from "@/components/ui/button";
import Card3D from "@/components/ui/Card3D";
import { useSiteImage } from "@/hooks/useSiteImage";
import { usePageContent } from "@/hooks/usePageContent";
import { Link } from "react-router-dom";
import { DynamicPageSections } from "@/components/page-builder/DynamicPageSections";

const GlobalEngagementsPage = () => {
  const { imageUrl: defaultHeaderImage } = useSiteImage('header_global_engagements');
  const { get } = usePageContent('global-engagements');
  const headerImage = get('header_image') || defaultHeaderImage || '/images/global_engagements_hero.jpg';

  const globalPillars = [
    {
      icon: "fa-solid fa-earth-americas",
      title: "International Joint Ventures & Consortia",
      desc: "Collaborative technical delivery, technology transfer, and joint capacity building across Sub-Saharan Africa, the Middle East, and global markets.",
      bullets: [
        "Multinational operator training partnerships",
        "Joint research & development programs",
        "Cross-border workforce qualification frameworks"
      ]
    },
    {
      icon: "fa-solid fa-handshake",
      title: "Cross-Border Competency Alignment",
      desc: "Harmonizing regional skills with international engineering and energy standards, ensuring seamless mobility for skilled professionals.",
      bullets: [
        "ISO 21001 & ISO 14001 governance integration",
        "NCDMB & OGTAN accredited curriculum alignment",
        "Pan-African competence verification systems"
      ]
    },
    {
      icon: "fa-solid fa-bolt",
      title: "Global Energy & Power Alliances",
      desc: "Strategic alliances with major petroleum operators, renewable energy developers, and smart grid technology leaders.",
      bullets: [
        "Oil & gas upstream/midstream workforce initiatives",
        "Renewable transition & green hydrogen advisory",
        "Smart grid & power distribution capacity projects"
      ]
    },
    {
      icon: "fa-solid fa-atom",
      title: "Multinational Research Collaborations",
      desc: "Connecting PANA Institute's 5 Centres of Excellence with global universities, research labs, and industrial think tanks.",
      bullets: [
        "Joint publication & white paper releases",
        "Decarbonisation & carbon capture research",
        "Digital transformation & industrial AI labs"
      ]
    }
  ];

  const globalHubs = [
    {
      city: "Port Harcourt",
      country: "Nigeria · Centre of Excellence",
      address: "Plot 94 Rivoc Road, Trans Amadi Industrial Layout, Port Harcourt",
      tel: "+234 702 600 0116",
      role: "Primary Technical Hub & Simulator Labs"
    },
    {
      city: "Abuja",
      country: "Nigeria · Federal Capital Territory",
      address: "No. 5 Vattern Street, off Amazon Street, Maitama, Abuja",
      tel: "+234 702 600 0119",
      role: "Policy, Governance & Institutional Liaison"
    },
    {
      city: "Kampala",
      country: "Uganda · East Africa",
      address: "C/O Cristal Advocates, 4th Floor, Padre Pio House, Plot 32 Lumumba Avenue, Kampala",
      role: "East African Rift & Energy Operations"
    },
    {
      city: "Dubai",
      country: "United Arab Emirates",
      address: "Business Center 1, M Floor, The Meydan Hotel, Nad Al Sheba, Dubai",
      role: "Middle East & International Advisory Hub"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Global Engagements & International Alliances | PANA Institute</title>
        <meta name="description" content="Connecting African industrial talent, R&D labs, and energy assets with international consortia, cross-border workforce development, and global accreditation bodies." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />

        <main className="flex-grow pt-20">
          {/* Hero Section */}
          <section className="relative py-24 md:py-32 overflow-hidden bg-zinc-950 text-white min-h-[460px] md:min-h-[540px] flex items-center justify-center">
            <div className="absolute inset-0">
              {headerImage ? (
                <img
                  src={headerImage}
                  alt="Global Engagements & International Alliances"
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-zinc-950 via-red-950 to-zinc-900"></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-900/85 to-red-950/80"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center z-10">
              <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full text-white text-xs font-bold uppercase tracking-wider border border-white/20">
                  <FontAwesomeIcon name="fa-solid fa-earth-americas" className="text-red-500" />
                  <span>Global Engagements & Partnerships</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white drop-shadow-lg">
                  Global Engagements & <span className="text-red-500">International Alliances</span>
                </h1>

                <p className="text-lg md:text-xl text-zinc-200 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                  Connecting African industrial talent, technical labs, and energy assets with international consortia, cross-border workforce development, and global accreditation bodies.
                </p>


              </div>
            </div>
          </section>

          {/* Overview Section */}
          <section id="overview" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="text-red-600 font-bold text-xs uppercase tracking-wider mb-2">Global Vision · Local Execution</div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                    Building Transnational Competency Frameworks
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    PANA Institute operates at the intersection of local content development and global industry standards. We collaborate with energy operators, national governments, and international technical institutions to deliver accredited workforce development and advisory.
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-8">
                    Our global engagements ensure that human capital trained across our facilities in Port Harcourt, Abuja, Kampala, and Dubai meets the exacting competence standards demanded by global markets.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Card3D className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="text-2xl font-bold text-red-600 mb-1 transform transition-transform duration-300 translate-z-10">4 Global Hubs</div>
                      <div className="text-xs text-gray-600">Nigeria, Uganda & UAE</div>
                    </Card3D>
                    <Card3D className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="text-2xl font-bold text-red-600 mb-1 transform transition-transform duration-300 translate-z-10">ISO & NCDMB</div>
                      <div className="text-xs text-gray-600">International Quality Standards</div>
                    </Card3D>
                  </div>
                </div>

                <Card3D className="bg-zinc-950 p-8 rounded-3xl text-white border border-zinc-800 shadow-2xl relative overflow-hidden preserve-3d">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl"></div>
                  <h3 className="text-2xl font-bold mb-4 text-white transform transition-transform duration-300 translate-z-10">Global Engagement Charter</h3>
                  <ul className="space-y-4 text-zinc-300 text-sm transform transition-transform duration-300 translate-z-5">
                    <li className="flex items-start gap-3">
                      <FontAwesomeIcon name="fa-solid fa-circle-check" className="text-red-500 text-base mt-0.5" />
                      <span>Drive technology and knowledge transfer between international energy hubs and regional assets.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <FontAwesomeIcon name="fa-solid fa-circle-check" className="text-red-500 text-base mt-0.5" />
                      <span>Establish joint research initiatives across our 5 R&D Centres of Excellence.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <FontAwesomeIcon name="fa-solid fa-circle-check" className="text-red-500 text-base mt-0.5" />
                      <span>Structure multi-year workforce decarbonisation and ESG advisory programs.</span>
                    </li>
                  </ul>

                  <div className="mt-8 pt-6 border-t border-zinc-800 flex items-center justify-between transform transition-transform duration-300 translate-z-10">
                    <span className="text-xs text-zinc-400">PANA Institute · Global Governance</span>
                    <Link to="/contact">
                      <Button className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2">
                        Reach Out
                      </Button>
                    </Link>
                  </div>
                </Card3D>
              </div>
            </div>
          </section>

          {/* Pillars Section */}
          <section id="pillars" className="py-20 bg-gray-50 relative overflow-hidden bg-grid-3d">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="text-red-600 font-bold text-xs uppercase tracking-wider mb-2">Our Operating Pillars</div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Core Dimensions of Global Engagement</h2>
                <p className="text-gray-600 leading-relaxed">
                  How PANA Institute partners with international energy corporations, development agencies, and academic institutions.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {globalPillars.map((pillar, idx) => (
                  <Card3D key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300 preserve-3d">
                    <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600 mb-6 transform transition-transform duration-300 translate-z-12 shadow-3d-sm">
                      <FontAwesomeIcon name={pillar.icon} className="text-xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 transform transition-transform duration-300 translate-z-10">{pillar.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 transform transition-transform duration-300 translate-z-5">{pillar.desc}</p>
                    <ul className="space-y-2 border-t border-gray-100 pt-4 transform transition-transform duration-300 translate-z-5">
                      {pillar.bullets.map((b, bi) => (
                        <li key={bi} className="flex items-center gap-2 text-xs text-gray-700">
                          <FontAwesomeIcon name="fa-solid fa-angle-right" className="text-red-600 text-[10px]" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </Card3D>
                ))}
              </div>
            </div>
          </section>

          {/* Global Hubs Section */}
          <section id="hubs" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="text-red-600 font-bold text-xs uppercase tracking-wider mb-2">International Presence</div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Global Operating Hubs</h2>
                <p className="text-gray-600 leading-relaxed">
                  Engage with PANA Institute through our strategic offices across West Africa, East Africa, and the Middle East.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {globalHubs.map((hub, idx) => (
                  <Card3D key={idx} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 flex flex-col justify-between hover:border-red-600 transition-colors preserve-3d">
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-xs mb-4 transform transition-transform duration-300 translate-z-12 shadow-3d-sm">
                        {hub.city[0]}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1 transform transition-transform duration-300 translate-z-10">{hub.city}</h3>
                      <p className="text-xs font-semibold text-red-600 mb-3 transform transition-transform duration-300 translate-z-5">{hub.country}</p>
                      <p className="text-xs text-gray-600 leading-relaxed mb-4 transform transition-transform duration-300 translate-z-5">{hub.address}</p>
                    </div>
                    <div className="transform transition-transform duration-300 translate-z-5">
                      {hub.tel && (
                        <p className="text-xs font-bold text-gray-900 mb-2">Tel: {hub.tel}</p>
                      )}
                      <span className="inline-block px-3 py-1 rounded-full bg-zinc-200 text-zinc-800 text-[11px] font-medium">
                        {hub.role}
                      </span>
                    </div>
                  </Card3D>
                ))}
              </div>
            </div>
          </section>

          {/* Partnership CTA */}
          <section id="contact" className="py-20 bg-red-600 text-white text-center">
            <div className="max-w-4xl mx-auto px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Partner on Global Engagements?</h2>
              <p className="text-red-100 max-w-2xl mx-auto mb-8 text-base leading-relaxed">
                Connect with our international Directorate to discuss cross-border workforce development, joint R&D consortia, or operating model advisory.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/contact">
                  <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 font-bold px-8">
                    Contact Global Directorate
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10 font-semibold px-8">
                    Explore Our Institute
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Dynamic Page Sections from CMS Page Builder */}
          <DynamicPageSections slug="global-engagements" />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default GlobalEngagementsPage;
