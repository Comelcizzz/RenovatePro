"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to login");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl blur-lg opacity-60 animate-pulse" />
              <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-3xl font-bold text-2xl">
                R
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-black text-white mb-3">
            Welcome
            <span className="gradient-text-accent"> Back</span>
          </h1>

          <p className="text-white/70 text-lg">
            Sign in to continue your renovation journey
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="glass-dark rounded-3xl p-8 space-y-6 border border-white/10"
        >
          {/* Error message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Email field */}
          <div className="space-y-2">
            <label className="block text-white font-medium text-sm">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="w-full glass text-white placeholder-white/50 px-4 py-3 rounded-xl border border-white/10 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
              required
            />
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <label className="block text-white font-medium text-sm">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className="w-full glass text-white placeholder-white/50 px-4 py-3 rounded-xl border border-white/10 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
              required
            />
          </div>

          {/* Remember me and forgot password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="sr-only" />
              <div className="w-5 h-5 glass rounded border border-white/20 flex items-center justify-center transition-all duration-300 hover:border-blue-500/50">
                <div className="w-2 h-2 bg-blue-500 rounded opacity-0 transition-opacity duration-300" />
              </div>
              <span className="ml-2 text-white/70 text-sm">Remember me</span>
            </label>

            <Link
              href="/forgot-password"
              className="text-blue-400 hover:text-blue-300 text-sm transition-colors duration-300"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary relative"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Signing In...
              </div>
            ) : (
              "Sign In"
            )}
          </button>

          {/* Register link */}
          <div className="text-center pt-4">
            <p className="text-white/70">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="gradient-text-accent font-semibold hover:underline transition-all duration-300"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </form>

        {/* Additional info */}
        <div className="text-center mt-8">
          <p className="text-white/50 text-sm">
            Secure login protected by industry-standard encryption
          </p>
        </div>
      </div>
    </div>
  );
}
