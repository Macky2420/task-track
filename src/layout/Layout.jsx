import React, { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useParams } from 'react-router-dom'
import { FaHome, FaTasks, FaUser, FaSignOutAlt, FaBars } from 'react-icons/fa'
import { auth } from '../database/firebaseConfig'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { message } from 'antd'

const Layout = () => {
  const navigate = useNavigate()
  const { userId } = useParams()
  const [user, setUser] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false) 

  // Authentication state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        // Clear navigation history for security
        window.history.replaceState(null, '', window.location.href)
      } else {
        // Block back navigation after logout
        navigate('/', { 
          replace: true,
          state: { from: 'logout' }
        })
        setUser(null)
      }
    })

    return () => unsubscribe()
  }, [navigate])

  // Secure logout function
  const handleLogout = async () => {
    try {
      await signOut(auth)
      setUser(null)
      
      // Clear all client-side storage
      window.sessionStorage.clear()
      window.localStorage.clear()
      
      // Replace history and navigate to prevent back navigation
      window.history.replaceState(null, '', '/')
      navigate('/', { 
        replace: true,
        state: { from: 'logout' }
      })
      
      // Force reload to clear all state
      window.location.reload()
      
      message.success('Logged out successfully')
    } catch (error) {
      console.error('Logout error:', error)
      message.error('Logout failed: ' + error.message)
    }
  }

  // Block back button after logout
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state?.from === 'logout') {
        navigate('/', { replace: true })
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [navigate])

  return (
    <div className="drawer drawer-end">
      <input id="mobile-menu" type="checkbox" className="drawer-toggle" />
      
      <div className="drawer-content flex flex-col min-h-screen">
        <nav className="fixed top-0 left-0 w-full p-4 flex items-center justify-between z-50 bg-white/20 backdrop-blur-md border-b border-white/30">
          <div className="flex-1">
            <NavLink to={`/home/${user?.uid}`} className="btn btn-ghost normal-case text-xl italic p-0">
              <FaTasks className="text-primary" />
              <span style={{ color: '#2f5d70' }}>TaskTrack</span>
            </NavLink>
          </div>

          <div className="hidden lg:flex space-x-4">
            <NavLink
              to={`/home/${user?.uid}`}
              className={({ isActive }) =>
                `flex items-center gap-1 py-1 px-2 rounded-md text-sm font-medium ${
                  isActive ? 'bg-primary text-white' : 'hover:bg-gray-100'
                }`
              }
            >
              <FaHome /> Home
            </NavLink>
            <NavLink
              to={`/userInfo/${user?.uid}`}
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

          <div className="lg:hidden">
            <label 
              htmlFor="mobile-menu" 
              className="btn btn-ghost btn-circle"
              aria-label="Open menu"
            >
              <FaBars className="text-xl" />
            </label>
          </div>
        </nav>

        <main className="flex-1 bg-base-200 p-4 sm:p-5 mt-10 md:mt-10 lg:mt-10">
          <Outlet />
        </main>
        
        <footer className="bg-base-100 border-t border-gray-200 text-center py-4">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} TaskTrack. All rights reserved.</p>
        </footer>
      </div>

      <div className="drawer-side mt-20">
        <label 
          htmlFor="mobile-menu" 
          className="drawer-overlay"
          aria-label="Close menu"
        ></label>
        <ul className="menu p-4 w-64 bg-base-100 space-y-2">
          <li>
            <NavLink
              to={`/home/${user?.uid}`}
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
              to={`/userInfo/${user?.uid}`}
              className={({ isActive }) =>
                `flex items-center gap-2 text-sm px-2 py-1 rounded ${
                  isActive ? 'bg-primary text-white' : 'hover:bg-gray-100'
                }`
              }
            >
              <FaUser /> Profile
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

export default Layout