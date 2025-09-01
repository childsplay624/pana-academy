import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const TrainingDelivery = () => {
  return (
    <>
      <Helmet>
        <title>Training Delivery | PANA Academy - Excellence in Learning</title>
        <meta name="description" content="Discover PANA Academy's comprehensive training delivery methods, modern technology platforms, and international standard learning environments designed for maximum impact." />
        <meta name="keywords" content="training delivery, learning management system, virtual classroom, training methods, PANA Academy" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="pt-20">
          {/* Hero Section */}
          <section className="py-16 bg-gradient-to-r from-pana-navy to-pana-blue">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Training Delivery
                </h1>
                <p className="text-xl text-white/90 max-w-3xl mx-auto">
                  Innovative methods and approaches designed to maximize learning impact and organizational success
                </p>
              </div>
            </div>
          </section>

          {/* Content Section */}
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <div className="prose prose-lg mx-auto">
                  <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
                    At PANA Academy, training delivery refers to the methods and approaches we use to present learning content and facilitate competency/skill development. We carefully choose our training delivery methods to maximize the impact and effectiveness of our training programs for improved employee performance and organizational success and sustainability.
                  </p>

                  <div className="space-y-16">
                    {/* Training Methods */}
                    <article>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-pana-gold/10 rounded-lg flex items-center justify-center">
                          <span className="text-2xl font-bold text-pana-gold">i.</span>
                        </div>
                        <h2 className="text-3xl font-bold text-foreground">Our Training Methods</h2>
                      </div>
                      <div className="bg-card p-6 rounded-lg border">
                        <p className="text-muted-foreground">
                          Our comprehensive training methods are designed to accommodate different learning styles and professional needs. We employ a blend of traditional and innovative approaches to ensure maximum knowledge retention and practical application.
                        </p>
                      </div>
                    </article>

                    {/* Training Approach */}
                    <article>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-pana-blue/10 rounded-lg flex items-center justify-center">
                          <span className="text-2xl font-bold text-pana-blue">ii.</span>
                        </div>
                        <h2 className="text-3xl font-bold text-foreground">Our Training Approach</h2>
                      </div>
                      <div className="bg-card p-6 rounded-lg border">
                        <p className="text-muted-foreground">
                          We adopt a learner-centered approach that emphasizes practical application, interactive engagement, and continuous assessment. Our methodology ensures that participants can immediately apply their new skills in real-world scenarios.
                        </p>
                      </div>
                    </article>

                    {/* Training Technology and Platforms */}
                    <article>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-pana-navy/10 rounded-lg flex items-center justify-center">
                          <span className="text-2xl font-bold text-pana-navy">iii.</span>
                        </div>
                        <h2 className="text-3xl font-bold text-foreground">Training Technology and Platforms</h2>
                      </div>
                      <div className="bg-card p-6 rounded-lg border">
                        <p className="text-muted-foreground leading-relaxed">
                          We use a wide range of modern technologies and digital platforms such as Learning Management Systems (LMS), interactive virtual classrooms, mobile learning applications and physical learning facilities to deliver flexible, accessible, and engaging learning experiences. These tools empower learners to access content anytime, anywhere, and at their own pace, fostering self-directed learning, improving retention, and ensuring training is adaptable to diverse schedules and learning preferences.
                        </p>
                      </div>
                    </article>

                    {/* Learning Environment */}
                    <article>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-pana-gold/10 rounded-lg flex items-center justify-center">
                          <span className="text-2xl font-bold text-pana-gold">iv.</span>
                        </div>
                        <h2 className="text-3xl font-bold text-foreground">Learning Environment</h2>
                      </div>
                      <div className="bg-card p-6 rounded-lg border space-y-4">
                        <p className="text-muted-foreground leading-relaxed">
                          We have both physical and virtual learning environments that are of international standard, designed to facilitate learner engagement such that training delivery aligns with international best practices. We have well-ventilated, ergonomically designed training spaces with adequate lighting and climate control for comfort and flexible seating arrangements to support both collaborative and independent learning.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                          Our training contents are aligned with internationally recognized qualifications, certifications, and industry needs and training sessions are facilitated by experienced and/or certified industry experts.
                        </p>
                      </div>
                    </article>
                  </div>

                  {/* Call to Action */}
                  <div className="mt-16 text-center bg-gradient-to-r from-pana-navy/5 to-pana-blue/5 p-8 rounded-lg">
                    <h3 className="text-2xl font-bold text-foreground mb-4">
                      Ready to Experience Our Training Excellence?
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Join thousands of professionals who have transformed their careers through our world-class training delivery methods.
                    </p>
                    <a 
                      href="#contact" 
                      className="inline-flex items-center px-6 py-3 bg-pana-gold text-white font-semibold rounded-lg hover:bg-pana-gold/90 transition-colors"
                    >
                      Get Started Today
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default TrainingDelivery;