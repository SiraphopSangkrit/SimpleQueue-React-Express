import { ThemeToggle } from "./ThemeController";
import { useNavigate } from "react-router";
import { logout } from "../api/AuthAPI";
export function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
      logout();
      navigate("/login", { replace: true });
    };
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <p className="text-xl">Booking App</p>
      </div>
      <div className="flex-none gap-5 flex items-center">
        <ThemeToggle />
       
          
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full bg-gray-700 dark:bg-white">
              
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <p className="justify-between">
                {localStorage.getItem("email") || "Admin"}
                
              </p>
            </li>
            <li>
               <button 
            onClick={handleLogout}
            className="btn btn-outline btn-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            ออกจากระบบ
          </button>
             
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
