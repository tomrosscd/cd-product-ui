import { useRef, useState } from 'react'
import { RoadmapBoard, Input, Textarea, Button, TextLink, type RoadmapItem, type RoadmapColumn } from '../src/index.js'
export const roadmapColumns: RoadmapColumn[] = [
  { id: 'ideas', label: 'Ideas' },
  { id: 'scoping', label: 'Scoping' },
  { id: 'ready', label: 'Ready to build' },
  { id: 'building', label: 'In build' },
]
export const roadmapItems: RoadmapItem[] = [
  {
    id: '1',
    title: 'A clearer workspace introduction',
    stage: 'ideas',
    category: 'Operations',
    description: 'Team onboarding guide',
    supportingText: 'Enablement',
    estimate: '20–40 hours',
  },
  {
    id: '2',
    title: 'Find shared resources more easily',
    stage: 'ideas',
    category: 'Improvement',
    categoryTone: 'accent',
    description: 'Resource library',
    supportingText: 'Discoverability',
    estimate: '40–60 hours',
  },
  {
    id: '3',
    title: 'A consistent view of team progress',
    stage: 'scoping',
    category: 'Improvement',
    categoryTone: 'accent',
    description: 'Workspace reporting',
    supportingText: 'Reporting',
    estimate: 'Estimate to confirm',
  },
  {
    id: '4',
    title: 'Make review responsibilities clear',
    stage: 'ready',
    category: 'Improvement',
    categoryTone: 'accent',
    description: 'Review checklist',
    estimate: '20–40 hours',
  },
  {
    id: '5',
    title: 'A simpler workspace settings screen',
    stage: 'building',
    category: 'Operations',
    description: 'Workspace settings',
    estimate: '40–60 hours',
  },
  {
    id: '6',
    title: 'Keep the next action visible',
    stage: 'building',
    category: 'Improvement',
    categoryTone: 'accent',
    description: 'Action summary',
    estimate: '20–40 hours',
    priority: true,
  },
]
export function RoadmapExample() {
  const [items, setItems] = useState(roadmapItems)
  const [adding, setAdding] = useState(false)
  const addButton = useRef<HTMLButtonElement>(null)
  function closeForm() {
    setAdding(false)
    addButton.current?.focus()
  }
  return (
    <div className="cui-root cui-roadmap-demo">
      <div className="cui-band cui-stack">
        {adding && (
          <form
            className="cui-card cui-card-comfortable cui-stack"
            aria-label="Add an idea"
            onSubmit={(event) => {
              event.preventDefault()
              const form = new FormData(event.currentTarget)
              setItems((old) => [
                ...old,
                {
                  id: `idea-${old.length + 1}`,
                  title: String(form.get('title')).trim(),
                  description: String(form.get('description')).trim(),
                  stage: 'ideas',
                  category: 'Improvement',
                  categoryTone: 'accent',
                },
              ])
              closeForm()
            }}
          >
            <Input label="Idea title" name="title" required maxLength={100} autoFocus />
            <Textarea label="Describe the idea" name="description" maxLength={500} />
            <div className="cui-row">
              <Button type="submit" variant="primary">
                Add to ideas
              </Button>
              <Button onClick={closeForm}>Cancel</Button>
            </div>
          </form>
        )}
        <RoadmapBoard
          title="Workspace roadmap"
          columns={roadmapColumns}
          items={items}
          actions={
            <>
              <TextLink href="https://example.com" external variant="standalone">
                Open source roadmap
              </TextLink>
              <Button ref={addButton} variant="primary" onClick={() => setAdding(true)}>
                + Add an idea
              </Button>
            </>
          }
          onStageChange={(id, stage) =>
            setItems((old) => old.map((item) => (item.id === id ? { ...item, stage } : item)))
          }
          onPriorityChange={(id, priority) =>
            setItems((old) => old.map((item) => (item.id === id ? { ...item, priority } : item)))
          }
        />
        <p className="cui-caption cui-secondary">
          Demonstration only. Stage changes and ideas are held in this example until it reloads.
        </p>
      </div>
    </div>
  )
}
