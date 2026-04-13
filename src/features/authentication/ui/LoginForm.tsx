import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiEye,
  FiEyeOff,
  FiMail,
  FiLock,
} from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] =
    useState<boolean>(false);
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsLoading(true);
    try {
      await login(email.trim(), password);
      navigate("/dashboard");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Login failed";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (
    e?: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e?.preventDefault();
    setIsLoading(true);
    try {
      await login("demo@budgetallright.com", "demo1234");
      navigate("/dashboard");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Demo login failed";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50 dark:bg-gray-950 px-4 py-12">
      <form
        onSubmit={handleSubmit}
        role="form"
        aria-labelledby="login-title"
        className="w-full max-w-md space-y-5 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg"
      >
        {/* <h2
          id="login-title"
          className="text-2xl font-semibold text-center text-emerald-800 dark:text-emerald-400"
        >
          Sign in
        </h2> */}
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-emerald-800 dark:text-emerald-400">
            Sign in
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Welcome back
          </p>
        </div>

        {/* Email */}
        <div className="relative">
          <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-2 dark:text-white border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-800 dark:placeholder:text-gray-500"
            required
            disabled={isLoading}
          />
        </div>

        {/* Password */}
        <div className="relative">
          <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-10 py-2 dark:text-white  border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-800 dark:placeholder:text-gray-500"
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 dark:text-emerald-400 cursor-pointer"
            disabled={isLoading}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 disabled:bg-emerald-400 transition cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>

        {/* Footer */}
        <div className="text-sm flex justify-between text-emerald-700">
          <a
            href="#"
            className="hover:underline"
          >
            Forgot password?
          </a>
          <a
            href="/signup"
            className="hover:underline"
          >
            Sign up
          </a>
        </div>

        {/* Demo login */}
        <div className="pt-4 text-center">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="text-sm text-blue-600 dark:text-blue-400 underline hover:text-blue-800"
          >
            Login as demo user
          </button>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            newtest@test.com test1234
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            demo@budgetallright.com demo1234
          </p>
        </div>
      </form>
    </div>
  );
}
