import UserStats from '../models/UserStats.js'
import Badge from '../models/Badge.js'
import { createNotification } from '../controllers/notificationController.js'

// XP values per action
export const XP_VALUES = {
  UPLOAD_NOTE: 20,
  DOWNLOAD_NOTE: 2,
  CREATE_EVENT: 15,
  ATTEND_EVENT: 10,
  CREATE_POST: 5,
  COMMENT: 3,
  COMPLETE_QUIZ: 15,
  ADD_QUESTION: 10,
  RESOLVE_LOST_FOUND: 25,
  JOIN_CLUB: 5,
  JOIN_STUDY_GROUP: 5,
  MENTORSHIP_SESSION: 30,
  DAILY_LOGIN: 5,
  STREAK_BONUS: 10, // per day of streak
}

// Level thresholds (cumulative XP needed)
export const getLevel = (xp) => {
  let level = 1
  let threshold = 100
  let totalNeeded = 0
  while (xp >= totalNeeded + threshold) {
    totalNeeded += threshold
    level++
    threshold = Math.floor(threshold * 1.3)
  }
  return { level, currentXP: xp - totalNeeded, neededXP: threshold, totalNeeded }
}

// Award XP and check for level up + badges
export const awardXP = async (userId, action, statField = null) => {
  try {
    const xpAmount = XP_VALUES[action] || 0
    if (xpAmount === 0) return null

    let stats = await UserStats.findOne({ user: userId })
    if (!stats) {
      stats = await UserStats.create({ user: userId })
    }

    const oldLevel = getLevel(stats.xp).level
    stats.xp += xpAmount

    if (statField) {
      stats.stats[statField] = (stats.stats[statField] || 0) + 1
    }

    stats.xpHistory.push({ action, xp: xpAmount })
    if (stats.xpHistory.length > 100) stats.xpHistory = stats.xpHistory.slice(-100)

    // Update streak
    const today = new Date().toDateString()
    const lastActive = stats.lastActiveDate ? new Date(stats.lastActiveDate).toDateString() : null
    const yesterday = new Date(Date.now() - 86400000).toDateString()

    if (lastActive !== today) {
      if (lastActive === yesterday) {
        stats.streak += 1
      } else if (lastActive !== null) {
        stats.streak = 1
      } else {
        stats.streak = 1
      }
      stats.lastActiveDate = new Date()
    }

    const newLevel = getLevel(stats.xp).level
    await stats.save()

    // Level up notification
    if (newLevel > oldLevel) {
      await createNotification({
        recipient: userId,
        type: 'system',
        title: `🎉 Level Up! You're now Level ${newLevel}`,
        message: `Keep going! You've earned ${stats.xp} XP total.`,
        link: '/profile',
      })
    }

    // Check badges
    await checkAndAwardBadges(userId, stats)

    return { xpEarned: xpAmount, totalXP: stats.xp, level: newLevel, leveledUp: newLevel > oldLevel }
  } catch (err) {
    console.error('XP award error:', err.message)
    return null
  }
}

export const checkAndAwardBadges = async (userId, stats) => {
  try {
    const allBadges = await Badge.find()
    const earnedIds = stats.badges.map(b => b.badgeId)

    for (const badge of allBadges) {
      if (earnedIds.includes(badge.badgeId)) continue

      let qualifies = false
      const { type, field, threshold } = badge.criteria

      if (type === 'count' && field) {
        qualifies = (stats.stats[field] || 0) >= threshold
      } else if (type === 'streak') {
        qualifies = stats.streak >= threshold
      } else if (type === 'milestone' && field === 'xp') {
        qualifies = stats.xp >= threshold
      }

      if (qualifies) {
        stats.badges.push({ badgeId: badge.badgeId })
        stats.xp += badge.xpReward
        await stats.save()

        await createNotification({
          recipient: userId,
          type: 'system',
          title: `🏆 Badge Earned: ${badge.name}`,
          message: badge.description,
          link: '/profile',
        })
      }
    }
  } catch (err) {
    console.error('Badge check error:', err.message)
  }
}