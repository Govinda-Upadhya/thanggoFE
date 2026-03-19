import React, { useState } from "react";
import {
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  X,
  Heart,
  Share2,
  Eye,
  Map,
} from "lucide-react";
import { type Ground } from "../../types/ground.ts";
import { useNavigate } from "react-router-dom";

interface GroundCardProps {
  ground: Ground;
}

const GroundCard: React.FC<GroundCardProps> = ({ ground }) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const getSportColor = (type: string) => {
    const colors = {
      Football: "bg-green-100 text-green-800",
      Basketball: "bg-orange-100 text-orange-800",
      Tennis: "bg-blue-100 text-blue-800",
      Badminton: "bg-red-100 text-red-800",
      Cricket: "bg-amber-100 text-amber-800",
      TableTennis: "bg-purple-100 text-purple-800",
      Volleyball: "bg-teal-100 text-teal-800",
      Rugby: "bg-pink-100 text-pink-800",
      Hockey: "bg-slate-100 text-slate-800",
      Baseball: "bg-amber-100 text-amber-800",
      Golf: "bg-emerald-100 text-emerald-800",
      Swimming: "bg-cyan-100 text-cyan-800",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getSportIcon = (type: string) => {
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
    return icons[type as keyof typeof icons] || "🏟️";
  };

  const handleViewDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowGallery(true);
  };

  const handleGalleryClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowGallery(false);
    setCurrentImageIndex(0);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? (ground.image?.length || 1) - 1 : prev - 1
    );
  };

  const handleThumbnailClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: ground.name,
        text: `Check out ${ground.name} sports ground!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // ✅ Google Maps handler
  const handleViewMapClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      ground.location
    )}`;
    window.open(mapsUrl, "_blank");
  };

  const images =
    ground.image && ground.image.length > 0
      ? ground.image
      : ["/placeholder.jpg"];

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-green-100 cursor-pointer">
        {/* Image with gallery controls */}
        <div className="relative h-52 overflow-hidden">
          <img
            src={images[currentImageIndex]}
            alt={ground.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Top left section - Sport type */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <span
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-sm ${getSportColor(
                ground.type
              )}`}
            >
              <span className="text-xs">{getSportIcon(ground.type)}</span>
              {ground.type}
            </span>
          </div>

          {/* Top right section - Favorite, Share, Map */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {/* ✅ Google Maps button */}
            <button
              onClick={handleViewMapClick}
              className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-green-50 transition-colors"
            >
              <Map className="h-4 w-4 text-gray-600" />
            </button>

            <button
              onClick={toggleFavorite}
              className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-red-50 transition-colors"
            >
              <Heart
                className={`h-4 w-4 ${
                  isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                }`}
              />
            </button>

            <button
              onClick={handleShare}
              className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-green-50 transition-colors"
            >
              <Share2 className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          {/* Image navigation dots */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => handleThumbnailClick(e, index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex
                      ? "bg-white scale-125"
                      : "bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Price badge - bottom right */}
          <div className="absolute bottom-3 right-3 bg-green-600 text-white rounded-lg px-2 py-1 shadow-sm">
            <span className="text-xs font-bold">
              Nu. {ground.pricePerHour}/hr
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title and location */}
          <div className="mb-3">
            <h3 className="text-lg font-bold text-gray-900 mb-1.5 line-clamp-1 group-hover:text-green-600 transition-colors">
              {ground.name}
            </h3>

            <div className="flex items-center text-gray-500 text-sm">
              <MapPin className="h-4 w-4 mr-1.5 text-green-500" />
              <span className="truncate">{ground.location}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
            {ground.description ||
              "A well-maintained sports ground with excellent facilities."}
          </p>

          {/* Features */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {(ground.features || []).slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md font-normal border border-green-100"
              >
                {feature}
              </span>
            ))}
            {ground.features && ground.features.length > 3 && (
              <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md font-normal border border-green-100">
                +{ground.features.length - 3}
              </span>
            )}
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3 p-2 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1 text-green-500" />
              <span>{ground.capacity} players</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-green-100">
            <button
              onClick={handleViewDetailsClick}
              className="text-sm text-green-600 hover:text-green-700 transition-colors flex items-center px-3 py-1.5 rounded-lg hover:bg-green-50 font-medium"
            >
              <Eye className="h-4 w-4 mr-1" />
              View Gallery
            </button>

            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md"
              onClick={() => navigate(`/booking/${ground._id}`)}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      {showGallery && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={handleGalleryClose}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleGalleryClose}
              className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Main image */}
            <div className="relative">
              <img
                src={images[currentImageIndex]}
                alt={ground.name}
                className="w-full h-[70vh] object-contain rounded-lg"
              />

              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 justify-center">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={(e) => handleThumbnailClick(e, index)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? "border-green-400 scale-110"
                        : "border-transparent hover:border-white/50"
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
            )}

            {/* Image counter */}
            <div className="text-white text-center mt-4">
              Image {currentImageIndex + 1} of {images.length}
            </div>

            {/* Ground info in modal */}
            <div className="mt-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg text-white">
              <h3 className="text-xl font-bold">{ground.name}</h3>
              <p className="text-white/80">{ground.location}</p>
              <div className="flex items-center mt-2">
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium ${getSportColor(
                    ground.type
                  )}`}
                >
                  {ground.type}
                </span>

                <div className="ml-3">
                  <span className="font-bold">Nu. {ground.pricePerHour}</span>
                  <span className="text-sm">/hr</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GroundCard;
