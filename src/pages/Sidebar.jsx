import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/logo.png';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { SunIcon, MoonIcon } from '../assets/icons/icons'
import { ThemeContext } from '../store/ThemeContext';

export default function Sidebar() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  
  // For dropdown menus inside the sidebar
  const [openDropdown, setOpenDropdown] = React.useState(null);
  // Shared sidebar state used for both mobile and desktop versions.
  // (On mobile the sidebar slides in/out; on desktop it collapses/expands.)
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleDropdownToggle = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <>
      {/* ========= MOBILE SIDEBAR ========= */}
      <div className="md:hidden">
        {/* Mobile Top Bar with Toggle Button */}
        <div className="flex items-center p-4 h-16 bg-main text-white">
          <button onClick={toggleSidebar}>
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>
        {/* Mobile Sidebar (slides in/out) */}
        <div
          className={`fixed top-0 left-0 h-full w-72bg-green-50  bg-white text-darkColor dark:bg-darkBg dark:text-white  border-r-2 dark:border-darkColor   font-poppins transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } z-50 flex flex-col`}
        >
          <div className="flex justify-end p-4">
            <button onClick={toggleSidebar}>
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
                  <Link
                    to="/dashboard/departments"
                    className="text-main p-2 rounded-md"
                    onClick={closeSidebar}
                  >
                    Departments
                  </Link>
                </div>
              )}
            </div>

            {/* Website Dashboard Dropdown */}
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
                  <Link
                    to="/website/faq"
                    className="text-main p-2 rounded-md"
                    onClick={closeSidebar}
                  >
                    FAQS
                  </Link>
                  <Link
                    to="/website/mentors"
                    className="text-main p-2 rounded-md"
                    onClick={closeSidebar}
                  >
                    Mentors
                  </Link>
                  <Link
                    to="/reviews"
                    className="text-main p-2 rounded-md"
                    onClick={closeSidebar}
                  >
                    Testimonials
                  </Link>
                  <Link
                    to="/website/pricing"
                    className="text-main p-2 rounded-md"
                    onClick={closeSidebar}
                  >
                    Pricing
                  </Link>
                  <Link
                    to="/website/careers"
                    className="text-main p-2 rounded-md"
                    onClick={closeSidebar}
                  >
                    Careers
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
                  <Link
                    to="/dashboard/users"
                    className="text-main p-2 rounded-md"
                    onClick={closeSidebar}
                  >
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
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white rounded-md px-4 py-2 font-sans font-medium shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </nav>
          <div className='p-5 '>
        <button
      onClick={() => setDarkMode(!darkMode)}
      className= " bg-gray-200 dark:bg-darkColor dark:text-white p-3 rounded-full"
    >
      {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
    </button>
        </div>
        </div>
      </div>

      {/* ========= DESKTOP SIDEBAR ========= */}
      <div
        className={`hidden md:flex fixed top-0 left-0 h-full bg-green-50  text-darkColor dark:bg-darkBg dark:text-white  border-r-2 dark:border-darkColor font-poppins rounded-r-3xl transition-all duration-300 flex-col ${isSidebarOpen ? 'w-64' : 'w-16'
          }`}
      >
        {/* Desktop Toggle Button inside Sidebar */}
        <div className="p-4">
          <button onClick={toggleSidebar} className="w-full">
            {isSidebarOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
        <div className="p-4">
          {/* Render logo only if expanded */}
          {isSidebarOpen && (
            <img
              src={Logo}
              className="h-auto w-[200px] transition-all duration-300"
              alt="Logo"
            />
          )}
        </div>
        <nav className="flex-1 flex flex-col gap-4 px-4 overflow-hidden">
          <Link
            to="/"
            className="rounded-md p-2 whitespace-nowrap"
            onClick={() => { }}
          >
            {isSidebarOpen ? 'Admin Dashboard' : 'AD'}
          </Link>
          <Link
            to="/contactus"
            className="rounded-md p-2 whitespace-nowrap"
            onClick={() => { }}
          >
            {isSidebarOpen ? 'New Students' : 'NS'}
          </Link>

          {/* Courses Dropdown */}
          <div className="relative">
            <button
              onClick={() => handleDropdownToggle('courses')}
              className="rounded-md p-2 w-full text-left flex justify-between items-center"
            >
              {isSidebarOpen ? 'Courses' : 'C'}
              <span>{openDropdown === 'courses' ? '-' : '+'}</span>
            </button>
            {openDropdown === 'courses' && isSidebarOpen && (
              <div className="flex flex-col bg-main bg-opacity-10 rounded-md p-2 mt-1">
                <Link
                  to="/dashboard/departments"
                  className="text-main p-2 rounded-md"
                  onClick={() => { }}
                >
                  Departments
                </Link>
              </div>
            )}
          </div>

          {/* Website Dashboard Dropdown */}
          <div className="relative">
            <button
              onClick={() => handleDropdownToggle('dashboard')}
              className="rounded-md p-2 w-full text-left flex justify-between items-center"
            >
              {isSidebarOpen ? 'Website Dashboard' : 'WD'}
              <span>{openDropdown === 'dashboard' ? '-' : '+'}</span>
            </button>
            {openDropdown === 'dashboard' && isSidebarOpen && (
              <div className="flex flex-col bg-main bg-opacity-10 rounded-md p-2 mt-1">
                <Link
                  to="/website/faq"
                  className="text-main p-2 rounded-md"
                  onClick={() => { }}
                >
                  FAQS
                </Link>
                <Link
                  to="/website/mentors"
                  className="text-main p-2 rounded-md"
                  onClick={() => { }}
                >
                  Mentors
                </Link>
                <Link
                  to="/reviews"
                  className="text-main p-2 rounded-md"
                  onClick={() => { }}
                >
                  Testimonials
                </Link>
                <Link
                  to="/website/pricing"
                  className="text-main p-2 rounded-md"
                  onClick={() => { }}
                >
                  Pricing
                </Link>
                <Link
                    to="/website/careers"
                    className="text-main p-2 rounded-md"
                    onClick={() => { }}
                  >
                    Careers
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
              {isSidebarOpen ? 'Users' : 'U'}
              <span>{openDropdown === 'users' ? '-' : '+'}</span>
            </button>
            {openDropdown === 'users' && isSidebarOpen && (
              <div className="flex flex-col bg-main bg-opacity-10 rounded-md p-2 mt-1">
                <Link
                  to="/dashboard/users"
                  className="text-main p-2 rounded-md"
                  onClick={() => { }}
                >
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
              {isSidebarOpen ? 'Settings' : 'S'}
              <span>{openDropdown === 'settings' ? '-' : '+'}</span>
            </button>
            {openDropdown === 'settings' && isSidebarOpen && (
              <div className="flex flex-col bg-main bg-opacity-10 rounded-md p-2 mt-1">
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white rounded-md px-4 py-2 font-sans font-medium shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                  Logout
                </button>
              </div>
            )}
          </div>


        </nav>
        <div className='p-5 '>
        <button
      onClick={() => setDarkMode(!darkMode)}
      className= " bg-gray-200 dark:bg-darkColor dark:text-white p-3 rounded-full"
    >
      {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
    </button>
        </div>
      </div>
    </>
  );
}
