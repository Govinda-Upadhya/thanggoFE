import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import { base_url } from "../../types/ground";
import BookingChart from "./bookingChart";
import WeeklyBookingChart from "./weeklychart";
import LeftBookingChart from "./leftBooking";
import RightBookingChart from "./rightBooking";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Booking {
  _id: string;
  date: string;
  amount?: number;
  status: "CONFIRMED" | "PENDING" | "REJECTED";
  ground?: {
    name: string;
    type: string;
  };
  contact?: string;
  email?: string;
  name?: string;
}

const Statistics: React.FC = () => {
  const [dailyTimeStats, setDailyTimeStats] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [weeklyRevenue, setWeeklyRevenue] = useState([]);
  const [confirmedBooking, setConfirmedBooking] = useState();
  const [pendingBooking, setPendingBookings] = useState();
  const [totalRevenues, setTotalRevenue] = useState();
  const [weeklyAvg, setWeeklyAvg] = useState(0);
  const [monthlyAvg, setMonthlyAvg] = useState(0);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month" | "year">(
    "week"
  );
  const [chartData, setChartData] = useState<any>({ labels: [], datasets: [] });
  const [revenueChartData, setRevenueChartData] = useState<any>({
    labels: [],
    datasets: [],
  });

  const [loading, setLoading] = useState(false);
  const [selectedGround, setSelectedGround] = useState<string>("all");
  const [grounds, setGrounds] = useState<string[]>([]);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [editFormData, setEditFormData] = useState({
    amount: 0,
    status: "CONFIRMED" as "CONFIRMED" | "PENDING" | "REJECTED",
    contact: "",
    email: "",
    name: "",
  });

  // Fetch all bookings
  useEffect(() => {
    async function fetchBookingData() {
      try {
        const bookingData = await axios.get(
          `${base_url}/admin/bookings/overall`,
          {
            withCredentials: true,
          }
        );
        setTotalRevenue(bookingData.data.totalRevenue);
        setConfirmedBooking(bookingData.data.totalConfirmedBookings);
        setPendingBookings(bookingData.data.totalPendingBookings);
        const bookingTimeStats = await axios.get(
          `${base_url}/admin/bookings/getDailyTimeStats`,
          { withCredentials: true }
        );
        setDailyTimeStats(bookingTimeStats.data);
        const weeklyStats = await axios.get(
          `${base_url}/admin/bookings/getWeeklyStats`,
          { withCredentials: true }
        );
        setWeeklyStats(weeklyStats.data);
        const values = Object.values(weeklyStats.data);
        const total = values.reduce((a, b) => a + b, 0);
        const average = total / values.length;

        console.log("Weekly Average:", average);

        setWeeklyAvg(average.toFixed(2));
        const monthlyStat = await axios.get(
          `${base_url}/admin/bookings/getMonthlyStats`,
          { withCredentials: true }
        );
        setMonthlyStats(monthlyStat.data);
        const value = Object.values(monthlyStat.data);
        const totals = values.reduce((a, b) => a + b, 0);
        const averages = totals / value.length;

        console.log("Weekmonhtlyly Average:", averages);

        setMonthlyAvg(averages.toFixed(2));
        const revenueDaily = await axios.get(
          `${base_url}/admin/bookings/getDailyRevenueStats`,
          { withCredentials: true }
        );
        setDailyRevenue(revenueDaily.data);
        const revenueWeekly = await axios.get(
          `${base_url}/admin/bookings/getWeeklyRevenueStats`,
          { withCredentials: true }
        );
        setWeeklyRevenue(revenueWeekly.data);
        console.log("weekly", revenueWeekly.data);
        // Monthly revenue
        const revenueMonthly = await axios.get(
          `${base_url}/admin/bookings/getMonthlyRevenueStats`,
          { withCredentials: true }
        );
        setMonthlyRevenue(revenueMonthly.data);
        console.log("monhtly", revenueMonthly.data);
        const res = await axios.get(`${base_url}/admin/bookings`, {
          withCredentials: true,
        });

        setBookings(res.data.bookings);
      } catch (error) {}
    }
    fetchBookingData();
  }, []);

  // Process booking data for the charts
  useEffect(() => {
    if (bookings.length === 0) return;

    const processData = () => {
      // Filter bookings based on selected ground and confirmed status
      let filteredBookings = bookings.filter((b) => b.status === "CONFIRMED");

      if (selectedGround !== "all") {
        filteredBookings = filteredBookings.filter(
          (b) => b.ground?.name === selectedGround
        );
      }

      // Group bookings by time range for bookings chart
      const bookingsGroupedData: { [key: string]: number } = {};
      const revenueGroupedData: { [key: string]: number } = {};
      const labels: string[] = [];

      const now = new Date();

      switch (timeRange) {
        case "day":
          for (let i = 23; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 3600000);
            const key = date.toLocaleTimeString([], { hour: "2-digit" });
            labels.push(key);
            bookingsGroupedData[key] = 0;
            revenueGroupedData[key] = 0;
          }
          break;

        case "week":
          for (let i = 6; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 86400000);
            const key = date.toLocaleDateString([], { weekday: "short" });
            labels.push(key);
            bookingsGroupedData[key] = 0;
            revenueGroupedData[key] = 0;
          }
          break;

        case "month":
          const daysInMonth = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0
          ).getDate();
          for (let i = 1; i <= daysInMonth; i++) {
            const key = `${i}`;
            labels.push(key);
            bookingsGroupedData[key] = 0;
            revenueGroupedData[key] = 0;
          }
          break;

        case "year":
          for (let i = 0; i < 12; i++) {
            const date = new Date(now.getFullYear(), i, 1);
            const key = date.toLocaleDateString([], { month: "short" });
            labels.push(key);
            bookingsGroupedData[key] = 0;
            revenueGroupedData[key] = 0;
          }
          break;
      }

      // Count bookings and revenue for each time period
      filteredBookings.forEach((booking) => {
        const bookingDate = new Date(booking.date);
        let key: string;

        switch (timeRange) {
          case "day":
            key = bookingDate.toLocaleTimeString([], { hour: "2-digit" });
            break;
          case "week":
            key = bookingDate.toLocaleDateString([], { weekday: "short" });
            break;
          case "month":
            key = bookingDate.getDate().toString();
            break;
          case "year":
            key = bookingDate.toLocaleDateString([], { month: "short" });
            break;
          default:
            key = "";
        }

        if (bookingsGroupedData[key] !== undefined) {
          bookingsGroupedData[key] += 1;
          revenueGroupedData[key] += booking.amount || 0;
        }
      });

      // Prepare data for charts
      const bookingsData = labels.map(
        (label) => bookingsGroupedData[label] || 0
      );
      const revenueData = labels.map((label) => revenueGroupedData[label] || 0);

      setChartData({
        labels,
        datasets: [
          {
            label: "Number of Bookings",
            data: bookingsData,
            borderColor: "rgb(16, 185, 129)",
            backgroundColor: "rgba(16, 185, 129, 0.2)",
            tension: 0.3,
            fill: true,
          },
        ],
      });

      setRevenueChartData({
        labels,
        datasets: [
          {
            label: "Revenue (₹)",
            data: revenueData,
            borderColor: "rgb(59, 130, 246)",
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            tension: 0.3,
            fill: true,
          },
        ],
      });
    };

    processData();
  }, [bookings, timeRange, selectedGround]);

  // Handle edit button click
  const handleEditClick = (booking: Booking) => {
    setEditingBooking(booking);
    setEditFormData({
      amount: booking.amount || 0,
      status: booking.status,
      contact: booking.contact || "",
      email: booking.email || "",
      name: booking.name || "",
    });
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: name === "amount" ? parseInt(value) || 0 : value,
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBooking) {
      // Update the booking in the state
      const updatedBookings = bookings.map((booking) =>
        booking._id === editingBooking._id
          ? { ...booking, ...editFormData }
          : booking
      );
      setBookings(updatedBookings);

      // Here you would typically make an API call to update the booking in the database
      console.log("Updating booking:", editingBooking._id, editFormData);

      // Close the edit modal
      setEditingBooking(null);
    }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Bookings by ${timeRange}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const revenueChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Revenue by ${timeRange}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return "₹" + value;
          },
        },
      },
    },
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

  const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED");
  const pendingBookings = bookings.filter((b) => b.status === "PENDING");
  const totalRevenue = confirmedBookings.reduce(
    (sum, booking) => sum + (booking.amount || 0),
    0
  );
  const averageBookingValue =
    confirmedBookings.length > 0 ? totalRevenue / confirmedBookings.length : 0;

  return (
    <div className="max-w-7xl w-full mx-auto p-2 sm:p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-emerald-800 tracking-wide">
          Booking Statistics
        </h1>
        <p className="text-emerald-600">
          Analyze booking trends and revenue over time
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-emerald-500">
          <h3 className="text-lg font-semibold text-emerald-800 mb-2">
            Total Bookings
          </h3>
          <p className="text-3xl font-bold text-emerald-700">
            {confirmedBooking}
          </p>
          <p className="text-sm text-gray-500 mt-1">Confirmed bookings</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-yellow-500">
          <h3 className="text-lg font-semibold text-emerald-800 mb-2">
            Pending Bookings
          </h3>
          <p className="text-3xl font-bold text-yellow-600">{pendingBooking}</p>
          <p className="text-sm text-gray-500 mt-1">Awaiting confirmation</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-emerald-800 mb-2">
            Total Revenue
          </h3>
          <p className="text-3xl font-bold text-blue-700">Nu.{totalRevenues}</p>
          <p className="text-sm text-gray-500 mt-1">From confirmed bookings</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-purple-500">
          <h3 className="text-lg font-semibold text-emerald-800 mb-4">
            Avg. Bookings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Weekly Avg */}
            <div className="bg-purple-50 p-4 rounded-xl text-center shadow-sm">
              <h4 className="text-sm font-medium text-purple-800 mb-1">
                Weekly Avg
              </h4>
              <p className="text-2xl font-bold text-purple-700">
                {weeklyAvg || 0}
              </p>
            </div>

            {/* Monthly Avg */}
            <div className="bg-purple-50 p-4 rounded-xl text-center shadow-sm">
              <h4 className="text-sm font-medium text-purple-800 mb-1">
                Monthly Avg
              </h4>
              <p className="text-2xl font-bold text-purple-700">
                {monthlyAvg || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Range
            </label>
            <div className="flex flex-wrap gap-2">
              {(["day", "week", "month"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    timeRange === range
                      ? "bg-emerald-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Ground
            </label>
            <select
              value={selectedGround}
              onChange={(e) => setSelectedGround(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            >
              {grounds.map((ground) => (
                <option key={ground} value={ground}>
                  {ground === "all" ? "All Grounds" : ground}
                </option>
              ))}
            </select>
          </div> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Bookings Overview
            </h3>
            <div className="h-80">
              <LeftBookingChart
                timeRange={timeRange} // "day" | "week" | "month"
                dailyTimeStats={dailyTimeStats}
                weeklyStats={weeklyStats}
                monthlyStats={monthlyStats}
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Revenue Overview
            </h3>
            <div className="h-80">
              <RightBookingChart
                timeRange={timeRange}
                dailyRevenueStats={dailyRevenue}
                monthlyRevenueStats={monthlyRevenue}
                weeklyRevenueStats={weeklyRevenue}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table with Edit Button */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ground
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.slice(0, 5).map((booking) => (
                <tr key={booking._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(booking.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>{booking.name}</div>
                    <div className="text-xs text-gray-500">{booking.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.ground?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Nu.{booking.amount || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        booking.status === "CONFIRMED"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Edit Booking</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (Nu)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={editFormData.amount}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={editFormData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PENDING">PENDING</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact
                </label>
                <input
                  type="text"
                  name="contact"
                  value={editFormData.contact}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingBooking(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;
