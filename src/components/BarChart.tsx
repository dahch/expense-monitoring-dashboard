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

// Registrar los componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  data: {
    totalIncome: number;
    totalExpense: number;
    balance: number;
  };
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const chartData = {
    labels: ["Income", "Expense", "Balance"],
    datasets: [
      {
        label: "Amount",
        data: [data.totalIncome, data.totalExpense, data.balance],
        backgroundColor: [
          "rgba(75, 192, 192, 0.5)", // Income
          "rgba(255, 99, 132, 0.5)", // Expense
          "rgba(153, 102, 255, 0.5)", // Balance
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)", // Income
          "rgba(255, 99, 132, 1)", // Expense
          "rgba(153, 102, 255, 1)", // Balance
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Overall Balance Overview",
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BarChart;
