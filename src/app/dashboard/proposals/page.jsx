"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ProposalsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/register");
      return;
    }
    if (status === "authenticated") {
      fetchProposals();
    }
  }, [status]);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/user/proposal");
      setProposals(res.data);
    } catch (err) {
      console.error("Failed to fetch proposals:", err);
      setError(err.response?.data?.error || "Failed to fetch proposals");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const techArray = technologies
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);
    if (techArray.length === 0) {
      setError("Please provide at least one technology");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/user/proposal", {
        jobOffer: { title, description, technologies: techArray },
      });
      setProposals([...proposals, res.data]);
      setSuccess("Proposal created successfully!");
      setTitle("");
      setDescription("");
      setTechnologies("");
    } catch (err) {
      console.error("Failed to create proposal:", err);
      setError(err.response?.data?.error || "Failed to create proposal");
      if (err.response?.data?.details) {
        setError(`${err.response.data.error}: ${err.response.data.details}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading)
    return <p className="text-center mt-10 text-[#101419]">Loading...</p>;

  return (
    <div className="min-h-screen bg-[#ADD9F4] flex flex-col items-center p-6">
      <div className="w-full max-w-3xl bg-[#101419] rounded-2xl shadow-lg p-8 text-white">
        <h1 className="text-2xl font-bold mb-6 text-center">My Proposals</h1>

        {/* Existing Proposals */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Existing Proposals</h2>
          {proposals.length === 0 ? (
            <p>No proposals found.</p>
          ) : (
            <ul className="space-y-4">
              {proposals.map((proposal) => (
                <li
                  key={proposal.id}
                  className="bg-[#476C9B] p-4 rounded-lg shadow-md"
                >
                  <p>
                    <span className="font-semibold"></span>{" "}
                    {proposal.proposalText}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    {proposal.status}
                  </p>
                  {proposal.jobOffer && (
                    <p>
                      <span className="font-semibold">Job Offer:</span>{" "}
                      {proposal.jobOffer.title}
                    </p>
                  )}
                  {proposal.project && (
                    <p>
                      <span className="font-semibold">Project:</span>{" "}
                      {proposal.project.title}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Create Proposal Form */}
        <h2 className="text-xl font-semibold mb-2">Create New Proposal</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Job Offer Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 rounded-lg bg-[#476C9B] text-white focus:outline-none focus:ring-2 focus:ring-[#468C98]"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded-lg bg-[#476C9B] text-white focus:outline-none focus:ring-2 focus:ring-[#468C98]"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">
              Technologies (comma-separated)
            </label>
            <input
              type="text"
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
              className="w-full p-2 rounded-lg bg-[#476C9B] text-white focus:outline-none focus:ring-2 focus:ring-[#468C98]"
              required
            />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="submit"
              className="bg-[#984447] hover:bg-[#468C98] text-white px-4 py-2 rounded-lg transition-colors duration-200"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate and Create Proposal"}
            </button>
          </div>
        </form>

        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-500 mt-2">{success}</p>}
      </div>
    </div>
  );
}
