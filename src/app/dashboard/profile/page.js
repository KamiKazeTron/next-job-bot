"use client";
import { useState } from "react";
import api from "../../../../lib//axios";

export default function ProfileForm({ userId }) {
  const [form, setForm] = useState({
    education: "",
    experience: "",
    resume: "",
    portfolio: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/user/profile`, { userId, ...form });
      alert("✅ Profile updated successfully!");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("❌ Error updating profile");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {Object.keys(form).map((key) => (
        <div key={key}>
          <label>{key}</label>
          <input name={key} value={form[key]} onChange={handleChange} />
        </div>
      ))}
      <button type="submit">Save Profile</button>
    </form>
  );
}
