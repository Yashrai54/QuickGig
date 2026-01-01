import express from 'express'
import dotenv from 'dotenv'
import ConnectDb from './config/db.js'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.route.js'
import cors from 'cors'
import verifyToken from './middlewares/authMiddleware.js'
import projectRouter from './routes/project.route.js'
import { Server } from 'socket.io'
import {createServer} from 'node:http'

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: "https://quick-gig-eight.vercel.app", 
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders:""
  }
});

dotenv.config()

ConnectDb().then(console.log("DB Connected"))

app.use(cors({origin:"https://quick-gig-eight.vercel.app/",credentials:true}))
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRouter)
app.use("/api/project",verifyToken,projectRouter)
app.get("/me",verifyToken,(req,res)=>{
    res.json({user:req.user})
})
io.on("connection",(socket)=>{
    socket.on("joinRoom",(roomId)=>{
        socket.join(roomId)
    })
     socket.on("sendMessage", ({ roomId, message }) => {
    const msgObj = { text: message, sender:socket.id, time: new Date().toLocaleTimeString() };
    io.to(roomId).emit("recieveMessage", msgObj);
  });

})
server.listen(4000,()=>{
    console.error("Server Started")
})
