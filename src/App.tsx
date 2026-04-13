import { Routes, Route } from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import Login from "./app/routes/LoginPage";
import Signup from "./app/routes/SignupPage";
import Settings from "./app/routes/SettingsPage";
import Transactions from "./app/routes/TransactionsPage";
import Dashboard from "./app/routes/DashboardPage";
import CategoryDetailsPage from "./app/routes/CategoryDetailsPage";
import NotFound from "./app/routes/NotFoundPage";
import Savings from "./app/routes/SavingsPage";

import PrivateRoute from "./components/PrivateRoute";
import Modal from "./components/Modal";

import { AuthProvider } from "./context/AuthContext";
import ModalProvider from "./context/ModalContext";
import MonthProvider from "./context/MonthContext";
import ThemeProvider from "./context/ThemeContext";
import Layout from "./shared/ui/Layout";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <ModalProvider>
            <MonthProvider>
              <Routes>
                <Route
                  path="/login"
                  element={<Login />}
                />
                <Route
                  path="/signup"
                  element={<Signup />}
                />
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <Layout />
                    </PrivateRoute>
                  }
                >
                  {/* by default renders Dashboard */}
                  <Route
                    index
                    element={<Dashboard />}
                  />
                  <Route
                    path="dashboard"
                    element={<Dashboard />}
                  />
                  <Route
                    path="transactions"
                    element={<Transactions />}
                  />
                  <Route
                    path="transactions/category/:category"
                    element={<CategoryDetailsPage />}
                  />
                  <Route
                    path="savings"
                    element={<Savings />}
                  />
                  <Route
                    path="settings"
                    element={<Settings />}
                  />
                  <Route
                    path="*"
                    element={<NotFound />}
                  />
                  {/* Handling non-existent nested paths */}
                </Route>
                <Route
                  path="*"
                  element={<NotFound />}
                />
                {/* Handling root non-existent paths */}
              </Routes>
              <Modal />
            </MonthProvider>
          </ModalProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
