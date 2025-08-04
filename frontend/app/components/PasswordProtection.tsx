"use client";

import { useState, useEffect } from "react";
import { Lock, Eye, EyeOff, AlertCircle, Users, Briefcase, Search, Globe } from "lucide-react";

interface PasswordProtectionProps {
  children: React.ReactNode;
}

const PasswordProtection = ({ children }: PasswordProtectionProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const authStatus = localStorage.getItem("huvtsp_2025_auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/validate-password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsAuthenticated(true);
        localStorage.setItem("huvtsp_2025_auth", "true");
      } else {
        setError(data.error || "Incorrect password. Please try again.");
        setPassword("");
      }
    } catch (error) {
      setError("Network error. Please try again.");
      setPassword("");
    }

    setIsLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("huvtsp_2025_auth");
    setPassword("");
    setError("");
  };

  if (isAuthenticated) {
    return (
      <div>
        {/* Logout button */}
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl w-full">
        {/* Preview Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
              <Globe className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Welcome to HUVTSP Alumni Network
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connect with your fellow HUVTSP 2025 alumni, discover exciting ventures, 
              and build meaningful professional relationships in our exclusive network.
            </p>
          </div>

          {/* Features Preview */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Alumni Profiles</h3>
              <p className="text-sm text-gray-600">
                Browse detailed profiles of your fellow alumni, including their expertise, 
                current roles, and contact information.
              </p>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <Briefcase className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Venture Showcase</h3>
              <p className="text-sm text-gray-600">
                Discover exciting projects and ventures launched by your alumni peers. 
                Find collaborators or get inspired by innovative ideas.
              </p>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <Search className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Smart Search</h3>
              <p className="text-sm text-gray-600">
                Find alumni by skills, location, industry, or interests. 
                Connect with people who share your professional goals.
              </p>
            </div>
          </div>

          {/* Stats Preview */}
          {/* <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white text-center">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm opacity-90">Alumni Members</div>
              </div>
              <div>
                <div className="text-2xl font-bold">25+</div>
                <div className="text-sm opacity-90">Active Ventures</div>
              </div>
              <div>
                <div className="text-2xl font-bold">15+</div>
                <div className="text-sm opacity-90">Industries</div>
              </div>
            </div>
          </div> */}
        </div>

        {/* Login Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Access Your Network
            </h2>
            <p className="text-gray-600">
              Enter your alumni password to connect with the community
            </p>
          </div>

          {/* Password Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Enter Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter alumni password"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Access Network"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              This platform is exclusively for HUVTSP 2025 alumni.
              <br />
              Available for access only until September 30, 2025 11:59 PM EST
            </p>
          </div>

          {/* Additional Links */}
          <div className="mt-6 space-y-3">
            <div className="text-center">
              <a
                href="https://forms.gle/a2rnNLBkHfhieBT46"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                Alumni Network Form
              </a>
              <p className="text-xs text-gray-500 mt-1">
                If you are an alumni of HUVTSP 2025, fill in this form to have
                your profile become visible to others
              </p>
            </div>

            <div className="text-center">
              <a
                href="https://forms.gle/rivGC6r8qwndHVWP9"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                Alumni Venture Form
              </a>
              <p className="text-xs text-gray-500 mt-1">
                If you would like to have your venture or project listed on the
                HUVTSP 2025 alumni network, fill in this form
              </p>
            </div>

            <div className="text-center">
              <a
                href="https://www.thecolorproject.world/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                Play our clicking game while you wait?
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordProtection;
