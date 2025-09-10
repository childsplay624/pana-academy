import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { TrainingCalendar } from "@/components/TrainingCalendar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// Mock data - replace with actual API call in production
const mockCourses = [
  {
    id: "1",
    title: "Advanced Project Management",
    description: "Master advanced project management techniques and methodologies.",
    startDate: "2025-10-15T09:00:00",
    endDate: "2025-10-20T17:00:00",
    category: "Project Management",
    location: "Virtual",
    duration: "5 days",
    capacity: 20,
    enrolled: 12,
    level: 'Advanced' as const,
  },
  {
    id: "2",
    title: "Digital Transformation Fundamentals",
    description: "Learn the core concepts of digital transformation in modern businesses.",
    startDate: "2025-10-18T10:00:00",
    endDate: "2025-10-22T16:00:00",
    category: "Digital Skills",
    location: "Lagos Office",
    duration: "5 days",
    capacity: 15,
    enrolled: 8,
    level: 'Intermediate' as const,
  },
  {
    id: "3",
    title: "Leadership in Tech",
    description: "Develop essential leadership skills for technology professionals.",
    startDate: "2025-11-01T09:30:00",
    endDate: "2025-11-05T16:30:00",
    category: "Leadership",
    location: "Virtual",
    duration: "5 days",
    capacity: 25,
    enrolled: 18,
    level: 'Advanced' as const,
  },
  {
    id: "4",
    title: "Data Analytics Bootcamp",
    description: "Intensive training on data analysis and visualization techniques.",
    startDate: "2025-11-10T09:00:00",
    endDate: "2025-11-15T17:00:00",
    category: "Data Science",
    location: "Abuja Office",
    duration: "6 days",
    capacity: 18,
    enrolled: 10,
    level: 'Beginner' as const,
  },
];

const TrainingCalendarPage = () => {
  const handleDateSelect = (date: Date) => {
    // Handle date selection if needed
    console.log("Selected date:", date);
  };

  return (
    <>
      <Helmet>
        <title>Training Calendar | PANA Academy</title>
        <meta name="description" content="View and manage upcoming training programs with our interactive training calendar." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-subtle">
        <Navigation />
        
        {/* Header with Image */}
        <div className="relative h-64 w-full overflow-hidden bg-pana-navy">
          <div className="absolute inset-0 bg-gradient-to-r from-pana-navy/90 to-pana-gold/30 z-10">
            <div className="container mx-auto h-full flex items-center px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl text-white">
                <h1 className="text-4xl font-bold mb-4">Training Calendar</h1>
                <p className="text-lg text-gray-100">
                  Explore our upcoming training programs and enhance your skills with industry experts.
                </p>
              </div>
            </div>
          </div>
          <div 
            className="absolute inset-0 bg-cover bg-center z-0 opacity-30"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80")',
            }}
          />
        </div>
        
        <main className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-pana-navy">Upcoming Programs</h1>
                <p className="mt-1 text-gray-600">
                  Browse and register for upcoming training sessions
                </p>
              </div>
              <Button className="mt-4 md:mt-0 bg-pana-gold hover:bg-pana-gold/90 text-pana-navy">
                <Plus className="w-4 h-4 mr-2" />
                Add New Course
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow p-6">
                  <TrainingCalendar 
                    courses={mockCourses} 
                    onDateSelect={handleDateSelect} 
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">Upcoming Trainings</h2>
                  <div className="space-y-4">
                    {mockCourses.slice(0, 3).map((course) => (
                      <div key={course.id} className="border-l-4 border-pana-gold pl-4 py-2">
                        <h3 className="font-medium">{course.title}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(course.startDate).toLocaleDateString()} - {new Date(course.endDate).toLocaleDateString()}
                        </p>
                        <span className="inline-block mt-1 px-2 py-1 text-xs bg-pana-navy/10 text-pana-navy rounded-full">
                          {course.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">Categories</h2>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(mockCourses.map(course => course.category))).map((category) => (
                      <span 
                        key={category}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default TrainingCalendarPage;
