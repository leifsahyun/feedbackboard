import { useState, useEffect, useMemo } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import { fetchFeedback } from './api'
import type { Feedback } from './types'
import { FeedbackBoard } from './components/FeedbackBoard'
import { FeedbackDetail } from './components/FeedbackDetail'

export default function App() {
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [tagFilter, setTagFilter] = useState('')

  useEffect(() => {
    fetchFeedback()
      .then(setFeedback)
      .catch((err) => {
        console.error('Failed to fetch feedback:', err)
        setError('Failed to load feedback. Please refresh the page.')
      })
  }, [])

  const handleStatusUpdated = (id: string, status: 'Active' | 'Resolved') => {
    setFeedback((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status } : f))
    )
  }

  const handleTagAdded = (_id: string, updatedItem: Feedback) => {
    setFeedback((prev) =>
      prev.map((f) => (f.id === updatedItem.id ? updatedItem : f))
    )
  }

  const filteredFeedback = useMemo(() => {
    const trimmed = tagFilter.trim().toLowerCase()
    if (!trimmed) return feedback
    return feedback.filter((f) =>
      f.tags.some((t) => t.toLowerCase().includes(trimmed))
    )
  }, [feedback, tagFilter])

  return (
    <>
      <Box
        component="header"
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          py: 2,
          px: 0,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            FeedbackBoard
          </Typography>
          <Typography color="text.secondary" variant="body1">
            Internal customer feedback tool
          </Typography>
        </Container>
      </Box>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {error && (
          <Box
            sx={{
              mb: 2,
              p: 2,
              backgroundColor: 'error.light',
              color: 'error.contrastText',
              borderRadius: 1,
            }}
          >
            <Typography>{error}</Typography>
          </Box>
        )}
        <TextField
          size="small"
          placeholder="Filter by tag…"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          sx={{ mb: 2, width: 260 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">#</InputAdornment>
            ),
          }}
          inputProps={{ 'aria-label': 'Filter by tag' }}
        />
        <FeedbackBoard
          feedback={filteredFeedback}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onStatusUpdated={handleStatusUpdated}
          onTagAdded={handleTagAdded}
        />
      </Container>
      <Drawer
        anchor="right"
        open={selectedId !== null}
        onClose={() => setSelectedId(null)}
        ModalProps={{
          BackdropProps: { sx: { backgroundColor: 'rgba(19, 21, 23, 0.2)' } },
        }}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 420 },
            maxWidth: '100%',
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: 1,
              py: 0.5,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <IconButton aria-label="Close drawer" onClick={() => setSelectedId(null)} size="small" sx={{ fontSize: '1.25rem' }}>
              ×
            </IconButton>
          </Box>
          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            {selectedId && (
              <FeedbackDetail
                feedbackId={selectedId}
                onStatusUpdated={handleStatusUpdated}
                onClose={() => setSelectedId(null)}
              />
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  )
}
