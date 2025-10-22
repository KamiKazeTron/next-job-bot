"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProjectsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
    else if (status === "authenticated") fetchProjects();
  }, [status, router]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get("/api/user/project");
      setProjects(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setLoading(false);
    }
  };

  const handleEditToggle = (project) => {
    if (editId === project.id) setEditId(null);
    else {
      setEditId(project.id);
      setFormData({
        title: project.title,
        description: project.description,
        technologies: project.technologies.join(", "),
      });
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put("/api/user/project", {
        id,
        ...formData,
        technologies: JSON.stringify(
          formData.technologies.split(",").map((t) => t.trim())
        ),
      });
      setEditId(null);
      fetchProjects();
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure?")) {
      try {
        await axios.delete(`/api/user/project?id=${id}`);
        fetchProjects();
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  if (status === "loading" || loading)
    return <p className="text-center mt-10 text-[#101419]">Loading...</p>;

  return (
    <div className="min-h-screen bg-[#ADD9F4] p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#101419]">My Projects</h1>
        <Link
          href="/dashboard/projects/new"
          className="bg-[#984447] hover:bg-[#468C98] text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          Add New Project
        </Link>
      </div>

      <ul className="w-full space-y-4">
        {projects.map((project) => (
          <li
            key={project.id}
            className="bg-[#101419] p-6 rounded-2xl shadow-lg text-white"
          >
            <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
            <p className="mb-1">{project.description}</p>
            <p className="mb-3">
              <span className="font-semibold">Technologies:</span>{" "}
              {project.technologies.join(", ")}
            </p>

            <div className="flex gap-2 mb-3">
              <button
                onClick={() => handleEditToggle(project)}
                className="bg-[#984447] hover:bg-[#468C98] px-3 py-1 rounded-lg transition-colors duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="bg-[#476C9B] hover:bg-[#468C98] px-3 py-1 rounded-lg transition-colors duration-200"
              >
                Delete
              </button>
            </div>

            {editId === project.id && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdate(project.id);
                }}
                className="space-y-3"
              >
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Title"
                  className="w-full p-2 rounded-lg bg-[#476C9B] text-white focus:outline-none focus:ring-2 focus:ring-[#468C98]"
                  required
                />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                  className="w-full p-2 rounded-lg bg-[#476C9B] text-white focus:outline-none focus:ring-2 focus:ring-[#468C98]"
                  required
                />
                <input
                  name="technologies"
                  value={formData.technologies}
                  onChange={handleInputChange}
                  placeholder="Technologies (comma-separated)"
                  className="w-full p-2 rounded-lg bg-[#476C9B] text-white focus:outline-none focus:ring-2 focus:ring-[#468C98]"
                  required
                />
                <div className="flex gap-2 justify-end">
                  <button
                    type="submit"
                    className="bg-[#984447] hover:bg-[#468C98] px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditId(null)}
                    className="bg-[#476C9B] hover:bg-[#468C98] px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
