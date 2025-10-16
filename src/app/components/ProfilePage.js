"use client";

import { useEffect, useState } from "react";
import axios from "../../../lib/axios";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get("/user/profile");
        setUser(res.data.user);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axios.put("/user/profile", {
        name: user.name,
        age: Number(user.age),
        sex: user.sex,
        address: user.address,
        phone: user.phone,
        education: user.education,
        experience: user.experience,
        resume: user.resume,
        portfolio: user.portfolio,
      });

      setUser(res.data.updatedUser);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!user) return null;

  const fields = [
    "name",
    "email",
    "age",
    "sex",
    "address",
    "phone",
    "education",
    "experience",
    "resume",
    "portfolio",
  ];

  // Simple inline styles
  const styles = {
    container: {
      maxWidth: "500px",
      margin: "40px auto",
      padding: "20px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      fontFamily: "Arial, sans-serif",
    },
    heading: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "20px",
    },
    label: {
      display: "flex",
      flexDirection: "column",
      marginBottom: "12px",
    },
    input: {
      padding: "8px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      fontSize: "14px",
      marginTop: "4px",
    },
    disabledInput: {
      backgroundColor: "#f0f0f0",
    },
    buttonContainer: {
      marginTop: "16px",
      display: "flex",
      gap: "8px",
    },
    editButton: {
      backgroundColor: "green",
      color: "white",
      padding: "8px 16px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
    saveButton: {
      backgroundColor: "blue",
      color: "white",
      padding: "8px 16px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
    disabledButton: {
      backgroundColor: "#999",
      cursor: "not-allowed",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Profile</h1>

      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <label key={field} style={styles.label}>
            <span style={{ fontWeight: "600" }}>
              {field.charAt(0).toUpperCase() + field.slice(1)}:
            </span>
            <input
              type={field === "email" ? "email" : field === "age" ? "number" : "text"}
              name={field}
              value={user[field] || ""}
              onChange={handleChange}
              disabled={field === "email" || !isEditing}
              style={{
                ...styles.input,
                ...(field === "email" || !isEditing ? styles.disabledInput : {}),
              }}
            />
          </label>
        ))}

        <div style={styles.buttonContainer}>
          {!isEditing && (
            <button
              type="button"
              style={styles.editButton}
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          )}
          {isEditing && (
            <button
              type="submit"
              style={{ 
                ...styles.saveButton, 
                ...(saving ? styles.disabledButton : {}) 
              }}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
