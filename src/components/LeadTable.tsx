import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Lead } from "@/hooks/useLeads"
import { LeadTableRow } from "./LeadTableRow"

interface LeadTableProps {
  leads: Lead[]
  onDelete: (id: string) => Promise<void>
  selectedLeads: string[]
  onSelectionChange: (ids: string[]) => void
}

export function LeadTable({ leads, onDelete, selectedLeads, onSelectionChange }: LeadTableProps) {
  if (leads.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No leads found.</div>
  }

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    onSelectionChange(checked === true ? leads.map((lead) => lead.id) : [])
  }

  const numSelected = selectedLeads.length
  const rowCount = leads.length

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={rowCount > 0 && numSelected === rowCount}
                onCheckedChange={handleSelectAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Last Contact</TableHead>
            <TableHead>Called By</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <LeadTableRow
              key={lead.id}
              lead={lead}
              onDelete={onDelete}
              isSelected={selectedLeads.includes(lead.id)}
              onSelectToggle={(leadId) => {
                const newSelected = selectedLeads.includes(leadId)
                  ? selectedLeads.filter((id) => id !== leadId)
                  : [...selectedLeads, leadId]
                onSelectionChange(newSelected)
              }}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}