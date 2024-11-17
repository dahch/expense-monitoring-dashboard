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
  data: { [month: string]: { income: number; expense: number } };
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const labels = Object.keys(data);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Income",
        data: labels.map((label) => data[label].income),
        borderColor: "#36A2EB",
        fill: false,
        tension: 0.3,
      },
      {
        label: "Expenses",
        data: labels.map((label) => data[label].expense),
        borderColor: "#FF6384",
        fill: false,
        tension: 0.3,
      },
    ],
  };

  return <Line data={chartData} />;
};

export default LineChart;
