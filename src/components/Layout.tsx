import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet /> {/* This renders the current route */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
