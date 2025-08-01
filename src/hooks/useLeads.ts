import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Database } from "@/integrations/supabase/types"

export type Lead = Database["public"]["Tables"]["leads"]["Row"]
export type LeadRemark = Database["public"]["Enums"]["lead_remarks"]

export type LeadFilters = {
  searchTerm?: string
  firstname?: string
  lastname?: string
  workphone?: string
  cellphone1?: string
  homephone?: string
  source?: string
  leadtype?: string
  remarks?: string
  calledby?: string
}

export function useLeads(remarkFilter?: string) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [calledByUsers, setCalledByUsers] = useState<string[]>([])
  const { toast } = useToast()

  const fetchLeads = async () => {
    try {
      setLoading(true)
      let query = supabase.from("leads").select("*").order("created_at", { ascending: false })
      
      if (remarkFilter && remarkFilter !== "") {
        query = query.eq("remarks", remarkFilter as LeadRemark)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      setLeads(data || [])
    } catch (error) {
      console.error("Error fetching leads:", error)
      toast({
        title: "Error",
        description: "Failed to fetch leads",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchCalledByUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("called_by_users")
        .select("name")
        .order("name")
      
      if (error) throw error
      setCalledByUsers(data?.map(user => user.name) || [])
    } catch (error) {
      console.error("Error fetching called by users:", error)
    }
  }

  const addLead = async (leadData: Omit<Lead, "id" | "created_at" | "updated_at">) => {
    try {
      const { data: newLead, error } = await supabase
        .from("leads")
        .insert([leadData])
        .select()
        .single()
      
      if (error) throw error
      
      // Add to called_by_users if new
      if (leadData.calledby && !calledByUsers.includes(leadData.calledby)) {
        await supabase
          .from("called_by_users")
          .insert([{ name: leadData.calledby }])
          .select()
        await fetchCalledByUsers()
      }
      
      if (!remarkFilter || newLead.remarks === remarkFilter) {
        setLeads(prevLeads => [newLead, ...prevLeads]);
      }

      toast({
        title: "Success",
        description: "Lead added successfully",
      })
    } catch (error) {
      console.error("Error adding lead:", error)
      toast({
        title: "Error",
        description: "Failed to add lead",
        variant: "destructive",
      })
      throw error
    }
  }

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    try {
      const { data: updatedLead, error } = await supabase
        .from("leads")
        .update(updates)
        .eq("id", id)
        .select()
        .single()
      
      if (error) throw error
      
      // Add to called_by_users if new
      if (updates.calledby && !calledByUsers.includes(updates.calledby)) {
        await supabase
          .from("called_by_users")
          .insert([{ name: updates.calledby }])
          .select()
        await fetchCalledByUsers()
      }
      
      setLeads(prevLeads => {
        if (remarkFilter && updatedLead.remarks !== remarkFilter) {
          return prevLeads.filter(lead => lead.id !== id);
        } else {
          return prevLeads.map(lead => (lead.id === id ? updatedLead : lead));
        }
      });

      toast({
        title: "Success",
        description: "Lead updated successfully",
      })
    } catch (error) {
      console.error("Error updating lead:", error)
      toast({
        title: "Error",
        description: "Failed to update lead",
        variant: "destructive",
      })
      throw error
    }
  }

  const deleteLead = async (id: string) => {
    try {
      const { error } = await supabase
        .from("leads")
        .delete()
        .eq("id", id)
      
      if (error) throw error
      
      setLeads(prevLeads => prevLeads.filter(lead => lead.id !== id));
      toast({
        title: "Success",
        description: "Lead deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting lead:", error)
      toast({
        title: "Error",
        description: "Failed to delete lead",
        variant: "destructive",
      })
      throw error
    }
  }

  const filterLeads = (filters: LeadFilters) => {
    const { searchTerm, ...specificFilters } = filters

    return leads.filter(lead => {
      // 1. Apply general search term filter
      if (searchTerm) {
        const searchTermLower = searchTerm.toLowerCase()
        const searchableFields = [
          lead.firstname,
          lead.lastname,
          lead.emailaddress,
          lead.workphone,
          lead.cellphone1,
          lead.homephone,
          lead.cellphone2,
          lead.source,
          lead.leadtype,
        ]
        const isMatch = searchableFields.some(field =>
          field?.toString().toLowerCase().includes(searchTermLower)
        )
        if (!isMatch) {
          return false
        }
      }

      // 2. Apply specific filters
      return Object.entries(specificFilters).every(([key, value]) => {
        if (!value) return true
        const leadValue = lead[key as keyof Lead]
        return leadValue?.toString().toLowerCase().includes(value.toLowerCase())
      })
    })
  }

  const batchAddLeads = async (newLeads: Omit<Lead, "id" | "created_at" | "updated_at">[]) => {
    try {
      // 1. Handle 'calledby' users
      const newCalledByUsers = Array.from(new Set(newLeads.map(lead => lead.calledby).filter(Boolean))) as string[];
      const existingUsers = new Set(calledByUsers);
      const usersToAdd = newCalledByUsers.filter(user => !existingUsers.has(user));

      if (usersToAdd.length > 0) {
        const { error: usersError } = await supabase
          .from("called_by_users")
          .insert(usersToAdd.map(name => ({ name })));
        if (usersError) throw usersError;
        await fetchCalledByUsers();
      }

      // 2. Insert leads
      const { error: leadsError } = await supabase
        .from("leads")
        .insert(newLeads);

      if (leadsError) throw leadsError;

      await fetchLeads();
      toast({
        title: "Success",
        description: `${newLeads.length} leads imported successfully.`,
      });
    } catch (error) {
      console.error("Error batch adding leads:", error);
      toast({
        title: "Error",
        description: "Failed to import leads. Please check the file and try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchLeads()
    fetchCalledByUsers()
  }, [remarkFilter])

  return {
    leads,
    loading,
    calledByUsers,
    addLead,
    updateLead,
    deleteLead,
    filterLeads,
    batchAddLeads,
    refetch: fetchLeads,
  }
}