import React, { useEffect, useState } from "react";
import PieChart from "../components/PieChart";
import LineChart from "../components/LineChart";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import BarChart from "../components/BarChart";

const Dashboard: React.FC = () => {
  const { token } = useAuth();
  const [categoriesData, setCategoriesData] = useState<{
    [category: string]: number;
  }>({});
  const [monthlyData, setMonthlyData] = useState<{
    [month: string]: { income: number; expense: number };
  }>({});
  const [balanceData, setBalanceData] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get("/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Agrupar por categoría
        const categoryTotals: { [category: string]: number } = {};
        const monthlyTotals: {
          [month: string]: { income: number; expense: number };
        } = {};

        data.transactions.forEach((transaction: any) => {
          const { category, type, amount, date } = transaction;

          // Totales por categoría
          categoryTotals[category] = (categoryTotals[category] || 0) + amount;

          // Totales mensuales
          const month = new Date(date).toLocaleString("default", {
            month: "short",
            year: "numeric",
          });
          if (!monthlyTotals[month]) {
            monthlyTotals[month] = { income: 0, expense: 0 };
          }
          monthlyTotals[month][type === "income" ? "income" : "expense"] +=
            amount;
        });

        setCategoriesData(categoryTotals);
        setMonthlyData(monthlyTotals);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };
    const fetchBalance = async () => {
      try {
        const response = await api.get("/transactions/balance", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { totalIncome, totalExpense, balance } = response.data;

        setBalanceData({ totalIncome, totalExpense, balance });
      } catch (error) {
        console.error("Error al obtener el balance:", error);
      }
    };

    fetchData();
    fetchBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-6 shadow rounded">
          <h2 className="text-lg font-semibold text-center mb-4">
            Transactions by Category
          </h2>
          <PieChart data={categoriesData} />
        </div>
        <div className="bg-white p-6 shadow rounded">
          <h2 className="text-lg font-semibold text-center mb-4">
            Monthly balance over time
          </h2>
          <LineChart data={monthlyData} />
        </div>
        <div className="bg-white p-6 shadow rounded">
          <h2 className="text-lg font-semibold text-center mb-4">Balance</h2>
          <BarChart data={balanceData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
