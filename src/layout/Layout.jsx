import React from 'react'
import { Outlet, NavLink, useNavigate, useParams } from 'react-router-dom'
import { FaHome, FaTasks, FaUser, FaSignOutAlt, FaBars } from 'react-icons/fa'

const Layout = () => {
  const navigate = useNavigate()
  const { userId } = useParams();

  const handleLogout = () => {
    // TODO: Add your logout logic here (e.g., clear auth tokens)
    navigate('/login')
  }

  return (
    // Drawer container with drawer-end for right-to-left slide
    <div className="drawer drawer-end">
      {/* Toggle input */}
      <input id="mobile-menu" type="checkbox" className="drawer-toggle" />

      {/* Main content (navbar + page) */}
      <div className="drawer-content flex flex-col min-h-screen">
        {/* Navbar */}
        <nav className="fixed top-0 left-0 w-full p-4 flex items-center justify-between z-50 \
          bg-white/20 backdrop-blur-md border-b border-white/30">
          {/* Brand on top-left */}
          <div className="flex-1">
            <a className="btn btn-ghost normal-case text-xl italic p-0">
              <FaTasks className="text-primary" />
              <span style={{ color: '#2f5d70' }}>
                TaskTrack
              </span>
            </a>
          </div>

          {/* Desktop links */}
          <div className="hidden lg:flex space-x-4">
            <NavLink
              to={`/home/${userId}`}
              className={({ isActive }) =>
                `flex items-center gap-1 py-1 px-2 rounded-md text-sm font-medium ${
                  isActive ? 'bg-primary text-white' : 'hover:bg-gray-100'
                }`
              }
            >
              <FaHome /> Home
            </NavLink>
            <NavLink
              to={`/userInfo/${userId}`}
              className={({ isActive }) =>
                `flex items-center gap-1 py-1 px-2 rounded-md text-sm font-medium ${
                  isActive ? 'bg-primary text-white' : 'hover:bg-gray-100'
                }`
              }
            >
              <FaUser /> Profile
            </NavLink>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 py-1 px-2 rounded-md text-sm font-medium hover:bg-gray-100"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <label htmlFor="mobile-menu" className="btn btn-ghost btn-circle">
              <FaBars className="text-xl" />
            </label>
          </div>
        </nav>

        {/* Page content */}
        <main className="flex-1 bg-base-200 p-4 sm:p-5 mt-10 md:mt-10 lg:mt-10">
          <Outlet />
        </main>
        {/* Footer */}
        <footer className="bg-base-100 border-t border-gray-200 text-center py-4">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} TaskTrack. All rights reserved.</p>
        </footer>
      </div>

      {/* Drawer side (mobile menu) slides in from right */}
      <div className="drawer-side">
        <label htmlFor="mobile-menu" className="drawer-overlay"></label>
        <ul className="menu p-4 w-64 bg-base-100 space-y-2">
          <li>
            <NavLink
              to={`/home/${userId}`}
              className={({ isActive }) =>
                `flex items-center gap-2 text-sm px-2 py-1 rounded ${
                  isActive ? 'bg-primary text-white' : 'hover:bg-gray-100'
                }`
              }
            >
              <FaHome /> Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/userInfo/${userId}`}
              className={({ isActive }) =>
                `flex items-center gap-2 text-sm px-2 py-1 rounded ${
                  isActive ? 'bg-primary text-white' : 'hover:bg-gray-100'
                }`
              }
            >
              <FaUser /> UserInfo
            </NavLink>
          </li>
          <li>
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm w-full text-left">
              <FaSignOutAlt /> Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Layout;
