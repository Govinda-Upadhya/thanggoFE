import axios from "axios";
import React, { useState } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { base_url } from "../../types/ground";
import { Activity, Shield, Target } from "lucide-react";

const FeedbackPage: React.FC = () => {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a star rating before submitting.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${base_url}/users/feedback`, {
        rating,
        comment,
      });

      if (res.status === 200) {
        toast.success("Thank you for your feedback.");
        setRating(0);
        setComment("");
      } else {
        toast.error("Feedback couldn't be submitted.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 px-4">
      <div className="text-center mb-8">
        <div className="flex justify-center items-center mb-4">
          <div className="relative">
            <div className="absolute -inset-4 bg-emerald-400/30 rounded-full animate-pulse"></div>
            <Shield className="h-12 w-12 text-emerald-700 relative z-10" />
          </div>
          <Target className="h-10 w-10 text-green-600 mx-2" />
          <Activity className="h-12 w-12 text-emerald-700" />
        </div>
        <h1 className="text-3xl font-bold text-emerald-800 mb-2">Feedback</h1>
        <p className="text-emerald-600">
          How was your experience with us today? ⭐ We'd love to hear your
          thoughts!
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
        {/* ⭐ Star Rating */}
        <div className="flex justify-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="focus:outline-none"
              disabled={loading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={star <= (hover || rating) ? "gold" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-8 h-8 text-yellow-500 transition-colors duration-200"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1
                     1 0 00.95.69h4.908c.969 0 1.371 1.24.588 1.81l-3.975
                     2.888a1 1 0 00-.364 1.118l1.518 4.674c.3.921-.755
                     1.688-1.54 1.118l-3.975-2.888a1 1 0 00-1.175 0l-3.975
                     2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1
                     1 0 00-.364-1.118L2.083 10.1c-.783-.57-.38-1.81.588-1.81h4.908a1
                     1 0 00.95-.69l1.518-4.674z"
                />
              </svg>
            </button>
          ))}
        </div>

        {/* 📝 Comment Section */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your feedback here..."
            className="border rounded-lg border-gray-400 p-3 h-28 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            disabled={loading}
          />

          {/* ✅ Submit Button */}
          <button
            type="submit"
            disabled={rating === 0 || loading}
            className={`px-4 py-2 rounded-lg font-semibold text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            }`}
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
};

export default FeedbackPage;
