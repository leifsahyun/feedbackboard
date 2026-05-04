import { useState, FormEvent } from 'react'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import type { Feedback } from '../types'
import { addTag } from '../api'

interface FeedbackCardProps {
  item: Feedback
  selected: boolean
  onSelect: () => void
  onMarkResolved: () => void
  onReopen: () => void
  onTagAdded: (id: string, updatedItem: Feedback) => void
}

export function FeedbackCard({
  item,
  selected,
  onSelect,
  onMarkResolved,
  onReopen,
  onTagAdded,
}: FeedbackCardProps) {
  const [tagInput, setTagInput] = useState('')
  const [addingTag, setAddingTag] = useState(false)
  const [tagError, setTagError] = useState(false)

  const handleAddTag = async (e: FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const trimmed = tagInput.trim()
    if (!trimmed) {
      setTagError(true)
      return
    }
    try {
      const updated = await addTag(item.id, trimmed)
      onTagAdded(item.id, updated)
      setTagInput('')
      setAddingTag(false)
      setTagError(false)
    } catch {
      // ignore
    }
  }

  return (
    <ListItemButton
      selected={selected}
      onClick={onSelect}
      sx={{ alignItems: 'flex-start', flexDirection: 'column', border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 1 }}
    >
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
        <ListItemText primary={item.title} secondary={item.description} primaryTypographyProps={{ fontWeight: 500 }} />
        <Chip label={item.status} size="small" color={item.status === 'Resolved' ? 'success' : 'default'} />
      </Box>
      {item.tags.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
          {item.tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" variant="outlined" />
          ))}
        </Box>
      )}
      <Box sx={{ mt: 1, width: '100%', display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between' }}>
        {addingTag ? (
          <Box
            component="form"
            onSubmit={handleAddTag}
            onClick={(e) => e.stopPropagation()}
            sx={{ display: 'flex', gap: 1, alignItems: 'center', flex: 1 }}
          >
            <TextField
              size="small"
              placeholder="Enter tag"
              value={tagInput}
              onChange={(e) => { setTagInput(e.target.value); setTagError(false) }}
              error={tagError}
              autoFocus
              sx={{ flex: 1 }}
              inputProps={{ 'aria-label': 'Tag name' }}
            />
            <Button size="small" variant="contained" type="submit">Add</Button>
            <Button size="small" onClick={(e) => { e.stopPropagation(); setAddingTag(false); setTagInput(''); setTagError(false) }}>Cancel</Button>
          </Box>
        ) : (
          <Button size="small" onClick={(e) => { e.stopPropagation(); setAddingTag(true) }}>
            + Add tag
          </Button>
        )}
        <Box>
          {item.status === 'Active' ? (
            <Button size="small" variant="outlined" color="primary" onClick={(e) => { e.stopPropagation(); onMarkResolved() }}>
              Mark resolved
            </Button>
          ) : (
            <Button size="small" variant="outlined" onClick={(e) => { e.stopPropagation(); onReopen() }}>
              Reopen
            </Button>
          )}
        </Box>
      </Box>
    </ListItemButton>
  )
}
