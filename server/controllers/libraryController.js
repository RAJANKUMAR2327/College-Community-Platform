import LibraryZone from '../models/LibraryZone.js'
import SeatBooking from '../models/SeatBooking.js'
import crypto from 'crypto'

// ─── ZONES (admin creates, students view) ─────────────────────────
export const createZone = async (req, res) => {
  try {
    const { name, type, floor, capacity, openTime, closeTime, maxBookingHours, amenities, color } = req.body

    // Auto-generate seats based on capacity (grid layout)
    const cols = Math.ceil(Math.sqrt(Number(capacity)))
    const seats = []
    for (let i = 1; i <= Number(capacity); i++) {
      const row = Math.ceil(i / cols)
      const col = ((i - 1) % cols) + 1
      seats.push({
        seatNumber: `${String.fromCharCode(64 + row)}${col}`,
        row, col,
        hasPowerOutlet: i % 3 === 0,
      })
    }

    const zone = await LibraryZone.create({
      name, type, floor, capacity: Number(capacity),
      seats, openTime, closeTime,
      maxBookingHours: maxBookingHours ? Number(maxBookingHours) : 3,
      amenities: amenities ? JSON.parse(amenities) : [],
      color, college: req.user.college,
    })

    res.status(201).json({ message: 'Zone created!', zone })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getZones = async (req, res) => {
  try {
    const zones = await LibraryZone.find({ college: req.user.college, isActive: true })
    res.json({ zones })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getZoneAvailability = async (req, res) => {
  try {
    const { date } = req.query
    const zone = await LibraryZone.findById(req.params.id)
    if (!zone) return res.status(404).json({ message: 'Zone not found.' })

    const bookings = await SeatBooking.find({
      zone: zone._id, date,
      status: { $in: ['upcoming', 'checked-in'] },
    })

    const seatAvailability = zone.seats.map(seat => {
      const seatBookings = bookings.filter(b => b.seatNumber === seat.seatNumber)
      return {
        ...seat.toObject(),
        bookedSlots: seatBookings.map(b => ({ startTime: b.startTime, endTime: b.endTime, userId: b.user })),
      }
    })

    res.json({ zone: { ...zone.toObject(), seats: undefined }, seats: seatAvailability })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ─── BOOKINGS ─────────────────────────────────────────────────────
const checkOverlap = (existingBookings, startTime, endTime) => {
  const toMinutes = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m }
  const newStart = toMinutes(startTime)
  const newEnd = toMinutes(endTime)

  return existingBookings.some(b => {
    const bStart = toMinutes(b.startTime)
    const bEnd = toMinutes(b.endTime)
    return newStart < bEnd && newEnd > bStart
  })
}

export const createBooking = async (req, res) => {
  try {
    const { zoneId, seatNumber, date, startTime, endTime, purpose, groupMembers } = req.body

    const zone = await LibraryZone.findById(zoneId)
    if (!zone) return res.status(404).json({ message: 'Zone not found.' })

    const seat = zone.seats.find(s => s.seatNumber === seatNumber)
    if (!seat || !seat.isActive) return res.status(400).json({ message: 'Seat not available.' })

    // Check duration limit
    const toMinutes = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m }
    const duration = (toMinutes(endTime) - toMinutes(startTime)) / 60
    if (duration > zone.maxBookingHours) {
      return res.status(400).json({ message: `Max booking duration is ${zone.maxBookingHours} hours.` })
    }
    if (duration <= 0) return res.status(400).json({ message: 'Invalid time range.' })

    // Check for existing bookings on this seat/date that overlap
    const existing = await SeatBooking.find({
      zone: zoneId, seatNumber, date,
      status: { $in: ['upcoming', 'checked-in'] },
    })

    if (checkOverlap(existing, startTime, endTime)) {
      return res.status(400).json({ message: 'This seat is already booked for the selected time.' })
    }

    // Check user doesn't have another active booking at the same time
    const myBookings = await SeatBooking.find({
      user: req.user._id, date,
      status: { $in: ['upcoming', 'checked-in'] },
    })
    if (checkOverlap(myBookings, startTime, endTime)) {
      return res.status(400).json({ message: 'You already have a booking during this time.' })
    }

    const qrCode = crypto.randomBytes(8).toString('hex').toUpperCase()

    const booking = await SeatBooking.create({
      user: req.user._id, zone: zoneId, seatNumber, date, startTime, endTime,
      purpose, qrCode,
      isGroupBooking: !!groupMembers?.length,
      groupMembers: groupMembers || [],
    })

    await booking.populate('zone', 'name type color')

    res.status(201).json({ message: 'Seat booked!', booking })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getMyBookings = async (req, res) => {
  try {
    const { status } = req.query
    const filter = { user: req.user._id }
    if (status) filter.status = status

    const bookings = await SeatBooking.find(filter)
      .sort({ date: -1, startTime: -1 })
      .populate('zone', 'name type color floor')

    res.json({ bookings })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const cancelBooking = async (req, res) => {
  try {
    const booking = await SeatBooking.findOne({ _id: req.params.id, user: req.user._id })
    if (!booking) return res.status(404).json({ message: 'Booking not found.' })

    if (booking.status !== 'upcoming') {
      return res.status(400).json({ message: 'Cannot cancel this booking.' })
    }

    booking.status = 'cancelled'
    await booking.save()
    res.json({ message: 'Booking cancelled.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const checkIn = async (req, res) => {
  try {
    const { qrCode } = req.body
    const booking = await SeatBooking.findOne({ qrCode, status: 'upcoming' })
    if (!booking) return res.status(404).json({ message: 'Invalid or already used booking.' })

    // Verify it's within reasonable time window (15 min before/after start)
    const now = new Date()
    const [h, m] = booking.startTime.split(':').map(Number)
    const bookingDateTime = new Date(booking.date)
    bookingDateTime.setHours(h, m)

    const diffMinutes = (now - bookingDateTime) / 60000
    if (diffMinutes < -15) {
      return res.status(400).json({ message: 'Too early to check in.' })
    }
    if (diffMinutes > 30) {
      booking.status = 'no-show'
      await booking.save()
      return res.status(400).json({ message: 'Booking expired due to no-show.' })
    }

    booking.status = 'checked-in'
    booking.checkedInAt = now
    await booking.save()

    res.json({ message: 'Checked in successfully!', booking })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const checkOut = async (req, res) => {
  try {
    const booking = await SeatBooking.findOne({ _id: req.params.id, user: req.user._id, status: 'checked-in' })
    if (!booking) return res.status(404).json({ message: 'No active session found.' })

    booking.status = 'completed'
    booking.checkedOutAt = new Date()
    await booking.save()

    res.json({ message: 'Checked out!' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ─── ADMIN: get zone stats ────────────────────────────────────────
export const getZoneStats = async (req, res) => {
  try {
    const { date } = req.query
    const targetDate = date || new Date().toISOString().slice(0, 10)

    const zones = await LibraryZone.find({ college: req.user.college })
    const stats = await Promise.all(zones.map(async (zone) => {
      const bookings = await SeatBooking.countDocuments({
        zone: zone._id, date: targetDate,
        status: { $in: ['upcoming', 'checked-in', 'completed'] },
      })
      return {
        zoneId: zone._id, name: zone.name,
        capacity: zone.capacity, bookings,
        utilization: Math.round((bookings / zone.capacity) * 100),
      }
    }))

    res.json({ stats })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}