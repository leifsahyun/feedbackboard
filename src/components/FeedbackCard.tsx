import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import type { SelectChangeEvent } from '@mui/material/Select'
import type { Feedback, FeedbackPriority } from '../types'

const PRIORITY_COLOR: Record<FeedbackPriority, 'error' | 'warning' | 'default'> = {
  high: 'error',
  medium: 'warning',
  low: 'default',
}

interface FeedbackCardProps {
  item: Feedback
  selected: boolean
  onSelect: () => void
  onMarkResolved: () => void
  onReopen: () => void
  onPriorityChange: (priority: FeedbackPriority) => void
}

export function FeedbackCard({
  item,
  selected,
  onSelect,
  onMarkResolved,
  onReopen,
  onPriorityChange,
}: FeedbackCardProps) {
  const handlePriorityChange = (e: SelectChangeEvent) => {
    e.stopPropagation()
    onPriorityChange(e.target.value as FeedbackPriority)
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
      <Box sx={{ mt: 1, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <FormControl size="small" onClick={(e) => e.stopPropagation()}>
          <Select
            value={item.priority}
            onChange={handlePriorityChange}
            sx={{ minWidth: 100 }}
            renderValue={(value) => (
              <Chip
                label={value.charAt(0).toUpperCase() + value.slice(1)}
                size="small"
                color={PRIORITY_COLOR[value as FeedbackPriority]}
              />
            )}
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </Select>
        </FormControl>
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
