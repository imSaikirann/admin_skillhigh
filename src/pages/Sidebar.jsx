import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/logo.jpg';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const [openDropdown, setOpenDropdown] = React.useState(null); // Tracks the currently open dropdown
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const navigate = useNavigate();

  const closeSidebar = () => setIsSidebarOpen(false);

  const handleDropdownToggle = (dropdown) => {
    // If the clicked dropdown is already open, close it, otherwise open it
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <div className=''>
      <div className="md:hidden flex items-center p-4 h-16 bg-main text-white ">
        <button onClick={() => setIsSidebarOpen(true)}>
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>

      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white text-black border-r-2 font-poppins transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 z-50 flex flex-col`}
      >
        <div className="md:hidden flex justify-end p-4">
          <button onClick={closeSidebar}>
            <XMarkIcon className="h-6 w-6 text-main hover:text-opacity-55" />
          </button>
        </div>

        <div className="p-4">
          <img src={Logo} className="h-auto w-[200px]" alt="Logo" />
        </div>

        <nav className="flex flex-col gap-4 px-4">
          <Link to="/" className="rounded-md p-2" onClick={closeSidebar}>
            Admin Dashboard
          </Link>

          <Link to="/contactus" className="rounded-md p-2" onClick={closeSidebar}>
            New Students
          </Link>

          {/* Courses Dropdown */}
          <div className="relative">
            <button
              onClick={() => handleDropdownToggle('courses')}
              className="rounded-md p-2 w-full text-left flex justify-between items-center"
            >
              Courses
              <span>{openDropdown === 'courses' ? '-' : '+'}</span>
            </button>
            {openDropdown === 'courses' && (
              <div className="flex flex-col bg-main bg-opacity-10 rounded-md p-2 mt-1">
                <Link to="/dashboard/departments" className="text-main p-2 rounded-md" onClick={closeSidebar}>
                  Departments
                </Link>
              </div>
            )}
          </div>

          {/* Dashboard Dropdown */}
          <div className="relative">
            <button
              onClick={() => handleDropdownToggle('dashboard')}
              className="rounded-md p-2 w-full text-left flex justify-between items-center"
            >
              Website Dashboard
              <span>{openDropdown === 'dashboard' ? '-' : '+'}</span>
            </button>
            {openDropdown === 'dashboard' && (
              <div className="flex flex-col bg-main bg-opacity-10 rounded-md p-2 mt-1">
                <Link to="/website/faq" className="text-main p-2 rounded-md" onClick={closeSidebar}>
                  FAQS
                </Link>
                <Link to="/website/mentors" className="text-main p-2 rounded-md" onClick={closeSidebar}>
                  Mentors
                </Link>
                <Link to="/reviews" className="text-main p-2 rounded-md" onClick={closeSidebar}>
                  Testimonials
                </Link>
                <Link to="/website/pricing" className="text-main p-2 rounded-md" onClick={closeSidebar}>
                Pricing
                </Link>
                
              </div>
            )}
          </div>

          {/* Users Dropdown */}
          <div className="relative">
            <button
              onClick={() => handleDropdownToggle('users')}
              className="rounded-md p-2 w-full text-left flex justify-between items-center"
            >
              Users
              <span>{openDropdown === 'users' ? '-' : '+'}</span>
            </button>
            {openDropdown === 'users' && (
              <div className="flex flex-col bg-main bg-opacity-10 rounded-md p-2 mt-1">
  
                <Link to="/dashboard/users" className="text-main p-2 rounded-md" onClick={closeSidebar}>
                  View Users
                </Link>
              </div>
            )}
          </div>

          {/* Settings Dropdown */}
          <div className="relative">
            <button
              onClick={() => handleDropdownToggle('settings')}
              className="rounded-md p-2 w-full text-left flex justify-between items-center"
            >
              Settings
              <span>{openDropdown === 'settings' ? '-' : '+'}</span>
            </button>
            {openDropdown === 'settings' && (
              <div className="flex flex-col bg-main bg-opacity-10 rounded-md p-2 mt-1">
                <button onClick={handleLogout} className="bg-red-500 text-white rounded-md px-4 py-2 font-sans font-medium shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300">
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
