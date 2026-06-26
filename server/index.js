import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import StudyGroup from './models/StudyGroup.js'

dotenv.config()

import authRoutes from './routes/authRoutes.js'
import noteRoutes from './routes/noteRoutes.js'
import lostFoundRoutes from './routes/lostFoundRoutes.js'
import eventRoutes from './routes/eventRoutes.js'
import listingRoutes from './routes/listingRoutes.js'
import placementRoutes from './routes/placementRoutes.js'
import placementStatRoutes from './routes/placementStatRoutes.js'
import searchRoutes from './routes/searchRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import commentRoutes from './routes/commentRoutes.js'
import postRoutes from './routes/postRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import studyGroupRoutes from './routes/studyGroupRoutes.js'
import clubRoutes from './routes/clubRoutes.js'
import questionRoutes from './routes/questionRoutes.js'
import mentorshipRoutes from './routes/mentorshipRoutes.js'
import collabDocRoutes from './routes/collabDocRoutes.js'

import Message from './models/Message.js'
import Conversation from './models/Conversation.js'
import User from './models/User.js'

const app = express()
const httpServer = createServer(app)

// ─── SOCKET.IO SETUP ──────────────────────────────────────────────
const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || origin.endsWith('.vercel.app') || origin === 'http://localhost:5173') {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
  },
  pingTimeout: 60000,
})

// Store online users: userId -> socketId
const onlineUsers = new Map()

// Socket.io auth middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token
    if (!token) return next(new Error('Authentication required'))
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select('name avatar')
    if (!user) return next(new Error('User not found'))
    socket.user = user
    next()
  } catch {
    next(new Error('Invalid token'))
  }
})

