import crypto from 'crypto'

// Generate a consistent but untraceable hash per user per confession thread
// This lets a user be recognized as "the same anon" within a thread (for replies)
// without exposing their real identity to anyone
export const generateAuthorHash = (userId, salt = '') => {
  return crypto
    .createHash('sha256')
    .update(`${userId}-${salt}-${process.env.JWT_SECRET}`)
    .digest('hex')
    .slice(0, 12)
}

// Generate a friendly anonymous display name from the hash
const animals = ['Panda', 'Fox', 'Owl', 'Wolf', 'Tiger', 'Eagle', 'Dolphin', 'Lion', 'Bear', 'Hawk', 'Otter', 'Raven']
const adjectives = ['Mysterious', 'Curious', 'Silent', 'Wandering', 'Hidden', 'Quiet', 'Secret', 'Anonymous', 'Masked', 'Shadow']

export const getAnonymousName = (hash) => {
  const num1 = parseInt(hash.slice(0, 4), 16) % adjectives.length
  const num2 = parseInt(hash.slice(4, 8), 16) % animals.length
  return `${adjectives[num1]} ${animals[num2]}`
}

export const getAnonymousAvatarColor = (hash) => {
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#14b8a6']
  const idx = parseInt(hash.slice(8, 10), 16) % colors.length
  return colors[idx]
}