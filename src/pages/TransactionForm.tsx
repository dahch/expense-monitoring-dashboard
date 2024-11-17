import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Button from "../components/Button";

interface TransactionFormData {
  amount: string;
  category: string;
  type: "income" | "expense";
  date: string;
  note: string;
}

const TransactionForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [formData, setFormData] = useState<TransactionFormData>({
    amount: "",
    category: "",
    type: "expense",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });

  const selectClasses = `
    w-full 
    p-2 
    border 
    rounded
    bg-white
    appearance-none 
    focus:outline-none 
    focus:ring-2 
    focus:ring-blue-500
    focus:border-transparent
    cursor-pointer
    text-gray-700
    relative
  `;

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchTransaction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/transactions/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchTransaction = async () => {
    try {
      const response = await api.get(`/transactions?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const transaction = response.data.transactions[0];
      setFormData({
        amount: transaction.amount.toString(),
        category: transaction.category,
        type: transaction.type,
        date: transaction.date.split("T")[0],
        note: transaction.note,
      });
    } catch (error) {
      console.error("Error fetching transaction:", error);
      setError("Error loading transaction");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        amount: Number(formData.amount),
      };

      if (id) {
        await api.put(`/transactions/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post("/transactions", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      navigate("/transactions");
    } catch (error: any) {
      setError(error.response?.data?.message || "Error saving transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {id ? "Edit Transaction" : "New Transaction"}
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as "income" | "expense",
                  })
                }
                className={selectClasses}
                required
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium mb-1">Category</label>
              <div className="space-y-2">
                <select
                  value={showNewCategory ? "new" : formData.category}
                  onChange={(e) => {
                    if (e.target.value === "new") {
                      setShowNewCategory(true);
                      setFormData({ ...formData, category: "" });
                    } else {
                      setShowNewCategory(false);
                      setFormData({ ...formData, category: e.target.value });
                    }
                  }}
                  className={selectClasses}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                  <option value="new">+ Add new category</option>
                </select>

                {showNewCategory && (
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => {
                      setNewCategory(e.target.value);
                      setFormData({ ...formData, category: e.target.value });
                    }}
                    placeholder="Enter new category"
                    className="w-full p-2 border rounded"
                    required
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Note</label>
            <textarea
              value={formData.note}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/transactions")}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
