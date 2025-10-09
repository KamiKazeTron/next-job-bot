import Link from "next/link";

export default function Home() {
  return (
    <div style={{ maxWidth: 900, margin: "40px auto", textAlign: "center" }}>
      <h1>Next Job Bot</h1>
      <p>
        Create professional Upwork proposals with AI — tailored from your
        profile and projects.
      </p>
      <div style={{ marginTop: 20 }}>
        <Link href="/register"
          style={{ marginRight: 12 }}>
            Register
        </Link>
        <Link href="/login">
          Login
        </Link>
      </div>
    </div>
  );
}
