import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

export default function Index() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setError("");
      await login(email, password);

      const user = JSON.parse(localStorage.getItem("user")!);

      if (user.role === "ROLE_ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
      {/* LEFT FULL PANEL */}
      <div className="relative flex flex-col justify-between p-10 text-white">
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-700" />

        {/* Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] [background-size:22px_22px]" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-teal-500/20 border border-white/10 flex items-center justify-center">
              <span className="text-xl font-bold">📄</span>
            </div>
            <p className="text-lg font-semibold tracking-wide">SMRMS</p>
          </div>

          <h1 className="mt-14 text-4xl font-bold leading-tight">
            Smart Meeting Room
            <br />
            Management System
          </h1>

          <p className="mt-6 text-white/80 max-w-md leading-relaxed">
            Streamline your workspace with intelligent room booking, real-time
            availability, and comprehensive analytics.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-5 max-w-md">
            <FeatureItem
              title="Smart Room Discovery"
              desc="Find the perfect room based on capacity and amenities."
              icon="📘"
            />
            <FeatureItem
              title="Instant Booking"
              desc="Book meeting rooms in seconds with real-time updates."
              icon="📅"
            />
            <FeatureItem
              title="Team Collaboration"
              desc="Invite attendees and manage meetings easily."
              icon="👥"
            />
            <FeatureItem
              title="Usage Analytics"
              desc="Track utilization and optimize workspace efficiency."
              icon="📊"
            />
          </div>
        </div>

        <p className="relative z-10 text-white/50 text-sm">
          © 2026 SMRMS. All rights reserved.
        </p>
      </div>

      {/* RIGHT FULL PANEL */}
      <div className="flex items-center justify-center px-6 sm:px-12 py-10 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
          <p className="mt-2 text-slate-500">
            Enter your credentials to access your account
          </p>

          <div className="mt-8 bg-slate-100 rounded-xl p-1 flex">
            <button className="w-1/2 py-2 rounded-lg text-sm font-medium bg-white shadow text-slate-900">
              Sign In
            </button>
            <button
              className="w-1/2 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-700"
              type="button"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </button>
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              placeholder="you@company.com"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mt-5">
            <label className="text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            className="mt-6 w-full rounded-xl bg-slate-900 text-white py-3 font-semibold hover:bg-slate-800 transition flex items-center justify-center gap-2"
          >
            Sign In <span className="text-lg">→</span>
          </button>

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-800">Demo Accounts:</p>
            <p className="mt-2">
              <span className="font-medium text-slate-700">Admin:</span>{" "}
              admin@company.com
            </p>
            <p className="mt-1">
              <span className="font-medium text-slate-700">User:</span>{" "}
              john.doe@company.com
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Use any password (min 6 chars)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ title, desc, icon }) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
          <span className="text-lg">{icon}</span>
        </div>
        <div>
          <p className="font-semibold text-sm">{title}</p>
          <p className="text-xs text-white/70 mt-1 leading-snug">{desc}</p>
        </div>
      </div>
    </div>
  );
}
