import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "./ui/scroll-area"

interface NotesSectionProps {
  notes: string | null | undefined
  onAddNote: (note: string) => Promise<void>
}

export function NotesSection({ notes, onAddNote }: NotesSectionProps) {
  const [newNote, setNewNote] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const handleAddNote = async () => {
    if (!newNote.trim()) return
    setIsSaving(true)
    try {
      await onAddNote(newNote)
      setNewNote("")
    } finally {
      setIsSaving(false)
    }
  }

  const formattedNotes = notes
    ? notes.split('\n').map((note, index) => (
        <div key={index} className="text-sm py-2 border-b last:border-b-0">
          {note}
        </div>
      ))
    : <p className="text-sm text-muted-foreground italic">No notes yet.</p>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-60 w-full rounded-md border p-3 bg-muted/50">
          <div className="pr-2 space-y-2">
            {formattedNotes}
          </div>
        </ScrollArea>
        <div className="space-y-2">
          <Textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a new note..."
            className="min-h-[80px]"
          />
          <Button onClick={handleAddNote} disabled={isSaving || !newNote.trim()}>
            {isSaving ? "Adding..." : "Add Note"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}