import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { base_url } from "../../types/ground";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
  Trophy,
  Users,
  Mail,
  Phone,
  Send,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";

interface AcceptChallengeForm {
  name: string;
  email: string;
  phone: string;
}

const AcceptChallenge: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AcceptChallengeForm>();
  const params = useParams();

  const onSubmit = async (data: AcceptChallengeForm) => {
    let res = await axios.post(`${base_url}/users/acceptChallenge`, {
      data,
      id: params.id,
    });
    if (res.status == 200) {
      alert("subitted the request successfully");
      setIsSubmitted(true);
      navigate("/");
    } else {
      alert("there was some error please try again");
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center animate-fade-in-up">
          <div className="flex justify-center mb-6">
            <div className="bg-emerald-100 p-4 rounded-full">
              <CheckCircle className="h-12 w-12 text-emerald-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-emerald-700 mb-4">
            Request Sent Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Your challenge request has been sent. The challenger will contact
            you shortly.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-emerald-700 hover:text-emerald-900 mb-6 transition-all duration-300 transform hover:-translate-x-1"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </button>

        <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 w-full animate-fade-in">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-3">
              <Trophy className="h-8 w-8 text-emerald-600 mr-2" />
              <h2 className="text-2xl font-bold text-emerald-800">
                Accept Challenge
              </h2>
            </div>
            <p className="text-emerald-600">
              Join the competition and showcase your skills!
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div className="relative">
              <label className="block text-emerald-800 font-medium mb-2 flex items-center">
                <Users className="h-4 w-4 mr-1" />
                Your Name
              </label>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className="w-full border border-emerald-200 rounded-lg px-4 py-3 pl-10 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-green-50"
                placeholder="Enter your name"
              />
              <Users className="absolute left-3 top-10 h-5 w-5 text-emerald-400" />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1 animate-shake">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="relative">
              <label className="block text-emerald-800 font-medium mb-2 flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                Email Address
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
                className="w-full border border-emerald-200 rounded-lg px-4 py-3 pl-10 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-green-50"
                placeholder="Enter your email"
              />
              <Mail className="absolute left-3 top-10 h-5 w-5 text-emerald-400" />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 animate-shake">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="relative">
              <label className="block text-emerald-800 font-medium mb-2 flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                Phone Number
              </label>
              <input
                type="tel"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^(77|17)[0-9]{6}$/,
                    message:
                      "Phone number must start with 77 or 17 and be 8 digits",
                  },
                })}
                className="w-full border border-emerald-200 rounded-lg px-4 py-3 pl-10 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-green-50"
                placeholder="Enter your 8-digit phone number"
                maxLength={8}
              />
              <Phone className="absolute left-3 top-10 h-5 w-5 text-emerald-400" />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1 animate-shake">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-green-700 transition-all duration-300 transform hover:-translate-y-1 disabled:from-gray-400 disabled:to-gray-500 disabled:transform-none disabled:hover:translate-y-0 shadow-md hover:shadow-lg flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Send Request
                </>
              )}
            </button>
          </form>

          {/* Note */}
          <div className="mt-6 text-sm text-emerald-700 text-center border-t border-emerald-100 pt-4">
            <p>
              <strong>Note:</strong> Once the request is sent, the challenge
              post will no longer be shown in the web app. The person who posted
              the challenge will contact you directly.
            </p>
          </div>
        </div>
      </div>

      {/* Add custom animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out;
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AcceptChallenge;
