import CallSession from '../models/CallSession.js'
import crypto from 'crypto'

export const createCallRoom = async (req, res) => {
  try {
    const { type, sourceId, participantIds } = req.body
    const roomId = crypto.randomBytes(8).toString('hex')

    const call = await CallSession.create({
      roomId,
      initiator: req.user._id,
      type, sourceId,
      participants: [
        { user: req.user._id },
        ...(participantIds || []).map(id => ({ user: id })),
      ],
    })

    res.status(201).json({ roomId, callId: call._id })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getCallHistory = async (req, res) => {
  try {
    const calls = await CallSession.find({
      'participants.user': req.user._id,
      status: 'ended',
    })
      .sort({ endedAt: -1 })
      .limit(20)
      .populate('participants.user', 'name avatar')

    res.json({ calls })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}