import Event from '../models/Event.js'

export const createEvent = async (req, res) => {
  try {
    const {
      title, description, category,
      date, endDate, venue, organizer,
      registrationLink, maxParticipants,
    } = req.body

    const banner = req.file ? req.file.path : ''

    const event = await Event.create({
      title, description, category,
      date, endDate, venue, organizer,
      banner, registrationLink, maxParticipants,
      createdBy: req.user._id,
    })

    await event.populate('createdBy', 'name branch year avatar')
    res.status(201).json({ message: 'Event created!', event })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getEvents = async (req, res) => {
  try {
    const { category, upcoming, search, page = 1, limit = 12 } = req.query

    const filter = { isApproved: true }
    if (category) filter.category = category
    if (upcoming === 'true') filter.date = { $gte: new Date() }
    if (search) filter.$text = { $search: search }

    const skip = (Number(page) - 1) * Number(limit)

    const [events, total] = await Promise.all([
      Event.find(filter)
        .sort({ date: 1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('createdBy', 'name branch year avatar'),
      Event.countDocuments(filter),
    ])

    res.json({
      events,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name branch year avatar')
      .populate('attendees', 'name branch year avatar')

    if (!event) return res.status(404).json({ message: 'Event not found.' })
    res.json({ event })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const toggleAttendance = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) return res.status(404).json({ message: 'Event not found.' })

    const userId = req.user._id
    const isAttending = event.attendees.includes(userId)

    if (isAttending) {
      event.attendees.pull(userId)
    } else {
      if (event.maxParticipants && event.attendees.length >= event.maxParticipants) {
        return res.status(400).json({ message: 'Event is full.' })
      }
      event.attendees.push(userId)
    }

    await event.save()
    res.json({
      attending: !isAttending,
      attendeeCount: event.attendees.length,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) return res.status(404).json({ message: 'Event not found.' })

    if (event.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized.' })
    }

    await event.deleteOne()
    res.json({ message: 'Event deleted.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user._id }).sort({ date: 1 })
    res.json({ events })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}