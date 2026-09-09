'use client'
import { useState } from 'react'
import { Button } from '@/registry/ui/button'
import { ChipGroup } from '@/registry/ui/chip'

/**
 * Registry pilot composition — proves the upstream-compatible Button, the Convert-pattern Chip,
 * and the shared tokens actually work together in one real consuming file, not three isolated
 * items that each install cleanly but were never used side by side. Requires
 * registry/tokens/tokens.css and registry/tokens/shadcn-bridge.css imported once, globally, plus
 * registry/ui/chip.css for Chip's styling.
 */
const teams = [
  { value: 'design', label: 'Design' },
  { value: 'development', label: 'Development' },
  { value: 'operations', label: 'Operations' },
]

export function TaskFilterExample() {
  const [teamFilter, setTeamFilter] = useState<string[]>(['design'])
  const [cleared, setCleared] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <ChipGroup label="Team" options={teams} value={teamFilter} onValueChange={setTeamFilter} />
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button variant="outline" size="sm" onClick={() => setTeamFilter([])} disabled={teamFilter.length === 0}>
          Clear filters
        </Button>
        <Button size="sm" onClick={() => setCleared(true)} disabled={teamFilter.length === 0}>
          Apply
        </Button>
      </div>
      <p role="status">
        {cleared
          ? `Showing ${teamFilter.length ? teamFilter.join(', ') : 'all teams'}.`
          : 'Choose a team and select Apply.'}
      </p>
    </div>
  )
}
