import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Database } from "@/integrations/supabase/types"

export type LeadNote = Database["public"]["Tables"]["lead_notes"]["Row"]

export function useLeadNotes(leadId: string | undefined) {
  const [notes, setNotes] = useState<LeadNote[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchNotes = useCallback(async () => {
    if (!leadId) return
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("lead_notes")
        .select("*")
        .eq("lead_id", leadId)
        .order("created_at", { ascending: false })

      if (error) throw error
      setNotes(data || [])
    } catch (error) {
      console.error("Error fetching notes:", error)
      toast({ title: "Error", description: "Failed to fetch notes.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }, [leadId, toast])

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  const addNote = async (content: string, userName: string) => {
    if (!leadId) return
    try {
      const { data: newNote, error } = await supabase
        .from("lead_notes")
        .insert({ lead_id: leadId, content, user_name: userName })
        .select()
        .single()
      
      if (error) throw error
      setNotes(prev => [newNote, ...prev])
      toast({ title: "Success", description: "Note added." })
    } catch (error) {
      console.error("Error adding note:", error)
      toast({ title: "Error", description: "Failed to add note.", variant: "destructive" })
      throw error
    }
  }

  const updateNote = async (noteId: string, content: string) => {
    try {
      const { data: updatedNote, error } = await supabase
        .from("lead_notes")
        .update({ content })
        .eq("id", noteId)
        .select()
        .single()

      if (error) throw error
      setNotes(prev => prev.map(n => n.id === noteId ? updatedNote : n))
      toast({ title: "Success", description: "Note updated." })
    } catch (error) {
      console.error("Error updating note:", error)
      toast({ title: "Error", description: "Failed to update note.", variant: "destructive" })
      throw error
    }
  }

  const deleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from("lead_notes")
        .delete()
        .eq("id", noteId)

      if (error) throw error
      setNotes(prev => prev.filter(n => n.id !== noteId))
      toast({ title: "Success", description: "Note deleted." })
    } catch (error) {
      console.error("Error deleting note:", error)
      toast({ title: "Error", description: "Failed to delete note.", variant: "destructive" })
      throw error
    }
  }

  return { notes, loading, addNote, updateNote, deleteNote }
}