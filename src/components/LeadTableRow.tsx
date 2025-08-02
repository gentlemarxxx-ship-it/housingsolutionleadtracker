import { useNavigate } from "react-router-dom"
import {
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Phone, Mail } from "lucide-react"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Lead } from "@/hooks/useLeads"

const formatDate = (dateString?: string | null) => {
  if (!dateString) return "N/A"
  const date = new Date(dateString)
  // Adjust for timezone offset to display the correct date
  const offset = date.getTimezoneOffset()
  const correctedDate = new Date(date.getTime() + offset * 60 * 1000)
  return correctedDate.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "2-digit" })
}

interface LeadTableRowProps {
  lead: Lead
  onDelete: (id: string) => Promise<void>
}

export function LeadTableRow({ lead, onDelete }: LeadTableRowProps) {
  const navigate = useNavigate()

  const handleNavigate = () => {
    navigate(`/lead/${lead.id}`)
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking delete
    onDelete(lead.id);
  }

  return (
    <TableRow onClick={handleNavigate} className="cursor-pointer hover:bg-muted/50">
      <TableCell className="font-medium">{lead.firstname} {lead.lastname}</TableCell>
      <TableCell>
        {lead.emailaddress && <div className="flex items-center gap-1 text-sm"><Mail className="h-3 w-3" />{lead.emailaddress}</div>}
        {lead.workphone && <div className="flex items-center gap-1 text-sm mt-1"><Phone className="h-3 w-3" />{lead.workphone}</div>}
        {lead.cellphone1 && <div className="flex items-center gap-1 text-sm mt-1"><Phone className="h-3 w-3" />{lead.cellphone1}</div>}
      </TableCell>
      <TableCell>{lead.source || "N/A"}</TableCell>
      <TableCell>{lead.leadtype || "N/A"}</TableCell>
      <TableCell>{formatDate(lead.lastcontact)}</TableCell>
      <TableCell>{lead.calledby || "N/A"}</TableCell>
      <TableCell className="text-right">
        <AlertDialog onOpenChange={(open) => open && event?.stopPropagation()}>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}><Trash2 className="h-4 w-4" /></Button>
          </AlertDialogTrigger>
          <AlertDialogContent onClick={(e) => e.stopPropagation()}>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>This will permanently delete the lead for {lead.firstname} {lead.lastname}.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteClick}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  )
}