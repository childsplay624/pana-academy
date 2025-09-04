import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const teamMembers = [
  {
    id: "daere-akobo",
    name: "Dr. Daere Afonya-a Akobo, FCIoD (London)",
    title: "Chairman and Group CEO",
    subtitle: "PANA Holdings",
    description: "Visionary entrepreneur and business leader with over 25 years of experience across multiple industries including oil & gas, power, and technology.",
    fullBio: "Dr. Daere Akobo, FCIoD (London) is a visionary entrepreneur, business mentor, and philanthropist celebrated for his unwavering commitment to excellence and innovation. As the Chairman and Group CEO of PANA Holdings, he oversees a dynamic portfolio of companies, including PE Energy Ltd, Synergy E&P Ltd, AKD Digital Solutions, PE Goldland, PANA Academy, PANA Infrastructure, Afriksnus, Ataraxia, Diplomatic Village Limited (DVL), and the Daere Afonya-a Akobo Foundation (DAAF). Through DAAF, Dr. Akobo is deeply dedicated to giving back to the community, empowering the less privileged, and driving meaningful social impact. In business, his bold, creative, and innovative mindset enables him to tackle complex challenges, deliver transformative solutions, and inspire growth across industries.",
    experience: [
      "Over 25 years of experience in electrical engineering and flow measurement",
      "Former Electrical and Instrumentation Superintendent at International Petroleum of Nigeria",
      "Recognized as African Continental Top Talent at General Electric (GE)",
      "Extensive business portfolio across multiple industries including power, water technology, and IT"
    ],
    image: "/team/daere-akobo.jpg"
  },
  {
    id: "iyenemi-akobo",
    name: "Mrs. Iyenemi Akobo",
    title: "Executive Director",
    subtitle: "Global Business Services",
    description: "Seasoned business administrator with international training and expertise in corporate governance and business administration.",
    fullBio: "Mrs. Iyenemi Akobo has been the backbone of the entire organization since its inception. With a background in Business Administration and CLE training in various international institutions in London, Dubai, Switzerland and Harvard, she is an alumna of the prestigious IMD Business School. She is a central figure in the administration of the group and a valued contributor to the growth of the business structure. She has held and efficiently managed key positions enabling and spurring the growth vision of the Chairman. She is the Executive Director (ED) for the Global Business Services unit, additionally supervising HR, Commercial Services and part of the Accounting functions. She is also driving the implementation of all Corporate Governance requirements on the ground together with a dedicated team of professionals.",
    experience: [
      "Extensive training in Business Administration and CLE from top international institutions",
      "Alumna of IMD Business School",
      "Expertise in corporate governance and business administration",
      "Key role in implementing corporate governance requirements"
    ],
    image: "/team/iyenemi-akobo.jpg"
  },
  {
    id: "callista-azogu",
    name: "Mrs. Callista C. Azogu",
    title: "Board Member",
    subtitle: "Former Deputy Managing Director, NAOC",
    description: "Accomplished executive with extensive experience in the oil and gas industry, specializing in finance, HR, and corporate governance.",
    fullBio: "Mrs. Callista C. Azogu attended FGGC Gboko and University of Ilorin, bagging MSc. in Managerial Accounting, BSc. Accounting & Finance. She joined Nigerian Agip Oil Company Limited (NAOC) in August 1996 as a Budget Analyst and rose through the ranks working through various professional areas in the Oil and Gas sector within the Eni ('AGIP') group locally and abroad. Her experiences span topmost level industry advocacy, Accounting, Finance, Nigerian content, Human Resources, Administration, and Commercial. She became a director of the company in 2015 and rose to the position of Deputy Managing Director from 2018 to August 2022 (Retirement date). In addition, she held the position of General Manager Human Resources & Organization of the Company from 2015 to 2022. She is the first female to hold the position in the over 60 years of existence of the Company. She won the award of the first Nigerian Content Operator of the year for the Company and received the PETAN Chairman's Outstanding Achievement Recognition Award for Nigerian content in 2015. She was also a director of the Nigerian Agip Closed Pension Fund Ltd from 2015 to August 2022.",
    experience: [
      "Former Deputy Managing Director, Nigerian Agip Oil Company Limited (NAOC)",
      "Over 25 years of experience in the oil and gas industry",
      "Fellow of the Institute of Chartered Accountants of Nigeria",
      "Recipient of PETAN Chairman's Outstanding Achievement Recognition Award"
    ],
    image: "/team/callista-azogu.jpg"
  },
  {
    id: "ifeyinwa-achumba",
    name: "Dr. Ifeyinwa Eucharia Achumba",
    title: "Advisory Board Member",
    subtitle: "MNCS, MNSE, COREN Reg, CPN Reg, MIEEE, FFTF Fellow",
    description: "Experienced academic and industry professional with expertise in STEM education and industry-academia partnerships.",
    fullBio: "Dr. Ifeyinwa Eucharia Achumba is an accomplished academic and industry professional with over twenty-five years of university service in various capacities including Head of Department (Electrical and Electronic Engineering), Head of Department (Computer Engineering), University Senate member, and Director of Information and Communication Technology (DICT). Her teaching efforts are geared towards producing graduate entrepreneurs and industry-ready graduates. She is a passionate advocate for Academia-Industry Partnerships (AIP) and a strong proponent of increasing female participation in STEM fields.",
    experience: [
      "Over 25 years of university service in various academic and administrative roles",
      "PhD from the University of Portsmouth, United Kingdom with Postdoctoral research experience",
      "Current Chair of the Institute of Electrical and Electronic Engineers (IEEE) Nigeria Section",
      "Intellectual Property Commissioner for Oil and Gas Trainers Association of Nigeria (OGTAN)",
      "Active participant in Oil & Gas National Occupational Standards (NOS) development",
      "Member of the Sector Working Group (SWG) on Education for NCDMB"
    ],
    image: "/team/Ifeyinwa-Eucharia.jpg"
  },
  {
    id: "kennedy-dike",
    name: "Kennedy Okechukwu Dike MCIPM, HRPL, FSM, FMCI",
    title: "Advisory Board Member",
    subtitle: "PANA Academy",
    description: "Seasoned HR practitioner with vast experience in Oil & Gas, Manufacturing, and Corporate Governance.",
    fullBio: "Kennedy Okechukwu Dike MCIPM, HRPL, FSM, FMCI is a seasoned Human Resources practitioner with vast experience spanning Oil & Gas, Manufacturing, Shipping, International Freight Logistics, Business Sustainability and Corporate governance. As certified HR Manager, he is licensed to practice Human Resources in Nigeria by the Chartered Institute of Personnel Management (CIPMN) the apex regulatory body for human resources practice Nigeria. He is also a member of the Society for Corporate Governance in Nigeria and currently the GM, Global Business Services PANA Holdings. Before joining PANA Holdings, he worked for Belemaoil Producing Ltd, Notore Chemical Industries Plc, The Oiltest Group and Ideke Shipping Ltd working in partnership with Hellmann Worldwide Logistics. Mr. Dike had served as a member of the Governing Council of the University of Calabar and Governing Council of the Chartered Institute of Personnel Management Nigeria (CIPMN). He is presently a member of the Board of Trustees of a number of organizations. He is the Rivers State Branch Chairman of Learning & Development Network International LDNI; Fellow Mentoring and Career Development Institute of Nigeria; Fellow, Institute of Strategic Management Nigeria (Chartered) and Fellow Chartered Business Institute London.",
    experience: [
      "GM, Global Business Services PANA Holdings",
      "Former member of Governing Council, University of Calabar",
      "Fellow, Institute of Strategic Management Nigeria",
      "Extensive experience in HR, corporate governance, and business sustainability"
    ],
    image: "/team/kennedy-dike.jpg"
  }
];

export default function TeamMemberPage() {
  const { memberId } = useParams<{ memberId: string }>();
  const [member, setMember] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const foundMember = teamMembers.find(m => m.id === memberId);
    setMember(foundMember);
  }, [memberId]);

  if (!isMounted) return null;
  if (!member) return <div>Team member not found</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Navigation />
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Button 
              asChild 
              variant="ghost" 
              className="mb-6 hover:bg-blue-50"
            >
              <Link to="/team" className="flex items-center text-blue-600">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Team
              </Link>
            </Button>

            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 h-48 relative">
                <div className="absolute -bottom-16 left-8">
                  <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                    <AvatarImage src={member.image} alt={member.name} />
                    <AvatarFallback className="text-3xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>

              <CardHeader className="pt-20 px-8">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-3xl font-bold text-gray-900">{member.name}</CardTitle>
                    <p className="text-lg font-medium text-blue-600">{member.title}</p>
                    {member.subtitle && <p className="text-gray-500">{member.subtitle}</p>}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="px-8 pb-8">
                <div className="prose max-w-none">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Biography</h3>
                  <p className="text-gray-700 mb-8">{member.fullBio || member.description}</p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Experience</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    {member.experience?.map((exp: string, index: number) => (
                      <li key={index}>{exp}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
