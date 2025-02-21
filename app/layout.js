"use client";

import { Sora, Inter } from "next/font/google";
import "./globals.css";
import { Provider } from "react-redux";
import store from "./store/store";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${sora.variable} ${inter.variable} font-sora antialiased`}
      >
        <ClerkProvider
          multiSession={true}
          appearance={{
            baseTheme: undefined,
            variables: { colorPrimary: "#2B7344" },
          }}
        >
          <Provider store={store}>{children}</Provider>
        </ClerkProvider>
      </body>
    </html>
  );
}
