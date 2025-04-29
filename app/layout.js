import Providers from "@/lib/Provider";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "BetterStart",
  description:
    "Creating a management system for new startups could be incredibly valuable. Many new businesses struggle with things like organization, resource allocation, financial tracking, marketing, and customer relations, so a unified tool to streamline these processes could help",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Toaster position="top-center" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
