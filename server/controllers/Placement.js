import mongoose from 'mongoose'

const placementSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['job', 'internship', 'experience', 'resource', 'discussion'],
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [150, 'Title too long'],
    },
    company: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [3000, 'Description too long'],
    },
    role: {
      type: String,
      trim: true, // e.g. "SWE Intern", "Data Analyst"
    },
    package: {
      type: String,
      trim: true, // e.g. "12 LPA", "₹40,000/month"
    },
    location: {
      type: String,
      trim: true,
    },
    applyLink: {
      type: String,
      trim: true,
    },
    deadline: Date,
    tags: [{ type: String, trim: true }], // ["DSA", "system-design", "on-campus"]
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

placementSchema.index({ title: 'text', company: 'text', description: 'text' })
placementSchema.index({ type: 1, createdAt: -1 })

export default mongoose.model('Placement', placementSchema)