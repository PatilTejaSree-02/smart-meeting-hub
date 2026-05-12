import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

type AuthMode =
  | "signin"
  | "company"
  | "employee";

export default function Index() {

  const { login } = useAuth();

  const navigate = useNavigate();

  const [mode, setMode] =
    useState<AuthMode>("signin");

  /* ================= LOGIN ================= */

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const handleLogin = async () => {

    try {

      setError("");

      await login(email, password);

      const user = JSON.parse(
        localStorage.getItem("user")!
      );

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

    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#F7F9FC] overflow-hidden">

      {/* ================= LEFT SECTION ================= */}

      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden">

        {/* Gradient Background */}

        <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0F172A] to-[#0F766E]" />

        {/* Glow */}

        <div className="absolute top-[-120px] left-[-120px] h-[300px] w-[300px] rounded-full bg-teal-400/20 blur-3xl" />

        <div className="absolute bottom-[-120px] right-[-120px] h-[300px] w-[300px] rounded-full bg-cyan-400/20 blur-3xl" />

        {/* Pattern */}

        <div className="absolute inset-0 opacity-20">

          <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.2)_1px,transparent_0)] [background-size:24px_24px]" />

        </div>

        {/* Content */}

        <div className="relative z-10">

          {/* Logo */}

          <div className="flex items-center gap-4">

            <div className="h-14 w-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center backdrop-blur-xl">

              <span className="text-2xl">
                🏢
              </span>

            </div>

            <div>

              <h1 className="text-2xl font-bold text-white">
                SMRMS
              </h1>

              <p className="text-white/60 text-sm">
                Workspace Intelligence
              </p>

            </div>

          </div>
          <div className="mt-20 max-w-xl">

            <h2 className="text-6xl leading-tight font-bold text-white">

              SMART
              <br />
              <h2 className="text-4xl leading-tight text-white">
              Meeting Room Management
              <br />
              </h2>

            </h2>

            <p className="mt-8 text-lg text-white/70 leading-relaxed">

              Centralize room booking,
              optimize workspace utilization,
              and streamline enterprise collaboration
              with intelligent scheduling.

            </p>

          </div>

          {/* Stats */}

          <div className="mt-16 flex gap-6">

            <StatCard
              value="99.9%"
              label="System Uptime"
            />

            <StatCard
              value="10K+"
              label="Bookings Managed"
            />

            <StatCard
              value="500+"
              label="Organizations"
            />

          </div>

        </div>

        {/* Footer */}

        <p className="relative z-10 text-white/40 text-sm">

          © 2026 SMRMS. Enterprise Workspace Platform.

        </p>

      </div>

      {/* ================= RIGHT SECTION ================= */}

      <div className="flex items-center justify-center p-6 lg:p-12">

        <div className="w-full max-w-lg">

          {/* Auth Card */}

          <div className="bg-white/80 backdrop-blur-2xl border border-slate-200 rounded-[32px] shadow-2xl p-8">

            {/* Heading */}

            <div>

              <h2 className="text-4xl font-bold text-slate-900">

                Workspace Access

              </h2>

              <p className="mt-3 text-slate-500">

                Securely access your company workspace.

              </p>

            </div>

            {/* Mode Switch */}

            <div className="mt-8 grid grid-cols-3 bg-slate-100 rounded-2xl p-1">

              <button
                onClick={() => setMode("signin")}
                className={`py-3 rounded-xl text-sm font-semibold transition ${
                  mode === "signin"
                    ? "bg-white shadow text-slate-900"
                    : "text-slate-500"
                }`}
              >

                Sign In

              </button>

              <button
                onClick={() => setMode("company")}
                className={`py-3 rounded-xl text-sm font-semibold transition ${
                  mode === "company"
                    ? "bg-white shadow text-slate-900"
                    : "text-slate-500"
                }`}
              >

                Company

              </button>

              <button
                onClick={() => setMode("employee")}
                className={`py-3 rounded-xl text-sm font-semibold transition ${
                  mode === "employee"
                    ? "bg-white shadow text-slate-900"
                    : "text-slate-500"
                }`}
              >

                Employee

              </button>

            </div>

            {/* ================= SIGN IN ================= */}

            {mode === "signin" && (

              <div className="mt-8">

                <Input
                  label="Email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={setEmail}
                />

                <div className="mt-5">

                  <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={setPassword}
                  />

                </div>

                {error && (

                  <div className="mt-5 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">

                    {error}

                  </div>

                )}

                <button
                  onClick={handleLogin}
                  className="mt-6 w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-semibold transition"
                >

                  Sign In →

                </button>

              </div>

            )}

            {/* ================= COMPANY ================= */}

            {mode === "company" && (

              <div className="mt-8">

                <div className="rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 p-6 text-white">

                  <h3 className="text-2xl font-bold">

                    Register Your Company

                  </h3>

                  <p className="mt-2 text-white/80">

                    Create your organization workspace
                    and onboard your teams.

                  </p>

                  <button
                    onClick={() => navigate("/admin-signup")}
                    className="mt-6 bg-white text-slate-900 px-6 py-3 rounded-xl font-semibold hover:bg-slate-100 transition"
                  >

                    Create Workspace

                  </button>

                </div>

              </div>

            )}

            {/* ================= EMPLOYEE ================= */}

            {mode === "employee" && (

              <div className="mt-8">

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

                  <h3 className="text-2xl font-bold text-slate-900">

                    Join Existing Workspace

                  </h3>

                  <p className="mt-2 text-slate-500">

                    Join your company using your
                    organization code.

                  </p>

                  <button
                    onClick={() => navigate("/signup")}
                    className="mt-6 w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition"
                  >

                    Join Company

                  </button>

                </div>

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}

/* ================= INPUT ================= */

function Input({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {

  return (

    <div>

      <label className="text-sm font-semibold text-slate-700">

        {label}

      </label>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition"
      />

    </div>
  );
}

/* ================= STAT CARD ================= */

function StatCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {

  return (

    <div className="rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xl px-6 py-5">

      <p className="text-3xl font-bold text-white">

        {value}

      </p>

      <p className="mt-1 text-sm text-white/60">

        {label}

      </p>

    </div>
  );
}