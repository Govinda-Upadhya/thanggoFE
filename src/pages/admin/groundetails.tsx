import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { base_url } from "../../types/ground";

const Groundetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ground, setGround] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroundDetails = async () => {
      try {
        const response = await axios.get(`${base_url}/admin/seeGround/${id}`, {
          withCredentials: true,
        });
        console.log(response);
        setGround(response.data);
      } catch (err) {
        console.error("Error fetching ground details:", err);
        setError("Failed to load ground details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchGroundDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-emerald-200">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-emerald-700 font-semibold">
            Loading Ground Details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-red-200 text-red-700 font-semibold">
        <p>{error}</p>
      </div>
    );
  }

  if (!ground) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-emerald-200 text-emerald-700 font-semibold">
        <p>Ground not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4">
      <div className="max-w-4xl w-full mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
        {/* Main Image Section */}
        <div className="relative h-64 sm:h-80 md:h-96">
          {ground.image && ground.image.length > 0 ? (
            <img
              src={ground.image[0]}
              alt={ground.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No Image Available</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black opacity-50 flex items-center justify-center">
            <h1 className="text-white opacity-100 text-4xl sm:text-5xl font-extrabold text-center drop-shadow-lg">
              {ground.name}
            </h1>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 sm:p-10 space-y-8">
          {/* General Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center p-4 bg-emerald-50 rounded-lg shadow-sm">
              <span className="text-emerald-500 mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.051 1.051A7.989 7.989 0 000 8c0 4.418 3.582 8 8 8s8-3.582 8-8c0-2.29-.982-4.354-2.551-5.727l-1.488 1.487A5.989 5.989 0 0113.9 8c0 3.31-2.69 6-6 6s-6-2.69-6-6a5.989 5.989 0 011.664-4.049L5.051 1.051zM14.243 14.243l-1.487-1.488A8.005 8.005 0 0016 8c0-1.282-.397-2.47-.899-3.46l1.487-1.487C17.018 4.646 18 6.208 18 8c0 5.523-4.477 10-10 10S-2 13.523-2 8a9.982 9.982 0 012.757-6.957L.899.899A11.989 11.989 0 00-4 8c0 6.627 5.373 12 12 12s12-5.373 12-12a11.989 11.989 0 00-3.157-8.001z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <div>
                <p className="font-bold text-gray-700">Location</p>
                <p className="text-gray-600">{ground.location}</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-emerald-50 rounded-lg shadow-sm">
              <span className="text-emerald-500 mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v6a1 1 0 102 0V5z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <div>
                <p className="font-bold text-gray-700">Price Per Hour</p>
                <p className="text-gray-600">
                  ₹{ground.pricePerHour.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center p-4 bg-emerald-50 rounded-lg shadow-sm">
              <span className="text-emerald-500 mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
              </span>
              <div>
                <p className="font-bold text-gray-700">Type</p>
                <p className="text-gray-600">{ground.type}</p>
              </div>
            </div>
          </div>

          {/* Location and Price */}

          {/* Description */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 border-b pb-2">
              Description
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {ground.description || "No description provided."}
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 border-b pb-2">
              Facilities
            </h3>
            {ground.features && ground.features.length > 0 ? (
              <ul className="list-disc list-inside space-y-2">
                {ground.features.map((feature, index) => (
                  <li key={index} className="text-gray-600">
                    {feature}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No facilities listed.</p>
            )}
          </div>

          {/* Availability */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 border-b pb-2">
              Availability
            </h3>
            {ground.availability && ground.availability.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {ground.availability.map((slot, index) => (
                  <span
                    key={index}
                    className="bg-emerald-100 text-emerald-800 text-sm font-semibold px-4 py-2 rounded-full"
                  >
                    {slot.start} - {slot.end}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No availability information.</p>
            )}
          </div>

          {/* Image Gallery */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 border-b pb-2">
              Ground Images
            </h3>
            {ground.image && ground.image.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {ground.image.map((url, index) => (
                  <div key={index} className="relative aspect-w-1 aspect-h-1">
                    <img
                      src={url}
                      alt={`Ground ${index + 1}`}
                      className="object-cover rounded-lg shadow-md w-full h-full"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">
                No images available for this ground.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Groundetails;
