import mongoose from 'mongoose'

const userStatsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streak: { type: Number, default: 0 },
    lastActiveDate: { type: Date },
    badges: [{
      badgeId: String,
      earnedAt: { type: Date, default: Date.now },
    }],
    stats: {
      notesUploaded: { type: Number, default: 0 },
      notesDownloaded: { type: Number, default: 0 },
      eventsAttended: { type: Number, default: 0 },
      eventsCreated: { type: Number, default: 0 },
      postsCreated: { type: Number, default: 0 },
      commentsPosted: { type: Number, default: 0 },
      quizzesCompleted: { type: Number, default: 0 },
      questionsAdded: { type: Number, default: 0 },
      lostFoundResolved: { type: Number, default: 0 },
      mentorshipSessions: { type: Number, default: 0 },
      clubsJoined: { type: Number, default: 0 },
      studyGroupsJoined: { type: Number, default: 0 },
    },
    xpHistory: [{
      action: String,
      xp: Number,
      timestamp: { type: Date, default: Date.now },
    }],
  },
  { timestamps: true }
)

userStatsSchema.index({ xp: -1 })

export default mongoose.model('UserStats', userStatsSchema)