import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import TransactionList from "./pages/TransactionList";
import TransactionForm from "./pages/TransactionForm";

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="pt-4">
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <Register />
            }
          />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/transactions"
            element={
              isAuthenticated ? <TransactionList /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/transactions/new"
            element={
              isAuthenticated ? <TransactionForm /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/transactions/edit/:id"
            element={
              isAuthenticated ? <TransactionForm /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
