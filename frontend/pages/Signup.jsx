import React, { useEffect, useState } from 'react'
import Logo from '../src/assets/logo.png'
import bg from '../src/assets/bg.png'
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

const Signup = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [msg, setMsg] = useState("");
    const [err, setErr] = useState("")

    const handleSubmit = async () => {
        try {
            const res = await axios.post("https://quickgig-jous.onrender.com/api/auth/signup", { username, email, password })
            setMsg(res.data.message)
            setErr("")
            navigate("/signin")
        }
        catch (err) {
            setErr(err.response?.data?.message || "Something Broke")
            setMsg("")
        }
    }
    return (
        <div className='min-h-screen bg-linear-to-b from-sky-500 via-50% to-white flex flex-col lg:flex-row justify-around items-center p-4 lg:p-0'>
            <motion.div
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: 30 }}
                transition={{ duration: 0.8, ease: "easeIn" }}
                className='hidden lg:block'
            >
                <img src={Logo} alt="" className=' w-[150px] h-[150px]' />
                <h1 className='ml-10 mb-5 text-white font-bold text-4xl'>Sign Up To</h1>
                <h2 className='ml-10 mb-5 text-white font-bold text-2xl'>QuickGig</h2>
                <p className='ml-10 text-white font-bold text-xs w-[500px]'>QuickGig is your go-to local freelancing hub.
                    Connect with nearby clients, showcase your skills, and get work done in your community—fast, simple, and local.</p>
                <img src={bg} alt="" className=' w-[385px] h-[385px]' />
            </motion.div>
            <div className=' w-full max-w-[500px] lg:w-[500px] h-auto lg:h-[600px] bg-white mr-0 lg:mr-10 relative top-0 lg:top-1/8 rounded-md p-4 lg:p-0'>
                <h1 className=' m-5 text-xl font-semibold'>Welcome to
                    <span className='ml-2 text-sky-500'>QuickGig</span></h1>
                <h1 className=' text-black font-bold text-3xl m-5'>Sign Up</h1>
                <p className=' ml-5 text-base font-semibold'>Enter Your username</p>
                <input type="text" name="username" id="username" value={username}
                    className=' m-5 px-4 md:w-full max-w-[400px] h-[50px] border-2 
                        border-sky-300 rounded-md outline-none transition-all duration-200 
                        focus:border-sky-500 focus:ring-2 focus:ring-sky-200' onChange={(e) => setUsername(e.target.value)} />
                <p className=' ml-5 text-base font-semibold'>Enter Your Email</p>
                <input type="text" name="email" id="email" value={email}
                    className=' m-5 px-4 md:w-full max-w-[400px] h-[50px] border-2 border-sky-300
                        rounded-md outline-none transition-all duration-200 
                        focus:border-sky-500 focus:ring-2 focus:ring-sky-200
                    ' onChange={(e) => setEmail(e.target.value)} />
                <p className=' ml-5 text-base font-semibold'>Enter Your Password</p>
                <input type="text" name="password" id="password" value={password}
                    className=' m-5 px-4 md:w-full max-w-[400px] h-[50px] border-2 border-sky-300
                    rounded-md outline-none transition-all duration-200 
                        focus:border-sky-500 focus:ring-2 focus:ring-sky-200
                    ' onChange={(e) => setPassword(e.target.value)} />
                <div className='flex flex-col sm:flex-row items-start sm:items-center'>
                    <button className=' m-5 cursor-pointer bg-sky-500 p-5 text-white font-semibold rounded-md'
                        onClick={() => handleSubmit()}
                    >
                        Sign Up</button>
                    <div className='m-5 text-black font-bold text-base'>Have an account?
                        <p className=' text-sky-500 cursor-pointer' onClick={() => navigate("/signin")}>Sign In</p></div>
                </div>
                {msg && <p className="text-green-600 ml-5">{msg}</p>}
                {err && <p className="text-red-600 ml-5">{err}</p>}

            </div>
        </div>
    )
}

export default Signup
