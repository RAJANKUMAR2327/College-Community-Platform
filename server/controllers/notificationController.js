import Notification from '../models/Notification.js'

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30)
      .populate('actor', 'name avatar')

    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      read: false,
    })

    res.json({ notifications, unreadCount })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { read: true }
    )
    res.json({ message: 'All marked as read.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const markOneRead = async (req, res) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { read: true }
    )
    res.json({ message: 'Marked as read.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const deleteNotification = async (req, res) => {
  try {
    await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user._id,
    })
    res.json({ message: 'Deleted.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Helper to create notifications from other controllers
export const createNotification = async ({
  recipient, type, title, message, link, actor
}) => {
  try {
    if (recipient.toString() === actor?.toString()) return // don't notify yourself
    await Notification.create({ recipient, type, title, message, link, actor })
  } catch {}
}