import { useState } from "react"
import {
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Phone, Mail, Save, XCircle, Link as LinkIcon } from "lucide-react"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Lead } from "@/hooks/useLeads"
import { Input } from "@/components/ui/input"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Constants } from "@/integrations/supabase/types"
import { Textarea } from "./ui/textarea"

interface LeadTableRowProps {
  lead: Lead
  onUpdate: (id: string, updates: Partial<Lead>) => Promise<void>
  onDelete: (id: string) => Promise<void>
  isLead2: boolean
}

const getRemarksBadgeVariant = (remarks: string | null) => {
  switch (remarks) {
    case "Approved": return "default"
    case "Decline": return "destructive"
    case "No Answer": return "secondary"
    default: return "outline"
  }
}

const formatDate = (dateString?: string | null) => {
  if (!dateString) return ""
  const date = new Date(dateString)
  const offset = date.getTimezoneOffset()
  const correctedDate = new Date(date.getTime() + offset * 60 * 1000)
  return correctedDate.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "2-digit" })
}

export function LeadTableRow({ lead, onUpdate, onDelete, isLead2 }: LeadTableRowProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedLeadData, setEditedLeadData] = useState<Partial<Lead>>(lead)

  const handleEditClick = () => {
    setIsEditing(true)
    setEditedLeadData(lead)
  }

  const handleCancelClick = () => {
    setIsEditing(false)
  }

  const handleSaveClick = async () => {
    const { id, created_at, updated_at, ...updatePayload } = editedLeadData as Lead
    await onUpdate(lead.id, updatePayload)
    setIsEditing(false)
  }

  const handleFieldChange = (field: keyof Omit<Lead, "id" | "created_at" | "updated_at">, value: string) => {
    setEditedLeadData({ ...editedLeadData, [field]: value || null })
  }

  if (isEditing) {
    return (
      <TableRow className="bg-secondary/50">
        {isLead2 ? (
          <>
            <TableCell>
              <Input value={editedLeadData.firstname || ""} onChange={(e) => handleFieldChange("firstname", e.target.value)} className="mb-1 h-8" placeholder="First Name" />
              <Input value={editedLeadData.lastname || ""} onChange={(e) => handleFieldChange("lastname", e.target.value)} className="h-8" placeholder="Last Name" />
            </TableCell>
            <TableCell>
              <Input type="email" value={editedLeadData.emailaddress || ""} onChange={(e) => handleFieldChange("emailaddress", e.target.value)} className="h-8 mb-1" placeholder="Email" />
              <Input value={editedLeadData.workphone || ""} onChange={(e) => handleFieldChange("workphone", e.target.value)} className="h-8" placeholder="Phone" />
            </TableCell>
            <TableCell>
              <Input value={editedLeadData.property_address || ""} onChange={(e) => handleFieldChange("property_address", e.target.value)} className="h-8 mb-1" placeholder="Property Address" />
              <div className="flex gap-1">
                <Input value={editedLeadData.city || ""} onChange={(e) => handleFieldChange("city", e.target.value)} className="h-8" placeholder="City" />
                <Input value={editedLeadData.state || ""} onChange={(e) => handleFieldChange("state", e.target.value)} className="h-8" placeholder="State" />
                <Input value={editedLeadData.zip_code || ""} onChange={(e) => handleFieldChange("zip_code", e.target.value)} className="h-8" placeholder="ZIP" />
              </div>
            </TableCell>
            <TableCell>
              <Input value={editedLeadData.source || ""} onChange={(e) => handleFieldChange("source", e.target.value)} className="h-8 mb-1" placeholder="Source" />
              <Input value={editedLeadData.leadtype || ""} onChange={(e) => handleFieldChange("leadtype", e.target.value)} className="h-8 mb-1" placeholder="Lead Type" />
              <Select value={editedLeadData.remarks || "Leads"} onValueChange={(value) => handleFieldChange("remarks", value)}>
                <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                <SelectContent>{Constants.public.Enums.lead_remarks.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
            </TableCell>
            <TableCell>
              <Textarea value={editedLeadData.link || ""} onChange={(e) => handleFieldChange("link", e.target.value)} placeholder="Links, comma-separated" />
            </TableCell>
          </>
        ) : (
          <>
            <TableCell>
              <Input value={editedLeadData.firstname || ""} onChange={(e) => handleFieldChange("firstname", e.target.value)} className="mb-1 h-8" placeholder="First Name" />
              <Input value={editedLeadData.lastname || ""} onChange={(e) => handleFieldChange("lastname", e.target.value)} className="h-8" placeholder="Last Name" />
            </TableCell>
            <TableCell>
              <Input type="email" value={editedLeadData.emailaddress || ""} onChange={(e) => handleFieldChange("emailaddress", e.target.value)} className="h-8 mb-1" placeholder="Email" />
              <Input value={editedLeadData.workphone || ""} onChange={(e) => handleFieldChange("workphone", e.target.value)} className="h-8 mb-1" placeholder="Work Phone" />
              <Input value={editedLeadData.cellphone1 || ""} onChange={(e) => handleFieldChange("cellphone1", e.target.value)} className="h-8" placeholder="Cell Phone" />
            </TableCell>
            <TableCell><Input value={editedLeadData.source || ""} onChange={(e) => handleFieldChange("source", e.target.value)} className="h-8" /></TableCell>
            <TableCell><Input value={editedLeadData.leadtype || ""} onChange={(e) => handleFieldChange("leadtype", e.target.value)} className="h-8" /></TableCell>
            <TableCell>
              <Select value={editedLeadData.remarks || "Leads"} onValueChange={(value) => handleFieldChange("remarks", value)}>
                <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                <SelectContent>{Constants.public.Enums.lead_remarks.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
            </TableCell>
            <TableCell><Input type="date" value={editedLeadData.lastcontact?.split("T")[0] || ""} onChange={(e) => handleFieldChange("lastcontact", e.target.value)} className="h-8" /></TableCell>
            <TableCell>
              <Select value={editedLeadData.calledby || ""} onValueChange={(value) => handleFieldChange("calledby", value)}>
                <SelectTrigger className="h-8"><SelectValue placeholder="Select user" /></SelectTrigger>
                <SelectContent><SelectItem value="Ian">Ian</SelectItem><SelectItem value="Yhome">Yhome</SelectItem><SelectItem value="Luisa">Luisa</SelectItem></SelectContent>
              </Select>
            </TableCell>
          </>
        )}
        <TableCell className="text-right align-top">
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="sm" onClick={handleSaveClick}><Save className="h-4 w-4" /></Button>
            <Button variant="ghost" size="sm" onClick={handleCancelClick}><XCircle className="h-4 w-4" /></Button>
          </div>
        </TableCell>
      </TableRow>
    )
  }

  return (
    <TableRow>
      {isLead2 ? (
        <>
          <TableCell className="font-medium">{lead.firstname} {lead.lastname}</TableCell>
          <TableCell>
            {lead.emailaddress && <div className="flex items-center gap-1 text-sm"><Mail className="h-3 w-3" /><a href={`mailto:${lead.emailaddress}`} className="text-primary hover:underline">{lead.emailaddress}</a></div>}
            {lead.workphone && <div className="flex items-center gap-1 text-sm"><Phone className="h-3 w-3" /><a href={`tel:${lead.workphone}`} className="text-primary hover:underline">{lead.workphone}</a></div>}
          </TableCell>
          <TableCell>
            <div>{lead.property_address}</div>
            <div className="text-sm text-muted-foreground">{lead.city}, {lead.state} {lead.zip_code}</div>
          </TableCell>
          <TableCell>
            <div><Badge variant={getRemarksBadgeVariant(lead.remarks)}>{lead.remarks}</Badge></div>
            <div className="text-sm text-muted-foreground mt-1">Src: {lead.source}</div>
            <div className="text-sm text-muted-foreground">Type: {lead.leadtype}</div>
          </TableCell>
          <TableCell>
            {lead.link?.split(',').map((link, i) => link.trim() && (
              <a key={i} href={link.trim().startsWith('http') ? link.trim() : `//${link.trim()}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline text-sm">
                <LinkIcon className="h-3 w-3" /> Link {i + 1}
              </a>
            ))}
          </TableCell>
        </>
      ) : (
        <>
          <TableCell className="font-medium">{lead.firstname} {lead.lastname}</TableCell>
          <TableCell>
            {lead.emailaddress && <div className="flex items-center gap-1 text-sm"><Mail className="h-3 w-3" /><a href={`mailto:${lead.emailaddress}`} className="text-primary hover:underline">{lead.emailaddress}</a></div>}
            {lead.workphone && <div className="flex items-center gap-1 text-sm"><Phone className="h-3 w-3" /><a href={`tel:${lead.workphone}`} className="text-primary hover:underline">{lead.workphone} (Work)</a></div>}
            {lead.cellphone1 && <div className="flex items-center gap-1 text-sm"><Phone className="h-3 w-3" /><a href={`tel:${lead.cellphone1}`} className="text-primary hover:underline">{lead.cellphone1} (Cell)</a></div>}
          </TableCell>
          <TableCell>{lead.source}</TableCell>
          <TableCell>{lead.leadtype}</TableCell>
          <TableCell><Badge variant={getRemarksBadgeVariant(lead.remarks)}>{lead.remarks}</Badge></TableCell>
          <TableCell>{formatDate(lead.lastcontact)}</TableCell>
          <TableCell>{lead.calledby}</TableCell>
        </>
      )}
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={handleEditClick}><Edit className="h-4 w-4" /></Button>
          <AlertDialog>
            <AlertDialogTrigger asChild><Button variant="ghost" size="sm"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>This will permanently delete the lead for {lead.firstname} {lead.lastname}.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(lead.id)}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  )
}