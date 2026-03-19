"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface LeftBookingChartProps {
  timeRange: "day" | "week" | "month";
  dailyTimeStats: Record<string, number>;
  weeklyStats: Record<string, number>;
  monthlyStats: Record<string, number>;
}

const LeftBookingChart: React.FC<LeftBookingChartProps> = ({
  timeRange,
  dailyTimeStats,
  weeklyStats,
  monthlyStats,
}) => {
  // Orders for week and month
  const daysOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const monthsOrder = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Select labels and values dynamically
  let labels: string[] = [];
  let dataValues: number[] = [];

  if (timeRange === "day") {
    labels = Object.keys(dailyTimeStats);
    dataValues = Object.values(dailyTimeStats);
  } else if (timeRange === "week") {
    labels = daysOrder;
    dataValues = daysOrder.map((day) => weeklyStats[day] || 0);
  } else if (timeRange === "month") {
    labels = monthsOrder;
    dataValues = monthsOrder.map((month) => monthlyStats[month] || 0);
  }

  const data = {
    labels,
    datasets: [
      {
        label: "Bookings",
        data: dataValues,
        backgroundColor: dataValues.map((value) =>
          value > 0 ? "rgba(54, 162, 235, 0.8)" : "rgba(200, 200, 200, 0.3)"
        ),
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: true,
        text:
          timeRange === "day"
            ? "Bookings Overview (Hourly)"
            : timeRange === "week"
            ? "Bookings Overview (Weekly)"
            : "Bookings Overview (Monthly)",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        title: { display: true, text: "Number of Bookings" },
      },
      x: {
        title: {
          display: true,
          text:
            timeRange === "day"
              ? "Time Slots"
              : timeRange === "week"
              ? "Day of Week"
              : "Month",
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default LeftBookingChart;
