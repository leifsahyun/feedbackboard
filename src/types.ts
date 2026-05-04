export type FeedbackStatus = 'Active' | 'Resolved'

export interface Feedback {
  id: string
  title: string
  description: string
  status: FeedbackStatus
  createdAt: string
  tags: string[]
}

export interface Comment {
  id: string
  text: string
  createdAt: string
}
