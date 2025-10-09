import Navbar from "./components/Navbar";

export const metadata = {
  title: "Next Job Bot",
  description: "AI-powered Upwork proposal generator",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main style={{ padding: "20px" }}>{children}</main>
      </body>
    </html>
  );
}
