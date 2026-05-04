import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import type { Feedback } from '../types'
import { updateStatus } from '../api'
import { FeedbackCard } from './FeedbackCard'

interface FeedbackBoardProps {
  feedback: Feedback[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  onStatusUpdated: (id: string, status: 'Active' | 'Resolved') => void
  onTagAdded: (id: string, updatedItem: Feedback) => void
}

const COLUMNS: { id: 'Active' | 'Resolved'; label: string }[] = [
  { id: 'Active', label: 'Active' },
  { id: 'Resolved', label: 'Resolved' },
]

export function FeedbackBoard({
  feedback,
  selectedId,
  onSelect,
  onStatusUpdated,
  onTagAdded,
}: FeedbackBoardProps) {
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

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        alignItems: 'flex-start',
        overflowX: 'auto',
        pb: 1,
        minHeight: 400,
      }}
    >
      {COLUMNS.map(({ id: status, label }) => {
        const items = feedback
          .filter((f) => f.status === status)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        return (
          <Paper
            key={status}
            variant="outlined"
            sx={{
              flex: '0 0 320px',
              minHeight: 200,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 1.5,
                borderBottom: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'grey.50',
              }}
            >
              <Typography variant="subtitle1" fontWeight={600}>
                {label}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {items.length} item{items.length !== 1 ? 's' : ''}
              </Typography>
            </Box>
            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                p: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              {items.map((item) => (
                <FeedbackCard
                  key={item.id}
                  item={item}
                  selected={selectedId === item.id}
                  onSelect={() => onSelect(item.id)}
                  onMarkResolved={() => handleMarkResolved(item.id)}
                  onReopen={() => handleReopen(item.id)}
                  onTagAdded={onTagAdded}
                />
              ))}
              {items.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                  No feedback
                </Typography>
              )}
            </Box>
          </Paper>
        )
      })}
    </Box>
  )
}
