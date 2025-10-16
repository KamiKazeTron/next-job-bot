"use client";

import { useState } from "react";
import api from "../../lib/axios";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    sex: "",
    address: "",
    phone: "",
    education: "",
    experience: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Prepare cleaned form data
      const cleanedForm = {
        ...form,
        age: parseInt(form.age) || 0,
        education: form.education || null,
        experience: form.experience || null,
      };

      const res = await axios.post("/register", cleanedForm, {
         headers: { "Content-Type": "application/json" },
       });

      // Check if backend returned an error
      if (res.data.error) {
        setError(res.data.error);
      } else {
        alert("✅ Registration successful!");
        router.push("/login");
      }
    } catch (err) {
      console.error(
        "❌ Registration failed:",
        err.response?.data || err.message
      );
      setError(err.response?.data?.error || "Failed to register.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(form).map((key) => (
          <div key={key}>
            <input
              type={
                key === "password"
                  ? "password"
                  : key === "age"
                  ? "number"
                  : "text"
              }
              name={key}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              value={form[key]}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required={["name", "email", "password"].includes(key)}
            />
          </div>
        ))}

        {error && <p className="text-red-500 text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
