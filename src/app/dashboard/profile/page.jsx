"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    sex: "",
    address: "",
    phone: "",
    education: "",
    experience: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
    if (status === "authenticated") fetchProfile();
  }, [status]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/user/profile");
      setFormData((prev) => ({ ...prev, ...res.data }));
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.put("/api/user/profile", formData);
      setEditMode(false);
      await fetchProfile();
      alert("Profile updated");
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setEditMode(false);
    await fetchProfile();
  };

  if (status === "loading" || loading)
    return <p className="text-center mt-10 text-[#101419]">Loading...</p>;

  return (
    <div className="min-h-screen bg-[#ADD9F4] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#101419] rounded-2xl shadow-lg p-8 text-white">
        <h1 className="text-2xl font-bold mb-6 text-center">My Profile</h1>

        {!editMode ? (
          <div className="space-y-3">
            {Object.entries(formData).map(([key, value]) => (
              <p key={key}>
                <span className="font-semibold capitalize">{key}:</span> {value}
              </p>
            ))}

            <div className="mt-6 flex justify-center">
              <button
                className="bg-[#984447] hover:bg-[#468C98] text-white px-4 py-2 rounded-lg transition-colors duration-200"
                onClick={() => setEditMode(true)}
              >
                Edit
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key}>
                <label className="block font-semibold mb-1 capitalize">
                  {key}
                </label>
                {key === "experience" ? (
                  <textarea
                    name={key}
                    value={value || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg bg-[#476C9B] text-white focus:outline-none focus:ring-2 focus:ring-[#468C98]"
                  />
                ) : (
                  <input
                    name={key}
                    value={value || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg bg-[#476C9B] text-white focus:outline-none focus:ring-2 focus:ring-[#468C98]"
                  />
                )}
              </div>
            ))}

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="submit"
                className="bg-[#984447] hover:bg-[#468C98] text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Save
              </button>
              <button
                type="button"
                className="bg-[#476C9B] hover:bg-[#468C98] text-white px-4 py-2 rounded-lg transition-colors duration-200"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
