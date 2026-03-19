import React, { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  User,
  ChevronDown,
  Star,
  Users,
  Calendar,
  Trophy,
} from "lucide-react";
import axios from "axios";
import { base_url } from "../../types/ground";

type FormValues = {
  name: string;
  email: string;
  message: string;
  phone?: string;
  subject?: string;
};

const ContactUs: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      console.log("Form data:", data);
      // Simulate API call
      await axios.post(`${base_url}/users/contactus`, data);

      setIsSubmitted(true);
      reset();

      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      content: "thanggodotcom@gmail.com",
      description: "Send us an email anytime",
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+975-17495130",
      description: "Mon-Fri from 8am to 6pm",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      content: "Zilukha, Thimphu, Bhutan",
      description: "Come say hello at our office",
    },
    {
      icon: Clock,
      title: "Response Time",
      content: "Within 24 hours",
      description: "We'll get back to you quickly",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Banner Section - Added pt-24 to account for fixed navbar */}
      <section className="relative bg-gradient-to-r from-emerald-900 via-green-800 to-emerald-900 text-white overflow-hidden pt-24 pb-20">
        {/* Animated background elements */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-0 left-0 w-72 h-72 bg-green-600 rounded-full filter blur-3xl animate-ping-slow"></div>
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-emerald-500 rounded-full filter blur-3xl animate-float"></div>
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-green-700 rounded-full filter blur-3xl animate-pulse-slow"></div>
        </div>

        {/* Sports field pattern overlay */}
        <div className="absolute inset-0 z-0 opacity-10">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-1 bg-white animate-line-appear"
              style={{
                top: `${i * 10}%`,
                animationDelay: `${i * 0.1}s`,
              }}
            ></div>
          ))}
          <div
            className="absolute top-1/2 left-0 w-full h-2 bg-white transform -translate-y-1/2 animate-line-appear"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 w-40 h-40 border-4 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-circle-appear"
            style={{ animationDelay: "1.2s" }}
          ></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <h1
            className={`text-5xl md:text-6xl font-bold mb-6 transition-all duration-1000 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            CONNECT WITH{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-400 animate-text-shimmer">
              THANGGO
            </span>
          </h1>
          <p
            className={`text-xl md:text-2xl max-w-3xl mx-auto mb-8 leading-relaxed transition-all duration-1000 delay-300 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            Your gateway to exceptional sports experiences. We're here to help
            you play, book, and enjoy.
          </p>

          {/* Stats counter */}
          <div
            className={`flex justify-center space-x-8 md:space-x-12 lg:space-x-16 mb-12 transition-all duration-1000 delay-500 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            {[{ number: "24/7", label: "Support", icon: Clock }].map(
              (stat, index) => (
                <div
                  key={index}
                  className="text-center animate-stats-appear"
                  style={{ animationDelay: `${0.7 + index * 0.2}s` }}
                >
                  <div className="flex items-center justify-center mb-2">
                    <stat.icon className="h-5 w-5 text-emerald-300 mr-2" />
                    <div className="text-2xl md:text-3xl font-bold text-emerald-300">
                      {stat.number}
                    </div>
                  </div>
                  <div className="text-sm text-emerald-200">{stat.label}</div>
                </div>
              )
            )}
          </div>

          <div
            className={`animate-bounce transition-all duration-1000 delay-1000 ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
          >
            <ChevronDown className="h-8 w-8 mx-auto text-emerald-300 opacity-80" />
          </div>
        </div>

        <style>{`
          @keyframes slide-up {
            0% { transform: translateY(30px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          
          @keyframes ping-slow {
            0% { transform: scale(0.8); opacity: 0.8; }
            75%, 100% { transform: scale(2.5); opacity: 0; }
          }
          
          @keyframes pulse-slow {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.4; }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0) translateX(0); }
            50% { transform: translateY(-20px) translateX(10px); }
          }
          
          @keyframes text-shimmer {
            0% { background-position: -100% 0; }
            100% { background-position: 200% 0; }
          }
          
          @keyframes line-appear {
            0% { width: 0; opacity: 0; }
            100% { width: 100%; opacity: 1; }
          }
          
          @keyframes circle-appear {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          }
          
          @keyframes stats-appear {
            0% { transform: translateY(20px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          
          .animate-slide-up { animation: slide-up 1s ease-out forwards; }
          .animate-ping-slow { animation: ping-slow 4s cubic-bezier(0, 0, 0.2, 1) infinite; }
          .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
          .animate-float { animation: float 8s ease-in-out infinite; }
          .animate-text-shimmer { 
            background: linear-gradient(90deg, #86efac, #10b981, #86efac);
            background-size: 200% 100%;
            animation: text-shimmer 3s linear infinite;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .animate-line-appear { animation: line-appear 0.8s ease-out forwards; }
          .animate-circle-appear { animation: circle-appear 1s ease-out forwards; }
          .animate-stats-appear { 
            opacity: 0;
            animation: stats-appear 0.8s ease-out forwards;
          }
        `}</style>
      </section>

      {/* Rest of the component remains the same */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get in <span className="text-emerald-600">Touch</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you. Fill out the
            form below and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Contact Information
              </h2>
              <p className="text-gray-600 mb-8">
                We're here to help you with any questions about our platform,
                bookings, or partnerships. Reach out through any channel below.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center group-hover:bg-emerald-600 transition-colors duration-300">
                    <item.icon className="h-6 w-6 text-emerald-600 group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-emerald-600 font-medium">
                      {item.content}
                    </p>
                    <p className="text-gray-500 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ Quick Links */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Help</h3>
              <ul className="space-y-2">
                <li className="text-emerald-600 hover:text-emerald-700 cursor-pointer">
                  • How to book a ground?
                </li>
                <li className="text-emerald-600 hover:text-emerald-700 cursor-pointer">
                  • Payment issues
                </li>
                <li className="text-emerald-600 hover:text-emerald-700 cursor-pointer">
                  • Cancellation policy
                </li>
                <li className="text-emerald-600 hover:text-emerald-700 cursor-pointer">
                  • Become a partner ground
                </li>
              </ul>
              <h2 className="font-semibold text-gray-900 mb-4">
                You can contact us if you have any query related to above
                mentioned things.
              </h2>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                <MessageSquare className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Send us a Message
                </h2>
                <p className="text-gray-600">We'll respond within 24 hours</p>
              </div>
            </div>

            {isSubmitted && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6 flex items-center">
                <CheckCircle className="h-5 w-5 text-emerald-600 mr-2" />
                <span className="text-emerald-700">
                  Message sent successfully! We'll get back to you soon.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 flex items-center">
                  <User className="h-4 w-4 mr-2 text-emerald-600" />
                  Full Name
                </label>
                <input
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                  type="text"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.name
                      ? "border-red-500 focus:ring-red-500 bg-red-50"
                      : "border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-emerald-600" />
                  Email Address
                </label>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value:
                        /^[a-zA-Z00-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                      message: "Please enter a valid email address",
                    },
                  })}
                  type="email"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500 bg-red-50"
                      : "border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                  }`}
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone (Optional) */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-emerald-600" />
                  Phone Number (Optional)
                </label>
                <input
                  {...register("phone", {
                    pattern: {
                      value: /^\+?[\d\s\-\(\)]{8,}$/,
                      message: "Please enter a valid phone number",
                    },
                  })}
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="+975 77 123 456"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Subject (Optional) */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Subject (Optional)
                </label>
                <select
                  {...register("subject")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="booking">Booking Issue</option>
                  <option value="payment">Payment Problem</option>
                  <option value="technical">Technical Support</option>
                  <option value="partnership">Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Your Message
                </label>
                <textarea
                  {...register("message", {
                    required: "Message is required",
                    minLength: {
                      value: 10,
                      message: "Message must be at least 10 characters",
                    },
                  })}
                  rows={5}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.message
                      ? "border-red-500 focus:ring-red-500 bg-red-50"
                      : "border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                  }`}
                  placeholder="Tell us how we can help you..."
                ></textarea>
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-emerald-700 hover:to-green-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
