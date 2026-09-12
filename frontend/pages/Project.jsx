import React, { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { motion } from 'framer-motion';


const Project = () => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [msg, setMsg] = useState("")
    const [err, setErr] = useState("")
    const [projects, setProjects] = useState([])
    const [update, setUpdate] = useState(null)
    const [updatedTitle, setUpdatedTitle] = useState("")
    const [updatedDescription, setUpdatedDescription] = useState("")

    useEffect(() => {
        const fetchProjects = async () => {
            const { data } = await axios.get("https://quickgig-jous.onrender.com/api/project/all", { withCredentials: true })
            setProjects(data.projects)
        }
        fetchProjects()
        console.log("projects fetched")
    }, [])

    function getLocation() {
        return new Promise((res, rej) => {
            navigator.geolocation.getCurrentPosition((pos) => res({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            }), rej)
        })
    }

    const handleSubmit = async () => {
        if (title && description) {
            const { lat, lng } = await getLocation()
            try {
                const res = await axios.post("https://quickgig-jous.onrender.com/api/project/add", { title, description, lat, lng }, { withCredentials: true })
                setMsg(res.data.message)
                setErr("")
                setProjects(p => [...p, res.data.createdProject])
            }
            catch (err) {
                setErr(err.response?.data?.message || "Something broke")
                setMsg("")
            }
            setTitle('')
            setDescription('')
        } else {
            alert('Please fill in all fields')
        }
    }

    const handleDelete = async (i) => {
        try {
            const res = await axios.delete(`https://quickgig-jous.onrender.com/api/project/delete/${i}`, { withCredentials: true })
            setMsg(res.data.message)
            setErr("")
            setProjects(p => p.filter(x => x._id !== i))
        }
        catch (error) {
            setErr(error.response?.data?.message || "Something broke")
            setMsg("")
        }
    }

    const handleUpdate = async (i) => {
        try {
            const res = await axios.put(`https://quickgig-jous.onrender.com/api/project/update/${i}`, { updatedTitle, updatedDescription }, { withCredentials: true })
            setMsg(res.data.message)
            setErr("")
            setProjects(p => p.map(x => x._id === i ? res.data.updatedProject : x))
            setUpdate(null)
        }
        catch (error) {
            setErr(error.response?.data?.message || "Something broke")
            setMsg("")
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 sm:px-6 lg:px-20 py-4">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 justify-center items-start">
                    {/* Current Projects Section */}
                    <div className="w-full lg:w-1/3">
                        <motion.div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Current Projects</h2>
                            <div className="space-y-4 max-h-[400px] lg:max-h-[500px] overflow-y-auto text-center">
                                {projects.length > 0 ? (
                                    projects.map((p) => (
                                        p.title && p.description &&
                                        <div key={p._id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-sky-500 transition-colors">
                                            <h3 className="font-semibold text-lg text-gray-800 mb-2 break-words">{p.title}</h3>
                                            <div className="flex gap-6 sm:gap-10 justify-center flex-wrap">
                                                <div className="flex flex-col items-center">
                                                    <CiEdit size={20} className="m-1 cursor-pointer" onClick={() => {
                                                        setUpdate(p._id)
                                                        setUpdatedTitle(p.title)
                                                        setUpdatedDescription(p.description)
                                                    }} />

                                                    {update === p._id ? (
                                                        <button
                                                            onClick={() => handleUpdate(p._id)}
                                                            className="m-auto bg-sky-500 text-white text-sm font-semibold py-2 px-3 rounded-lg hover:bg-sky-600 transition-colors whitespace-nowrap"
                                                        >
                                                            Save Project
                                                        </button>
                                                    ) : <p>Edit</p>}
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <MdDelete size={20} className="m-1 cursor-pointer" onClick={() => handleDelete(p._id)} />
                                                    <p>Delete</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-8">No projects yet</p>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Create Project Form Section */}
                    {update ? (
                        <div className="w-full lg:w-1/3">
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                                <div className="bg-sky-500 text-white p-5 sm:p-6">
                                    <h1 className="text-2xl sm:text-3xl font-bold">Edit Project</h1>
                                    <p className="mt-2 text-sky-100 text-sm sm:text-base">Fill in the details to edit your project</p>
                                </div>

                                <div className="p-5 sm:p-8">
                                    <div className="mb-6">
                                        <label htmlFor="updatedtitle" className="block text-gray-700 font-semibold mb-2">
                                            Project Title
                                        </label>
                                        <input
                                            type="text"
                                            id="updatedtitle"
                                            value={updatedTitle}
                                            onChange={(e) => setUpdatedTitle(e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-sky-500 transition-colors"
                                            placeholder="Enter project title"
                                        />
                                    </div>

                                    <div className="mb-6">
                                        <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">
                                            Project Description
                                        </label>
                                        <textarea
                                            id="description"
                                            value={updatedDescription}
                                            onChange={(e) => setUpdatedDescription(e.target.value)}
                                            rows="6"
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-sky-500 transition-colors resize-none"
                                            placeholder="Describe your project"
                                        />
                                    </div>

                                    {(msg || err) && (
                                        <div className="mb-4">
                                            {msg && <p className="text-green-600 font-semibold">{msg}</p>}
                                            {err && <p className="text-red-600 font-semibold">{err}</p>}
                                        </div>
                                    )}

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button
                                            onClick={() => {
                                                setUpdate(null)
                                                setUpdatedTitle("")
                                                setUpdatedDescription("")
                                            }}
                                            className="flex-1 bg-white text-sky-500 font-semibold py-3 px-6 rounded-lg border-2 border-sky-500 hover:bg-sky-50 transition-colors"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            onClick={() => handleUpdate(update)}
                                            className="flex-1 bg-sky-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-sky-600 transition-colors"
                                        >
                                            Save Project
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <motion.div
                            className="w-full lg:w-1/3"
                            initial={{ opacity: 0, y: 0 }}
                            animate={{ opacity: 1, y: 5 }}
                            transition={{ duration: 0.6, ease: "easeIn" }}
                        >
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                                <div className="bg-sky-500 text-white p-5 sm:p-6">
                                    <h1 className="text-2xl sm:text-3xl font-bold">Create New Project</h1>
                                    <p className="mt-2 text-sky-100 text-sm sm:text-base">Fill in the details to start your new project</p>
                                </div>

                                <div className="p-5 sm:p-8">
                                    <div className="mb-6">
                                        <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">
                                            Project Title
                                        </label>
                                        <input
                                            type="text"
                                            id="title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-sky-500 transition-colors"
                                            placeholder="Enter project title"
                                        />
                                    </div>

                                    <div className="mb-6">
                                        <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">
                                            Project Description
                                        </label>
                                        <textarea
                                            id="description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            rows="6"
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-sky-500 transition-colors resize-none"
                                            placeholder="Describe your project"
                                        />
                                    </div>

                                    {(msg || err) && (
                                        <div className="mb-4">
                                            {msg && <p className="text-green-600 font-semibold">{msg}</p>}
                                            {err && <p className="text-red-600 font-semibold">{err}</p>}
                                        </div>
                                    )}

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button
                                            onClick={() => handleSubmit()}
                                            className="flex-1 bg-sky-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-sky-600 transition-colors"
                                        >
                                            Create Project
                                        </button>
                                        <button
                                            onClick={() => {
                                                setTitle('')
                                                setDescription('')
                                            }}
                                            className="flex-1 bg-white text-sky-500 font-semibold py-3 px-6 rounded-lg border-2 border-sky-500 hover:bg-sky-50 transition-colors"
                                        >
                                            Clear Form
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Project