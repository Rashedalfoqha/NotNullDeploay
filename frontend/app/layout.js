"use client"
import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./Navbar";
import StoreProvider from "./StoreProvider";
import { store } from "./lib/store";
import Footer from "./Footer";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(true); 
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider store={store}>
          {isLoggedIn && <Navbar />}
          {children}
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
