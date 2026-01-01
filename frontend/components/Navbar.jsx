import React, { useState } from 'react'
import Logo from '../src/assets/logo.png'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { Drawer, IconButton } from '@mui/material'
import { HiMenuAlt3 } from 'react-icons/hi'
import { IoClose } from 'react-icons/io5'

const Navbar = () => {
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen)
  }

  const handleNavigation = (path) => {
    navigate(path)
    setDrawerOpen(false)
  }

  return (
    <>
      <div className='w-full max-w-[1200px] h-[80px] bg-white m-auto flex justify-between items-center shadow-xl px-4 md:px-8'>
        <img src={Logo} className='w-[60px] h-[60px] md:w-[80px] md:h-[80px]' alt="Logo"/>
        
        {/* Desktop Menu */}
        <ul className='hidden md:flex gap-[40px]'>
          <li className='hover:text-sky-500 cursor-pointer'><Link to="/">Home</Link></li>
          <li className='hover:text-sky-500 cursor-pointer'><Link to="/signin">Log In</Link></li>
          <li className='hover:text-sky-500 cursor-pointer'><Link to="/signup">Sign Up</Link></li>
        </ul>
        
        <button 
          className='hidden md:block cursor-pointer border-2 border-sky-500 bg-sky-500 text-white font-semibold rounded-md px-10 py-2' 
          onClick={() => navigate("/project")}
        >
          Post a Project
        </button>

        {/* Mobile Hamburger */}
        <IconButton 
          onClick={toggleDrawer}
          sx={{ color: '#0ea5e9' }}
          className="md:!hidden"
        >
          <HiMenuAlt3 size={30} />
        </IconButton>
      </div>

      {/* MUI Drawer for Mobile */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          '& .MuiDrawer-paper': {
            width: '280px',
            padding: '20px'
          }
        }}
      >
        <div className='flex flex-col h-full'>
          {/* Close Button */}
          <div className='flex justify-end mb-6'>
            <IconButton onClick={toggleDrawer} sx={{ color: '#0ea5e9' }}>
              <IoClose size={30} />
            </IconButton>
          </div>

          {/* Logo */}
          <div className='flex justify-center mb-8'>
            <img src={Logo} className='w-[70px] h-[70px]' alt="Logo"/>
          </div>

          {/* Menu Items */}
          <ul className='flex flex-col gap-6 mb-8'>
            <li 
              className='text-lg hover:text-sky-500 cursor-pointer border-b pb-2' 
              onClick={() => handleNavigation("/")}
            >
              Home
            </li>
            <li 
              className='text-lg hover:text-sky-500 cursor-pointer border-b pb-2' 
              onClick={() => handleNavigation("/signin")}
            >
              Log In
            </li>
            <li 
              className='text-lg hover:text-sky-500 cursor-pointer border-b pb-2' 
              onClick={() => handleNavigation("/signup")}
            >
              Sign Up
            </li>
          </ul>

          {/* Post Project Button */}
          <button 
            className='mt-auto cursor-pointer border-2 border-sky-500 bg-sky-500 text-white font-semibold rounded-md px-6 py-3 w-full' 
            onClick={() => handleNavigation("/project")}
          >
            Post a Project
          </button>
        </div>
      </Drawer>
    </>
  )
}

export default Navbar
