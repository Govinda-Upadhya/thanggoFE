import axios from "axios";
import React, { useEffect, useState } from "react";
import { base_url } from "../../types/ground";

interface TimeRange {
  start: string;
  end: string;
}

interface Booking {
  _id: string;
  email: string;
  name?: string;
  contact: string;
  amount?: number;
  date: string;
  time: TimeRange[];
  bookingId: string;
  ground: {
    _id: string;
    name: string;
    type: string;
  };
  status: "CONFIRMED" | "PENDING" | "REJECTED";
  createdAt: string;
}

const Booking: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");

  // Modal states
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );
  const [rejecting, setRejecting] = useState(false);

  // Detail view modal
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Animation states
  const [animateRow, setAnimateRow] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await axios.get(`${base_url}/admin/bookings`, {
          withCredentials: true,
        });
        console.log(res.data.bookings);
        setBookings(res.data.bookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  const handleDelete = async (id: string) => {
    setAnimateRow(id);
    const confirmed = window.confirm(
      "Are you sure you want to delete this booking?"
    );
    if (!confirmed) return;

    try {
      const res = await axios.delete(
        `${base_url}/admin/bookings/delete/${id}`,
        { withCredentials: true }
      );
      if (res.status === 200) {
        setBookings((prev) => prev.filter((b) => b._id !== id));
        alert("Deleted successfully");
      } else {
        alert("Couldn't delete the booking");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Failed to delete booking");
    }
  };

  const handleAction = async (id: string, status: "CONFIRMED" | "REJECTED") => {
    if (status === "CONFIRMED") {
      const accept = await axios.post(
        `${base_url}/admin/bookings/acceptbooking`,
        { bookingId: id },
        { withCredentials: true }
      );
      if (accept.data.status === 404) {
        return alert("Cannot find the id");
      }
    }
    if (status === "REJECTED") {
      setSelectedBookingId(id);
      setShowRejectModal(true);
      return;
    }

    // Animation for status change
    setAnimateRow(id);
    setTimeout(() => {
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status } : b))
      );
      setAnimateRow(null);
    }, 300);
  };

  const confirmReject = async () => {
    if (!selectedBookingId) return;
    setRejecting(true);
    try {
      const reject = await axios.post(
        `${base_url}/admin/bookings/rejectbooking`,
        {
          bookingId: selectedBookingId,
          reason: rejectReason,
        },
        { withCredentials: true }
      );
      if (reject.data.status === 404) {
        return alert("Cannot find the id");
      }

      alert("Booking rejected");
      setBookings((prev) =>
        prev.map((b) =>
          b._id === selectedBookingId ? { ...b, status: "REJECTED" } : b
        )
      );
    } catch (error) {
      console.error("Error rejecting booking:", error);
    } finally {
      setRejecting(false);
      setShowRejectModal(false);
      setRejectReason("");
      setSelectedBookingId(null);
    }
  };

  const openDetailModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-emerald-200 rounded-full animate-spin"></div>
          <div className="w-16 h-16 border-4 border-transparent rounded-full absolute top-0 border-t-4 border-t-emerald-500 animate-ping"></div>
        </div>
      </div>
    );
  }

  // Filter bookings by ID, name, email, contact AND date
  // Filtering logic
  const filteredBookings = bookings.filter((b) => {
    const lower = searchTerm.toLowerCase();

    // ✅ Safe string checks for all fields
    const matchesText = lower
      ? (b._id || "").toLowerCase().includes(lower) ||
        (b.name || "").toLowerCase().includes(lower) ||
        (b.email || "").toLowerCase().includes(lower) ||
        (b.contact || "").toLowerCase().includes(lower)
      : true;

    // ✅ Date check that works with <input type="date">
    const matchesDate = searchDate
      ? new Date(b.date).toLocaleDateString("en-CA") === searchDate
      : true;

    return matchesText && matchesDate;
  });

  return (
    <div className="max-w-7xl w-full mx-auto p-2 sm:p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-emerald-800 tracking-wide">
          Booking Management
        </h1>
        <p className="text-emerald-600">
          Manage all ground bookings in one place
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 sm:p-6 rounded-2xl shadow-md mb-8 border border-emerald-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-emerald-700 mb-2">
              Search by ID, Name, Email, or Contact
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-emerald-400"
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
                placeholder="Enter keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full border border-emerald-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-700 mb-2">
              Filter by Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-emerald-400"
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
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="pl-10 w-full border border-emerald-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {(searchTerm || searchDate) && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setSearchTerm("");
                setSearchDate("");
              }}
              className="flex items-center px-4 py-2 bg-white text-emerald-700 border border-emerald-300 rounded-xl hover:bg-emerald-50 transition-all duration-300 shadow-sm"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl shadow-md border border-emerald-100">
          <svg
            className="w-16 h-16 mx-auto text-emerald-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="text-xl font-medium text-emerald-800 mb-2">
            No bookings found
          </h3>
          <p className="text-emerald-600">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-emerald-100">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
                  <th className="px-4 sm:px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                    ID & Customer
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                    Ground & Sport
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-100">
                {filteredBookings
                  .sort(
                    (a, b) =>
                      new Date(a.date).getTime() - new Date(b.date).getTime()
                  )
                  .map((booking) => (
                    <tr
                      key={booking._id}
                      className={`transition-all duration-300 hover:bg-emerald-50 ${
                        animateRow === booking._id
                          ? "opacity-0 transform -translate-x-4"
                          : "opacity-100"
                      } ${
                        booking.status === "PENDING"
                          ? "bg-yellow-50 hover:bg-yellow-100"
                          : ""
                      }`}
                    >
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                            <svg
                              className="h-6 w-6 text-emerald-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.name || "No Name"}
                            </div>
                            <div className="text-sm text-emerald-600">
                              {booking.email}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {booking._id}
                            </div>
                            <div className="text-xs text-gray-500">
                              Contact: {booking.contact}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.ground?.name}
                        </div>
                        <div className="text-sm text-emerald-600">
                          {booking.ground?.type}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {new Date(booking.date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                        <div className="text-sm text-emerald-600">
                          {booking.time[0].start} -{" "}
                          {booking.time[booking.time.length - 1].end}
                          {booking.time.length > 1 && (
                            <span className="text-xs bg-emerald-100 text-emerald-800 ml-1 px-1 rounded">
                              +{booking.time.length - 1} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="text-sm font-medium text-emerald-700">
                          Nu.{booking.amount || 0}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            booking.status === "CONFIRMED"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800 animate-pulse"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {booking.status === "CONFIRMED" && (
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openDetailModal(booking)}
                            className="text-emerald-600 hover:text-emerald-900 transition-colors duration-300"
                            title="View Details"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>

                          {booking.status === "PENDING" && (
                            <>
                              <button
                                onClick={() =>
                                  handleAction(booking._id, "CONFIRMED")
                                }
                                className="text-green-600 hover:text-green-900 transition-colors duration-300"
                                title="Accept Booking"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={() =>
                                  handleAction(booking._id, "REJECTED")
                                }
                                className="text-red-600 hover:text-red-900 transition-colors duration-300"
                                title="Reject Booking"
                              >
                                <svg
                                  className="w-5 h-5"
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
                            </>
                          )}
                          {booking.status === "CONFIRMED" && (
                            <button
                              onClick={() => handleDelete(booking._id)}
                              className="text-gray-500 hover:text-gray-900 transition-colors duration-300"
                              title="Remove Booking"
                            >
                              <svg
                                className="w-5 h-5"
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
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail View Modal */}
      {showDetailModal && selectedBooking && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 px-2 sm:px-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl transform transition-all duration-300 scale-95 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-emerald-800">
                Booking Details
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg
                  className="w-6 h-6"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-emerald-50 p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-emerald-800 mb-3">
                  Customer Information
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-emerald-700">
                      Name:
                    </span>
                    <p className="text-gray-900">
                      {selectedBooking.name || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-emerald-700">
                      Email:
                    </span>
                    <p className="text-gray-900">{selectedBooking.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-emerald-700">
                      Contact:
                    </span>
                    <p className="text-gray-900">{selectedBooking.contact}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-emerald-700">
                      Booking ID:
                    </span>
                    <p className="text-gray-900 font-mono">
                      {selectedBooking._id}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-emerald-800 mb-3">
                  Booking Information
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-emerald-700">
                      Ground:
                    </span>
                    <p className="text-gray-900">
                      {selectedBooking.ground.name}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-emerald-700">
                      Sport:
                    </span>
                    <p className="text-gray-900">
                      {selectedBooking.ground.type}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-emerald-700">
                      Date:
                    </span>
                    <p className="text-gray-900">
                      {new Date(selectedBooking.date).toLocaleDateString(
                        "en-GB",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-emerald-700">
                      Time Slots:
                    </span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {selectedBooking.time.map((t, idx) => (
                        <span
                          key={idx}
                          className="bg-emerald-500 text-white px-2 py-1 rounded-md text-xs font-medium"
                        >
                          {t.start} - {t.end}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-emerald-800 mb-3">
                  Payment Information
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-emerald-700">
                      Amount:
                    </span>
                    <p className="text-2xl font-bold text-emerald-700">
                      ₹{selectedBooking.amount || 0}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-emerald-700">
                      Status:
                    </span>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        selectedBooking.status === "CONFIRMED"
                          ? "bg-green-100 text-green-800"
                          : selectedBooking.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedBooking.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-emerald-700">
                      Booked On:
                    </span>
                    <p className="text-gray-900">
                      {new Date(selectedBooking.createdAt).toLocaleDateString(
                        "en-GB",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-emerald-800 mb-3">
                  Actions
                </h3>
                <div className="space-y-3">
                  {selectedBooking.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => {
                          handleAction(selectedBooking._id, "CONFIRMED");
                          setShowDetailModal(false);
                        }}
                        className={`w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-300 `}
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Accept Booking
                      </button>
                      <button
                        onClick={() => {
                          setSelectedBookingId(selectedBooking._id);
                          setShowRejectModal(true);
                          setShowDetailModal(false);
                        }}
                        className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-300"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
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
                        Reject Booking
                      </button>
                    </>
                  )}
                  {selectedBooking.status === "CONFIRMED" && (
                    <button
                      onClick={() => {
                        handleDelete(selectedBooking._id);
                        setShowDetailModal(false);
                      }}
                      className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors duration-300"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
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
                      Remove Booking
                    </button>
                  )}
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="w-full flex items-center justify-center px-4 py-2 bg-white text-emerald-700 border border-emerald-300 rounded-xl hover:bg-emerald-50 transition-colors duration-300"
                  >
                    Close Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 px-2 sm:px-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md transform transition-all duration-300 scale-95 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Reject Booking
              </h2>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                  setSelectedBookingId(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg
                  className="w-6 h-6"
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

            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-r">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    Please provide a reason for rejecting this booking. This
                    will be sent to the customer.
                  </p>
                </div>
              </div>
            </div>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter reason for rejection..."
              className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-300"
              rows={4}
            />

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                  setSelectedBookingId(null);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                disabled={!rejectReason.trim() || rejecting}
                className={`px-4 py-2 rounded-xl text-white font-medium flex items-center justify-center transition-all duration-300 ${
                  !rejectReason.trim() || rejecting
                    ? "bg-red-300 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 transform hover:scale-105"
                }`}
              >
                {rejecting && (
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
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                )}
                {rejecting ? "Rejecting..." : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
