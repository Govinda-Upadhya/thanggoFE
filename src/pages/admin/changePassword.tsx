import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { base_url } from "../../types/ground";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Mail,
  Shield,
  Send,
  ArrowLeft,
  CheckCircle,
  Activity,
} from "lucide-react";

type FormData = {
  email: string;
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      console.log(data);
      const res = await axios.post(`${base_url}/admin/changePassword`, {
        email: data.email,
      });
      alert(
        "Password reset link for the account will reach you shortly in your registered email."
      );
      navigate("/admin/signin");
    } catch (error) {
      console.log(error.response.data.msg);
      alert(error.response.data.msg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-2 sm:p-4 flex items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-green-200 opacity-20 animate-pulse"
            style={{
              width: Math.floor(Math.random() * 100) + 50 + "px",
              height: Math.floor(Math.random() * 100) + 50 + "px",
              top: Math.floor(Math.random() * 100) + "%",
              left: Math.floor(Math.random() * 100) + "%",
              animationDuration: Math.random() * 5 + 5 + "s",
              animationDelay: Math.random() * 2 + "s",
            }}
          ></div>
        ))}
      </div>

      <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-green-200 relative z-10 transform transition-all duration-300 hover:shadow-green-200/40">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-emerald-600 hover:text-emerald-800 mb-4 transition-colors duration-300"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <ArrowLeft
            className={`mr-1 transition-transform duration-300 ${
              isHovered ? "transform -translate-x-1" : ""
            }`}
            size={18}
          />
          Back
        </button>

        {!isSubmitted ? (
          <>
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  <div className="absolute -inset-4 bg-emerald-400/30 rounded-full animate-pulse"></div>
                  <Shield className="h-12 w-12 text-emerald-700 relative z-10" />
                </div>
                <Activity className="h-10 w-10 text-green-600 mx-2" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-gray-800">
                Reset Your <span className="text-emerald-600">Password</span>
              </h2>
              <p className="text-emerald-600">
                We'll send you a reset link to your email
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Input */}
              <div className="relative">
                <label className="block text-gray-700 font-medium mb-1">
                  Email Address
                </label>
                <p className="text-sm text-emerald-600 mb-3">
                  Please enter your registered email address. We will send you a
                  link to reset your password.
                </p>

                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500"
                    size={20}
                  />
                  <input
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 focus:outline-none transition-all duration-300"
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white mr-1 text-xs">
                      !
                    </span>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-[1.02] ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Send className="mr-2" size={20} />
                    SEND RESET LINK
                  </div>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
              <CheckCircle className="text-emerald-600" size={30} />
            </div>
            <h3 className="text-xl font-bold text-emerald-800 mb-2">
              Email Sent!
            </h3>
            <p className="text-emerald-600 mb-4">
              We've sent a password reset link to your email address.
            </p>
            <div className="mt-6">
              <div className="flex justify-center">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-sm text-emerald-600 mt-4">
                Redirecting you to homepage...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
