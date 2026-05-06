import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button, Input } from "../components/FormComponents";
import { useAuth } from "../hooks/useAuth";
import { Lock } from "lucide-react";

import { Link } from "react-router-dom";
import { userAPI } from "../services/api";

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiError("");
    try {
      const result = await login(data.email, data.password);
      const { success, message, redirect } = result;
      console.log("Login result:", result); // debug log
      if (success) {
        navigate(redirect);
      } else {
        setApiError(message || "Login failed. Please try again.");
      }

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            SC
          </div>
          <h2 className="text-3xl font-bold"> Login</h2>
          <p className=" mt-2">Sign in to your account</p>
        </div>

        {/* Login Card */}
        <div className="bg-black border-2 border-r-2  rounded-xl shadow-lg p-8">
          {apiError && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <Input
              label="Email Address"
              type="email"
              placeholder="@example.com"
              required
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
              error={errors.email?.message}
            />

            {/* Password */}
            <div>
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                required
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                error={errors.password?.message}
              />
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <Lock size={12} /> Use your credentials
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div>
              don't have an account? sign up
              <Link
                to="/register"
                className="text-purple-400 hover:text-purple-300 transition"
              >
                <b> here</b>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
