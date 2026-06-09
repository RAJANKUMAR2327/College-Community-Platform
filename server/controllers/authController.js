import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/email.js'

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })

// ─── REGISTER ─────────────────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { name, email, password, branch, year, college } = req.body

    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({ message: 'Email already registered.' })
    }

    const verifyToken = crypto.randomBytes(32).toString('hex')
    const verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await User.create({
      name, email, password, branch, year, college,
      verifyToken, verifyTokenExpiry,
      isVerified: true,
    })

    // await sendVerificationEmail(email, verifyToken)

    res.status(201).json({ message: 'Registration successful!' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ─── VERIFY EMAIL ─────────────────────────────────────────────────
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query
    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    })
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification link.' })
    }
    user.isVerified = true
    user.verifyToken = undefined
    user.verifyTokenExpiry = undefined
    await user.save()
    res.json({ message: 'Email verified successfully! You can now log in.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ─── LOGIN ────────────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }
    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email before logging in.' })
    }
    const token = signToken(user._id)
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        branch: user.branch,
        year: user.year,
        college: user.college,
        avatar: user.avatar,
      },
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ─── GET ME ───────────────────────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    res.json({ user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ─── UPDATE PROFILE ───────────────────────────────────────────────
export const updateProfile = async (req, res) => {
  try {
    const { name, branch, year, college } = req.body
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, branch, year, college },
      { new: true, runValidators: true }
    )
    res.json({ message: 'Profile updated!', user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ─── FORGOT PASSWORD ──────────────────────────────────────────────
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return res.json({ message: 'If that email exists, a reset link has been sent.' })
    }
    const resetToken = crypto.randomBytes(32).toString('hex')
    user.resetPasswordToken = resetToken
    user.resetPasswordExpiry = new Date(Date.now() + 60 * 60 * 1000)
    await user.save()
    await sendPasswordResetEmail(email, resetToken)
    res.json({ message: 'If that email exists, a reset link has been sent.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ─── RESET PASSWORD ───────────────────────────────────────────────
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.query
    const { password } = req.body
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() },
    })
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset link.' })
    }
    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpiry = undefined
    await user.save()
    res.json({ message: 'Password reset successful. You can now log in.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}