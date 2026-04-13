import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import {
  FiEye,
  FiEyeOff,
  FiMail,
  FiLock,
} from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";

interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupForm() {
  const { signup } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<SignupFormData>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data: SignupFormData) => {
    try {
      await signup(data.email.trim(), data.password);
      toast.success(
        "Check your email to confirm registration.",
      );
      reset();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Signup failed. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50 dark:bg-gray-950 px-4 py-12">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg space-y-6"
      >
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-emerald-800 dark:text-emerald-400">
            Create account
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Join us and start tracking your budget
          </p>
        </div>

        {/* Email */}
        <div className="relative">
          <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" />
          <input
            type="email"
            placeholder="Email address"
            {...register("email", {
              required: "Email is required",
            })}
            className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-800 dark:placeholder:text-gray-500"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="relative">
          <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message:
                  "Password must be at least 8 characters",
              },
            })}
            className="w-full pl-11 pr-12 py-3  dark:text-white border border-gray-300 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-800 dark:placeholder:text-gray-500"
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600 dark:text-emerald-400"
            disabled={isSubmitting}
          >
            {showPassword ? (
              <FiEyeOff size={20} />
            ) : (
              <FiEye size={20} />
            )}
          </button>
          {errors.password && (
            <p className="text-sm text-red-600 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" />
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password ||
                "Passwords do not match",
            })}
            className="w-full pl-11 pr-12 py-3 dark:text-white border border-gray-300 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-800 dark:placeholder:text-gray-500"
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600 dark:text-emerald-400"
            disabled={isSubmitting}
          >
            {showConfirm ? (
              <FiEyeOff size={20} />
            ) : (
              <FiEye size={20} />
            )}
          </button>
          {errors.confirmPassword && (
            <p className="text-sm text-red-600 mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-3 rounded-2xl font-medium transition cursor-pointer disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? "Creating account..."
            : "Create account"}
        </button>

        <p className="text-center text-sm text-emerald-700 dark:text-emerald-400">
          Already have an account?{" "}
          <a
            href="/login"
            className="underline hover:text-emerald-800"
          >
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
}
