import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'

dotenv.config()

// ── Import routes AFTER dotenv.config() ──
import authRoutes from './routes/authRoutes.js'
import noteRoutes from './routes/noteRoutes.js'
import lostFoundRoutes from './routes/lostFoundRoutes.js'
import eventRoutes from './routes/eventRoutes.js'
import listingRoutes from './routes/listingRoutes.js'
import placementRoutes from './routes/placementRoutes.js'

app.use('/api/placement', placementRoutes)
// ── Create app ──
const app = express()

// ── Middleware ──
app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(morgan('dev'))
app.use(express.json())

// ── Routes ──
app.use('/api/auth', authRoutes)
app.use('/api/notes', noteRoutes)
app.use('/api/lost-found', lostFoundRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/listings', listingRoutes)

// ── Health check ──
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

// ── Global error handler ──
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ message: err.message || 'Server error' })
})

// ── Connect DB then start server ──
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected')
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    )
  })
  .catch((err) => console.error('❌ DB connection failed:', err.message))