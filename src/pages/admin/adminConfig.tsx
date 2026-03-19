import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Admin, base_url, upload_base_url } from "../../types/ground";
import {
  ImagePlay,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Activity,
  ArrowLeft,
  X,
} from "lucide-react";

const AdminConfig = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();
  const [user, setUser] = useState<Admin>();

  const [imagePreview, setImagePreview] = useState(null);
  const [scannerPreview, setScannerPreview] = useState(null);
  const [contactValue, setContactValue] = useState("");

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
  const handleCancel = () => {
    navigate("/admin/dashboard");
  };
  async function handlePasswordChange(email: string) {
    try {
      const res = await axios.post(`${base_url}/admin/changePassword`, {
        email: email,
      });
      alert(
        "Password reset link for the account will reach you shortly in your registered email."
      );
    } catch (error) {
      console.log(error);
      alert("sorry some error occurred please try again");
    }
  }

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
    try {
      let newEmail = false;
      let profileUrl = user?.profile;
      let scannerUrl = user?.scanner;
      if (data.email != user?.email) {
        newEmail = true;
      }
      if (data.profile?.[0]) {
        const formData = new FormData();
        formData.append("file", data.profile[0]);
        const res = await axios.post(
          `${upload_base_url}/admin/signup/upload?usermail=${
            data.email.split("@")[0]
          }`,
          formData
        );
        profileUrl = res.data.url;
      }

      if (data.scanner?.[0]) {
        const formData = new FormData();
        formData.append("file", data.scanner[0]);
        const res = await axios.post(
          `${upload_base_url}/admin/signup/upload?usermail=${
            data.email.split("@")[0]
          }`,
          formData
        );
        scannerUrl = res.data.url;
      }

      const updatedData = {
        name: data.name,
        contact: data.contact,
        profile: profileUrl,
        scanner: scannerUrl,
        email: data.email,
        newEmail,
      };

      const saveRes = await axios.put(
        `${base_url}/admin/update`,
        { newInfo: updatedData },
        { withCredentials: true }
      );

      if (saveRes.status === 200) {
        if (data.email != user?.email) {
          alert("Updated successfully,please signin again.");
          navigate("/admin/signin");
        } else {
          alert("Admin updated successfully.");
          navigate("/admin/dashboard");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error updating admin");
    }
  };
  function handleScannerImage(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScannerPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  async function fetchAdmin() {
    const userInfo = await axios.get(`${base_url}/admin/getAdmin`, {
      withCredentials: true,
    });
    setUser(userInfo.data);
    console.log(userInfo.data);
  }
  useEffect(() => {
    fetchAdmin();
    return () => {};
  }, []);
  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("email", user.email);
      setValue("contact", user.contact);
    }
  }, [user, setValue]);

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
        className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-green-200 relative overflow-hidden transform transition-all duration-300 hover:shadow-green-200/40 z-10"
      >
        {/* Animated header stripe */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse"></div>

        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-1 rounded-full hover:bg-green-100 transition-colors duration-200"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5 text-emerald-600" />
        </button>

        <div className="flex items-center justify-center mb-6 mt-2">
          <div className="relative">
            <Activity className="h-10 w-10 text-emerald-600 mr-2" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
            Admin <span className="text-emerald-600">Configuration</span>
          </h2>
        </div>

        <p className="text-center text-gray-600 mb-6">
          Update your profile information and settings
        </p>

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
            {...register("email")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg 
           bg-gray-100
           focus:ring-0 focus:border-gray-300 focus:outline-none transition-all duration-300"
            placeholder="Enter your email"
          />
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
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
                ) : user?.profile ? (
                  <img
                    src={user.profile}
                    alt="Current Profile"
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
                  required: !user?.profile,
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
            Scanner Picture
          </label>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-emerald-300 flex items-center justify-center overflow-hidden bg-green-50">
                {scannerPreview ? (
                  <img
                    src={scannerPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : user?.scanner ? (
                  <img
                    src={user.scanner}
                    alt="Current Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImagePlay className="h-6 w-6 text-emerald-400" />
                )}
              </div>
              {scannerPreview && (
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
                  required: !user?.scanner,
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

        {/* Password Change Button */}
        <div className="mb-6">
          <div
            onClick={() => handlePasswordChange(user?.email)}
            className="flex justify-center items-center w-full py-3 text-emerald-700 font-semibold rounded-lg border border-emerald-300 transition-all duration-300 transform hover:scale-[1.02] bg-white hover:bg-green-50 cursor-pointer"
          >
            Change Password
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            A password reset link will be sent to your email
          </p>
        </div>

        {/* Button Group */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 py-3 text-gray-700 font-semibold rounded-lg border border-gray-300 transition-all duration-300 transform hover:scale-[1.02] bg-white hover:bg-gray-50 flex items-center justify-center"
          >
            <X className="h-4 w-4 mr-2" /> Cancel
          </button>
          <button
            type="submit"
            className={`flex-1 py-3 text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-[1.02] ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            } flex items-center justify-center`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              "Apply Changes"
            )}
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-4">
          Need to sign in?{" "}
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

export default AdminConfig;
