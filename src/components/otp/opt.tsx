import axios from "axios";
import React, {
  useState,
  useRef,
  FormEvent,
  ChangeEvent,
  useEffect,
} from "react";
import { base_url } from "../../types/ground";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useNavigate } from "react-router-dom";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setEmail } from "../../slice/authSlice";
import { Activity } from "lucide-react";

export default function OtpPage(): JSX.Element {
  const [submitting, setSubmiting] = useState(false);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [message, setMessage] = useState<string>("");
  let email = useSelector((state: RootState) => state.auth.email);
  let dispatch = useDispatch();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>, idx: number) => {
    const value = e.target.value.replace(/\D/g, "");
    if (!value) return;
    const newOtp = [...otp];
    newOtp[idx] = value[0];
    setOtp(newOtp);

    if (idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];
      if (newOtp[idx]) {
        newOtp[idx] = "";
        setOtp(newOtp);
      } else if (idx > 0) {
        inputRefs.current[idx - 1]?.focus();
        newOtp[idx - 1] = "";
        setOtp(newOtp);
      }
    }
  };
  useEffect(() => {
    if (!email) {
      const newEmail = localStorage.getItem("email");
      console.log("email from useEffect local", newEmail);
      if (newEmail) {
        dispatch(setEmail(newEmail));
      } else {
        toast.error("make a booking first");
      }
    }
    return () => {};
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp.some((digit) => digit === "")) {
      setMessage("Please fill all 6 digits");
      return;
    }
    const otpCode = otp.join("");
    setSubmiting(true);
    try {
      const res = await axios.post(
        `${base_url}/users/verifyotp`,
        { otp: otpCode, email, id: localStorage.getItem("id") },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setSubmiting(false);
        localStorage.removeItem("email");
        localStorage.removeItem("id");
        setTimeout(() => {
          navigate(`/users/booking/${res.data.id}`);
        }, 2000);
      }
    } catch (error: any) {
      setSubmiting(false);
      if (error.response) {
        toast.error(error.response.data.message || "Verification failed");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  async function handleResend() {
    const res = await axios.post(`${base_url}/users/resendotp`, {
      email,
    });
    if (res.status === 200) {
      toast.success("OTP has been sent to your email");
    } else {
      toast.error("Error resending OTP");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-2 sm:p-4">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-sm sm:max-w-md lg:max-w-lg">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <Activity className="h-10 w-10 text-emerald-600 mr-2" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
            Enter <span className="text-emerald-600">OTP</span>
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* OTP Inputs */}
          <div className="flex justify-between gap-2 sm:gap-3">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                ref={(el) => (inputRefs.current[idx] = el)}
                className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-emerald-600"
              />
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {submitting ? "Verifying..." : "Submit"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <p className="mt-4 text-center text-red-600 font-medium">{message}</p>
        )}

        {/* Resend */}
        <p className="mt-6 text-center text-gray-500 text-sm">
          Didn't receive OTP?{" "}
          <button
            className="text-emerald-600 hover:underline"
            onClick={handleResend}
          >
            Resend
          </button>
        </p>
      </div>

      {/* Toasts */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
        transition={Bounce}
      />
    </div>
  );
}
