import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Plus,
  ChevronDown,
  Play,
  Trophy,
  Users,
  Calendar,
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  X,
} from "lucide-react";
import { base_url, type Ground } from "../../types/ground";

import SearchBar from "../../components/search/SearchBar";
import GroundCard from "../../components/ground/GroundCard";
import ChallengeCard from "../../components/challenge/challengeCard";
import axios from "axios";
import GoogleLoader from "../../components/Loader";

const HomePage: React.FC = () => {
  const [showChallengeInfoPopup, setShowChallengeInfoPopup] = useState(false);
  const [hasSeenChallengeInfo, setHasSeenChallengeInfo] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchDate, setSearchDate] = useState("");
  const [availableGroundIds, setAvailableGroundIds] = useState<string[]>([]);
  const [searchName, setSearchName] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [activeTab, setActiveTab] = useState<"grounds" | "rivals">("grounds");
  const [challenges, setChallenges] = useState<any[]>([]);
  const [challengeSearch, setChallengeSearch] = useState("");
  const [challengeDateSearch, setChallengeDateSearch] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [activePolicy, setActivePolicy] = useState<string | null>(null);
  const handleTabClick = (tab: "grounds" | "rivals") => {
    setActiveTab(tab);
    // Only show the popup if the user clicks Challenges for the first time
    if (tab === "rivals" && !hasSeenChallengeInfo) {
      setShowChallengeInfoPopup(true); // show the popup
      setHasSeenChallengeInfo(true); // mark it as "seen"
    }
  };
  async function fetchGrounds() {
    setLoading(true);
    const res = await axios.get(`${base_url}/users/getgrounds`, {
      withCredentials: true,
    });
    setGrounds(res.data.ground);
    console.log(res.data.ground);
    setAvailableGroundIds(res.data.ground.map((g) => g._id));

    setLoading(false);
  }
  async function fetchChallenges() {
    try {
      setLoading(true);
      const res = await axios.get(`${base_url}/users/getChallenge`);
      console.log(res.data.challenges);
      setChallenges(res.data.challenges);
    } catch (error) {
      console.error("Error fetching challenges:", error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchGrounds();
    fetchChallenges();
  }, []);

  function handleAccept(id: string) {
    navigate(`/acceptChallenge/${id}`);
  }

  const handleSearch = (
    name: string,
    type: string,
    date: string,
    location: string
  ) => {
    setSearchName(name);
    setSearchType(type);
    setSearchDate(date);
    setSearchLocation(location.trim());
  };

  const filteredGrounds = useMemo(() => {
    return grounds.filter((ground) => {
      const matchesName = ground.name
        .toLowerCase()
        .includes(searchName.toLowerCase());
      const matchesType =
        !searchType ||
        ground.type.trim().toLowerCase() === searchType.trim().toLowerCase();
      const matchesDate =
        !searchDate || availableGroundIds.includes(ground._id);
      const matchesLocation =
        !searchLocation ||
        ground.location?.toLowerCase().includes(searchLocation.toLowerCase());

      return matchesName && matchesType && matchesDate && matchesLocation;
    });
  }, [
    grounds,
    searchName,
    searchType,
    searchDate,
    searchLocation,
    availableGroundIds,
  ]);

  const handleAddChallenge = () => {
    navigate("/addChallenge");
  };

  const filteredChallenges = useMemo(() => {
    return challenges.filter((challenge) => {
      const query = challengeSearch.toLowerCase();
      const dateQuery = challengeDateSearch;

      let availabilityData: any[] = [];
      if (typeof challenge.availability === "string") {
        try {
          availabilityData = JSON.parse(challenge.availability);
        } catch {
          availabilityData = [];
        }
      } else {
        availabilityData = challenge.availability;
      }

      const matchesName = challenge.teamName?.toLowerCase().includes(query);
      const matchesEmail = challenge.email?.toLowerCase().includes(query);
      const matchesDescription = challenge.description
        ?.toLowerCase()
        .includes(query);
      const matchesSport = challenge.sport?.toLowerCase().includes(query);

      const textMatches =
        matchesName || matchesEmail || matchesDescription || matchesSport;

      const dateMatches =
        !dateQuery ||
        availabilityData.some((slot: any) => slot.date === dateQuery);

      return textMatches && dateMatches;
    });
  }, [challenges, challengeSearch, challengeDateSearch]);
  useEffect(() => {
    console.log(new Date().toString());
    // Shows local server timezone

    console.log(new Date().toISOString());
    // Always UTC (may look like "yesterday")

    return () => {};
  }, []);
  const openPolicy = (policy: string) => {
    setActivePolicy(policy);
  };

  const closePolicy = () => {
    setActivePolicy(null);
  };

  // Policy content
  const policyContent = {
    privacy: {
      title: "Privacy Policy",
      content: `# Privacy Policy

Last updated: September 7, 2024

## 1. Introduction

Welcome to ThangGo. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.

## 2. Information We Collect

We may collect personal information that you voluntarily provide to us when you:
- Create an account
- Make a booking
- Participate in challenges
- Contact us

## 3. How We Use Your Information

We use the information we collect to:
- Provide and maintain our services
- Process your transactions
- Send you administrative information
- Respond to your inquiries

## 4. Data Security

We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.`,
    },
    terms: {
      title: "Terms of Service",
      content: `# Terms of Service

Last updated: September 7, 2024

## 1. Acceptance of Terms

By accessing or using ThangGo's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.

## 2. User Accounts

When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account and password.

## 3. Bookings and Payments

All ground bookings are subject to availability. Payments must be made in accordance with our pricing and payment terms.

## 4. User Conduct

You agree not to use the service to:
- Violate any applicable laws
- Harass other users
- Upload malicious content

## 5. Limitation of Liability

ThangGo shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.`,
    },
    cookies: {
      title: "Cookie Policy",
      content: `# Cookie Policy

Last updated: September 7, 2024

## 1. What Are Cookies

Cookies are small text files that are placed on your device by websites that you visit. They are widely used to make websites work more efficiently and provide information to the site owners.

## 2. How We Use Cookies

We use cookies for several purposes:
- Essential cookies: Required for the basic functions of our website
- Performance cookies: Help us understand how visitors interact with our website
- Functionality cookies: Enable enhanced functionality and personalization
- Targeting cookies: Used to deliver relevant advertisements

## 3. Your Choices Regarding Cookies

You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of our website may become inaccessible or not function properly.`,
    },
  };
  if (loading) {
    return <GoogleLoader />;
  }
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Premium Sports Hero Section */}
      <div className="relative h-screen overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-emerald-900">
        {/* Animated background elements */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-0 left-0 w-72 h-72 bg-green-600 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-emerald-500 rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-green-700 rounded-full filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>

        {/* Animated soccer field lines */}
        <div className="absolute inset-0 z-0 opacity-10">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-1 bg-white"
              style={{ top: `${i * 10}%` }}
            ></div>
          ))}
          <div className="absolute top-1/2 left-0 w-full h-2 bg-white transform -translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/2 w-40 h-40 border-4 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-4">
          {/* Main headline with animation */}
          <div className="mb-8 overflow-hidden">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 text-white uppercase tracking-tighter animate-slide-up">
              <span className="block">PLAY</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-400">
                LIKE A PRO
              </span>
            </h1>
          </div>

          {/* Subheadline */}
          <div className="mb-12 animate-fade-in-up animation-delay-300">
            <p className="text-xl md:text-2xl font-medium text-green-100 mb-4">
              Book premium sports grounds. Challenge worthy opponents.
            </p>
            <p className="text-lg text-green-200 max-w-2xl mx-auto">
              Experience the thrill of competition on the best fields in town
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 mb-16 animate-fade-in-up animation-delay-500">
            <button
              onClick={() =>
                document
                  .getElementById("search-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="group relative bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full transform hover:scale-105 transition-all duration-300 shadow-2xl flex items-center justify-center overflow-hidden"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <span className="relative z-10 flex items-center">
                FIND GROUNDS
                <ChevronDown className="ml-2 h-5 w-5 group-hover:animate-bounce" />
              </span>
              <div
                className={`absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 transform ${
                  isHovered ? "translate-x-0" : "-translate-x-full"
                } transition-transform duration-500`}
              ></div>
            </button>

            {/* <button className="group bg-transparent border-2 border-white hover:bg-white text-white hover:text-green-800 font-bold py-4 px-8 rounded-full transform hover:scale-105 transition-all duration-300 shadow-xl flex items-center justify-center">
              <span className="flex items-center">
                WATCH VIDEO
                <Play className="ml-2 h-4 w-4 fill-current" />
              </span>
            </button> */}
          </div>

          {/* Enhanced Interactive Stats Bar */}
          <div className=" animate-fade-in-up animation-delay-700">
            <div className="flex flex-col md:flex-row justify-center items-center md:items-start space-y-8 md:space-y-0 md:space-x-4 lg:space-x-12 xl:space-x-20 2xl:space-x-28">
              {[
                {
                  number: "24/7",
                  label: "BOOKING",
                  icon: Calendar,
                  description: "Book anytime, anywhere",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="m-4 text-center group cursor-pointer transform hover:scale-110 transition-all duration-500 flex flex-col items-center w-40"
                >
                  {/* Animated counter circle */}
                  <div className="relative mb-4 w-20 h-20 flex items-center justify-center">
                    {/* Background circle with pulse animation */}
                    <div className="absolute inset-0 bg-green-700 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500 md:animate-ping"></div>

                    {/* Main circle */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-emerald-500 group-hover:from-emerald-500 group-hover:to-green-600 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg group-hover:shadow-2xl">
                      <stat.icon className="h-8 w-8 text-white transform group-hover:scale-110 transition-transform duration-300" />
                    </div>

                    {/* Progress ring effect on hover */}
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                      <circle
                        cx="50%"
                        cy="50%"
                        r="38"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray="239"
                        strokeDashoffset="239"
                        className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                      />
                    </svg>
                  </div>

                  {/* Animated numbers with counting effect */}
                  <div className="relative overflow-hidden h-10 mb-2">
                    <div className="text-3xl md:text-4xl font-black text-white group-hover:text-emerald-300 transition-colors duration-500 transform group-hover:translate-y-0 translate-y-0">
                      {stat.number}
                    </div>
                  </div>

                  {/* Label with hover effect */}
                  <div className="text-sm font-semibold text-green-200 group-hover:text-white transition-colors duration-500 mb-2 uppercase tracking-wide">
                    {stat.label}
                  </div>

                  {/* Description that appears on hover */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-48 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                    <div className="bg-white text-green-900 text-xs font-medium py-2 px-3 rounded-lg shadow-xl">
                      {stat.description}
                      {/* Tooltip arrow */}
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full border-4 border-transparent border-t-white"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll indicator - moved down slightly */}
          <div className="absolute bottom-2 animate-bounce">
            <ChevronDown className="h-8 w-8 text-white opacity-70" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="flex justify-center gap-6 border-b border-gray-200 mb-8">
            <button
              onClick={() => handleTabClick("grounds")}
              className={`px-6 py-3 text-lg font-semibold transition ${
                activeTab === "grounds"
                  ? "border-b-4 border-emerald-600 text-emerald-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Grounds
            </button>
            {/* <button
              onClick={() => handleTabClick("rivals")}
              className={`px-6 py-3 text-lg font-semibold transition ${
                activeTab === "rivals"
                  ? "border-b-4 border-emerald-600 text-emerald-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Challenges
            </button> */}
          </div>
          {/* Grounds Section */}
          {activeTab === "grounds" && (
            <>
              <div id="search-section" className="py-8">
                <SearchBar onSearch={handleSearch} className="mb-12" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
                {filteredGrounds.map((ground) => (
                  <GroundCard key={ground._id} ground={ground} />
                ))}
              </div>
            </>
          )}
          {/* Rivals Section */}
          {activeTab === "rivals" && (
            <div className="py-8 flex flex-col justify-center pb-16">
              {/* Challenge Header with Board Effect - MOVED INSIDE CHALLENGES SECTION */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 mb-6 text-center rounded-lg border-2 border-emerald-200 shadow-md relative overflow-hidden">
                {/* Subtle corner elements for board effect */}
                <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-emerald-400"></div>
                <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-emerald-400"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-emerald-400"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-emerald-400"></div>

                <div className="mb-4">
                  <h3 className="text-xl font-bold text-emerald-800 mb-2">
                    THE ULTIMATE SPORTS CHALLENGE
                  </h3>
                  <h4 className="text-lg font-semibold text-emerald-700 mb-1">
                    Where <span className="text-emerald-900">Strangers</span>{" "}
                    Become <span className="text-emerald-900">Rivals</span>
                  </h4>
                  <h4 className="text-lg font-semibold text-emerald-700">
                    And <span className="text-emerald-900">Rivals</span> Become{" "}
                    <span className="text-emerald-900">Legends</span>
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-4">
                  <div className="bg-white p-3 rounded-lg border border-emerald-200 shadow-sm">
                    <p className="font-bold text-emerald-800 mb-1">
                      Compete Hard
                    </p>
                    <p className="text-sm text-emerald-600">
                      Give your best effort
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-emerald-200 shadow-sm">
                    <p className="font-bold text-emerald-800 mb-1">Play Fair</p>
                    <p className="text-sm text-emerald-600">Respect the game</p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-emerald-200 shadow-sm">
                    <p className="font-bold text-emerald-800 mb-1">
                      Cheer Louder
                    </p>
                    <p className="text-sm text-emerald-600">
                      Support your teammates
                    </p>
                  </div>
                </div>

                <p className="text-emerald-700 text-sm max-w-2xl mx-auto">
                  Challenge your friends, build teamwork, and respect every
                  opponent. Are you ready to step up and play?
                </p>
              </div>

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Challenges</h2>
                <button
                  onClick={handleAddChallenge}
                  className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
                >
                  <Plus size={20} />
                  Add Challenge
                </button>
              </div>

              {/* Search Bar for Challenges */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 text-emerald-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Find Challenges
                </h3>
                <div className="flex flex-col sm:flex-row gap-4 bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-xl border border-emerald-100 shadow-sm">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-emerald-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search by team name, email, or sport..."
                      value={challengeSearch}
                      onChange={(e) => setChallengeSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 bg-white shadow-sm transition-all duration-200"
                    />
                  </div>
                  <div className="relative sm:w-1/3">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-emerald-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <input
                      type="date"
                      value={challengeDateSearch}
                      onChange={(e) => setChallengeDateSearch(e.target.value)}
                      className="w-full min-h-[48px] pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-white text-base appearance-none shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {filteredChallenges.length === 0 ? (
                <p className="text-gray-500">
                  No challenges found. Try a different search.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredChallenges.map((challenge, index) => {
                    let availabilityData: any[] = [];
                    if (typeof challenge.availability === "string") {
                      try {
                        availabilityData = JSON.parse(challenge.availability);
                      } catch {
                        availabilityData = [];
                      }
                    } else {
                      availabilityData = challenge.availability;
                    }

                    const availabilityText = availabilityData
                      .map(
                        (slot: any) => `${slot.date} ${challenge.description}`
                      )
                      .join(", ");

                    return (
                      <ChallengeCard
                        key={challenge._id || index}
                        teamName={challenge.teamName}
                        teamImage={challenge.teamImage}
                        availability={availabilityText}
                        playersCount={challenge.members}
                        sport={challenge.sport}
                        email={challenge.email}
                        description={challenge.description}
                        onAccept={() => handleAccept(challenge._id!)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}{" "}
        </div>
      </div>
      {showChallengeInfoPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          {/* Blurred glass-like background */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>

          {/* Popup card */}
          <div className="relative bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8 max-w-lg w-full shadow-2xl transform scale-95 opacity-0 animate-popup">
            <h2 className="text-2xl font-bold mb-6">How to Use Challenges</h2>
            <p className="mb-6 text-gray-700 text-lg">
              You can post challenges by clicking on the "Add Challenge" button
              and filling in the necessary details. You can also accept already
              posted challenges.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowChallengeInfoPopup(false)}
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Section */}
      <footer className="bg-gradient-to-r from-green-900 to-emerald-900 text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center mb-4">
                <Trophy className="h-8 w-8 text-green-400 mr-2" />
                <span className="text-2xl font-bold">ThangGo</span>
              </div>
              <p className="text-green-200 mb-4">
                Your premier destination for sports ground bookings and
                competitive challenges.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com/share/16H5v2eMph/"
                  className="text-green-300 hover:text-white transition-colors"
                >
                  <Facebook className="h-6 w-6" />
                </a>

                <a
                  href="https://www.instagram.com/thanggodotcom?igsh=cGlrM2lnbTRjc2Zo"
                  className="text-green-300 hover:text-white transition-colors"
                >
                  <Instagram className="h-6 w-6" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/"
                    className="text-green-200 hover:text-white transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    className="text-green-200 hover:text-white transition-colors"
                  >
                    Grounds
                  </a>
                </li>
                <li
                  onClick={() => setActiveTab("rivals")}
                  className="text-green-200 hover:text-white transition-colors cursor-pointer"
                >
                  Challenges
                </li>

                <li>
                  <a
                    href="/aboutus"
                    className="text-green-200 hover:text-white transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/contactus"
                    className="text-green-200 hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-green-200">
                    Zilukha, Thimphu, Bhutan
                  </span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-green-200">+975 17495130</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-green-200">
                    thanggodotcom@gmail.com
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-green-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-green-300 text-sm">
              © 2024 ThangGo. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <button
                onClick={() => openPolicy("privacy")}
                className="text-green-300 hover:text-white text-sm transition-colors"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => openPolicy("terms")}
                className="text-green-300 hover:text-white text-sm transition-colors"
              >
                Terms of Service
              </button>
              <button
                onClick={() => openPolicy("cookies")}
                className="text-green-300 hover:text-white text-sm transition-colors"
              >
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Policy Modal */}
      {activePolicy && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border-2 border-emerald-200 transform animate-modal-appear">
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-green-700 to-emerald-700 p-6 relative overflow-hidden">
              {/* Animated background elements */}
              <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute top-0 left-0 w-32 h-32 bg-green-500 rounded-full filter blur-xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-emerald-400 rounded-full filter blur-xl animate-pulse animation-delay-2000"></div>
              </div>

              <div className="flex justify-between items-center relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  {
                    policyContent[activePolicy as keyof typeof policyContent]
                      .title
                  }
                </h2>
                <button
                  onClick={closePolicy}
                  className="text-white hover:text-emerald-200 transition-colors bg-white bg-opacity-20 rounded-full p-1 hover:bg-opacity-30"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Content area with custom scrollbar */}
            <div className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
              <div className="prose prose-lg max-w-none">
                {policyContent[
                  activePolicy as keyof typeof policyContent
                ].content
                  .split("\n")
                  .map((paragraph, index) => {
                    if (paragraph.startsWith("# ")) {
                      return (
                        <h1
                          key={index}
                          className="text-2xl font-bold mt-6 mb-4 text-emerald-800 border-l-4 border-emerald-500 pl-4"
                        >
                          {paragraph.substring(2)}
                        </h1>
                      );
                    } else if (paragraph.startsWith("## ")) {
                      return (
                        <h2
                          key={index}
                          className="text-xl font-semibold mt-5 mb-3 text-emerald-700 flex items-center"
                        >
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                          {paragraph.substring(3)}
                        </h2>
                      );
                    } else if (paragraph.startsWith("### ")) {
                      return (
                        <h3
                          key={index}
                          className="text-lg font-medium mt-4 mb-2 text-emerald-600"
                        >
                          {paragraph.substring(4)}
                        </h3>
                      );
                    } else if (paragraph.trim() === "") {
                      return <br key={index} />;
                    } else if (paragraph.startsWith("- ")) {
                      return (
                        <li
                          key={index}
                          className="mb-2 text-gray-700 flex items-start"
                        >
                          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span>{paragraph.substring(2)}</span>
                        </li>
                      );
                    } else {
                      return (
                        <p key={index} className="mb-4 text-gray-700">
                          {paragraph}
                        </p>
                      );
                    }
                  })}
              </div>
            </div>

            {/* Footer with button */}
            <div className="px-6 py-4 bg-gradient-to-r from-green-100 to-emerald-100 border-t border-emerald-200 flex justify-end">
              <button
                onClick={closePolicy}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-md flex items-center"
              >
                Close
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS for custom animations and styling */}
      <style>{`
        @keyframes slide-up {
          0% { transform: translateY(100px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes fade-in-up {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes progress-ring {
          0% { stroke-dashoffset: 239; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes modal-appear {
          0% { transform: scale(0.9) translateY(20px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 1s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 1s ease-out forwards; }
        .animate-modal-appear { animation: modal-appear 0.3s ease-out forwards; }
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-700 { animation-delay: 0.7s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .group:hover circle {
          animation: progress-ring 1s ease-out forwards;
        }
        
        /* Custom scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(167, 243, 208, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #10b981, #059669);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #059669, #047857);
        }
        
        /* Prose customizations */
        .prose ul {
          list-style-type: none;
          padding-left: 0;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
