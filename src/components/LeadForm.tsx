import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { Lead } from "@/hooks/useLeads"
import { CalledByInput } from "./CalledByInput"

interface LeadFormProps {
  onSubmit: (lead: Omit<Lead, "id" | "created_at" | "updated_at">) => Promise<void>
  calledByUsers: string[]
  trigger?: React.ReactNode
  lead?: Lead
  title?: string
}

export function LeadForm({ onSubmit, calledByUsers, trigger, lead, title = "Add New Lead" }: LeadFormProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    firstname: lead?.firstname || "",
    lastname: lead?.lastname || "",
    emailaddress: lead?.emailaddress || "",
    workphone: lead?.workphone || "",
    cellphone1: lead?.cellphone1 || "",
    homephone: lead?.homephone || "",
    cellphone2: lead?.cellphone2 || "",
    source: lead?.source || "",
    leadtype: lead?.leadtype || "",
    remarks: lead?.remarks || "Leads" as const,
    lastcontact: lead?.lastcontact || "",
    calledby: lead?.calledby || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await onSubmit(formData)
      setOpen(false)
      if (!lead) {
        setFormData({
          firstname: "",
          lastname: "",
          emailaddress: "",
          workphone: "",
          cellphone1: "",
          homephone: "",
          cellphone2: "",
          source: "",
          leadtype: "",
          remarks: "Leads",
          lastcontact: "",
          calledby: "",
        })
      }
    } catch (error) {
      // Error is handled in the hook
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstname">First Name *</Label>
              <Input
                id="firstname"
                value={formData.firstname}
                onChange={(e) => setFormData({...formData, firstname: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastname">Last Name *</Label>
              <Input
                id="lastname"
                value={formData.lastname}
                onChange={(e) => setFormData({...formData, lastname: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="emailaddress">Email Address</Label>
            <Input
              id="emailaddress"
              type="email"
              value={formData.emailaddress}
              onChange={(e) => setFormData({...formData, emailaddress: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="workphone">Work Phone</Label>
              <Input
                id="workphone"
                value={formData.workphone}
                onChange={(e) => setFormData({...formData, workphone: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="cellphone1">Cell Phone 1</Label>
              <Input
                id="cellphone1"
                value={formData.cellphone1}
                onChange={(e) => setFormData({...formData, cellphone1: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="homephone">Home Phone</Label>
              <Input
                id="homephone"
                value={formData.homephone}
                onChange={(e) => setFormData({...formData, homephone: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="cellphone2">Cell Phone 2</Label>
              <Input
                id="cellphone2"
                value={formData.cellphone2}
                onChange={(e) => setFormData({...formData, cellphone2: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                value={formData.source}
                onChange={(e) => setFormData({...formData, source: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="leadtype">Lead Type</Label>
              <Input
                id="leadtype"
                value={formData.leadtype}
                onChange={(e) => setFormData({...formData, leadtype: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="remarks">Remarks</Label>
              <Select
                value={formData.remarks}
                onValueChange={(value: "Leads" | "Approved" | "Decline" | "No Answer") =>
                  setFormData({...formData, remarks: value})
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Leads">Leads</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Decline">Decline</SelectItem>
                  <SelectItem value="No Answer">No Answer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="lastcontact">Last Contact</Label>
              <Input
                id="lastcontact"
                type="date"
                value={formData.lastcontact}
                onChange={(e) => setFormData({...formData, lastcontact: e.target.value})}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="calledby">Called By</Label>
            <CalledByInput
              value={formData.calledby}
              onChange={(value) => setFormData({...formData, calledby: value})}
              suggestions={calledByUsers}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {lead ? "Update" : "Add"} Lead
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}