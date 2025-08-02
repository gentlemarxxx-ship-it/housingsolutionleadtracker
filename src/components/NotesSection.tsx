import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "./ui/scroll-area"
import { useLeadNotes, LeadNote } from "@/hooks/useLeadNotes"
import { Edit, Trash2, Save, X } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Skeleton } from "./ui/skeleton"
import { useUser } from "@/contexts/UserContext"

interface NotesSectionProps {
  leadId: string
  onAddNote: (content: string) => Promise<void>
}

const NoteItem = ({ note, onUpdate, onDelete }: { note: LeadNote, onUpdate: (id: string, content: string) => Promise<void>, onDelete: (id: string) => Promise<void> }) => {
  const { currentUser } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(note.content)

  const canEdit = currentUser === note.user_name

  const handleUpdate = async () => {
    if (content.trim() === "") return
    await onUpdate(note.id, content)
    setIsEditing(false)
  }

  const formattedDate = new Date(note.created_at).toLocaleString('en-US', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true
  })

  return (
    <div className="text-sm py-2 border-b last:border-b-0 group">
      <div className="flex justify-between items-start">
        <div className="flex-grow">
          {isEditing ? (
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} className="min-h-[60px]" />
          ) : (
            <p className="whitespace-pre-wrap">{note.content}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {note.user_name ? `${note.user_name} - ` : ''}{formattedDate}
          </p>
        </div>
        {canEdit && (
          <div className="flex items-center ml-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            {isEditing ? (
              <>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleUpdate}><Save className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsEditing(false)}><X className="h-4 w-4" /></Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsEditing(true)}><Edit className="h-4 w-4" /></Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Note?</AlertDialogTitle>
                      <AlertDialogDescription>This action cannot be undone. Are you sure you want to permanently delete this note?</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(note.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function NotesSection({ leadId, onAddNote }: NotesSectionProps) {
  const { notes, loading, updateNote, deleteNote } = useLeadNotes(leadId)
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-60 w-full rounded-md border bg-muted/50">
          <div className="p-3 pr-2 space-y-2">
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : notes.length > 0 ? (
              notes.map(note => <NoteItem key={note.id} note={note} onUpdate={updateNote} onDelete={deleteNote} />)
            ) : (
              <p className="text-sm text-muted-foreground italic text-center py-4">No notes yet.</p>
            )}
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