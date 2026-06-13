import express from 'express'
import {
  getDashboardStats, getAllUsers, updateUserRole,
  deleteUser, toggleUserVerification,
  getAllNotes, deleteNote,
  getAllComments, deleteComment,
} from '../controllers/adminController.js'
import { protect } from '../middleware/auth.js'
import { adminOnly } from '../middleware/admin.js'

const router = express.Router()

// All routes require auth + admin
router.use(protect, adminOnly)

router.get('/stats', getDashboardStats)

// Users
router.get('/users', getAllUsers)
router.patch('/users/:id/role', updateUserRole)
router.patch('/users/:id/verify', toggleUserVerification)
router.delete('/users/:id', deleteUser)

// Content
router.get('/notes', getAllNotes)
router.delete('/notes/:id', deleteNote)
router.get('/comments', getAllComments)
router.delete('/comments/:id', deleteComment)

export default router