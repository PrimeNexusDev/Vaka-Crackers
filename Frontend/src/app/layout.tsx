import type { Metadata } from "next";
import { AppProvider } from "../context/AppContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vaka Crackers | Premium Sivakasi Fireworks Online",
  description: "Celebrate Diwali and festivals with Vaka Crackers. Premium quality fireworks direct from Sivakasi factory. Maximum discount and wholesale prices with safe home delivery.",
  keywords: "Sivakasi crackers, fireworks online, buy crackers, diwali crackers, wholesale crackers price, direct factory crackers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
