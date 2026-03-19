// src/layouts/UserLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/NavBar";

const UserLayout: React.FC = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default UserLayout;
