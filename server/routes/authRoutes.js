import express from 'express'
import {
  register,
  login,
  verifyEmail,
  getMe,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'
import {
  register, login, verifyEmail, getMe,
  forgotPassword, resetPassword,
  updateProfile, updateAvatar
} from '../controllers/authController.js'
import { uploadMarketplaceImage } from '../utils/cloudinary.js'
import {
  register, login, verifyEmail, getMe,
  forgotPassword, resetPassword,
  updateProfile, updateAvatar,
  changePassword, deleteAccount
} from '../controllers/authController.js'

router.patch('/change-password', protect, changePassword)
router.delete('/delete-account', protect, deleteAccount)

router.patch('/update-avatar', protect, uploadMarketplaceImage.single('avatar'), updateAvatar)

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/verify-email', verifyEmail)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.get('/me', protect, getMe)     // protected — needs JWT

export default router