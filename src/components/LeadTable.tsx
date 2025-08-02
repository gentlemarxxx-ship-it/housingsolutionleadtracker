import {
  Table, TableBody, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Lead } from "@/hooks/useLeads"
import { LeadTableRow } from "./LeadTableRow"

interface LeadTableProps {
  leads: Lead[]
  onUpdate: (id: string, updates: Partial<Lead>) => Promise<void>
  onDelete: (id: string) => Promise<void>
  remarkFilter?: string
}

export function LeadTable({ leads, onUpdate, onDelete, remarkFilter }: LeadTableProps) {
  const isLead2 = remarkFilter === 'Lead 2'

  if (leads.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No leads found.</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {isLead2 ? (
              <>
                <TableHead>Full Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Property Address</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Links</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </>
            ) : (
              <>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead>Last Contact</TableHead>
                <TableHead>Called By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <LeadTableRow
              key={lead.id}
              lead={lead}
              onUpdate={onUpdate}
              onDelete={onDelete}
              isLead2={isLead2}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}