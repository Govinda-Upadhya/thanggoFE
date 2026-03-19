import React, { useState, useEffect } from "react";
import {
  Check,
  Clock,
  Calendar,
  MapPin,
  Users,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { Download } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { base_url } from "../../types/ground";
import * as tf from "@tensorflow/tfjs";

type TimeSlot = { start: string; end: string };
const fileToTensor = async (file: File): Promise<tf.Tensor> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
        const tensor = tf.tidy(() => {
          return tf.browser
            .fromPixels(img)
            .resizeBilinear([640, 640]) // 🔥 match YOLO input
            .expandDims(0) // [1,640,640,3]
            .toFloat()
            .div(255.0); // normalize
        });
        resolve(tensor);
      };
    };
    reader.readAsDataURL(file);
  });
};

interface BookingInfoType {
  _id: string;
  name: string;
  email: string;
  contact: string;
  amount: string;
  time: TimeSlot[];
  ground: { name: string; _id: string; location: string };
  date: string;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  contact?: string;
  file?: string;
}

const BookingPending = () => {
  const navigate = useNavigate();
  const [imgVal, setImageVal] = useState(false);
  const { booking_id } = useParams();
  const [bookingInfo, setBookingInfo] = useState<BookingInfoType>();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [countdown, setCountdown] = useState(300);
  const [scanner, setScanner] = useState(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [model, setModel] = useState<tf.GraphModel | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  useEffect(() => {
    async function loadModel() {
      const loaded = await tf.loadGraphModel("/models/yolo/model.json");

      setModel(loaded);
      console.log("✅ Model loaded");
    }
    loadModel();
  }, []);

  // Dummy data
  useEffect(() => {
    async function fetchBooking() {
      const info = await axios.get(
        `${base_url}/users/bookinginfo/${booking_id}`
      );
      console.log(info);
      setBookingInfo(info.data.info);
      setScanner(info.data.scanner);
    }
    fetchBooking();
  }, []);

  async function cancelBooking() {
    const res = await axios.post(`${base_url}/users/cancelBooking`, {
      id: booking_id,
    });
    if (res.status == 400) {
      alert(
        "You booking reservation has been canceled as you havent submitted the screenshoot"
      );
      navigate("/");
    }
  }
  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      cancelBooking();
    }
  }, [countdown]);

  // Validation functions
  const validateName = (name: string): string | undefined => {
    if (!name.trim()) return "Name is required";
    if (name.length < 2) return "Name must be at least 2 characters";
    if (!/^[a-zA-Z\s]+$/.test(name))
      return "Name can only contain letters and spaces";
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return undefined;
  };

  const validateContact = (contact: string): string | undefined => {
    if (!contact.trim()) return "Phone number is required";
    if (!/^\d+$/.test(contact)) return "Phone number must contain only digits";
    if (contact.length !== 8) return "Phone number must be exactly 8 digits";
    return undefined;
  };

  const validateFile = (file: File | null): string | undefined => {
    if (!file) return "Payment screenshot is required";
    if (!file.type.startsWith("image/")) return "File must be an image";
    if (file.size > 5 * 1024 * 1024) return "File size must be less than 5MB";
    return undefined;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };
  const handleDownload = () => {
    if (!scanner) return;
    const link = document.createElement("a");
    link.href = scanner;
    link.download = "payment-qr.png";
    link.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const fileError = validateFile(selectedFile);

      if (fileError) {
        setErrors((prev) => ({ ...prev, file: fileError }));
        setFile(null);
      } else {
        setFile(selectedFile);
        setErrors((prev) => ({ ...prev, file: undefined }));

        if (model) {
          const img = await fileToTensor(selectedFile); // 🔥 now correct size
          const preds = model.predict(img) as tf.Tensor;
          const data = await preds.data();

          const maxIdx = data.indexOf(Math.max(...Array.from(data)));
          console.log("maxIdx", maxIdx);
          const labels = [
            "Invalid payment screenshoot",
            "Valid payment screenshoot",
          ]; // from metadata.yaml
          setPrediction(labels[maxIdx]);
          if (labels[maxIdx] == "Valid payment screenshoot") {
            setImageVal(true);
          }
          console.log("📊 Prediction:", labels[maxIdx], data);
          img.dispose();
          preds.dispose();
        }
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      contact: validateContact(formData.contact),
      file: validateFile(file),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== undefined);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !prediction) return;

    if (prediction !== "Valid payment screenshoot") {
      alert("⚠️ Please upload a valid payment screenshot.");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("screenshot", file);
    formData.append("name", bookingInfo?.name || "");
    formData.append("groundId", bookingInfo?.ground._id || "");
    formData.append("contactInfo", bookingInfo?.contact || "");
    formData.append("email", bookingInfo?.email || "");
    formData.append("bookingId", bookingInfo?._id || "");
    await axios.post(
      `${base_url}/users/bookinginfo/send_screentshot`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    navigate("/users/booking/confirmed");
    setUploading(false);

    setUploading(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!bookingInfo)
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading booking info...</p>
        </div>
      </div>
    );

  const downPayment = Number(bookingInfo.amount) * 0.1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Confirmation
          </h1>
          <p className="text-gray-600">Secure your spot with a quick payment</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-green-100">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Booking Reserved!</h2>
            <p className="opacity-90">ID: #{booking_id || "12345"}</p>
          </div>

          <div className="p-6">
            {/* Countdown Timer */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <span className="font-semibold text-yellow-700">
                  Reservation expires in:
                </span>
              </div>
              <div className="text-2xl font-bold text-yellow-700">
                {formatTime(countdown)}
              </div>
            </div>

            {/* Booking Details */}
            <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Booking Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ground</p>
                    <p className="font-semibold">{bookingInfo.ground.name}</p>
                    <p className="text-xs text-gray-500">
                      {bookingInfo.ground.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date & Time</p>
                    <p className="font-semibold">
                      {new Date(bookingInfo.date).toLocaleDateString("en-GB")}
                    </p>
                    <p className="text-xs text-gray-500">
                      {bookingInfo.time.map((slot, i) => (
                        <span key={i}>
                          {slot.start}-{slot.end}{" "}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contact</p>
                    <p className="font-semibold">{bookingInfo.contact}</p>
                    <p className="text-xs text-gray-500">{bookingInfo.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="font-semibold">Nu.{bookingInfo.amount}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200 mb-6">
              <h3 className="font-bold text-gray-900 mb-3 text-lg">
                Payment Instructions
              </h3>
              <div className="bg-white shadow-md rounded-xl p-4 w-full max-w-sm mx-auto text-center border border-gray-200">
                <p className="text-gray-700 font-medium mb-3">Owner Bank QR</p>

                <div className="relative">
                  {scanner ? (
                    <img
                      src={scanner}
                      alt="Payment QR"
                      className="w-40 h-40 mx-auto rounded-lg border border-gray-300 shadow-sm object-contain bg-gray-50"
                    />
                  ) : (
                    <div className="w-40 h-40 mx-auto flex items-center justify-center rounded-lg border border-dashed border-gray-400 bg-gray-50 text-gray-500">
                      No QR Available
                    </div>
                  )}

                  {scanner && (
                    <button
                      onClick={handleDownload}
                      className="absolute bottom-2 right-2 p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg transition-colors"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Down Payment (10%):</span>
                  <span className="font-bold text-green-700">
                    Nu.{downPayment}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Remaining Amount:</span>
                  <span className="font-bold text-gray-700">
                    Nu.{Number(bookingInfo.amount) - downPayment}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  * Pay remaining amount at the venue after your match
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-4">
                Upload your payment screenshot to confirm your booking. The
                ground owner will verify your payment.
              </p>

              <form>
                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Screenshot
                  </label>
                  <div className="relative w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 z-10 w-full h-full cursor-pointer opacity-0"
                    />
                    <div
                      className={`w-full border-2 border-dashed rounded-xl p-4 transition-colors ${
                        errors.file
                          ? "border-red-500 bg-red-50"
                          : "border-green-300 focus:ring-green-500 focus:border-green-500"
                      }`}
                    >
                      {!file ? (
                        <div className="flex flex-col items-center justify-center text-center">
                          <CreditCard className="h-8 w-8 text-green-400 mx-auto mb-2" />
                          <span className="text-green-600 font-medium">
                            Click to upload payment screenshot
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between px-4">
                          <span className="text-green-700 font-medium truncate">
                            {file.name}
                          </span>
                          <Check className="h-5 w-5 text-green-600" />
                        </div>
                      )}
                    </div>
                  </div>
                  {errors.file && (
                    <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.file}</span>
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    Accepted formats: JPG, PNG, GIF. Max size: 5MB
                  </div>
                </div>
                {prediction && (
                  <div className="mt-2 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${
                        prediction === "Valid payment screenshoot"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {prediction}
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={uploading || !imgVal}
                  onClick={handleSend}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:hover:scale-100 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Check className="h-5 w-5" />
                      Confirm Payment
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Help Text */}
            <div className="text-center text-sm text-gray-500">
              Need help? Contact thanggodotcom@gmail.com or call +975-17495130
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPending;
