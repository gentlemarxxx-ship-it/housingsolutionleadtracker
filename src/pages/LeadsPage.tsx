import { useState } from "react"
import { useLeads, LeadFilters as LeadFiltersType } from "@/hooks/useLeads"
import { LeadTable } from "@/components/LeadTable"
import { LeadForm } from "@/components/LeadForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ImportLeadsDialog } from "@/components/ImportLeadsDialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { LeadFilters } from "@/components/LeadFilters"

interface LeadsPageProps {
  remarkFilter?: string
  title: string
  description: string
}

export function LeadsPage({ remarkFilter, title, description }: LeadsPageProps) {
  const { leads, loading, addLead, deleteLead, filterLeads, batchAddLeads, batchDeleteLeads } = useLeads(remarkFilter)
  const [filters, setFilters] = useState<LeadFiltersType>({})
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])
  
  const filteredLeads = filterLeads(filters)

  const handleSelectionChange = (newSelection: string[]) => {
    setSelectedLeads(newSelection)
  }

  const handleDeleteSelected = async () => {
    await batchDeleteLeads(selectedLeads)
    setSelectedLeads([])
  }

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
            <ImportLeadsDialog onImport={batchAddLeads} remarkFilter={remarkFilter} />
            <LeadForm 
              onSubmit={addLead} 
              remarkFilter={remarkFilter}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <LeadFilters 
            onFilterChange={setFilters}
            leads={leads}
          />
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {filteredLeads.length} of {leads.length} leads
            </div>
            {selectedLeads.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete ({selectedLeads.length})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete {selectedLeads.length} selected lead(s).
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteSelected}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          
          <LeadTable
            leads={filteredLeads}
            onDelete={deleteLead}
            selectedLeads={selectedLeads}
            onSelectionChange={handleSelectionChange}
          />
        </CardContent>
      </Card>
    </div>
  )
}