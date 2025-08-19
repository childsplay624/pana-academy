import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Users, BarChart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const courses = [
  {
    id: 1,
    title: "Advanced Project Management",
    description: "Master project management methodologies and tools to deliver projects on time and within budget.",
    duration: "8 weeks",
    students: "1200+",
    level: "Advanced",
    category: "Leadership"
  },
  {
    id: 2,
    title: "Digital Transformation Strategy",
    description: "Learn to lead digital transformation initiatives and drive innovation in your organization.",
    duration: "6 weeks",
    students: "850+",
    level: "Intermediate",
    category: "Digital"
  },
  {
    id: 3,
    title: "Renewable Energy Fundamentals",
    description: "Gain a comprehensive understanding of renewable energy technologies and their applications.",
    duration: "4 weeks",
    students: "1500+",
    level: "Beginner",
    category: "Energy"
  },
  {
    id: 4,
    title: "Data Analytics for Business",
    description: "Develop data-driven decision making skills using modern analytics tools and techniques.",
    duration: "10 weeks",
    students: "2000+",
    level: "Intermediate",
    category: "Digital"
  },
  {
    id: 5,
    title: "Leadership in Tech",
    description: "Develop leadership skills specifically tailored for technology-driven environments.",
    duration: "6 weeks",
    students: "950+",
    level: "Advanced",
    category: "Leadership"
  },
  {
    id: 6,
    title: "Oil & Gas Operations",
    description: "Comprehensive overview of upstream, midstream, and downstream operations in the oil and gas industry.",
    duration: "8 weeks",
    students: "1750+",
    level: "Intermediate",
    category: "Energy"
  }
];

const CoursesSection = ({ showAll = false }) => {
  const displayCourses = showAll ? courses : courses.slice(0, 4);

  return (
    <section id="courses" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-pana-navy mb-4">Our Courses</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our comprehensive range of professional development programs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayCourses.map((course) => (
            <Card key={course.id} className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="h-2 bg-gradient-to-r from-pana-navy to-pana-blue"></div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-block px-3 py-1 text-xs font-semibold text-pana-navy bg-pana-light-gray rounded-full mb-2">
                      {course.category}
                    </span>
                    <CardTitle className="text-xl">{course.title}</CardTitle>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-pana-gold/10 text-pana-gold rounded">
                    {course.level}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{course.description}</p>
                <div className="flex items-center justify-between text-sm text-muted-foreground mt-4 pt-4 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>{course.students}</span>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs">
                    Enroll Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!showAll && (
          <div className="text-center mt-12">
            <Link to="/courses">
              <Button variant="outline" size="lg" className="border-pana-navy text-pana-navy hover:bg-pana-navy hover:text-white">
                View All Courses
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default CoursesSection;
