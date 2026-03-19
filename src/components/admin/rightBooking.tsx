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

interface RightBookingChartProps {
  timeRange: "day" | "week" | "month";
  dailyRevenueStats: Record<string, number>;
  weeklyRevenueStats: Record<string, number>;
  monthlyRevenueStats: Record<string, number>;
}

const RightBookingChart: React.FC<RightBookingChartProps> = ({
  timeRange,
  dailyRevenueStats,
  weeklyRevenueStats,
  monthlyRevenueStats,
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
    labels = Object.keys(dailyRevenueStats);
    dataValues = Object.values(dailyRevenueStats);
  } else if (timeRange === "week") {
    labels = daysOrder;
    dataValues = daysOrder.map((day) => weeklyRevenueStats[day] || 0);
  } else if (timeRange === "month") {
    labels = monthsOrder;
    dataValues = monthsOrder.map((month) => monthlyRevenueStats[month] || 0);
  }

  const data = {
    labels,
    datasets: [
      {
        label: "Revenue (₹)", // currency label
        data: dataValues,
        backgroundColor: dataValues.map((value) =>
          value > 0 ? "rgba(255, 159, 64, 0.8)" : "rgba(200, 200, 200, 0.3)"
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
            ? "Revenue Overview (Hourly)"
            : timeRange === "week"
            ? "Revenue Overview (Weekly)"
            : "Revenue Overview (Monthly)",
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `₹${context.raw.toFixed(2)}`, // show ₹ in tooltip
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Revenue (₹)" },
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

export default RightBookingChart;
