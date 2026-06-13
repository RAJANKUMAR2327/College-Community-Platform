import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'

dotenv.config()
import notificationRoutes from './routes/notificationRoutes.js'
import authRoutes from './routes/authRoutes.js'
import noteRoutes from './routes/noteRoutes.js'
import lostFoundRoutes from './routes/lostFoundRoutes.js'
import eventRoutes from './routes/eventRoutes.js'
import listingRoutes from './routes/listingRoutes.js'
import placementRoutes from './routes/placementRoutes.js'
import searchRoutes from './routes/searchRoutes.js'
import placementStatRoutes from './routes/placementStatRoutes.js'

const app = express()

app.use(helmet())
app.use(cors({
  origin: (origin, callback) => {
    if (
      !origin ||
      origin.endsWith('.vercel.app') ||
      origin === 'http://localhost:5173'
    ) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}))
app.use(morgan('dev'))
app.use(express.json())
app.use('/api/search', searchRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/notes', noteRoutes)
app.use('/api/lost-found', lostFoundRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/listings', listingRoutes)
app.use('/api/placement', placementRoutes)
app.use('/api/placement-stats', placementStatRoutes)
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ message: err.message || 'Server error' })
})

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected')
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    )
  })
  .catch((err) => console.error('❌ DB connection failed:', err.message))