import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { base_url } from "../../types/ground";
import { useNavigate, useParams } from "react-router-dom";
import { Lock, Key, Eye, EyeOff, CheckCircle, ArrowLeft } from "lucide-react";

type FormData = {
  password: string;
  confirmPassword: string;
};

const ChangePasswordLink = () => {
  const params = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormData>();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const passwordValue = watch("password", "");

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!passwordValue) return 0;

    let strength = 0;
    if (passwordValue.length >= 6) strength += 25;
    if (/[A-Z]/.test(passwordValue)) strength += 25;
    if (/[0-9]/.test(passwordValue)) strength += 25;
    if (/[^A-Za-z0-9]/.test(passwordValue)) strength += 25;

    return strength;
  };

  const onSubmit = async (data: FormData) => {
    console.log("New password data:", data);
    try {
      const res = await axios.post(
        `${base_url}/admin/changePassword/link/${params.id}`,
        data
      );
      console.log(res.data);
      if (res.status == 200) {
        alert("Password reset successful. Please login.");
        navigate("/admin/signin");
      } else if (res.status == 404) {
        alert("Invalid user");
        navigate("/");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-100 to-lime-100 p-4 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-green-200 opacity-20 animate-ping"
            style={{
              width: `${Math.random() * 80 + 30}px`,
              height: `${Math.random() * 80 + 30}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.5}s`,
            }}
          />
        ))}

        {/* Sporty field lines */}
        <div className="absolute top-0 left-1/4 w-1 h-full bg-green-300 opacity-10 transform -translate-x-1/2"></div>
        <div className="absolute top-0 left-1/2 w-1 h-full bg-green-300 opacity-10 transform -translate-x-1/2"></div>
        <div className="absolute top-0 left-3/4 w-1 h-full bg-green-300 opacity-10 transform -translate-x-1/2"></div>

        {/* Floating icons */}
        <Key
          className="absolute top-20 right-10 text-green-300 opacity-30 animate-bounce"
          size={40}
        />
        <Lock
          className="absolute bottom-40 left-10 text-green-300 opacity-30 animate-float"
          size={40}
        />
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md border border-green-200 relative z-10 transform transition-all duration-500 hover:shadow-2xl">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-green-600 hover:text-green-800 mb-4 transition-colors duration-300"
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

        {!isSuccess ? (
          <>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-emerald-600 mb-4 shadow-lg">
                <Key className="text-white" size={30} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-800">
                Reset Password
              </h2>
              <p className="text-green-600">Create a strong new password</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* New Password */}
              <div className="mb-5 relative">
                <label className="block text-green-800 font-medium mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500"
                    size={20}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 6, message: "Minimum 6 characters" },
                    })}
                    className="w-full pl-10 pr-10 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none transition-all duration-300"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 hover:text-green-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* Password strength indicator */}
                {passwordValue && (
                  <div className="mt-2">
                    <div className="flex items-center mb-1">
                      <div className="w-full bg-green-100 rounded-full h-2.5">
                        <div
                          className="h-2.5 rounded-full transition-all duration-300"
                          style={{
                            width: `${getPasswordStrength()}%`,
                            backgroundColor:
                              getPasswordStrength() < 50
                                ? "#ef4444"
                                : getPasswordStrength() < 75
                                ? "#f59e0b"
                                : "#10b981",
                          }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-xs text-green-600">
                      Password strength:{" "}
                      {getPasswordStrength() < 50
                        ? "Weak"
                        : getPasswordStrength() < 75
                        ? "Medium"
                        : "Strong"}
                    </p>
                  </div>
                )}

                {errors.password && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <span
                      className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white mr-1"
                      style={{ fontSize: "10px" }}
                    >
                      !
                    </span>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mb-6 relative">
                <label className="block text-green-800 font-medium mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500"
                    size={20}
                  />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === watch("password") || "Passwords do not match",
                    })}
                    className="w-full pl-10 pr-10 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none transition-all duration-300"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 hover:text-green-700"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <span
                      className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white mr-1"
                      style={{ fontSize: "10px" }}
                    >
                      !
                    </span>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 text-white font-bold rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center ${
                  isSubmitting
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:shadow-xl transform hover:-translate-y-1"
                }`}
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
                    UPDATING...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2" size={20} />
                    UPDATE PASSWORD
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <CheckCircle className="text-green-600" size={30} />
            </div>
            <h3 className="text-xl font-bold text-green-800 mb-2">
              Password Updated!
            </h3>
            <p className="text-green-600 mb-4">
              Your password has been successfully reset.
            </p>
            <div className="mt-6">
              <div className="flex justify-center">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-sm text-green-600 mt-4">
                Redirecting you to homepage...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangePasswordLink;
