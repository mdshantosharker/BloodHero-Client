import Footer from "@/components/Home/Footer";
import Navbar from "@/components/Navbar";
import { ToastProvider } from "@heroui/react";
import React from "react";

const MainLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <ToastProvider placement="top" />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
