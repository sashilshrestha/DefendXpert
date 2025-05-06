'use client';
import Logo from '../assets/images/logo.png';
import { useState } from 'react';
import { Link } from 'react-router';
import {
  LayoutDashboard,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { logout } from '../utils/logout';

export default function Sidebar() {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('confidence-level');

  const menuItems = [
    // { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'confidence-level', label: 'Confidence Level', icon: Settings },
    { id: 'model-training', label: 'Model Training', icon: Settings },
  ];

  const handleMenuClick = (id) => {
    setActiveItem(id);
    navigate(`/admin/${id}`);
  };

  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`max-h-screen bg-base-100 text-base-content fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out inset-auto `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-base-200">
            <div className="flex items-center">
              <img src={Logo} alt="" className="h-10" />
              <span className="text-xl font-bold ml-3">DefendXpert</span>
            </div>
          </div>

          {/* Sidebar Menu */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="menu menu-md px-4 gap-2 w-full">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <a
                    className={
                      activeItem === item.id
                        ? 'active bg-blue-400 text-dxprimary'
                        : ''
                    }
                    onClick={() => handleMenuClick(item.id)}
                  >
                    <item.icon size={18} />
                    {item.label}
                    {item.badge && (
                      <span className="badge badge-sm badge-primary ml-auto">
                        {item.badge}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-base-200">
            <ul className="menu menu-md gap-2 w-full">
              <li onClick={handleLogout}>
                <Link className="text-error" to="/">
                  <LogOut size={18} />
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
}
