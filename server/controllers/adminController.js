import User from '../models/User.js'
import Note from '../models/Note.js'
import Event from '../models/Event.js'
import Listing from '../models/Listing.js'
import LostFound from '../models/LostFound.js'
import Placement from '../models/Placement.js'
import Comment from '../models/Comment.js'

// ─── DASHBOARD STATS ──────────────────────────────────────────────
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers, totalNotes, totalEvents,
      totalListings, totalLostFound, totalPlacements,
      totalComments, recentUsers, recentNotes,
    ] = await Promise.all([
      User.countDocuments(),
      Note.countDocuments(),
      Event.countDocuments(),
      Listing.countDocuments(),
      LostFound.countDocuments(),
      Placement.countDocuments(),
      Comment.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(5)
        .select('name email branch year college createdAt role'),
      Note.find().sort({ createdAt: -1 }).limit(5)
        .populate('uploader', 'name branch'),
    ])

    // User growth by month (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ])

    // Branch distribution
    const branchDist = await User.aggregate([
      { $match: { branch: { $exists: true, $ne: '' } } },
      { $group: { _id: '$branch', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ])

    // College distribution
    const collegeDist = await User.aggregate([
      { $match: { college: { $exists: true, $ne: '' } } },
      { $group: { _id: '$college', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ])

    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const growthData = userGrowth.map(u => ({
      month: months[u._id.month - 1],
      users: u.count,
    }))

    res.json({
      stats: {
        totalUsers, totalNotes, totalEvents,
        totalListings, totalLostFound,
        totalPlacements, totalComments,
      },
      recentUsers,
      recentNotes,
      userGrowth: growthData,
      branchDist: branchDist.map(b => ({ branch: b._id, count: b.count })),
      collegeDist: collegeDist.map(c => ({ college: c._id, count: c.count })),
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ─── USER MANAGEMENT ──────────────────────────────────────────────
export const getAllUsers = async (req, res) => {
  try {
    const { search, role, page = 1, limit = 20 } = req.query
    const filter = {}
    if (role) filter.role = role
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { college: new RegExp(search, 'i') },
      ]
    }
    const skip = (Number(page) - 1) * Number(limit)
    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(filter),
    ])
    res.json({ users, pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) } })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body
    if (!['student', 'faculty', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role.' })
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true })
    if (!user) return res.status(404).json({ message: 'User not found.' })
    res.json({ message: 'Role updated!', user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account.' })
    }
    await User.findByIdAndDelete(req.params.id)
    res.json({ message: 'User deleted.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const toggleUserVerification = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found.' })
    user.isVerified = !user.isVerified
    await user.save()
    res.json({ message: `User ${user.isVerified ? 'verified' : 'unverified'}!`, user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ─── CONTENT MODERATION ───────────────────────────────────────────
export const getAllNotes = async (req, res) => {
  try {
    const { page = 1, limit = 15 } = req.query
    const skip = (Number(page) - 1) * Number(limit)
    const [notes, total] = await Promise.all([
      Note.find().sort({ createdAt: -1 }).skip(skip).limit(Number(limit))
        .populate('uploader', 'name email'),
      Note.countDocuments(),
    ])
    res.json({ notes, pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) } })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id)
    res.json({ message: 'Note deleted.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const deleteComment = async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id)
    res.json({ message: 'Comment deleted.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getAllComments = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query
    const skip = (Number(page) - 1) * Number(limit)
    const [comments, total] = await Promise.all([
      Comment.find().sort({ createdAt: -1 }).skip(skip).limit(Number(limit))
        .populate('author', 'name email'),
      Comment.countDocuments(),
    ])
    res.json({ comments, pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) } })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}