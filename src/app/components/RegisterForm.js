"use client";

import { useState } from "react";
import api from "../../../lib/axios";

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    sex: "",
    address: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Send the actual form data, not hardcoded values
      const response = await api.post("/auth/register", form);

      setMessage("Registration successful!");
      console.log("User registered:", response.data.user);

      // Reset form
      setForm({
        name: "",
        email: "",
        password: "",
        age: "",
        sex: "",
        address: "",
        phone: "",
      });
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data?.error) {
        setMessage(`Error: ${err.response.data.error}`);
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 bg-white shadow rounded"
    >
      <h2 className="text-2xl font-bold mb-4">Register</h2>

      {["name", "email", "password", "age", "sex", "address", "phone"].map(
        (field) => (
          <input
            key={field}
            type={
              field === "password"
                ? "password"
                : field === "email"
                ? "email"
                : field === "age"
                ? "number"
                : "text"
            }
            name={field}
            value={form[field]}
            onChange={handleChange}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            required={
              field !== "sex" && field !== "address" && field !== "phone"
            } // optional fields
            className="w-full mb-2 p-2 border rounded"
          />
        )
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? "Registering..." : "Register"}
      </button>

      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </form>
  );
}
