import type { Feedback, Comment } from './types'

const BASE = '/api'

export async function fetchFeedback(): Promise<Feedback[]> {
  const res = await fetch(`${BASE}/feedback`)
  if (!res.ok) throw new Error('Failed to fetch feedback')
  return res.json()
}

export async function fetchFeedbackById(id: string): Promise<Feedback> {
  const res = await fetch(`${BASE}/feedback/${id}`)
  if (!res.ok) throw new Error('Failed to fetch feedback')
  return res.json()
}

export async function updateStatus(id: string, status: 'Active' | 'Resolved'): Promise<Feedback> {
  const res = await fetch(`${BASE}/feedback/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  if (!res.ok) throw new Error('Failed to update status')
  return res.json()
}

export async function fetchComments(feedbackId: string): Promise<Comment[]> {
  const res = await fetch(`${BASE}/feedback/${feedbackId}/comments`)
  if (!res.ok) throw new Error('Failed to fetch comments')
  return res.json()
}

export async function addTag(feedbackId: string, tag: string): Promise<Feedback> {
  const res = await fetch(`${BASE}/feedback/${feedbackId}/tags`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tag }),
  })
  if (!res.ok) throw new Error('Failed to add tag')
  return res.json()
}

export async function addComment(feedbackId: string, text: string): Promise<Comment> {
  const res = await fetch(`${BASE}/feedback/${feedbackId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
  if (!res.ok) throw new Error('Failed to add comment')
  return res.json()
}
