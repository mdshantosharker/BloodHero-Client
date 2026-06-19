import Footer from "@/components/Home/Footer";
import Navbar from "@/components/Navbar";
import React from "react";

const MainLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
