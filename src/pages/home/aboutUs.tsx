import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  Target,
  Heart,
  Award,
  Globe,
  Shield,
  Star,
  Calendar,
  MapPin,
  ChevronDown,
  Play,
  Trophy,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AboutUs: React.FC = () => {
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);
  const [animatedStats, setAnimatedStats] = useState([0, 0, 0, 0]);

  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "To revolutionize sports accessibility by connecting players with premium facilities through innovative technology.",
    },
    {
      icon: Heart,
      title: "Our Passion",
      description:
        "We're driven by our love for sports and commitment to creating unforgettable playing experiences for everyone.",
    },
    {
      icon: Shield,
      title: "Our Promise",
      description:
        "We guarantee seamless bookings, secure payments, and exceptional support for all our users.",
    },
    {
      icon: Globe,
      title: "Our Vision",
      description:
        "To become the world's most trusted platform for sports enthusiasts and facility owners alike.",
    },
  ];

  // Handle scroll for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animate stats when they come into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate stats counting up
            const duration = 2000; // 2 seconds
            const interval = 20; // update every 20ms
            const steps = duration / interval;

            stats.forEach((stat, index) => {
              let step = 0;
              const increment = stat.value / steps;

              const timer = setInterval(() => {
                step += 1;
                const currentValue = Math.min(
                  Math.floor(increment * step),
                  stat.value
                );

                setAnimatedStats((prev) => {
                  const newStats = [...prev];
                  newStats[index] =
                    index === 3
                      ? currentValue === stat.value
                        ? stat.value
                        : Number((increment * step).toFixed(1))
                      : currentValue;
                  return newStats;
                });

                if (step >= steps) {
                  clearInterval(timer);
                }
              }, interval);
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Banner with CTA-style animation */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-green-700 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-40 h-40 border-4 border-emerald-400 rounded-full opacity-20 animate-ping"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 border-4 border-emerald-400 rounded-full opacity-20 animate-ping animation-delay-2000"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            About <span className="text-emerald-300">ThangGo</span>
          </h1>
          <p className="text-lg md:text-xl mb-0 max-w-2xl mx-auto">
            Revolutionizing the way players connect with premium sports
            facilities
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-20 left-20 w-40 h-40 border-4 border-emerald-500 rounded-full"></div>
          <div className="absolute bottom-40 right-32 w-32 h-32 border-4 border-emerald-500 rounded-full"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="text-lg leading-relaxed">
                  Founded in 2023, ThangGo emerged from a simple observation:
                  sports enthusiasts struggled to find and book quality playing
                  facilities, while ground owners faced challenges in managing
                  their bookings efficiently.
                </p>
                <p className="text-lg leading-relaxed">
                  What started as a solution to connect players with nearby
                  grounds has evolved into a comprehensive platform that serves
                  thousands of users across multiple cities, offering seamless
                  booking experiences and building vibrant sports communities.
                </p>
                <p className="text-lg leading-relaxed">
                  Today, we're proud to be at the forefront of sports technology
                  innovation, continuously enhancing our platform to deliver
                  exceptional value to both players and facility owners.
                </p>
              </div>
            </div>
            <div className="relative" data-aos="fade-left" data-aos-delay="200">
              <div className="bg-emerald-600 rounded-2xl p-6 text-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="transform -rotate-2">
                  <Award className="h-12 w-12 mb-4 text-emerald-300" />
                  <blockquote className="text-xl italic mb-4">
                    "ThangGo has transformed how we manage our facilities and
                    serve our players. It's been a game-changer for our
                    business."
                  </blockquote>
                  <p className="font-semibold">— Sports Facility Owner</p>
                </div>
              </div>
              <div className="absolute -z-10 top-4 left-4 w-full h-full bg-emerald-300 rounded-2xl opacity-30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white relative">
        {/* Floating elements */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-emerald-100 rounded-full opacity-50 animate-float"></div>
        <div className="absolute bottom-20 left-10 w-16 h-16 bg-emerald-200 rounded-full opacity-30 animate-float animation-delay-2000"></div>

        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at ThangGo
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center group p-6 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-all duration-300 hover:-translate-y-2"
                data-aos="zoom-in"
                data-aos-delay={index * 100}
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-600 transition-all duration-300 shadow-md group-hover:shadow-lg">
                  <value.icon className="h-8 w-8 text-emerald-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-green-700 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-40 h-40 border-4 border-emerald-400 rounded-full opacity-20 animate-ping"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 border-4 border-emerald-400 rounded-full opacity-20 animate-ping animation-delay-2000"></div>
        </div>

        <div
          className="max-w-4xl mx-auto px-4 text-center relative z-10"
          data-aos="zoom-in"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join the ThangGo Community
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Whether you're a player looking for the perfect ground or a facility
            owner wanting to reach more customers, we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/")}
              className="px-8 py-4 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Start Booking Now
            </button>
            <button
              onClick={() => navigate("/contactus")}
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-emerald-600 transition-all duration-300 transform hover:scale-105"
            >
              List Your Ground
            </button>
          </div>
        </div>
      </section>

      {/* Add CSS for custom animations */}
      <style jsx>{`
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes ping {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          75%,
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .animate-ping {
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default AboutUs;
