import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import HomePageBg from '../src/assets/homebgg.png'
import { motion } from 'framer-motion'
import { CiSearch } from "react-icons/ci";
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const Home = () => {
   const [nearbyProjects,setNearbyProjects] = useState([])
   const [message,setMsg] = useState("")
   const navigate = useNavigate()
   function getLocation(){
    return new Promise((res,rej)=>{
      navigator.geolocation.getCurrentPosition((p)=>res({
        lat:p.coords.latitude,
        lng:p.coords.longitude
      }
      ),rej)
    })
   }
   async function handleNearbyProjects(){
      const {lat,lng} = await getLocation()

      try{
        console.log(lat)
        console.log(lng)
          const res = await axios.get(`https://quickgig-jous.onrender.com/api/project/near/${lat}/${lng}`,{withCredentials:true})
          console.log(res)
          setNearbyProjects(res.data.foundProjects)
          setMsg(res.data.message)
          navigate("/near",{state:{projects:res.data.foundProjects,message:res.data.message}})
      }
      catch(error){
          setMsg("Something Broke")
      }
   }
  return (
    <div className='min-h-screen bg-[#F2FAFA]'>
      <Navbar />

      <main className='m-5 flex flex-col lg:flex-row justify-center items-center gap-[20px] lg:gap-[40px] px-4'>
        <motion.div initial={{ opacity: 0, x: 0 }} animate={{ opacity: 1, x: 30 }}
          transition={{ duration: 0.8, ease: "easeIn" }}
          className='w-full max-w-[500px] mt-5 md:mt-10'> 
          <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold text-black text-center lg:text-left'>
            Are you finding local clients?
          </h1>
          <p className='text-base md:text-lg lg:text-xl font-semibold w-full mt-5 text-center text-[#252525]'>
            Find work near you. Fast.
            Browse local gigs, connect with nearby clients, and get paid for what you do best
            — all in your area.
          </p>
        <div className='flex flex-col sm:flex-row items-center justify-center mt-10 gap-3 sm:gap-0'>
          <button className='bg-sky-500 text-white font-semibold px-6 sm:px-10 py-3 sm:py-4
             rounded-md cursor-pointer w-full sm:w-auto
            ' onClick={()=>handleNearbyProjects()}>
              Check for Projects
            </button>
          <input type="search" name="job-search" id="job-search"
            placeholder='Search freelance work' className='sm:ml-5 px-4 py-3 sm:py-4 border-2 border-sky-500 rounded-md outline-none
             transition-all duration-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 w-full sm:w-auto
             '  />
          <span className="items-center sm:ml-3">
            <CiSearch size={30} className='cursor-pointer' onClick={()=>getLocationAndSearch()} />
          </span>
        </div>
        </motion.div>
        <div className='w-full max-w-[500px] h-auto mt-10 lg:mt-0'>
          <img src={HomePageBg} alt="" className='w-full h-auto' />
        </div>
      </main>
    </div>
  )
}

export default Home
