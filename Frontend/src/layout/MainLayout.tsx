import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Outlet } from "react-router";
import { SideBar } from "../components/SideBar";


export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Mobile Header with hamburger */}
      <div className="lg:hidden">
        <div className="navbar bg-base-100 border-b border-base-300">
          <div className="flex-none">
            <button 
              className="btn btn-square btn-ghost"
              onClick={toggleSidebar}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          <div className="flex-1">
            <span className="text-xl font-bold">Booking App</span>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block">
        <Navbar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <SideBar isOpen={sidebarOpen} onClose={closeSidebar} />
        
        {/* Main Content */}
        <main className="flex-1 bg-base-200 p-4 lg:p-8 overflow-auto">
         
            <Outlet />
        
        </main>
      </div>
      
      <Footer />
    </div>
  );
}
