import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Phone, Mail } from "lucide-react"
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
import { Lead } from "@/hooks/useLeads"
import { LeadForm } from "./LeadForm"

interface LeadTableProps {
  leads: Lead[]
  onUpdate: (id: string, updates: Partial<Lead>) => Promise<void>
  onDelete: (id: string) => Promise<void>
  calledByUsers: string[]
}

export function LeadTable({ leads, onUpdate, onDelete, calledByUsers }: LeadTableProps) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  const handleUpdate = async (updatedLead: Omit<Lead, "id" | "created_at" | "updated_at">) => {
    if (selectedLead) {
      await onUpdate(selectedLead.id, updatedLead)
      setSelectedLead(null)
    }
  }

  const getRemarksBadgeVariant = (remarks: string) => {
    switch (remarks) {
      case "Approved":
        return "default"
      case "Decline":
        return "destructive"
      case "No Answer":
        return "secondary"
      default:
        return "outline"
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit"
    })
  }

  if (leads.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No leads found. Add your first lead to get started.
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead>Last Contact</TableHead>
              <TableHead>Called By</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">
                  {lead.firstname} {lead.lastname}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {lead.emailaddress && (
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3" />
                        <a
                          href={`mailto:${lead.emailaddress}`}
                          className="text-primary hover:underline"
                        >
                          {lead.emailaddress}
                        </a>
                      </div>
                    )}
                    {lead.workphone && (
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3" />
                        <a
                          href={`tel:${lead.workphone}`}
                          className="text-primary hover:underline"
                        >
                          {lead.workphone} (Work)
                        </a>
                      </div>
                    )}
                    {lead.cellphone1 && (
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3" />
                        <a
                          href={`tel:${lead.cellphone1}`}
                          className="text-primary hover:underline"
                        >
                          {lead.cellphone1} (Cell)
                        </a>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{lead.source}</TableCell>
                <TableCell>{lead.leadtype}</TableCell>
                <TableCell>
                  <Badge variant={getRemarksBadgeVariant(lead.remarks)}>
                    {lead.remarks}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(lead.lastcontact)}</TableCell>
                <TableCell>{lead.calledby}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <LeadForm
                      lead={lead}
                      title="Edit Lead"
                      onSubmit={handleUpdate}
                      calledByUsers={calledByUsers}
                      trigger={
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedLead(lead)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the lead
                            for {lead.firstname} {lead.lastname}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(lead.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}