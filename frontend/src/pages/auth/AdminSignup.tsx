import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/api";

export default function AdminSignup() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    companyName: "",
    subdomain: "",
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      await api.post(
        "/auth/admin-signup",
        form
      );

      alert("Company Registered Successfully");

      navigate("/");

    } catch (err: any) {

      alert(
        err?.response?.data?.message ||
        "Signup failed"
      );
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-6">
          Company Registration
        </h1>

        <form
          onSubmit={handleSignup}
          className="space-y-4"
        >

          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            type="text"
            name="subdomain"
            placeholder="Company Code"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            type="text"
            name="firstName"
            placeholder="Admin First Name"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            type="text"
            name="lastName"
            placeholder="Admin Last Name"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Admin Email"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            type="text"
            name="department"
            placeholder="Department"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
          >
            Register Company
          </button>

        </form>

      </div>

    </div>
  );
}