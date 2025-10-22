"use client";

import Navbar from "./components/Navbar";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

export default function RootLayout({ children }) { 
  return (
    <html lang="en">
      <body className="m-0 p-0 bg-[#ADD9F4] min-h-screen">
        <SessionProvider>
          <Navbar />
          <main className="relative z-10 p-5">{children}</main>
        </SessionProvider>
      </body>
    </html>
  ); 
}
