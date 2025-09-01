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
    id: "igilar-chukwuemeka",
    name: "Mr. Igilar Chukwuemeka",
    title: "Vice President, Synergy E&P",
    subtitle: "Technical Sales & Business Growth Leader",
    description: "A visionary leader with over 15 years of experience in technical sales and business development. Specializes in driving growth and innovation in the energy sector.",
    fullBio: "Mr. Igilar Chukwuemeka is a seasoned executive with a proven track record in technical sales and business development. With over 15 years of experience in the energy sector, he has successfully led numerous high-value projects and strategic initiatives. His expertise lies in identifying new business opportunities, building strong client relationships, and driving revenue growth. Mr. Chukwuemeka holds an MBA in Business Administration and is known for his innovative approach to solving complex business challenges.",
    experience: [
      "15+ years in technical sales and business development",
      "Expertise in energy sector growth strategies",
      "Proven track record in client relationship management"
    ]
  },
  {
    id: "sylvia-agbamuche-maduka",
    name: "Dr. Sylvia Agbamuche‑Maduka",
    title: "Vice President",
    subtitle: "Global Business Services",
    description: "Seasoned executive with a Ph.D. in Business Administration. Leads our global operations with a focus on operational excellence and customer satisfaction.",
    fullBio: "Dr. Sylvia Agbamuche‑Maduka is a distinguished executive with a Ph.D. in Business Administration. She brings over 20 years of experience in global operations and business strategy. Dr. Agbamuche‑Maduka has a strong background in driving operational excellence and implementing best practices across international markets. Her leadership has been instrumental in scaling operations and improving customer satisfaction metrics across all regions. She is a published author and frequent speaker at international business conferences.",
    experience: [
      "20+ years in global operations",
      "Ph.D. in Business Administration",
      "Expert in operational excellence"
    ]
  },
  {
    id: "lalit-zavar",
    name: "Mr. Lalit Zavar",
    title: "VP AKD Digital",
    subtitle: "Digital Transformation Leader",
    description: "Technology strategist with a passion for digital innovation. Leads our digital transformation initiatives and technology partnerships.",
    fullBio: "Lalit Zavar is a technology visionary with over 18 years of experience in digital transformation and technology strategy. As VP of AKD Digital, he leads the company's digital innovation initiatives and strategic technology partnerships. Mr. Zavar has a unique ability to bridge the gap between business needs and technological solutions, having led successful digital transformation projects for Fortune 500 companies. He holds multiple certifications in emerging technologies and is a sought-after advisor for digital strategy.",
    experience: [
      "18+ years in digital transformation",
      "Expert in technology strategy",
      "Leader in digital innovation"
    ]
  },
  {
    id: "domotimi-leghemo",
    name: "Mr. Domotimi Leghemo",
    title: "General Manager",
    subtitle: "PANA Infrastructure",
    description: "Infrastructure expert with extensive experience in managing complex technical operations and large-scale projects across multiple regions.",
    fullBio: "Domotimi Leghemo is a results-driven General Manager with over 25 years of experience in infrastructure development and technical operations. His expertise spans across project management, operational strategy, and team leadership in complex, multi-stakeholder environments. Mr. Leghemo has successfully overseen the delivery of large-scale infrastructure projects across multiple regions, consistently meeting or exceeding performance targets. He holds a Master's degree in Civil Engineering and is a certified Project Management Professional (PMP).",
    experience: [
      "25+ years in infrastructure management",
      "Expert in large-scale project delivery",
      "PMP certified professional"
    ]
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
