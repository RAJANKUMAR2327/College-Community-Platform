import Comment from '../models/Comment.js'

export const addComment = async (req, res) => {
  try {
    const { content } = req.body
    const { targetId, targetType } = req.params

    const comment = await Comment.create({
      content,
      author: req.user._id,
      targetId,
      targetType,
    })

    await comment.populate('author', 'name avatar branch year')
    await awardXP(req.user._id, 'COMMENT', 'commentsPosted')
    res.status(201).json({ message: 'Comment added!', comment })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getComments = async (req, res) => {
  try {
    const { targetId, targetType } = req.params

    const comments = await Comment.find({ targetId, targetType })
      .sort({ createdAt: -1 })
      .populate('author', 'name avatar branch year')

    res.json({ comments, total: comments.length })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const toggleCommentLike = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId)
    if (!comment) return res.status(404).json({ message: 'Comment not found.' })

    const userId = req.user._id
    const liked = comment.likes.includes(userId)

    if (liked) comment.likes.pull(userId)
    else comment.likes.push(userId)

    await comment.save()
    res.json({ liked: !liked, likeCount: comment.likes.length })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId)
    if (!comment) return res.status(404).json({ message: 'Comment not found.' })

    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized.' })
    }

    await comment.deleteOne()
    res.json({ message: 'Comment deleted.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}