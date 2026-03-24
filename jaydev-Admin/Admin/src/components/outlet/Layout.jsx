import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar.jsx";
import Header from "../topbar/Header.jsx";
import Loader from "../Loader.jsx";

export default function Layout() {
  const [sidebar, setSidebar] = useState(true); // expanded by default
  const [loading, setLoading] = useState(true); // ✅ new loader state

  useEffect(() => {
    // Simulate loading (you can replace with real data loading logic)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Loader stays for 1 second
    return () => clearTimeout(timer);
  }, []);

  // ✅ Show loader until loading is done
  if (loading) {
    return <Loader />;
  }

  // ✅ Once loading completes, show layout content
  return (
    <main className="flex">
      {/* Sidebar */}
      <Sidebar sidebar={sidebar} />

      {/* Mobile overlay to close sidebar */}
      <div
        onClick={() => setSidebar(false)}
        className={`fixed inset-0 bg-black/40 z-20 md:hidden transition-opacity duration-300 ${
          sidebar ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Main content area */}
      <div
        className={`flex flex-col transition-all duration-300 w-full ml-0 
        ${sidebar ? "md:ml-[18vw] md:w-[calc(100%-18vw)]" : "md:ml-[80px] md:w-[calc(100%-80px)]"}`}
      >
        {/* Header */}
        <Header toggleSidebar={() => setSidebar(!sidebar)} sidebar={sidebar} />

        {/* Page content */}
        <div className="flex-1 p-4 mt-[70px] bg-white transition-colors">
          <Outlet />
        </div>
      </div>
    </main>
  );





  
}
