import { useState } from "react"
import { useLeads, LeadFilters as LeadFiltersType } from "@/hooks/useLeads"
import { LeadTable } from "@/components/LeadTable"
import { LeadForm } from "@/components/LeadForm"
import { LeadFilters } from "@/components/LeadFilters"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ImportLeadsDialog } from "@/components/ImportLeadsDialog"

interface LeadsPageProps {
  remarkFilter?: string
  title: string
  description: string
}

export function LeadsPage({ remarkFilter, title, description }: LeadsPageProps) {
  const { leads, loading, calledByUsers, addLead, updateLead, deleteLead, filterLeads, batchAddLeads } = useLeads(remarkFilter)
  const [filters, setFilters] = useState<LeadFiltersType>({})
  
  const filteredLeads = filterLeads(filters)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading leads...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <ImportLeadsDialog onImport={batchAddLeads} />
            <LeadForm 
              onSubmit={addLead} 
              calledByUsers={calledByUsers}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <LeadFilters 
            onFilterChange={setFilters}
            calledByUsers={calledByUsers}
          />
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {filteredLeads.length} of {leads.length} leads
            </div>
          </div>
          
          <LeadTable
            leads={filteredLeads}
            onUpdate={updateLead}
            onDelete={deleteLead}
            calledByUsers={calledByUsers}
          />
        </CardContent>
      </Card>
    </div>
  )
}