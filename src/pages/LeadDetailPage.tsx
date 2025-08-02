import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useLeadDetail } from "@/hooks/useLeadDetail"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Constants } from "@/integrations/supabase/types"
import { ArrowLeft } from "lucide-react"

const leadSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  emailaddress: z.string().email().nullable().optional(),
  workphone: z.string().nullable().optional(),
  cellphone1: z.string().nullable().optional(),
  homephone: z.string().nullable().optional(),
  cellphone2: z.string().nullable().optional(),
  property_address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  zip_code: z.string().nullable().optional(),
  source: z.string().nullable().optional(),
  leadtype: z.string().nullable().optional(),
  remarks: z.enum(Constants.public.Enums.lead_remarks).nullable().optional(),
  lastcontact: z.string().nullable().optional(),
  calledby: z.string().nullable().optional(),
  link: z.string().nullable().optional(),
})

export function LeadDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { lead, loading, updateLead } = useLeadDetail(id)

  const form = useForm<z.infer<typeof leadSchema>>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      emailaddress: "",
      workphone: "",
      cellphone1: "",
      homephone: "",
      cellphone2: "",
      property_address: "",
      city: "",
      state: "",
      zip_code: "",
      source: "",
      leadtype: "",
      remarks: "Leads",
      lastcontact: "",
      calledby: "",
      link: "",
    },
  })

  useEffect(() => {
    if (lead) {
      form.reset({
        ...lead,
        lastcontact: lead.lastcontact ? lead.lastcontact.split("T")[0] : "",
      })
    }
  }, [lead, form])

  const onSubmit = async (values: z.infer<typeof leadSchema>) => {
    await updateLead(values)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!lead) {
    return <div>Lead not found.</div>
  }

  return (
    <div className="space-y-6">
       <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Leads
      </Button>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Edit Lead: {lead.firstname} {lead.lastname}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>First Name</Label><Input {...form.register("firstname")} />{form.formState.errors.firstname && <p className="text-red-500 text-sm">{form.formState.errors.firstname.message}</p>}</div>
                <div><Label>Last Name</Label><Input {...form.register("lastname")} />{form.formState.errors.lastname && <p className="text-red-500 text-sm">{form.formState.errors.lastname.message}</p>}</div>
                <div><Label>Email</Label><Input type="email" {...form.register("emailaddress")} /></div>
                <div><Label>Work Phone</Label><Input {...form.register("workphone")} /></div>
                <div><Label>Cell Phone 1</Label><Input {...form.register("cellphone1")} /></div>
                <div><Label>Home Phone</Label><Input {...form.register("homephone")} /></div>
                <div><Label>Cell Phone 2</Label><Input {...form.register("cellphone2")} /></div>
              </div>
            </div>

            {/* Address Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Property Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2"><Label>Address</Label><Input {...form.register("property_address")} /></div>
                <div><Label>City</Label><Input {...form.register("city")} /></div>
                <div><Label>State</Label><Input {...form.register("state")} /></div>
                <div><Label>ZIP Code</Label><Input {...form.register("zip_code")} /></div>
              </div>
            </div>

            {/* Lead Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Lead Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Source</Label><Input {...form.register("source")} /></div>
                <div><Label>Lead Type</Label><Input {...form.register("leadtype")} /></div>
                <div>
                  <Label>Remarks</Label>
                  <Controller name="remarks" control={form.control} render={({ field }) => (
                    <Select value={field.value || ""} onValueChange={field.onChange}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
                      {Constants.public.Enums.lead_remarks.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent></Select>
                  )} />
                </div>
                <div><Label>Last Contact Date</Label><Input type="date" {...form.register("lastcontact")} /></div>
                <div>
                  <Label>Called By</Label>
                  <Controller name="calledby" control={form.control} render={({ field }) => (
                    <Select value={field.value || ""} onValueChange={field.onChange}><SelectTrigger><SelectValue placeholder="Select user" /></SelectTrigger><SelectContent>
                      <SelectItem value="Ian">Ian</SelectItem><SelectItem value="Yhome">Yhome</SelectItem><SelectItem value="Luisa">Luisa</SelectItem>
                    </SelectContent></Select>
                  )} />
                </div>
                <div className="md:col-span-2"><Label>Links (comma-separated)</Label><Textarea {...form.register("link")} /></div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}