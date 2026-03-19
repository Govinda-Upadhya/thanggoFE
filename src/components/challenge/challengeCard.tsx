import React, { useState } from "react";
import { Calendar, Users, Mail, MapPin, Trophy, ChevronDown, ChevronUp, Star } from "lucide-react";

interface ChallengeCardProps {
  teamName: string;
  teamImage: string;
  availability: string;
  playersCount: number;
  sport: string;
  email: string;
  description: string;
  onAccept: () => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  teamName,
  teamImage,
  availability,
  playersCount,
  sport,
  email,
  onAccept,
  description,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const getSportColor = (sport: string) => {
    const colors = {
      Football: "from-green-500 to-emerald-600",
      Basketball: "from-orange-500 to-amber-600",
      Cricket: "from-blue-500 to-cyan-600",
      Tennis: "from-purple-500 to-violet-600",
      Badminton: "from-red-500 to-rose-600",
    };
    return colors[sport as keyof typeof colors] || "from-emerald-500 to-green-600";
  };

  const getSportIcon = (sport: string) => {
    const icons = {
      Football: "⚽",
      Basketball: "🏀",
      Cricket: "🏏",
      Tennis: "🎾",
      Badminton: "🏸",
    };
    return icons[sport as keyof typeof icons] || "🏆";
  };

  return (
    <div 
      className="relative bg-white rounded-2xl overflow-hidden group cursor-pointer transform transition-all duration-500 hover:scale-[1.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute top-0 left-0 w-32 h-32 bg-green-200 rounded-full -translate-x-12 -translate-y-12 opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-emerald-200 rounded-full translate-x-12 translate-y-12 opacity-20"></div>
      </div>
      
      {/* Glowing border effect on hover */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${getSportColor(sport)} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
      
      {/* Main card content */}
      <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-2xl border border-emerald-100 overflow-hidden h-full flex flex-col">
        {/* Team Image with parallax effect */}
        <div className="relative h-44 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
          
          <img
            src={imageError ? "/api/placeholder/400/200" : teamImage}
            alt={teamName}
            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
          
          {/* Sport badge with gradient */}
          <div className="absolute top-4 left-4 z-20">
            <div className={`bg-gradient-to-r ${getSportColor(sport)} text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md`}>
              <span className="text-sm">{getSportIcon(sport)}</span> 
              <span>{sport}</span>
            </div>
          </div>
          
          {/* Players count */}
          <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-emerald-800 shadow-sm">
            {playersCount} vs {playersCount}
          </div>
          
          {/* Team name overlay */}
          <div className="absolute bottom-4 left-4 right-4 z-20">
            <h3 className="text-xl font-bold text-white drop-shadow-md">{teamName}</h3>
          </div>
        </div>

        {/* Card content */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Info items with subtle animations */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center text-sm text-gray-600 transition-all duration-300 hover:text-emerald-700">
              <div className="p-2 bg-emerald-100 rounded-lg mr-3">
                <Calendar className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-emerald-500">WHEN</p>
                <p className="font-medium">{availability}</p>
              </div>
            </div>
            
            <div className="flex items-center text-sm text-gray-600 transition-all duration-300 hover:text-emerald-700">
              <div className="p-2 bg-emerald-100 rounded-lg mr-3">
                <Users className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-emerald-500">PLAYERS</p>
                <p className="font-medium">{playersCount} needed</p>
              </div>
            </div>
            
            <div className="flex items-center text-sm text-gray-600 transition-all duration-300 hover:text-emerald-700">
              <div className="p-2 bg-emerald-100 rounded-lg mr-3">
                <Mail className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-emerald-500">CONTACT</p>
                <p className="font-medium truncate">{email}</p>
              </div>
            </div>
          </div>

          {/* Expandable description */}
          <div className="mb-4">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-between w-full text-sm text-emerald-600 hover:text-emerald-800 transition-all duration-300 py-2 px-3 bg-emerald-50 rounded-lg hover:bg-emerald-100"
            >
              <span className="font-medium flex items-center">
                <Trophy className="h-4 w-4 mr-2 text-emerald-500" />
                Challenge Details
              </span>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 transition-transform duration-300" />
              ) : (
                <ChevronDown className="h-4 w-4 transition-transform duration-300" />
              )}
            </button>
            
            {isExpanded && (
              <div className="mt-2 p-3 bg-emerald-50 rounded-lg text-sm text-gray-700 animate-fade-in">
                <p>{description || "No description provided."}</p>
              </div>
            )}
          </div>

          {/* Accept Button with advanced animations */}
          <div className="mt-auto pt-4 border-t border-emerald-100">
            <button
              onClick={onAccept}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
              className={`w-full py-3 px-4 rounded-xl font-bold transition-all duration-500 flex items-center justify-center gap-2 relative overflow-hidden ${
                isButtonHovered 
                  ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg transform scale-105" 
                  : "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md"
              }`}
            >
              {/* Animated background elements */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute top-0 left-0 w-8 h-8 bg-white/20 rounded-full -translate-x-4 -translate-y-4"></div>
                <div className="absolute bottom-0 right-0 w-10 h-10 bg-white/20 rounded-full translate-x-4 translate-y-4"></div>
              </div>
              
              {/* Trophy icon with glow effect */}
              <div className={`relative z-10 flex items-center justify-center h-6 w-6 rounded-full transition-all duration-500 ${
                isButtonHovered 
                  ? 'bg-yellow-100 glow-animation transform scale-110' 
                  : 'bg-white/20'
              }`}>
                <Trophy className={`h-3 w-3 transition-colors duration-500 ${
                  isButtonHovered ? 'text-yellow-500' : 'text-white'
                }`} />
              </div>
              
              <span className="relative z-10">Accept Challenge</span>
              
              {/* Shimmer effect on hover */}
              {isButtonHovered && (
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-0 left-0 h-full w-10 bg-white/20 skew-x-12 animate-shimmer"></div>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Add custom styles */}
      <style>{`
        @keyframes fade-in {
          from { 
            opacity: 0; 
            transform: translateY(-8px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        .animate-fade-in {
          animation: fade-in 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        @keyframes glow {
          0% { 
            box-shadow: 0 0 5px rgba(234, 179, 8, 0.6);
          }
          50% { 
            box-shadow: 0 0 15px rgba(234, 179, 8, 0.9);
          }
          100% { 
            box-shadow: 0 0 5px rgba(234, 179, 8, 0.6);
          }
        }
        .glow-animation {
          animation: glow 1.5s ease-in-out infinite;
        }
        
        @keyframes shimmer {
          0% { 
            transform: translateX(-100%) skewX(-12deg);
          }
          100% { 
            transform: translateX(200%) skewX(-12deg);
          }
        }
        .animate-shimmer {
          animation: shimmer 1s ease-in-out;
        }
        
        .group:hover .shadow-spread {
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
};

export default ChallengeCard;