io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.user.name}`)

  // Register user as online
  onlineUsers.set(socket.user._id.toString(), socket.id)

  // Broadcast online status
  socket.broadcast.emit('user_online', { userId: socket.user._id })

  // Get online users
  socket.on('get_online_users', () => {
    socket.emit('online_users', Array.from(onlineUsers.keys()))
  })

  // Join conversation room
  socket.on('join_conversation', (conversationId) => {
    socket.join(`conv_${conversationId}`)
    console.log(`${socket.user.name} joined conv_${conversationId}`)
  })

  // Leave conversation room
  socket.on('leave_conversation', (conversationId) => {
    socket.leave(`conv_${conversationId}`)
  })

  // Send message via socket
  socket.on('send_message', async (data) => {
    try {
      const { conversationId, content, replyTo } = data

      // Verify conversation participant
      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: socket.user._id,
      })
      if (!conversation) return

      // Create message
      const message = await Message.create({
        conversation: conversationId,
        sender: socket.user._id,
        content,
        type: 'text',
        replyTo: replyTo || undefined,
        readBy: [socket.user._id],
      })

      await message.populate('sender', 'name avatar branch year')
      if (replyTo) await message.populate('replyTo', 'content sender')

      // Update conversation
      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: message._id,
        lastMessageAt: new Date(),
      })

      // Increment unread for other participants
      const otherParticipants = conversation.participants
        .filter(p => p.toString() !== socket.user._id.toString())

      for (const participantId of otherParticipants) {
        await Conversation.findByIdAndUpdate(conversationId, {
          $inc: { [`unreadCount.${participantId}`]: 1 },
        })

        // Send real-time notification to other participant
        const recipientSocketId = onlineUsers.get(participantId.toString())
        if (recipientSocketId) {
          io.to(recipientSocketId).emit('new_message', {
            message,
            conversationId,
          })
          io.to(recipientSocketId).emit('conversation_updated', {
            conversationId,
            lastMessage: message,
          })
        }
      }

      // Send to all in conversation room
      io.to(`conv_${conversationId}`).emit('message_received', message)

    } catch (err) {
      socket.emit('message_error', { message: err.message })
    }
  })

  // Typing indicator
  socket.on('typing_start', ({ conversationId }) => {
    socket.to(`conv_${conversationId}`).emit('user_typing', {
      userId: socket.user._id,
      userName: socket.user.name,
      conversationId,
    })
  })

  socket.on('typing_stop', ({ conversationId }) => {
    socket.to(`conv_${conversationId}`).emit('user_stop_typing', {
      userId: socket.user._id,
      conversationId,
    })
  })

  // Message read
  socket.on('message_read', async ({ conversationId }) => {
    try {
      await Message.updateMany(
        {
          conversation: conversationId,
          sender: { $ne: socket.user._id },
          readBy: { $ne: socket.user._id },
        },
        { $addToSet: { readBy: socket.user._id } }
      )
      await Conversation.findByIdAndUpdate(conversationId, {
        [`unreadCount.${socket.user._id}`]: 0,
      })
      socket.to(`conv_${conversationId}`).emit('messages_read', {
        userId: socket.user._id,
        conversationId,
      })
    } catch {}
  })

  // React to message
  socket.on('react_message', async ({ messageId, emoji, conversationId }) => {
    try {
      const message = await Message.findById(messageId)
      if (!message) return

      const existingIdx = message.reactions.findIndex(
        r => r.user.toString() === socket.user._id.toString()
      )

      if (existingIdx !== -1) {
        if (message.reactions[existingIdx].emoji === emoji) {
          message.reactions.splice(existingIdx, 1)
        } else {
          message.reactions[existingIdx].emoji = emoji
        }
      } else {
        message.reactions.push({ emoji, user: socket.user._id })
      }

      await message.save()

      io.to(`conv_${conversationId}`).emit('message_reacted', {
        messageId,
        reactions: message.reactions,
      })
    } catch {}
  })
  // Group message via socket
socket.on('send_group_message', async (data) => {
  try {
    const { groupId, conversationId, content, replyTo } = data

    const group = await StudyGroup.findById(groupId)
    if (!group) return

    const isMember = group.members.some(
      m => m.user.toString() === socket.user._id.toString()
    )
    if (!isMember) return

    const message = await Message.create({
      conversation: conversationId,
      sender: socket.user._id,
      content,
      type: 'text',
      replyTo: replyTo || undefined,
      readBy: [socket.user._id],
    })

    await message.populate('sender', 'name avatar branch year')

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      lastMessageAt: new Date(),
    })

    group.messageCount = (group.messageCount || 0) + 1
    await group.save()

    io.to(`conv_${conversationId}`).emit('message_received', message)
  } catch (err) {
    socket.emit('message_error', { message: err.message })
  }
})
socket.on('send_club_message', async (data) => {
  try {
    const { clubId, conversationId, content } = data
    const club = await Club.findById(clubId)
    if (!club) return

    const isMember = club.members.some(m => m.user.toString() === socket.user._id.toString())
    if (!isMember) return

    const message = await Message.create({
      conversation: conversationId,
      sender: socket.user._id,
      content,
      type: 'text',
      readBy: [socket.user._id],
    })
    await message.populate('sender', 'name avatar branch year')

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      lastMessageAt: new Date(),
    })

    io.to(`conv_${conversationId}`).emit('message_received', message)
  } catch (err) {
    socket.emit('message_error', { message: err.message })
  }
})
import CollabDoc from './models/CollabDoc.js'

// Track active editors per doc: docId -> Map(socketId -> {userId, name, color, cursorPos})
const docEditors = new Map()
const editorColors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#ef4444']

socket.on('join_doc', async ({ docId }) => {
  socket.join(`doc_${docId}`)

  if (!docEditors.has(docId)) docEditors.set(docId, new Map())
  const editors = docEditors.get(docId)
  const color = editorColors[editors.size % editorColors.length]

  editors.set(socket.id, {
    userId: socket.user._id.toString(),
    name: socket.user.name,
    avatar: socket.user.avatar,
    color,
    cursorPos: 0,
  })

  // Broadcast updated editor list
  io.to(`doc_${docId}`).emit('doc_editors', Array.from(editors.values()))
})

socket.on('leave_doc', ({ docId }) => {
  socket.leave(`doc_${docId}`)
  const editors = docEditors.get(docId)
  if (editors) {
    editors.delete(socket.id)
    io.to(`doc_${docId}`).emit('doc_editors', Array.from(editors.values()))
  }
})

// Real-time content sync (operational — simple last-write-wins per chunk)
socket.on('doc_change', async ({ docId, content, title }) => {
  try {
    socket.to(`doc_${docId}`).emit('doc_updated', {
      content, title,
      editedBy: { id: socket.user._id, name: socket.user.name },
    })

    // Debounced save handled client-side; this just saves on each change
    await CollabDoc.findByIdAndUpdate(docId, {
      content, title,
      lastEditedBy: socket.user._id,
      $inc: { version: 1 },
    })
  } catch (err) {
    console.error('doc_change error:', err.message)
  }
})

// Cursor position broadcast
socket.on('cursor_move', ({ docId, cursorPos, selectionEnd }) => {
  const editors = docEditors.get(docId)
  if (editors?.has(socket.id)) {
    editors.get(socket.id).cursorPos = cursorPos
    editors.get(socket.id).selectionEnd = selectionEnd
  }
  socket.to(`doc_${docId}`).emit('cursor_updated', {
    userId: socket.user._id,
    name: socket.user.name,
    cursorPos,
    selectionEnd,
    color: editors?.get(socket.id)?.color,
  })
})

// Clean up on disconnect
docEditors.forEach((editors, docId) => {
  if (editors.has(socket.id)) {
    editors.delete(socket.id)
    io.to(`doc_${docId}`).emit('doc_editors', Array.from(editors.values()))
  }
})
  // Disconnect
  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.user.name}`)
    onlineUsers.delete(socket.user._id.toString())
    socket.broadcast.emit('user_offline', { userId: socket.user._id })
  })
})

// ─── EXPRESS MIDDLEWARE ───────────────────────────────────────────
app.use(helmet())
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.endsWith('.vercel.app') || origin === 'http://localhost:5173') {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}))
app.use(morgan('dev'))
app.use(express.json())

// ─── ROUTES ───────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/notes', noteRoutes)
app.use('/api/lost-found', lostFoundRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/listings', listingRoutes)
app.use('/api/placement', placementRoutes)
app.use('/api/placement-stats', placementStatRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/study-groups', studyGroupRoutes)
app.use('/api/questions', questionRoutes)
app.use('/api/clubs', clubRoutes)
app.use('/api/mentorship', mentorshipRoutes)
app.use('/api/collab-docs', collabDocRoutes)

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ message: err.message || 'Server error' })
})

// ─── START SERVER ─────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected')
    httpServer.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    )
  })
  .catch((err) => console.error('❌ DB connection failed:', err.message))