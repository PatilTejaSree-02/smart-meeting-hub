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
    <div className="flex h-screen items-center justify-center">
      <div className="w-80 space-y-4">
        <h2 className="text-xl font-bold">Login</h2>

        <input
          placeholder="Email"
          className="w-full border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white p-2"
        >
          Login
        </button>
      </div>
    </div>
  );
}
