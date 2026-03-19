import axios from "axios";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { base_url, upload_base_url } from "../../types/ground";
import {
  MapPin,
  Users,
  Star,
  Clock,
  Calendar,
  Image as ImageIcon,
  Plus,
  X,
  Trash2,
} from "lucide-react";
import { Bounce, toast, ToastContainer } from "react-toastify";

const Addground = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      type: "Football",
      location: "",
      capacity: 0,
      pricePerHour: 0,
      nightprice: 0,
      rating: 4,
      features: [""],
      availability: [{ start: "", end: "" }],
      description: "",
      admin: "",
    },
  });

  const {
    fields: timeFields,
    append: addTime,
    remove: removeTime,
  } = useFieldArray({
    control,
    name: "availability",
  });

  const {
    fields: featureFields,
    append: addFeature,
    remove: removeFeature,
  } = useFieldArray({
    control,
    name: "features",
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [activeTimePicker, setActiveTimePicker] = useState({
    index: null,
    type: null,
  });
  const currentRating = watch("rating", 4);

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      setImages((prev) => {
        const newFiles = [...prev];
        newFiles[index] = file;
        return newFiles;
      });

      setPreviews((prev) => {
        const newPreviews = [...prev];
        newPreviews[index] = URL.createObjectURL(file);
        return newPreviews;
      });
    }
  };

  const addImageField = () => {
    setImages((prev) => [...prev, null]);
    setPreviews((prev) => [...prev, null]);
  };

  const removeImageField = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleStarClick = (ratingValue) => {
    setValue("rating", ratingValue, { shouldValidate: true });
  };
  const generateTimeSlots = (startTime, endTime) => {
    const slots = [];
    let [startHour, startMin] = startTime.split(":").map(Number);
    let [endHour, endMin] = endTime.split(":").map(Number);

    while (
      startHour < endHour ||
      (startHour === endHour && startMin < endMin)
    ) {
      let nextHour = startHour + 1;
      let nextMin = startMin;

      const startStr = `${String(startHour).padStart(2, "0")}:${String(
        startMin
      ).padStart(2, "0")}`;
      const endStr = `${String(nextHour).padStart(2, "0")}:${String(
        nextMin
      ).padStart(2, "0")}`;

      slots.push({ start: startStr, end: endStr });

      startHour = nextHour;
      startMin = nextMin;
    }

    return slots;
  };

  // Convert 24h time to 12h format
  const to12HourFormat = (time24) => {
    if (!time24) return "";

    const [hours, minutes] = time24.split(":");
    const h = parseInt(hours);
    const period = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;

    return `${h12}:${minutes} ${period}`;
  };

  // Convert 12h time to 24h format
  const to24HourFormat = (time12) => {
    if (!time12) return "";

    const [time, period] = time12.split(" ");
    let [hours, minutes] = time.split(":");

    let h = parseInt(hours);
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;

    return `${h.toString().padStart(2, "0")}:${minutes}`;
  };

  // Time Picker Component for 12-hour format
  const TimePicker = ({ value, index, onChange, name, type, error }) => {
    const [time, setTime] = useState(value ? to12HourFormat(value) : "");

    const generateTimeOptions = () => {
      const options: JSX.Element[] = []; // 👈 explicitly say it's JSX

      for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += 60) {
          const time24 = `${h.toString().padStart(2, "0")}:${m
            .toString()
            .padStart(2, "0")}`;
          const timeString = `${h % 12 || 12}:${m
            .toString()
            .padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;

          options.push(
            <div
              key={time24}
              className={`p-2 hover:bg-green-100 cursor-pointer rounded ${
                value === time24 ? "bg-green-500 text-white" : ""
              }`}
              onClick={() => {
                setTime(timeString);
                onChange(time24);
                setActiveTimePicker({ index: null, type: null });
              }}
            >
              {timeString}
            </div>
          );
        }
      }

      return options;
    };

    const isActive =
      activeTimePicker.index === index && activeTimePicker.type === type;

    return (
      <div className="relative">
        <div className="flex items-center border border-gray-300 rounded-lg p-2 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 transition">
          <input
            type="text"
            value={time}
            onChange={(e) => {
              const newValue = e.target.value;
              setTime(newValue);
              onChange(to24HourFormat(newValue));
            }}
            onFocus={() => setActiveTimePicker({ index, type })}
            placeholder="HH:MM AM/PM"
            className="flex-1 outline-none"
            name={name}
          />
          <button
            type="button"
            onClick={() =>
              setActiveTimePicker(
                isActive ? { index: null, type: null } : { index, type }
              )
            }
            className="text-gray-400 hover:text-gray-600"
          >
            <Clock className="h-4 w-4" />
          </button>
        </div>

        {isActive && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {generateTimeOptions()}
          </div>
        )}

        {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
      </div>
    );
  };

  const onSubmit = async (data) => {
    const availability = data.availability.filter((a) => a.start && a.end);
    if (availability.length === 0) return alert("Please select availability");

    if (availability[0].start >= availability[0].end) {
      return alert("Start time should be earlier than the end time");
    }

    const slots = generateTimeSlots(availability[0].start, availability[0].end);
    const submitData = { ...data, availability: slots, images };

    try {
      // Upload images first
      const formData = new FormData();
      submitData.images.forEach((img) => {
        if (img) formData.append("files", img);
      });

      const urls = await axios.post(
        `${upload_base_url}/admin/uploads`,
        formData,
        { withCredentials: true }
      );

      // Send to backend
      const sendtobackend = await axios.post(
        `${base_url}/admin/createground`,
        {
          name: submitData.name,
          type: submitData.type,
          location: submitData.location,
          pricePerHour: submitData.pricePerHour,
          nightprice: submitData.nightprice,
          rating: submitData.rating,
          features: submitData.features.filter((f) => f !== ""),
          capacity: submitData.capacity,
          availability: submitData.availability.filter((a) => a.start && a.end),
          description: submitData.description,
          image: urls.data.urls,
          admin: submitData.admin,
        },
        { withCredentials: true }
      );

      if (sendtobackend.status === 200) {
        reset();
        setImages([]);
        setPreviews([]);
        toast.success("ground created successfully");
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        alert("Failed to create ground. Please check your information.");
      }
    } catch (error) {
      console.error("Error creating ground:", error);
      alert("An error occurred while creating the ground.");
    }
  };

  const getSportIcon = (type) => {
    const icons = {
      Football: "⚽",
      Basketball: "🏀",
      Tennis: "🎾",
      Badminton: "🏸",
      Cricket: "🏏",
      TableTennis: "🏓",
      Volleyball: "🏐",
      Rugby: "🏉",
      Hockey: "🏑",
      Baseball: "⚾",
      Golf: "⛳",
      Swimming: "🏊",
    };
    return icons[type] || "🏟️";
  };

  // Render star rating component with half-star capability
  const renderStarRating = () => {
    return (
      <div className="flex flex-col">
        <label className="block font-medium text-gray-700 mb-2">Rating</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => {
            const fullStar = star <= currentRating;
            const halfStar =
              currentRating >= star - 0.5 && currentRating < star;

            return (
              <div key={star} className="relative">
                <button
                  type="button"
                  className={`transform transition-all duration-200 ${
                    fullStar ? "scale-110 text-yellow-400" : "text-gray-300"
                  }`}
                  onClick={() => handleStarClick(star)}
                >
                  <Star
                    className={`h-6 w-6 ${fullStar ? "fill-current" : ""}`}
                  />
                </button>

                {/* Half star button */}
                <button
                  type="button"
                  className="absolute left-0 top-0 w-1/2 h-full overflow-hidden opacity-0"
                  onClick={() => handleStarClick(star - 0.5)}
                >
                  <span className="sr-only">Half star</span>
                </button>

                {/* Visual half star indicator */}
                {halfStar && (
                  <div className="absolute left-0 top-0 w-1/2 h-full overflow-hidden">
                    <Star className="h-6 w-6 text-yellow-400 fill-current" />
                  </div>
                )}
              </div>
            );
          })}
          <span className="ml-2 text-sm font-medium text-gray-700">
            {currentRating} {currentRating === 1 ? "Star" : "Stars"}
          </span>
          <input type="hidden" {...register("rating")} />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Click left side of star for half rating
        </p>
      </div>
    );
  };

  return (
    <div className="max-w-4xl w-full mx-auto bg-white shadow-lg rounded-2xl overflow-hidden border border-green-100">
      {/* Header with sporty design */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-6 text-white">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span className="bg-white/20 p-2 rounded-lg">🏟️</span>
          Add New Sports Ground
        </h2>
        <p className="text-green-100 mt-1">
          Fill in the details to list a new sports facility
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="md:col-span-2">
            <label className="block font-medium text-gray-700 mb-2">
              Ground Name
            </label>
            <div className="relative">
              <input
                type="text"
                {...register("name", { required: "Ground name is required" })}
                className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                placeholder="Enter ground name"
              />
              <span className="absolute left-3 top-3 text-gray-400">🏟️</span>
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Type */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Sport Type
            </label>
            <div className="relative">
              <select
                {...register("type", { required: "Type is required" })}
                className="w-full border border-gray-300 rounded-lg p-3 pl-10 appearance-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              >
                <option value="" disabled selected>
                  Choose a sport
                </option>
                <option value="Football">Football</option>
                <option value="Cricket">Cricket</option>
                <option value="Basketball">Basketball</option>
                <option value="Tennis">Tennis</option>
                <option value="Badminton">Badminton</option>
                <option value="TableTennis">Table Tennis</option>
                <option value="Volleyball">Volleyball</option>
                <option value="Rugby">Rugby</option>
                <option value="Hockey">Hockey</option>
                <option value="Baseball">Baseball</option>
                <option value="Golf">Golf</option>
                <option value="Swimming">Swimming</option>
              </select>
              <span className="absolute left-3 top-3 text-gray-400">
                {getSportIcon("Football")}
              </span>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Capacity */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Capacity
            </label>
            <div className="relative">
              <input
                type="number"
                {...register("capacity", {
                  required: "Capacity is required",
                  min: { value: 1, message: "Capacity must be at least 1" },
                })}
                className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                placeholder="Number of players"
              />
              <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
            {errors.capacity && (
              <p className="text-red-500 text-sm mt-1">
                {errors.capacity.message}
              </p>
            )}
          </div>

          {/* Location */}
          <div className="md:col-span-2">
            <label className="block font-medium text-gray-700 mb-2">
              Location
            </label>
            <div className="relative">
              <input
                type="text"
                {...register("location", { required: "Location is required" })}
                className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                placeholder="Street name, village, gewog, dzongkhag"
              />
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">
                {errors.location.message}
              </p>
            )}
          </div>

          {/* Price per Hour */}
          <div className="w-full">
            <label className="block font-medium text-gray-700 mb-2">
              Price Per Hour (Nu.)
            </label>
            <div className="relative w-full">
              <input
                type="number"
                {...register("pricePerHour", {
                  required: "Price per hour is required",
                  min: { value: 0, message: "Price cannot be negative" },
                })}
                className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                placeholder="0.00"
              />
              <span className="absolute left-3 top-3 text-gray-400">Nu.</span>
            </div>
            {errors.pricePerHour && (
              <p className="text-red-500 text-sm mt-1">
                {errors.pricePerHour.message}
              </p>
            )}
          </div>
          {/* Price per Hour at night*/}
          <div className="w-full">
            <label className="block font-medium text-gray-700 mb-2">
              Price Per Hour at Night (Nu.)
            </label>
            <div className="relative w-full">
              <input
                type="number"
                {...register("nightprice", {
                  required: "Price per hour is required",
                  min: { value: 0, message: "Price cannot be negative" },
                })}
                className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                placeholder="0.00"
              />
              <span className="absolute left-3 top-3 text-gray-400">Nu.</span>
            </div>
            {errors.nightprice && (
              <p className="text-red-500 text-sm mt-1">
                {errors.nightprice.message}
              </p>
            )}
          </div>

          {/* Rating - Moved next to Price Per Hour */}
        </div>

        {/* Features */}
        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
          <label className="block font-medium text-gray-700 mb-2">
            Facilities & Amenities
          </label>
          <p className="text-sm text-gray-500 mb-3">
            Add features like changing rooms, floodlights, parking, etc.
          </p>

          <div className="space-y-3">
            {featureFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <input
                  type="text"
                  {...register(`features.${index}`)}
                  className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                  placeholder="Add facility"
                />
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => addFeature("")}
            className="mt-3 flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
          >
            <Plus className="h-4 w-4" /> Add Facility
          </button>
        </div>

        {/* Images */}
        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
          <label className="block font-medium text-gray-700 mb-2">
            Ground Images
          </label>
          <p className="text-sm text-gray-500 mb-3">
            Upload high-quality images of your sports ground
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((_, index) => (
              <div
                key={index}
                className="border border-dashed border-green-300 rounded-xl p-4 bg-white"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    Image {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeImageField(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <label className="block relative h-40 border-2 border-dashed border-green-300 rounded-lg cursor-pointer hover:border-green-400 transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, index)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  {previews[index] ? (
                    <img
                      src={previews[index]}
                      alt="preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <ImageIcon className="h-8 w-8 mb-2" />
                      <span className="text-sm">Click to upload</span>
                    </div>
                  )}
                </label>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addImageField}
            className="mt-4 flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
          >
            <Plus className="h-4 w-4" /> Add Another Image
          </button>
        </div>

        {/* Availability */}
        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
          <label className="block font-medium text-gray-700 mb-2">
            Availability Schedule
          </label>
          <p className="text-sm text-gray-500 mb-3">
            Select start and end time — slots will be auto generated (1 hour
            each).
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <TimePicker
              value={watch("availability.0.start")}
              onChange={(value) => setValue("availability.0.start", value)}
              index={0}
              type="start"
              error={errors.availability?.[0]?.start}
            />
            <TimePicker
              value={watch("availability.0.end")}
              onChange={(value) => setValue("availability.0.end", value)}
              index={0}
              type="end"
              error={errors.availability?.[0]?.end}
            />
          </div>
        </div>
        {/* Description */}
        <div>
          <label className="block font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            {...register("description")}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            rows={4}
            placeholder="Describe the ground, its features, and any special notes for players..."
          />
        </div>

        {/* Admin */}
        <div>
          <label className="block font-medium text-gray-700 mb-2">
            Admin Contact
          </label>
          <input
            type="text"
            {...register("admin", {
              required: "Contact is required",
              pattern: {
                value: /^(77|17)[0-9]{6}$/,
                message: "Contact must be 8 digits and start with 77 or 17",
              },
            })}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            placeholder="Admin name or contact information"
          />
          {errors.admin && (
            <p className="text-red-500 text-sm mt-1">{errors.admin.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white py-3 rounded-xl font-medium hover:from-green-700 hover:to-emerald-600 transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
              Creating Ground...
            </span>
          ) : (
            "Create Ground Listing"
          )}
        </button>
      </form>
      <ToastContainer
        position="top-right"
        autoClose={3000}
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

export default Addground;
