"use client";
import Navbar from "./components/Navbar";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Navbar />
          <main style={{ padding: "20px" }}>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
