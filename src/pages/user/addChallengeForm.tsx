import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Calendar, Plus, X, Upload, Trophy, ArrowLeft } from "lucide-react";
import { base_url, upload_base_url } from "../../types/ground";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface ChallengeFormData {
  teamName: string;
  teamImage: FileList | null;
  email: string;
  members: string;
  contact: string;
  sport: string;
  availability: { date: string }[];
  description: string;
}

const AddChallengeForm: React.FC = () => {
  const navigate = useNavigate();
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChallengeFormData>({
    defaultValues: {
      teamName: "",
      teamImage: null,
      email: "",
      members: "6",
      contact: "",
      availability: [
        {
          date: new Date().toISOString().split("T")[0],
        },
      ],
      description: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "availability",
  });

  const submitHandler = async (data: ChallengeFormData) => {
    const photo = data.teamImage?.[0];
    const formData = new FormData();

    if (!photo) return;
    formData.append("file", photo);
    const res = await axios.post(`${upload_base_url}/user/upload`, formData);

    const addChallenge = await axios.post(`${base_url}/users/createChallenge`, {
      ...data,
      imageUrl: res.data.url,
    });

    if (addChallenge.status === 200) {
      localStorage.setItem("email", data.email);
      localStorage.setItem("challengeId", addChallenge.data.id);
      navigate("/user/verifychallenge");
    }
  };

  // Function to handle team name input (only letters and spaces)
  const handleTeamNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
  };

  // Function to handle contact input (only numbers, max 8 digits)
  const handleContactInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 8);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-emerald-700 hover:text-emerald-900 font-medium transition-all duration-300 hover:scale-105 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back
          </button>
          <div className="flex-grow text-center">
            <div className="flex items-center justify-center mb-4">
              <Trophy className="h-10 w-10 text-emerald-600 mr-2" />
              <h1 className="text-3xl font-bold text-emerald-800">
                Create Challenge
              </h1>
            </div>
          </div>
          <div className="w-20"></div> {/* Spacer to balance the back button */}
        </div>

        <p className="text-emerald-600 text-center mb-8">
          Challenge other teams and showcase your skills!
        </p>

        <form
          onSubmit={handleSubmit(submitHandler)}
          className="bg-white p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row gap-6 transition-all duration-300 hover:shadow-xl"
        >
          {/* Left side - Image Upload */}
          <div className="flex flex-col items-center w-full sm:w-1/3 relative">
            <div className="w-40 h-40 rounded-full border-2 border-dashed border-emerald-400 flex items-center justify-center overflow-hidden bg-green-50 relative transition-all duration-300 hover:border-emerald-600 hover:scale-105">
              {preview ? (
                <img
                  src={preview}
                  alt="Team Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-emerald-500">
                  <Upload className="w-8 h-8 mb-2" />
                  <span className="text-sm">Upload Team Image</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                {...register("teamImage", {
                  required: "Team image is required",
                })}
                className="absolute top-0 left-0 w-40 h-40 opacity-0 cursor-pointer"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setPreview(URL.createObjectURL(e.target.files[0]));
                    setIsUploading(true);
                    setTimeout(() => setIsUploading(false), 1000);
                  }
                }}
              />
            </div>
            <p className="mt-3 text-emerald-600 text-sm text-center">
              {isUploading ? "Uploading..." : "Click to upload your team image"}
            </p>
            {errors.teamImage && (
              <p className="text-red-500 text-xs mt-2">
                {errors.teamImage.message}
              </p>
            )}
          </div>

          {/* Right side - Inputs */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Team Name"
                  {...register("teamName", {
                    required: "Team name is required",
                    pattern: {
                      value: /^[a-zA-Z\s]+$/,
                      message:
                        "Team name should only contain letters and spaces",
                    },
                  })}
                  onInput={handleTeamNameInput}
                  className="w-full border border-emerald-200 rounded-lg p-3 bg-green-50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
                {errors.teamName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.teamName.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="w-full border border-emerald-200 rounded-lg p-3 bg-green-50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="number"
                  placeholder="Number of Players"
                  {...register("members", {
                    required: "Members required",
                    min: {
                      value: 1,
                      message: "At least 1 player is required",
                    },
                  })}
                  className="w-full border border-emerald-200 rounded-lg p-3 bg-green-50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
                {errors.members && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.members.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  {...register("contact", {
                    required: "Contact is required",
                    pattern: {
                      value: /^[0-9]{8}$/,
                      message: "Contact must contain exactly 8 digits",
                    },
                    validate: {
                      startsWithValid: (value) =>
                        value.startsWith("77") ||
                        value.startsWith("17") ||
                        "Contact must start with 77 or 17",
                    },
                  })}
                  onInput={handleContactInput}
                  className="w-full border border-emerald-200 rounded-lg p-3 bg-green-50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="Enter your 8-digit contact number"
                />
                {errors.contact && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.contact.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <select
                {...register("sport", { required: "Sport is required" })}
                className="w-full border border-emerald-200 rounded-lg p-3 bg-green-50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              >
                <option value="">Select Sport</option>
                <option value="Football">Football</option>
                <option value="Cricket">Cricket</option>
                <option value="Basketball">Basketball</option>
                <option value="Badminton">Badminton</option>
                <option value="Volleyball">Volleyball</option>
              </select>
              {errors.sport && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.sport.message}
                </p>
              )}
            </div>

            {/* Availability */}
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="border border-emerald-200 p-3 rounded-lg space-y-2 bg-green-50 flex items-center transition-all duration-300 hover:bg-green-100"
                >
                  <div className="flex-1">
                    <label className="text-sm font-medium flex items-center mb-1 text-emerald-700">
                      <Calendar className="h-4 w-4 mr-1" /> Date Availability
                    </label>
                    <input
                      type="date"
                      {...register(`availability.${index}.date`, {
                        required: "Date is required",
                      })}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full border border-emerald-200 rounded-lg p-2 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>

                  {/* Remove button only if more than 1 field */}
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="ml-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all duration-300 transform hover:scale-110"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  append({
                    date: new Date().toISOString().split("T")[0],
                  })
                }
                className="flex items-center text-emerald-600 hover:text-emerald-800 transition-all duration-300 font-medium"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add More Availability
              </button>
            </div>

            {/* Description */}
            <div>
              <textarea
                placeholder="Tell something about when you will be available"
                {...register("description", {
                  required: "Description required",
                })}
                className="w-full border border-emerald-200 rounded-lg p-3 h-24 bg-green-50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-1/3 border border-emerald-500 text-emerald-600 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                disabled={isSubmitting}
                type="submit"
                className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-green-700 transition-all duration-300 transform hover:-translate-y-1 disabled:from-gray-400 disabled:to-gray-500 disabled:transform-none disabled:hover:translate-y-0 shadow-md hover:shadow-lg"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
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
                    Processing...
                  </span>
                ) : (
                  "Create Challenge"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Add custom animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AddChallengeForm;
