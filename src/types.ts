export type FeedbackStatus = 'Active' | 'Resolved'

export type FeedbackPriority = 'low' | 'medium' | 'high'

export interface Feedback {
  id: string
  title: string
  description: string
  status: FeedbackStatus
  priority: FeedbackPriority
  createdAt: string
}

export interface Comment {
  id: string
  text: string
  createdAt: string
}
