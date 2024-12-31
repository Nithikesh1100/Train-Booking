"use client";

import React, { useEffect, useState } from "react";
import { User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        setIsLoggedIn(true);
        const email = localStorage.getItem("userEmail") || "";
        setUserEmail(email);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are already logged out.");
        return;
      }

      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/logout`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to log out.");
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
      setIsLoggedIn(false);
      setUserEmail("");
      router.push("/auth/login"); // Redirect after logout
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <span className="text-xl font-bold">Train Booking</span>
          </div>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span>{userEmail || "User"}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border rounded flex items-center gap-2 hover:bg-gray-100"
                  disabled={loading}
                >
                  <LogOut className="w-4 h-4" />
                  {loading ? "Logging out..." : "Logout"}
                </button>
              </div>
            ) : (
              <Link href="/auth/login">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
