import {
  Table, TableBody, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Lead } from "@/hooks/useLeads"
import { LeadTableRow } from "./LeadTableRow"

interface LeadTableProps {
  leads: Lead[]
  onDelete: (id: string) => Promise<void>
}

export function LeadTable({ leads, onDelete }: LeadTableProps) {
  if (leads.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No leads found.</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
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
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}