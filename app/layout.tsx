import { ReactNode } from "react";
import { Inter } from "next/font/google";

import DraftIndicator from "./components/DraftIndicator";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <section className="min-h-screen">
          <DraftIndicator />
          <main>{children}</main>
        </section>
      </body>
    </html>
  );
}
