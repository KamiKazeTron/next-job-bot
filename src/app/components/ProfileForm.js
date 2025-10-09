"use client";
import { useState, useEffect } from "react";
import axios from "../lib/axios";

export default function ProfileForm() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
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

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get("/user/profile");
        if (res.data.user) setProfile(res.data.user);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  function onChange(e) {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put("/user/profile", profile);
      alert("Profile saved");
    } catch (err) {
      console.error(err);
      alert("Error saving profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div style={{ display: "grid", gap: 8 }}>
        <input
          name="name"
          value={profile.name || ""}
          onChange={onChange}
          placeholder="Full name"
          required
        />
        <input
          name="email"
          value={profile.email || ""}
          onChange={onChange}
          placeholder="Email"
          required
        />
        <input
          name="age"
          value={profile.age || ""}
          onChange={onChange}
          placeholder="Age"
        />
        <input
          name="sex"
          value={profile.sex || ""}
          onChange={onChange}
          placeholder="Sex"
        />
        <input
          name="address"
          value={profile.address || ""}
          onChange={onChange}
          placeholder="Address"
        />
        <input
          name="phone"
          value={profile.phone || ""}
          onChange={onChange}
          placeholder="Phone"
        />
        <textarea
          name="education"
          value={profile.education || ""}
          onChange={onChange}
          placeholder="Education"
        />
        <textarea
          name="experience"
          value={profile.experience || ""}
          onChange={onChange}
          placeholder="Experience"
        />
        <input
          name="resume"
          value={profile.resume || ""}
          onChange={onChange}
          placeholder="Resume URL or path"
        />
        <input
          name="portfolio"
          value={profile.portfolio || ""}
          onChange={onChange}
          placeholder="Portfolio URL"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </form>
  );
}
