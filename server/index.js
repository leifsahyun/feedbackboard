import express from 'express'
import cors from 'cors'
import {
  getFeedback,
  getFeedbackById,
  updateFeedbackStatus,
  getComments,
  addComment,
  addTag,
} from './store.js'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

// Async error handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

app.get('/api/feedback', asyncHandler((req, res) => {
  const list = getFeedback()
  res.json(list)
}))

app.get('/api/feedback/:id', asyncHandler((req, res) => {
  try {
    const item = getFeedbackById(req.params.id)
    res.json(item)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}))

app.patch('/api/feedback/:id', asyncHandler((req, res) => {
  const { status } = req.body
  if (!status) {
    return res.status(400).json({ error: 'status is required' })
  }
  if (status !== 'Active' && status !== 'Resolved') {
    return res.status(400).json({ error: 'status must be either "Active" or "Resolved"' })
  }
  try {
    const updated = updateFeedbackStatus(req.params.id, status)
    res.json(updated)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}))

app.post('/api/feedback/:id/tags', asyncHandler((req, res) => {
  const { tag } = req.body
  if (!tag || typeof tag !== 'string') {
    return res.status(400).json({ error: 'tag is required' })
  }
  if (!tag.trim()) {
    return res.status(400).json({ error: 'tag cannot be empty' })
  }
  try {
    const updated = addTag(req.params.id, tag.trim())
    res.json(updated)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}))

app.get('/api/feedback/:id/comments', asyncHandler((req, res) => {
  const comments = getComments(req.params.id)
  res.json(comments)
}))

app.post('/api/feedback/:id/comments', asyncHandler((req, res) => {
  const { text } = req.body
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'text is required' })
  }
  if (!text.trim()) {
    return res.status(400).json({ error: 'comment text cannot be empty' })
  }
  const comment = addComment(req.params.id, text)
  res.status(201).json(comment)
}))

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  })
})

app.listen(PORT, () => {
  console.log(`FeedbackBoard API at http://localhost:${PORT}`)
})
