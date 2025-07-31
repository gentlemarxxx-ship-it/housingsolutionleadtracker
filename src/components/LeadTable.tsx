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
import { Edit, Trash2, Phone, Mail, Save, XCircle } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CalledByInput } from "./CalledByInput"

interface LeadTableProps {
  leads: Lead[]
  onUpdate: (id: string, updates: Partial<Lead>) => Promise<void>
  onDelete: (id: string) => Promise<void>
  calledByUsers: string[]
}

export function LeadTable({ leads, onUpdate, onDelete, calledByUsers }: LeadTableProps) {
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null)
  const [editedLeadData, setEditedLeadData] = useState<Partial<Lead> | null>(null)

  const handleEditClick = (lead: Lead) => {
    setEditingLeadId(lead.id)
    setEditedLeadData(lead)
  }

  const handleCancelClick = () => {
    setEditingLeadId(null)
    setEditedLeadData(null)
  }

  const handleSaveClick = async () => {
    if (editingLeadId && editedLeadData) {
      const { id, created_at, updated_at, ...updatePayload } = editedLeadData as Lead
      await onUpdate(editingLeadId, updatePayload)
      setEditingLeadId(null)
      setEditedLeadData(null)
    }
  }

  const handleFieldChange = (field: keyof Omit<Lead, "id" | "created_at" | "updated_at">, value: string) => {
    if (editedLeadData) {
      setEditedLeadData({ ...editedLeadData, [field]: value || null })
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
    // Handles both 'YYYY-MM-DD' and full ISO strings
    const date = new Date(dateString)
    // Add timezone offset to prevent date from shifting
    const offset = date.getTimezoneOffset()
    const correctedDate = new Date(date.getTime() + offset * 60 * 1000)
    return correctedDate.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
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
            {leads.map((lead) =>
              editingLeadId === lead.id && editedLeadData ? (
                <TableRow key={lead.id} className="bg-secondary/50">
                  <TableCell>
                    <Input
                      value={editedLeadData.firstname || ""}
                      onChange={(e) => handleFieldChange("firstname", e.target.value)}
                      className="mb-1 h-8"
                      placeholder="First Name"
                    />
                    <Input
                      value={editedLeadData.lastname || ""}
                      onChange={(e) => handleFieldChange("lastname", e.target.value)}
                      className="h-8"
                      placeholder="Last Name"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Input
                        type="email"
                        value={editedLeadData.emailaddress || ""}
                        onChange={(e) => handleFieldChange("emailaddress", e.target.value)}
                        className="h-8"
                        placeholder="Email"
                      />
                       <Input
                        value={editedLeadData.workphone || ""}
                        onChange={(e) => handleFieldChange("workphone", e.target.value)}
                        className="h-8"
                        placeholder="Work Phone"
                      />
                       <Input
                        value={editedLeadData.cellphone1 || ""}
                        onChange={(e) => handleFieldChange("cellphone1", e.target.value)}
                        className="h-8"
                        placeholder="Cell Phone"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input
                      value={editedLeadData.source || ""}
                      onChange={(e) => handleFieldChange("source", e.target.value)}
                      className="h-8"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={editedLeadData.leadtype || ""}
                      onChange={(e) => handleFieldChange("leadtype", e.target.value)}
                      className="h-8"
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={editedLeadData.remarks}
                      onValueChange={(value) => handleFieldChange("remarks", value)}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Leads">Leads</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Decline">Decline</SelectItem>
                        <SelectItem value="No Answer">No Answer</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="date"
                      value={editedLeadData.lastcontact?.split("T")[0] || ""}
                      onChange={(e) => handleFieldChange("lastcontact", e.target.value)}
                      className="h-8"
                    />
                  </TableCell>
                  <TableCell>
                    <CalledByInput
                      value={editedLeadData.calledby || ""}
                      onChange={(value) => handleFieldChange("calledby", value)}
                      suggestions={calledByUsers}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={handleSaveClick}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleCancelClick}>
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
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
                      <Button variant="ghost" size="sm" onClick={() => handleEditClick(lead)}>
                        <Edit className="h-4 w-4" />
                      </Button>
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
              )
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}