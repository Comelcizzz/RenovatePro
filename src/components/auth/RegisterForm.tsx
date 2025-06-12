"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const roleOptions = [
  {
    value: "user",
    label: "User",
    icon: "👤",
    description: "Looking for renovation services",
  },
  {
    value: "designer",
    label: "Designer",
    icon: "🎨",
    description: "Professional interior designer",
  },
  {
    value: "worker",
    label: "Worker",
    icon: "🔨",
    description: "Skilled craftsman or contractor",
  },
];

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [selectedRole, setSelectedRole] = useState("user");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role: selectedRole }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to register");
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
      {/* Background effects */}
      <div className="absolute inset-0 animated-bg" />
      <div className="absolute inset-0 bg-black/20" />

      {/* Floating particles */}
      <div className="particles">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 3}px`,
              height: `${Math.random() * 6 + 3}px`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 15 + 10}s`,
            }}
          />
        ))}
      </div>

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
            Join the
            <span className="gradient-text-accent"> Revolution</span>
          </h1>

          <p className="text-white/70 text-lg">
            Create your account and start transforming spaces
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

          {/* Name field */}
          <div className="space-y-2">
            <label className="block text-white font-medium text-sm">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className="w-full glass text-white placeholder-white/50 px-4 py-3 rounded-xl border border-white/10 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
              required
            />
          </div>

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
              placeholder="Create a strong password"
              className="w-full glass text-white placeholder-white/50 px-4 py-3 rounded-xl border border-white/10 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
              required
            />
          </div>

          {/* Confirm Password field */}
          <div className="space-y-2">
            <label className="block text-white font-medium text-sm">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              className="w-full glass text-white placeholder-white/50 px-4 py-3 rounded-xl border border-white/10 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
              required
            />
          </div>

          {/* Role selection */}
          <div className="space-y-4">
            <label className="block text-white font-medium text-sm">
              I am a:
            </label>
            <div className="grid gap-3">
              {roleOptions.map((option) => (
                <label
                  key={option.value}
                  className={`relative cursor-pointer transition-all duration-300 ${
                    selectedRole === option.value
                      ? "transform scale-105"
                      : "hover:scale-102"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={option.value}
                    checked={selectedRole === option.value}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="sr-only"
                  />
                  <div
                    className={`glass rounded-xl p-4 border transition-all duration-300 ${
                      selectedRole === option.value
                        ? "border-blue-500/50 bg-blue-500/10"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{option.icon}</span>
                      <div>
                        <div className="text-white font-medium">
                          {option.label}
                        </div>
                        <div className="text-white/60 text-sm">
                          {option.description}
                        </div>
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
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
                Creating Account...
              </div>
            ) : (
              "Create Account"
            )}
          </button>

          {/* Login link */}
          <div className="text-center pt-4">
            <p className="text-white/70">
              Already have an account?{" "}
              <Link
                href="/login"
                className="gradient-text-accent font-semibold hover:underline transition-all duration-300"
              >
                Sign In
              </Link>
            </p>
          </div>
        </form>

        {/* Additional info */}
        <div className="text-center mt-8">
          <p className="text-white/50 text-sm">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-blue-400 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-blue-400 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
