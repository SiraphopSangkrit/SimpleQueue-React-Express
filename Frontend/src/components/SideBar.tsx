import { type ReactNode, useState } from "react";
import { Link, useLocation } from "react-router";
import {UsersIcon,BookOpenIcon} from "@heroicons/react/24/outline";

interface SideBarProps {
  isOpen?: boolean;
  onClose?: () => void;
  totalBookings?: string;
}

interface MenuItem {
  label: string;
  icon: ReactNode;
  path?: string;
  badge?: string;
  children?: MenuItem[];
}

export function SideBar({ isOpen = true, onClose, totalBookings = "" }: SideBarProps) {
  const location = useLocation();
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);

  const toggleDropdown = (label: string) => {
    setOpenDropdowns(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const menuItems: MenuItem[] = [
    {
      label: "Dashboard",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        </svg>
      ),
      path: "/",
    },
    {
      label: "จองทั้งหมด",
      icon: (
       <BookOpenIcon className="w-5 h-5" />
      ),
      badge: totalBookings,
      children: [
        {
          label: "รายการจอง",
          icon:'',
          path: "/bookings"
        },
        {
          label: "ประวัติการจอง",
          icon: '',
          path: "/bookings/history"
        }
      ]
    },
    {
      label: "ลูกค้า",
      icon: (
        <UsersIcon className="w-5 h-5" />
      ),
      path: "/customers",
       
    },
    {
      label: "การตั้งค่า",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      children: [
        {
          label: "ข้อมูลทั่วไป",
          icon: '',
          path: "/settings/general"
        },
        {
          label: "การแจ้งเตือน",
          icon: '',
          path: "/settings/notifications"
        }
      ]
    },
  ];

  const isActiveRoute = (path: string) => {
    if (!path) return false;
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const hasActiveChild = (children?: MenuItem[]) => {
    if (!children) return false;
    return children.some(child => child.path && isActiveRoute(child.path));
  };

  const renderMenuItem = (item: MenuItem) => {
    const hasChildren = item.children && item.children.length > 0;
    const isDropdownOpen = openDropdowns.includes(item.label);
    const isActive = item.path ? isActiveRoute(item.path) : hasActiveChild(item.children);

    if (hasChildren) {
      return (
        <li key={item.label}>
          <details open={isDropdownOpen}>
            <summary 
              className={`flex items-center justify-between ${isActive ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                toggleDropdown(item.label);
              }}
            >
              <div className="flex items-center gap-2">
                {item.icon}
                <span className="ml-2 text-base">{item.label}</span>
              </div>
              {item.badge && (
                <span className="badge badge-primary badge-sm">
                  {item.badge}
                </span>
              )}
            </summary>
            <ul className="p-2">
              {item.children?.map((child) => (
                <li key={child.label} className="pl-4">
                  <Link
                    to={child.path || '#'}
                    className={child.path && isActiveRoute(child.path) ? 'active' : ''}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        onClose?.();
                      }
                    }}
                  >
                    {child.icon}
                    <span>{child.label}</span>
                    {child.badge && (
                      <span className="badge badge-primary badge-sm">
                        {child.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        </li>
      );
    }

    return (
      <li key={item.label}>
        <Link
          to={item.path || '#'}
          className={isActive ? 'active' : ''}
          onClick={() => {
            if (window.innerWidth < 1024) {
              onClose?.();
            }
          }}
        >
          {item.icon}
          <span className="ml-2 text-base">{item.label}</span>
          {item.badge && (
            <span className="badge badge-primary badge-sm">
              {item.badge}
            </span>
          )}
        </Link>
      </li>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
         fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-base-200 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col shadow-[6px_0px_8px_0px_rgba(0,_0,_0,_0.1)]
      `}>
        {/* Header */}
        <div className="navbar bg-base-100 min-h-16 px-4 shadow-sm lg:hidden">
          <div className="flex-1">
            <div className="flex items-center gap-3">
             
              <span className="font-bold text-lg">Booking App</span>
            </div>
          </div>
          <div className="flex-none">
            <button 
              className="btn btn-square btn-ghost btn-sm"
              onClick={onClose}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <ul className="menu menu-vertical bg-base-200 w-full p-2">
            {menuItems.map(renderMenuItem)}
          </ul>
        </div>
      </div>
    </>
  );
}