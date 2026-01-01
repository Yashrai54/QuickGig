import { useScroll } from 'framer-motion'
import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'

const ProtectedRoute = ({ children }) => {
    const [isAuth, setIsAuth] = useState(false)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await axios.get("https://quickgig-jous.onrender.com/me", { withCredentials: true });
                setIsAuth(true);
            } catch {
                setIsAuth(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);
    if (loading) return null
    return isAuth == true ? children : <Navigate to="/signin"></Navigate>
}

export default ProtectedRoute
