import React, { useState, useEffect } from "react";
import { useParams, useNavigate, data } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  User,
  Mail,
  CreditCard,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  ImageIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { base_url } from "../../types/ground";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

type TimeSlot = { start: string; end: string };

interface BookingFormData {
  date: string;
  name: string;
  email: string;
  phone: string;
  availability: TimeSlot[];
}

interface Ground {
  _id: string;
  name: string;
  location: string;
  description: string;
  pricePerHour: number;
  features: string[];
  availability: TimeSlot[];
  images: string[];
}

// Component for each ground card with its own independent gallery
const GroundCard: React.FC<{ ground: Ground }> = ({ ground }) => {
  // Each card has its own independent state for gallery
  const [showGallery, setShowGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Gallery functions specific to this card
  const openImageGallery = (index: number) => {
    setCurrentImageIndex(index);
    setShowGallery(true);
  };

  const closeImageGallery = () => {
    setShowGallery(false);
  };

  const navigateImage = (direction: "next" | "prev") => {
    if (direction === "next") {
      setCurrentImageIndex((prev) =>
        prev === ground.image.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex((prev) =>
        prev === 0 ? ground.image.length - 1 : prev - 1
      );
    }
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6 border border-gray-100">
      {/* Independent Gallery Modal for this card */}
      {showGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh]">
            <button
              onClick={closeImageGallery}
              className="absolute top-4 right-4 z-10 text-white bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-75 transition-all"
            >
              <X className="h-6 w-6" />
            </button>

            <button
              onClick={() => navigateImage("prev")}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-75 transition-all"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              onClick={() => navigateImage("next")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-75 transition-all"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <img
              src={ground.image[currentImageIndex]}
              alt={`${ground.name} - Image ${currentImageIndex + 1}`}
              className="w-full h-full max-h-[70vh] object-contain rounded-lg"
            />

            {/* Thumbnail Gallery */}
            <div className="flex gap-2 mt-4 justify-center">
              {ground.image.map((image, index) => (
                <button
                  key={index}
                  onClick={() => selectImage(index)}
                  className={`w-12 h-12 rounded border-2 overflow-hidden transition-all ${
                    index === currentImageIndex
                      ? "border-white scale-110"
                      : "border-gray-400 hover:border-white"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            <div className="text-white text-center mt-3">
              {currentImageIndex + 1} / {ground.image.length}
            </div>
          </div>
        </div>
      )}

      {/* Main Image with Gallery */}
      <div className="relative">
        <img
          src={ground.image[0]}
          alt={ground.name}
          className="w-full h-72 object-cover cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => openImageGallery(0)}
        />

        {/* Gallery Indicator */}
        {ground.image.length > 1 && (
          <div className="absolute top-4 right-4">
            <button
              onClick={() => openImageGallery(0)}
              className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2 text-sm font-medium text-gray-700 hover:bg-white transition-colors"
            >
              <ImageIcon className="h-4 w-4" />
              View Gallery ({ground.image.length})
            </button>
          </div>
        )}

        {/* Image Navigation Dots */}
        {ground.image.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {ground.image.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  openImageGallery(index);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === 0
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3">Ground Details</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">
          {ground.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold text-emerald-700">
            Nu.{ground.pricePerHour}
            <span className="text-lg font-normal text-gray-500">/hour</span>
          </div>

          <div className="flex items-center bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm font-medium">Available Now</span>
          </div>
        </div>

        <h4 className="font-semibold text-gray-900 mb-3">
          Facilities & Features
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {ground.features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center text-gray-700 bg-gray-50 px-3 py-2 rounded-lg"
            >
              <Check className="h-4 w-4 text-emerald-600 mr-2 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const BookingAdminPage: React.FC = () => {
  const [groundloading, setGroundLoading] = useState(false);

  const [disable, setDisbale] = useState<boolean>(false);
  const [bookedTime, setBookedTime] = useState<TimeSlot[]>([]);
  const { groundId } = useParams<{ groundId: string }>();
  const navigate = useNavigate();
  const [ground, setGround] = useState<Ground>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot[]>([]);
  const [isBooking, setIsBooking] = useState(false);

  const [bookingId, setBookingId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>();

  async function fetchGroundView() {
    setGroundLoading(true);
    const foundGround = await axios.get(
      `${base_url}/users/seegrounds/${groundId}`
    );
    console.log();
    setGround(foundGround.data);
    setGroundLoading(false);
  }

  useEffect(() => {
    if (groundId) {
      fetchGroundView();
    }
  }, [groundId]);

  const onSubmit = async (data: BookingFormData) => {
    if (!ground || !selectedTimeSlot.length) return;
    data.availability = selectedTimeSlot;

    setIsBooking(true);
    const bookingPayload = {
      amount: ground.pricePerHour * selectedTimeSlot.length,
      contact: data.phone,
      date: data.date,
      email: data.email,
      ground: { _id: ground._id, name: ground.name },
      name: data.name,
      status: "PENDING",
      screenshot: false,
      time: selectedTimeSlot,
    };

    // Store the booking data in local storage

    const booking = await axios.post(
      `${base_url}/admin/bookingOffline/${groundId}`,
      {
        data,
      }
    );

    setIsBooking(false);
    navigate(`/admin/booking/confirmed`);
  };

  const getTotalAmount = () => {
    const price = ground ? ground.pricePerHour : 0;
    const total = selectedTimeSlot.length * price;
    return total;
  };

  const selectedDate = watch("date");
  async function getTime() {
    try {
      const response = await axios.get(`${base_url}/users/bookedTime`, {
        params: {
          date: selectedDate,
          ground: groundId,
        },
      });

      const updatedBookedTime: TimeSlot[] = response.data.bookedTime || [];

      // Update booked times
      setBookedTime(updatedBookedTime);

      // Remove any selected times that are now booked
      setSelectedTimeSlot((prev) =>
        prev.filter(
          (slot) =>
            !updatedBookedTime.some(
              (booked) => booked.start === slot.start && booked.end === slot.end
            )
        )
      );
    } catch (error) {
      console.error("Error fetching booked times:", error);
    }
  }

  useEffect(() => {
    // run immediately on mount / when selectedDate changes
    getTime();

    // then run every 5 seconds
    const interval = setInterval(() => {
      getTime();
    }, 1000);

    // cleanup interval when component unmounts or selectedDate changes
    return () => clearInterval(interval);
  }, [selectedDate]);

  // Phone number validation
  const validatePhone = (value: string) => {
    const phoneRegex = /^\d{8}$/;
    return phoneRegex.test(value) || "Phone number must be exactly 8 digits";
  };

  // Name validation
  const validateName = (value: string) => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(value) || "Name should not contain numbers";
  };

  // Email validation
  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) || "Please enter a valid email address";
  };

  if (!ground) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">
            Loading ground details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center text-emerald-600 font-semibold hover:text-emerald-700 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Grounds
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{ground.name}</h1>
          <div className="flex items-center mt-2 text-gray-600 text-lg">
            <MapPin className="h-5 w-5 mr-2 text-gray-500" />
            <span>{ground.location}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ground Details */}
          <div>
            <GroundCard ground={ground} />
          </div>

          {/* Booking Form */}
          <div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                Book This Ground
              </h3>

              {/* Date Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-emerald-600" />
                  Select Date
                </label>
                <input
                  type="date"
                  {...register("date", {
                    required: "Please select a date",
                  })}
                  min={new Date().toLocaleDateString("en-CA", {
                    timeZone: "Asia/Kolkata",
                  })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors ${
                    errors.date
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                  }`}
                />
                {errors.date && (
                  <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.date.message}</span>
                  </div>
                )}
              </div>

              {/* Time Slot Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Available Time Slots
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ground.availability.map((hour, key) =>
                    typeof hour !== "string" ? (
                      <button
                        key={key}
                        type="button"
                        disabled={bookedTime.some(
                          (time) =>
                            time.start === hour.start && time.end === hour.end
                        )}
                        onClick={() => {
                          setSelectedTimeSlot((prev) => {
                            const exists = prev.some(
                              (time) =>
                                time.start === hour.start &&
                                time.end === hour.end
                            );

                            if (exists) {
                              // Remove if already selected
                              return prev.filter(
                                (time) =>
                                  !(
                                    time.start === hour.start &&
                                    time.end === hour.end
                                  )
                              );
                            } else {
                              // Add if not selected
                              return [...prev, hour];
                            }
                          });
                        }}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all
            ${
              selectedTimeSlot.some(
                (time) => time.start === hour.start && time.end === hour.end
              )
                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                : bookedTime.some(
                    (time) => time.start === hour.start && time.end === hour.end
                  )
                ? "border-gray-300 bg-gray-200 text-gray-400 cursor-not-allowed"
                : "border-gray-300 hover:border-emerald-300 hover:bg-emerald-50"
            }
          `}
                      >
                        {hour.start}-{hour.end}
                      </button>
                    ) : null
                  )}
                </div>
              </div>

              {/* Customer Information */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-emerald-600" />
                  Customer Information
                </h4>
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Full Name"
                      {...register("name", {
                        required: "Name is required",
                        validate: (value) => {
                          const hasInvalidChars = /[^a-zA-Z\s]/.test(value);

                          if (hasInvalidChars) {
                            return "Name cannot contain numbers or special characters.";
                          }

                          return true;
                        },
                      })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors ${
                        errors.name
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                      }`}
                    />
                    {errors.name && (
                      <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.name.message}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      {...register("email", {
                        required: "Email is required",
                        validate: validateEmail,
                      })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors ${
                        errors.email
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                      }`}
                    />
                    {errors.email && (
                      <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.email.message}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <input
                      type="tel"
                      placeholder="Phone Number (8 digits)"
                      maxLength={8}
                      {...register("phone", {
                        required: "Contact is required",
                        pattern: {
                          value: /^(77|17)[0-9]{6}$/,
                          message:
                            "Contact must be 8 digits and start with 77 or 17",
                        },
                      })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors ${
                        errors.phone
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                      }`}
                    />
                    {errors.phone && (
                      <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.phone.message}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Booking Summary */}
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-5 mb-6 border border-emerald-200">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-emerald-600" />
                  Booking Summary
                </h4>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ground:</span>
                    <span className="font-medium">{ground.name}</span>
                  </div>

                  {selectedDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">
                        {new Date(selectedDate).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  )}

                  {selectedTimeSlot.length > 0 && (
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-600">Time Slots:</span>
                        <span className="font-medium">
                          {selectedTimeSlot.length} hour(s)
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {selectedTimeSlot.map((hour, key) => (
                          <div key={key} className="flex justify-between">
                            <span></span>
                            <span>
                              {hour.start}-{hour.end}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-t border-emerald-200 pt-2 mt-2">
                    <div className="flex justify-between text-lg font-bold text-emerald-700">
                      <span>Total Amount:</span>
                      <span>Nu.{getTotalAmount()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isBooking || selectedTimeSlot.length === 0}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-4 px-6 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:from-emerald-700 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                {isBooking ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    Confirm Booking - Nu.{getTotalAmount()}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingAdminPage;
