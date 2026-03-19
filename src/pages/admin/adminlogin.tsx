import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { base_url } from "../../types/ground";
import {
  Eye,
  EyeOff,
  Shield,
  Activity,
  Target,
  Mail,
  Lock,
} from "lucide-react";

const Adminsignin = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${base_url}/admin/signin`, data, {
        withCredentials: true,
      });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        setMessage("Login successful! Redirecting...");
        setTimeout(() => navigate("/admin/dashboard"), 1500);
      } else {
        setMessage("Login failed. Please check your credentials.");
      }
    } catch (err) {
      setMessage("Login failed. Please check your credentials.");
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

      <div className="relative w-full max-w-md z-10">
        {/* Header with sporty icons */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <div className="relative">
              <div className="absolute -inset-4 bg-emerald-400/30 rounded-full animate-pulse"></div>
              <Shield className="h-12 w-12 text-emerald-700 relative z-10" />
            </div>
            <Target className="h-10 w-10 text-green-600 mx-2" />
            <Activity className="h-12 w-12 text-emerald-700" />
          </div>
          <h1 className="text-3xl font-bold text-emerald-800 mb-2">
            Admin Access
          </h1>
          <p className="text-emerald-600">
            Sign in to manage your sports platform
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl border border-green-200 transform transition-all duration-300 hover:shadow-green-200/40">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email input */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-emerald-700"
              >
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  className={`w-full px-4 py-3 border ${
                    errors.email ? "border-red-400" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 focus:outline-none transition-all duration-300 pr-10`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Mail className="h-5 w-5 text-emerald-400" />
                </div>
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <Lock className="h-4 w-4 mr-1" /> {errors.email.message}
                </p>
              )}
            </div>

            {/* Password input */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-emerald-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 border ${
                    errors.password ? "border-red-400" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 focus:outline-none transition-all duration-300 pr-10`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must have at least 6 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-emerald-400 hover:text-emerald-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-emerald-400 hover:text-emerald-600 transition-colors" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <Lock className="h-4 w-4 mr-1" /> {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit button */}
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
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Message */}
          {message && (
            <div
              className={`mt-6 p-3 rounded-lg text-center ${
                message.includes("successful")
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
              } transition-all duration-500`}
            >
              {message}
            </div>
          )}

          {/* Links */}
          <div className="text-center mt-6 space-y-2">
            <a
              onClick={() => navigate("/admin/changePassword")}
              className="block text-sm font-medium text-emerald-600 hover:text-emerald-800 cursor-pointer transition-colors duration-300"
            >
              Forgot your password?
            </a>
            {/* <div className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/admin/signup")}
                className="text-emerald-600 font-medium hover:text-emerald-700 hover:underline transition-colors duration-300"
              >
                Sign Up
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Adminsignin;
