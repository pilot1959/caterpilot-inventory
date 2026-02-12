import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/app/store/store";

export const metadata: Metadata = {
  title: "CaterPilot Inventory",
  description: "Inventory + vendors + pricing (rolling average COGS).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
