import { useState, useMemo } from 'react'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import List from '@mui/material/List'
import Box from '@mui/material/Box'
import type { Feedback, FeedbackPriority } from '../types'
import { updateStatus, updatePriority } from '../api'
import { FeedbackCard } from './FeedbackCard'

type FilterValue = 'all' | 'Active' | 'Resolved'

const PRIORITY_ORDER: Record<FeedbackPriority, number> = { high: 3, medium: 2, low: 1 }

interface FeedbackListProps {
  feedback: Feedback[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  onStatusUpdated: (id: string, status: 'Active' | 'Resolved') => void
  onPriorityUpdated: (id: string, priority: FeedbackPriority) => void
}

export function FeedbackList({
  feedback,
  selectedId,
  onSelect,
  onStatusUpdated,
  onPriorityUpdated,
}: FeedbackListProps) {
  const [filter, setFilter] = useState<FilterValue>('all')

  const filtered = useMemo(() => {
    if (filter === 'all') return feedback
    return feedback.filter((f) => f.status === (filter as 'Active' | 'Resolved'))
  }, [feedback, filter])

  const sortedAndFiltered = useMemo(() => {
    const list = [...filtered]
    list.sort((a, b) => {
      const priorityDiff = PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority]
      if (priorityDiff !== 0) return priorityDiff
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    return list
  }, [filtered])

  const handleMarkResolved = async (id: string) => {
    try {
      const updated = await updateStatus(id, 'Resolved')
      onStatusUpdated(id, updated.status)
    } catch {
      // TODO handle error
    }
  }

  const handleReopen = async (id: string) => {
    try {
      const updated = await updateStatus(id, 'Active')
      onStatusUpdated(id, updated.status)
    } catch {
      // TODO handle error
    }
  }

  const handlePriorityChange = async (id: string, priority: FeedbackPriority) => {
    try {
      const updated = await updatePriority(id, priority)
      onPriorityUpdated(id, updated.priority)
    } catch {
      // TODO handle error
    }
  }

  return (
    <Box>
      <FormControl size="small" sx={{ minWidth: 140, mb: 2 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={filter}
          label="Status"
          onChange={(e) => setFilter(e.target.value as FilterValue)}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Resolved">Resolved</MenuItem>
        </Select>
      </FormControl>
      <List disablePadding>
        {sortedAndFiltered.map((item) => (
          <FeedbackCard
            key={item.id}
            item={item}
            selected={selectedId === item.id}
            onSelect={() => onSelect(item.id)}
            onMarkResolved={() => handleMarkResolved(item.id)}
            onReopen={() => handleReopen(item.id)}
            onPriorityChange={(priority) => handlePriorityChange(item.id, priority)}
          />
        ))}
      </List>
    </Box>
  )
}
