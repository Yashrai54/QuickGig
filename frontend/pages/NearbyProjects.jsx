import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Button, Drawer, IconButton, TextField } from '@mui/material'
import { FaMessage, FaPaperPlane } from "react-icons/fa6"
import socket from '../socket'

const NearbyProjects = () => {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])

  const toggleDrawer = (project = null) => {
    setSelectedProject(project)
    setOpen(!open)
  }

  const projects = location.state?.projects || []
  const roomId = selectedProject?._id
  useEffect(() => {
      setMessages([]) 
    if (!roomId) return
    socket.emit("joinRoom", roomId)
    socket.on("recieveMessage", (msg) => {
      const self = msg.sender === socket.id
      if(!self)
      setMessages((prev) => [...prev, msg])
    })

    return () => {
      socket.off("recieveMessage")
    }
  }, [roomId])

  const sendMessage = () => {
    if (!message.trim()) return

    socket.emit("sendMessage", { roomId, message })
    setMessages((prev) => [...prev, { text: message, self: true }])
    setMessage("")
  }
  return (
    <div className="space-y-4 overflow-y-auto text-center p-4">
      {projects.length === 0 ? (<p>{message}</p>) : projects.map(p => (
        <div
          className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-sky-500 transition-colors"
          key={p._id}
        >
          <h1 className="font-semibold text-lg text-gray-800 mb-2">{p.title}</h1>
          <p className="text-gray-600 mb-3">{p.description}</p>
          <Button
            variant="contained"
            startIcon={<FaMessage />}
            onClick={() => toggleDrawer(p)}
            sx={{ textTransform: 'none' }}
          >
            Message
          </Button>
        </div>
      ))}

      <Drawer
        open={open}
        onClose={() => toggleDrawer()}
        anchor='right'
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 400 }
          }
        }}
      >
        <div className="h-full flex flex-col">
          <header className="bg-sky-600 text-white p-4 flex items-center justify-between shadow-md">
            <div>
              <h2 className="font-semibold text-lg">Chat</h2>
              {selectedProject && (
                <p className="text-sm opacity-90">{selectedProject.title}</p>
              )}
            </div>
            <IconButton
              className=' bg-black'
              onClick={() => toggleDrawer()}
              sx={{ color: 'black' }}
            >
            </IconButton>
          </header>

          <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
            <div className="space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`${msg.self ? 'bg-sky-500 text-white ml-auto' : 'bg-white text-gray-800'} p-3 rounded-lg shadow-sm max-w-xs`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <span className="text-xs opacity-80">{msg.time || 'now'}</span>
                </div>
              ))}
            </div>
          </main>
          {/* Message Input Footer */}
          <footer className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-center gap-2">
              <TextField
                fullWidth
                size="small"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
                multiline
                maxRows={3}
              />
              <IconButton
                color="primary"
                onClick={
                  sendMessage}
                disabled={!message.trim()}
              >
                <FaPaperPlane />
              </IconButton>
            </div>
          </footer>
        </div>
      </Drawer>
    </div>
  )
}

export default NearbyProjects