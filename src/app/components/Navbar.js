import Link from "next/link";

export default function Navbar() {
  return (
    <header
      style={{ background: "#111827", color: "white", padding: "12px 20px" }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <Link href="/"
             style={{ color: "white", textDecoration: "none" }}>
              Next Job Bot
            
          </Link>
        </div>
        <nav>
          <Link href="/dashboard"
             style={{ color: "white", marginRight: 12 }}>
              Dashboard
          </Link>
          <Link href="/login"
            style={{ color: "white", marginRight: 12 }}>
              Login
          </Link>
          <Link href="/register"
            style={{ color: "white" }}>
            Register
          </Link>
        </nav>
      </div>
    </header>
  );
}
