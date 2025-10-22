"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

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
          <Link href="/" style={{ color: "white", textDecoration: "none" }}>
            Next Job Bot
          </Link>
        </div>
        <nav>
          {status === "authenticated" ? (
            <>
              <Link
                href="/dashboard"
                style={{ color: "white", marginRight: 12 }}
              >
                Dashboard
              </Link>
              <a
                href="#"
                onClick={() => signOut({ callbackUrl: "/" })}
                style={{
                  color: "white",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                Logout
              </a>
            </>
          ) : (
            <>
              <Link href="/login" style={{ color: "white", marginRight: 12 }}>
                Login
              </Link>
              <Link href="/register" style={{ color: "white" }}>
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
