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
  const [selectedMonthLine, setSelectedMonthLine] = useState<string>();
  const [optionsMonths, setOptionsMonths] = useState<string[]>([]);
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
          categoryTotals[category] =
            Number(categoryTotals[category] || 0) + Number(amount);

          const month = new Date(date).toLocaleString("default", {
            month: "short",
            year: "numeric",
          });
          if (!monthlyTotals[month]) {
            monthlyTotals[month] = { income: 0, expense: 0 };
          }
          monthlyTotals[month][type as "income" | "expense"] += Number(amount);
        });
        const sortedMonthlyTotals = Object.entries(monthlyTotals)
          .sort((a, b) => {
            const dateA = new Date(a[0]);
            const dateB = new Date(b[0]);
            return dateA.getTime() - dateB.getTime();
          })
          .reduce((acc, [month, data]) => {
            acc[month] = data;
            return acc;
          }, {} as typeof monthlyTotals);
        console.log(Object.keys(monthlyTotals));
        const months = [
          ...new Set(Object.keys(monthlyTotals).map((date) => date)),
        ];
        setOptionsMonths(months);
        setCategoriesData(categoryTotals);
        setMonthlyData(sortedMonthlyTotals);
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
          <select
            onChange={(e) => setSelectedMonthLine(e.target.value)}
            value={selectedMonthLine || ""}
            className="w-full p-2 mb-4 border border-gray-300 rounded-md bg-white text-gray-700 
    hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
    focus:border-blue-500 transition-colors"
          >
            <option value="">Todos los meses</option>
            {optionsMonths.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          <LineChart data={monthlyData} selectedMonth={selectedMonthLine} />
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
