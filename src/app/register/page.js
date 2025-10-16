"use client";
import { useState } from "react";
import api from "../../lib/axios";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
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
    resume: "",
    portfolio: "",
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/register", form);
      if (res.status === 200) {
        alert("Signup successful! Redirecting to login...");
        router.push("/login");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h1>Create Your Account</h1>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "10px" }}>
        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          onChange={handleChange}
          required
        />
        <input
          name="age"
          placeholder="Age"
          type="number"
          onChange={handleChange}
        />
        <input
          name="sex"
          placeholder="Sex (Male/Female)"
          onChange={handleChange}
        />
        <input name="address" placeholder="Address" onChange={handleChange} />
        <input
          name="phone"
          placeholder="Phone Number"
          onChange={handleChange}
        />
        <textarea
          name="education"
          placeholder="Education"
          onChange={handleChange}
        />
        <textarea
          name="experience"
          placeholder="Experience"
          onChange={handleChange}
        />
        <input name="resume" placeholder="Resume URL" onChange={handleChange} />
        <input
          name="portfolio"
          placeholder="Portfolio URL"
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
