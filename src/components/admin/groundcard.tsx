import axios from "axios";
import React, { useState, useRef } from "react";
import { data, useNavigate } from "react-router-dom";
import { base_url, upload_base_url, type Ground } from "../../types/ground";

const Groundcard = ({ ground, onUpdate }) => {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const navigate = useNavigate();
  const [newImagesUrls, setNewImagesUrls] = useState<string[]>([]);
  const [removedImageUrls, setRemovedImageUrls] = useState<string[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const fileInputRef = useRef(null);

  // Initialize form data with ground details
  const [editFormData, setEditFormData] = useState({
    name: ground.name || "",
    type: ground.type || "Football",
    location: ground.location || "",
    capacity: ground.capacity || 0,
    pricePerHour: ground.pricePerHour || 0,
    features: ground.features || [],
    images: ground.image || [],
    availability: ground.availability || [],
    description: ground.description || "",
  });

  const [newFacility, setNewFacility] = useState("");
  const [newAvailability, setNewAvailability] = useState({
    start: "",
    end: "",
  });
  const [uploadingImages, setUploadingImages] = useState(false);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      3000
    );
  };
  function showDeletePopUp(e) {
    e.stopPropagation();
    setShowDeletePopup(true);
  }

  const handleDelete = async (e: boolean) => {
    if (e) {
      setIsDeleting(true);
      try {
        // Replace with your actual API endpoint
        await axios.delete(`${base_url}/admin/deleteground/${ground._id}`, {
          withCredentials: true,
        });

        showNotification("Ground deleted successfully!", "success");
        setShowDeletePopup(false);
      } catch (error) {
        console.error("Error deleting ground:", error);
        showNotification("Failed to delete ground. Please try again.", "error");
        setIsDeleting(false);
      }
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();

    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    setIsUpdating(true);

    try {
      // Format the data correctly for the API
      const formattedData = {
        ...editFormData,
        capacity: parseInt(editFormData.capacity),
        removedImages: removedImageUrls,
        newImageUrls: newImagesUrls,
        pricePerHour: parseFloat(editFormData.pricePerHour),
      };
      console.log(formattedData);

      if (formattedData.images.length == 0) {
        alert("there has to be one image");
        return;
      }
      if (formattedData.features.length == 0) {
        alert("there has to be one facility");

        return;
      }
      if (formattedData.availability.length == 0) {
        alert("there has to be one time slot availability");
        return;
      }
      // Replace with your actual API endpoint
      const response = await axios.put(
        `${base_url}/admin/updateground/${ground._id}`,
        formattedData,
        {
          withCredentials: true,
        }
      );
      console.log(response.data);

      if (onUpdate) {
        onUpdate(response.data);
      }

      setShowEditModal(false);
      showNotification("Ground updated successfully!", "success");
      window.location.reload();
    } catch (error) {
      console.error("Error updating ground:", error);
      alert(error.response.data);
      showNotification("Failed to update ground. Please try again.", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleAddFacility = () => {
    if (newFacility.trim()) {
      setEditFormData({
        ...editFormData,
        features: [...editFormData.features, newFacility.trim()],
      });
      setNewFacility("");
    }
  };

  const handleRemoveFacility = (index) => {
    const updatedFacilities = [...editFormData.features];
    updatedFacilities.splice(index, 1);
    setEditFormData({
      ...editFormData,
      features: updatedFacilities,
    });
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);

        const uploads = await axios.post(
          `${upload_base_url}/admin/upload`,
          formData,
          { withCredentials: true }
        );

        uploadedUrls.push(uploads.data.url);
      }
      console.log("uplaoded urls", uploadedUrls);
      // ✅ Store both preview and send to API later
      setNewImagesUrls((prev) => [...prev, ...uploadedUrls]);

      // ✅ Add to form data so preview appears immediately
      setEditFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));

      showNotification("Images uploaded successfully!", "success");
    } catch (error) {
      console.error("Error uploading images:", error);
      showNotification("Failed to upload images. Please try again.", "error");
    } finally {
      setUploadingImages(false);
    }
  };

  const handleRemoveImage = async (index) => {
    const updatedImages = [...editFormData.images];
    console.log(updatedImages[index]);
    setRemovedImageUrls([...removedImageUrls, updatedImages[index]]);
    updatedImages.splice(index, 1);
    setEditFormData({
      ...editFormData,
      images: updatedImages,
    });
  };

  const handleAddAvailability = () => {
    if (newAvailability.start && newAvailability.end) {
      setEditFormData({
        ...editFormData,
        availability: [...editFormData.availability, { ...newAvailability }],
      });
      setNewAvailability({ start: "", end: "" });
    }
  };

  const handleRemoveAvailability = (index) => {
    const updatedAvailability = [...editFormData.availability];
    updatedAvailability.splice(index, 1);
    setEditFormData({
      ...editFormData,
      availability: updatedAvailability,
    });
  };

  return (
    <>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 transform ${
          isHovered
            ? "scale-105 shadow-2xl -translate-y-2"
            : "scale-100 shadow-lg"
        } ${
          isDeleting ? "opacity-0 scale-95" : "opacity-100"
        } relative w-full max-w-xs mx-auto sm:max-w-full mb-6 cursor-pointer border-2 border-emerald-100 hover:border-emerald-300`}
      >
        {/* Image container with overlay effect */}
        <div className="relative overflow-hidden">
          <img
            src={
              ground.image && ground.image[0]
                ? ground.image[0]
                : "https://via.placeholder.com/300x200?text=No+Image"
            }
            alt={ground.name}
            className={`w-full h-48 object-cover transition-transform duration-700 ${
              isHovered ? "scale-110" : "scale-100"
            }`}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 flex items-end">
            <div className="p-4 text-white">
              <h3 className="text-xl font-bold drop-shadow-md">
                {ground.name}
              </h3>
            </div>
          </div>

          {/* Status badge */}
          {/* <span
            className={`absolute top-3 left-3 px-3 py-1 text-xs font-bold rounded-full shadow-md ${
              ground.status === "Available"
                ? "bg-emerald-500 text-white"
                : "bg-amber-500 text-white"
            } transition-all duration-300 ${isHovered ? "scale-110" : ""}`}
          >
            {ground.type || "Unknown"}
          </span> */}

          {/* Action buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {/* Edit button */}
            <button
              type="button"
              onClick={(e) => handleEditClick(e)}
              className="p-2 bg-white text-emerald-600 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 hover:bg-emerald-50 active:scale-95 group"
              aria-label="Edit ground"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 group-hover:rotate-12 transition-transform"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>

            {/* Delete button */}
            <button
              type="button"
              onClick={(e) => showDeletePopUp(e)}
              className="p-2 bg-white text-red-500 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 hover:bg-red-50 active:scale-95 group"
              aria-label="Delete ground"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 group-hover:shake"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content section */}
        <div className="p-5 bg-gradient-to-b from-white to-emerald-50">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {ground.name}
          </h3>

          <div className="flex items-start mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-emerald-500 mt-0.5 mr-2 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <p className="text-sm text-gray-600">{ground.location}</p>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-emerald-100">
            <div className="flex items-center space-x-2 bg-emerald-100 px-3 py-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-emerald-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5.5 12.5a.5.5 0 100 1h9a.5.5 0 100-1h-9z" />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v6a1 1 0 102 0v-6z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-emerald-800 font-semibold text-sm">
                {ground.capacity} Players
              </span>
            </div>
            <div
              onClick={() => navigate(`/admin/booking/${ground._id}`)}
              className="text-emerald-600 font-medium text-sm bg-white px-3 py-2 rounded-full border border-emerald-200 hover:bg-emerald-50 transition-colors"
            >
              Update Booking{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </div>

            <div
              onClick={() => navigate(`/admin/ground/${ground._id}`)}
              className="text-emerald-600 font-medium text-sm bg-white px-3 py-2 rounded-full border border-emerald-200 hover:bg-emerald-50 transition-colors"
            >
              View Details{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </div>
          </div>
        </div>

        {/* Hover effect line */}
        <div
          className={`h-1 bg-gradient-to-r from-emerald-400 to-green-400 transition-all duration-300 ${
            isHovered ? "w-full" : "w-0"
          }`}
        ></div>
      </div>

      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform ${
            notification.type === "success"
              ? "bg-emerald-500 text-white"
              : "bg-red-500 text-white"
          } ${
            notification.show
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0"
          }`}
        >
          <div className="flex items-center">
            <div
              className={`mr-3 p-2 rounded-full ${
                notification.type === "success"
                  ? "bg-emerald-600"
                  : "bg-red-600"
              }`}
            >
              {notification.type === "success" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <div>
              <p className="font-medium">{notification.message}</p>
            </div>
            <button
              onClick={() =>
                setNotification({ show: false, message: "", type: "" })
              }
              className="ml-4 text-white hover:text-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          {/* Blurred glass-like background */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>

          {/* Popup card */}
          <div className="relative flex flex-col justify-center items-center bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8 max-w-lg w-full shadow-2xl transform scale-95 opacity-0 animate-popup">
            <h2 className="text-2xl font-bold mb-6">Confirm Delete</h2>
            <p className="mb-6 text-gray-700 text-lg">
              Are you sure you want to delete the ground?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={(e) => {
                  setConfirmDelete(true);
                  handleDelete(true);
                }}
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition"
              >
                {isDeleting ? "deleting..." : "yes"}
              </button>
              <button
                onClick={() => setShowDeletePopup(false)}
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal with blurred background */}
      {showEditModal && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div
            className="bg-white rounded-2xl overflow-hidden w-full max-w-3xl my-8 shadow-2xl border border-emerald-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-emerald-500 p-4 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold">Edit Ground</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-white hover:text-emerald-200 transition-colors p-1 rounded-full hover:bg-emerald-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form
              onSubmit={handleEditSubmit}
              className="p-6 max-h-[70vh] overflow-y-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="name"
                  >
                    Ground Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={editFormData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="type"
                  >
                    Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={editFormData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  >
                    <option value="Football">Football</option>
                    <option value="Cricket">Cricket</option>
                    <option value="Tennis">Tennis</option>
                    <option value="Basketball">Basketball</option>
                    <option value="Volleyball">Volleyball</option>
                    <option value="Badminton">Badminton</option>
                    <option value="Rugby">Rugby</option>
                    <option value="Hockey">Hockey</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="address"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={editFormData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="capacity"
                  >
                    Capacity
                  </label>
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    value={editFormData.capacity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                    min="1"
                  />
                </div>

                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="pricePerHour"
                  >
                    Price Per Hour (Nu)
                  </label>
                  <input
                    type="number"
                    id="pricePerHour"
                    name="pricePerHour"
                    value={editFormData.pricePerHour}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Facilities
                </label>
                <div className="flex mb-2">
                  <input
                    type="text"
                    value={newFacility}
                    onChange={(e) => setNewFacility(e.target.value)}
                    placeholder="Add a facility"
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddFacility}
                    className="bg-emerald-500 text-white px-4 py-2 rounded-r-lg hover:bg-emerald-600 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {editFormData.features.map((facility, index) => (
                    <span
                      key={index}
                      className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full flex items-center"
                    >
                      {facility}
                      <button
                        type="button"
                        onClick={() => handleRemoveFacility(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Existing Images
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                  {editFormData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Ground ${index}`}
                        className="w-full h-24 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>

                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Upload New Images
                </label>
                <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-emerald-300 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    multiple
                    accept="image/*"
                    className="hidden"
                  />
                  <div
                    className="text-center"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-emerald-500 mx-auto mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-sm text-emerald-700">
                      {uploadingImages
                        ? "Uploading..."
                        : "Click to upload images"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Availability (24h HH:mm)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                  <input
                    type="time"
                    value={newAvailability.start}
                    onChange={(e) =>
                      setNewAvailability({
                        ...newAvailability,
                        start: e.target.value,
                      })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="time"
                    value={newAvailability.end}
                    onChange={(e) =>
                      setNewAvailability({
                        ...newAvailability,
                        end: e.target.value,
                      })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddAvailability}
                    className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    Add Time Slot
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {editFormData.availability.map((slot, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center"
                    >
                      {slot.start} - {slot.end}
                      <button
                        type="button"
                        onClick={() => handleRemoveAvailability(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={editFormData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 flex items-center"
                >
                  {isUpdating ? (
                    <>
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
                      Updating...
                    </>
                  ) : (
                    "Update Ground"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Groundcard;
