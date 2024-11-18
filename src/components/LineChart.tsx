import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

interface LineChartProps {
  data: {
    [key: string]: { income: number; expense: number };
  };
  selectedMonth?: string;
}

const LineChart: React.FC<LineChartProps> = ({ data, selectedMonth }) => {
  const filteredData = selectedMonth
    ? Object.entries(data).reduce((acc, [month, values]) => {
        if (month.includes(selectedMonth)) {
          acc[month] = values;
        }
        return acc;
      }, {} as typeof data)
    : data;
  const sortedLabels = Object.keys(filteredData)
    .sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA.getTime() - dateB.getTime();
    })
    .reverse();

  const chartData = {
    labels: sortedLabels,
    datasets: [
      {
        label: "Income",
        data: sortedLabels.map((label) => filteredData[label].income),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        fill: false,
        tension: 0.3,
      },
      {
        label: "Expenses",
        data: sortedLabels.map((label) => filteredData[label].expense),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        fill: false,
        tension: 0.3,
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
        text: "Monthly Income vs Expenses",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default LineChart;
