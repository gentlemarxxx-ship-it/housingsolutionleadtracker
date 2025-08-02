import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Lead } from "./useLeads"

export function useLeadDetail(id: string | undefined) {
  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchLead = useCallback(async () => {
    if (!id) return
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("id", id)
        .single()

      if (error) throw error
      setLead(data)
    } catch (error) {
      console.error("Error fetching lead:", error)
      toast({
        title: "Error",
        description: "Failed to fetch lead details.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [id, toast])

  useEffect(() => {
    fetchLead()
  }, [fetchLead])

  const updateLead = async (updates: Partial<Lead>) => {
    if (!id) return
    try {
      const { data: updatedLead, error } = await supabase
        .from("leads")
        .update(updates)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      setLead(updatedLead)
      toast({
        title: "Success",
        description: "Lead updated successfully.",
      })
    } catch (error) {
      console.error("Error updating lead:", error)
      toast({
        title: "Error",
        description: "Failed to update lead.",
        variant: "destructive",
      })
      throw error
    }
  }

  return { lead, loading, updateLead, refetch: fetchLead }
}