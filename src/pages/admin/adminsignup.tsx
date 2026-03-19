import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { base_url, upload_base_url } from "../../types/ground";
import {
  ImagePlay,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Activity,
} from "lucide-react";

const Adminsignup = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [scannerImagePreview, setScannermagePreview] = useState(null);
  const [contactValue, setContactValue] = useState("");
  const password = watch("password", "");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle contact input change with validation
  const handleContactChange = (e) => {
    const input = e.target.value;

    // Only allow numbers
    const numbersOnly = input.replace(/[^0-9]/g, "");

    // Limit to 8 digits
    const truncated = numbersOnly.slice(0, 8);

    setContactValue(truncated);
    setValue("contact", truncated, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    const file = data.profile[0];
    const scannerFile = data.scanner[0];
    console.log(scannerFile);
    if (!file) return alert("Please select a file");
    const usermail = data.email.split("@")[0];
    try {
      const formData = new FormData();
      formData.append("file", file);

      const imagepath = await axios.post(
        `${upload_base_url}/admin/signup/upload?usermail=${usermail}`,
        formData
      );
      const newFormData = new FormData();
      newFormData.append("file", scannerFile);
      const newImage = await axios.post(
        `${upload_base_url}/admin/signup/upload?usermail=${usermail}`,
        newFormData
      );
      const signupData = {
        name: data.name,
        email: data.email,
        contact: data.contact,
        password: data.password,
        profile: imagepath.data.url,
        scanner: newImage.data.url,
      };

      const saveRes = await axios.post(`${base_url}/admin/signup`, signupData, {
        withCredentials: true,
      });

      if (saveRes.status === 200) {
        navigate("/admin/signin");
      } else {
        alert("Signup failed");
      }
    } catch (err) {
      console.error("Error during signup:", err);
      alert(err.response?.data?.msg || "An error occurred during signup");
    }
  };

  // Password strength checker
  const getPasswordStrength = () => {
    if (!password) return { strength: 0, label: "" };

    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    const labels = [
      "Very Weak",
      "Weak",
      "Fair",
      "Good",
      "Strong",
      "Very Strong",
    ];
    return { strength, label: labels[strength] };
  };
  function handleScannerImage(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScannermagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  const passwordStrength = getPasswordStrength();

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

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-4 sm:p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-green-200 relative overflow-hidden transform transition-all duration-300 hover:shadow-green-200/40 z-10"
      >
        {/* Animated header stripe */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse"></div>

        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <Activity className="h-10 w-10 text-emerald-600 mr-2" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
            Admin <span className="text-emerald-600">Signup</span>
          </h2>
        </div>

        {/* Name */}
        <div className="mb-5 relative">
          <label className="block text-gray-700 font-medium mb-1">Name</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 focus:outline-none transition-all duration-300"
            placeholder="Enter your full name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <XCircle className="h-4 w-4 mr-1" /> {errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 focus:outline-none transition-all duration-300"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <XCircle className="h-4 w-4 mr-1" /> {errors.email.message}
            </p>
          )}
        </div>

        {/* Profile Upload with Preview */}
        <div className="mb-5">
          <label className="block text-gray-700 font-medium mb-1">
            Profile Picture
          </label>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-emerald-300 flex items-center justify-center overflow-hidden bg-green-50">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImagePlay className="h-6 w-6 text-emerald-400" />
                )}
              </div>
              {imagePreview && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            <label className="flex-1 cursor-pointer">
              <div className="px-4 py-2 bg-green-50 text-emerald-700 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors duration-300 text-center">
                Choose Image
              </div>
              <input
                type="file"
                accept="image/*"
                {...register("profile", {
                  required: "Profile picture is required",
                  onChange: (e) => handleImageChange(e),
                })}
                className="hidden"
              />
            </label>
          </div>
          {errors.profile && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <XCircle className="h-4 w-4 mr-1" /> {errors.profile.message}
            </p>
          )}
        </div>
        {/* Scanner Upload with Preview */}
        <div className="mb-5">
          <label className="block text-gray-700 font-medium mb-1">
            Bank Scanner
          </label>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-emerald-300 flex items-center justify-center overflow-hidden bg-green-50">
                {scannerImagePreview ? (
                  <img
                    src={scannerImagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImagePlay className="h-6 w-6 text-emerald-400" />
                )}
              </div>
              {scannerImagePreview && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            <label className="flex-1 cursor-pointer">
              <div className="px-4 py-2 bg-green-50 text-emerald-700 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors duration-300 text-center">
                Choose Image
              </div>
              <input
                type="file"
                accept="image/*"
                {...register("scanner", {
                  required: "Scanner picture is required",
                  onChange: (e) => handleScannerImage(e),
                })}
                className="hidden"
              />
            </label>
          </div>
          {errors.scanner && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <XCircle className="h-4 w-4 mr-1" /> {errors.scanner.message}
            </p>
          )}
        </div>

        {/* Contact */}
        <div className="mb-5">
          <label className="block text-gray-700 font-medium mb-1">
            Contact
          </label>
          <input
            type="text"
            value={contactValue}
            {...register("contact", {
              required: "Contact is required",
              pattern: {
                value: /^(77|17)[0-9]{6}$/,
                message: "Contact must be 8 digits and start with 77 or 17",
              },
            })}
            onChange={handleContactChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 focus:outline-none transition-all duration-300"
            placeholder="Enter your 8-digit contact number"
            inputMode="numeric"
          />
          <div className="flex justify-between mt-1">
            {errors.contact ? (
              <p className="text-red-500 text-sm flex items-center">
                <XCircle className="h-4 w-4 mr-1" /> {errors.contact.message}
              </p>
            ) : (
              <p className="text-green-500 text-sm flex items-center">
                {contactValue.length === 8 && (
                  <CheckCircle className="h-4 w-4 mr-1" />
                )}
                {contactValue.length === 8 ? "Valid contact number" : ""}
              </p>
            )}
            <p className="text-gray-500 text-sm">{contactValue.length}/8</p>
          </div>
        </div>

        {/* Password with strength indicator */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 focus:outline-none transition-all duration-300 pr-10"
              placeholder="Enter a strong password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>

          {/* Password strength meter */}
          {password && (
            <div className="mt-2">
              <div className="flex items-center mb-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      passwordStrength.strength < 2
                        ? "bg-red-500"
                        : passwordStrength.strength < 4
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    style={{
                      width: `${(passwordStrength.strength / 5) * 100}%`,
                    }}
                  ></div>
                </div>
                <span className="ml-2 text-xs font-medium text-gray-600">
                  {passwordStrength.label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1 text-xs">
                <div className="flex items-center">
                  {password.length >= 6 ? (
                    <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <XCircle className="h-3 w-3 text-gray-400 mr-1" />
                  )}
                  <span
                    className={
                      password.length >= 6 ? "text-green-600" : "text-gray-500"
                    }
                  >
                    Min. 6 characters
                  </span>
                </div>
                <div className="flex items-center">
                  {/[A-Z]/.test(password) ? (
                    <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <XCircle className="h-3 w-3 text-gray-400 mr-1" />
                  )}
                  <span
                    className={
                      /[A-Z]/.test(password)
                        ? "text-green-600"
                        : "text-gray-500"
                    }
                  >
                    Uppercase letter
                  </span>
                </div>
                <div className="flex items-center">
                  {/[0-9]/.test(password) ? (
                    <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <XCircle className="h-3 w-3 text-gray-400 mr-1" />
                  )}
                  <span
                    className={
                      /[0-9]/.test(password)
                        ? "text-green-600"
                        : "text-gray-500"
                    }
                  >
                    Number
                  </span>
                </div>
                <div className="flex items-center">
                  {/[^A-Za-z0-9]/.test(password) ? (
                    <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <XCircle className="h-3 w-3 text-gray-400 mr-1" />
                  )}
                  <span
                    className={
                      /[^A-Za-z0-9]/.test(password)
                        ? "text-green-600"
                        : "text-gray-500"
                    }
                  >
                    Special character
                  </span>
                </div>
              </div>
            </div>
          )}

          {errors.password && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <XCircle className="h-4 w-4 mr-1" /> {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className={`w-full py-3 text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-[1.02] ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Submitting...
            </div>
          ) : (
            "Sign Up"
          )}
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/admin/signin")}
            className="text-emerald-600 font-medium hover:text-emerald-700 hover:underline transition-colors duration-300"
          >
            Sign In
          </button>
        </p>
      </form>
    </div>
  );
};

export default Adminsignup;
