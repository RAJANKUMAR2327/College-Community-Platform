import Note from '../models/Note.js'
import Event from '../models/Event.js'
import Placement from '../models/Placement.js'
import Listing from '../models/Listing.js'
import UserStats from '../models/UserStats.js'
import MentorshipRequest from '../models/MentorshipRequest.js'
import { getLevel } from './xpEngine.js'

export const buildDigestData = async (user, sections, periodDays = 7) => {
  const since = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000)
  const data = { user, periodDays }

  if (sections.notes) {
    data.topNotes = await Note.find({
      branch: user.branch, year: user.year,
      createdAt: { $gte: since }, isApproved: true,
    })
      .sort({ downloadCount: -1 })
      .limit(5)
      .populate('uploader', 'name')
  }

  if (sections.events) {
    data.upcomingEvents = await Event.find({
      date: { $gte: new Date(), $lte: new Date(Date.now() + periodDays * 86400000) },
      isApproved: true,
    })
      .sort({ date: 1 })
      .limit(5)
  }

  if (sections.placements) {
    data.newPlacements = await Placement.find({ createdAt: { $gte: since } })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('postedBy', 'name')
  }

  if (sections.marketplace) {
    data.newListings = await Listing.find({
      status: 'available', createdAt: { $gte: since },
    })
      .sort({ createdAt: -1 })
      .limit(5)
  }

  if (sections.gamification) {
    const stats = await UserStats.findOne({ user: user._id })
    if (stats) {
      const levelInfo = getLevel(stats.xp)
      data.gamification = {
        xpEarnedThisPeriod: stats.xpHistory
          .filter(h => new Date(h.timestamp) >= since)
          .reduce((sum, h) => sum + h.xp, 0),
        currentLevel: levelInfo.level,
        currentXP: stats.xp,
        streak: stats.streak,
        newBadges: stats.badges.filter(b => new Date(b.earnedAt) >= since).length,
      }
    }
  }

  if (sections.mentorship) {
    data.mentorshipUpdates = await MentorshipRequest.countDocuments({
      $or: [{ mentor: user._id }, { mentee: user._id }],
      status: 'pending', createdAt: { $gte: since },
    })
  }

  return data
}