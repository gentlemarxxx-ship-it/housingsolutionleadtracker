import { useParams, useNavigate } from "react-router-dom"
import { useLeadDetail } from "@/hooks/useLeadDetail"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Constants } from "@/integrations/supabase/types"
import { ArrowLeft } from "lucide-react"
import { EditableField } from "@/components/EditableField"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { NotesSection } from "@/components/NotesSection"
import { useUser } from "@/contexts/UserContext"
import { useLeadNotes } from "@/hooks/useLeadNotes"

const formatDate = (dateString?: string | null) => {
  if (!dateString) return null
  try {
    return new Date(dateString.split('T')[0]).toISOString().split('T')[0]
  } catch (e) {
    return null
  }
}

export function LeadDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { currentUser } = useUser()
  const { lead, loading, updateLead } = useLeadDetail(id)
  const notesHook = useLeadNotes(id)

  const handleUpdate = (field: string) => async (value: string) => {
    await updateLead({ [field]: value || null })
  }

  const handleAddNote = async (content: string) => {
    if (!currentUser) return;
    await notesHook.addNote(content, currentUser);
    await updateLead({ 
      calledby: currentUser, 
      lastcontact: new Date().toISOString().split('T')[0] 
    });
  };

  const getRemarkOptions = () => {
    if (!lead) return Constants.public.Enums.lead_remarks;
    const lead1Options = ['Lead 1', 'Approved', 'Decline', 'No Answer'];
    const lead2Options = ['Lead 2', 'Approved', 'Decline', 'No Answer'];
    const isLead2Type = lead.remarks === 'Lead 2' || 
                        (lead.remarks !== 'Lead 1' && (
                            lead.property_address || 
                            lead.city || 
                            lead.state || 
                            lead.zip_code || 
                            lead.link
                        ));
    return isLead2Type ? lead2Options : lead1Options;
  };

  if (loading) {
    return <LeadDetailSkeleton />
  }

  if (!lead) {
    return (
      <div className="text-center">
        <p>Lead not found.</p>
        <Button variant="outline" onClick={() => navigate(-1)} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Leads
        </Button>
      </div>
    )
  }

  const remarkOptions = getRemarkOptions();
  const fullName = `${lead.firstname || ""} ${lead.lastname || ""}`.trim()

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 -ml-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Leads
        </Button>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{fullName}</h1>
          <EditableField
            value={lead.remarks}
            onSave={handleUpdate("remarks")}
            type="select"
            selectOptions={remarkOptions}
            className="w-[180px]"
          >
            <Badge variant="outline" className="text-base px-3 py-1">{lead.remarks}</Badge>
          </EditableField>
        </div>
        <p className="text-muted-foreground">Lead details and information overview.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <EditableField label="First Name" value={lead.firstname} onSave={handleUpdate("firstname")} />
              <EditableField label="Last Name" value={lead.lastname} onSave={handleUpdate("lastname")} />
              <EditableField label="Email" value={lead.emailaddress} onSave={handleUpdate("emailaddress")} type="email" />
              <EditableField label="Work Phone" value={lead.workphone} onSave={handleUpdate("workphone")} />
              <EditableField label="Cell Phone 1" value={lead.cellphone1} onSave={handleUpdate("cellphone1")} />
              <EditableField label="Home Phone" value={lead.homephone} onSave={handleUpdate("homephone")} />
              <EditableField label="Cell Phone 2" value={lead.cellphone2} onSave={handleUpdate("cellphone2")} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Property Address</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <EditableField label="Address" value={lead.property_address} onSave={handleUpdate("property_address")} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                <EditableField label="City" value={lead.city} onSave={handleUpdate("city")} />
                <EditableField label="State" value={lead.state} onSave={handleUpdate("state")} />
                <EditableField label="ZIP Code" value={lead.zip_code} onSave={handleUpdate("zip_code")} />
              </div>
            </CardContent>
          </Card>

          <NotesSection leadId={lead.id} onAddNote={handleAddNote} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Lead Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <EditableField label="Source" value={lead.source} onSave={handleUpdate("source")} />
              <EditableField label="Lead Type" value={lead.leadtype} onSave={handleUpdate("leadtype")} />
              <EditableField
                label="Called By"
                value={lead.calledby}
                onSave={handleUpdate("calledby")}
                type="select"
                selectOptions={["Ian", "Yhome", "Luisa"]}
              />
              <EditableField
                label="Last Contact Date"
                value={formatDate(lead.lastcontact)}
                onSave={handleUpdate("lastcontact")}
                type="date"
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Links</CardTitle></CardHeader>
            <CardContent>
              <EditableField
                label="Links (comma-separated)"
                value={lead.link}
                onSave={handleUpdate("link")}
                type="textarea"
              >
                {lead.link ? (
                  <div className="flex flex-wrap gap-2">
                    {lead.link.split(',').map(l => l.trim()).filter(Boolean).map((link, index) => {
                      const href = /^(http|https)s?:\/\//.test(link) ? link : `https://${link}`;
                      return (
                        <a
                          key={index}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Badge variant="secondary" className="hover:bg-muted">
                            {link}
                          </Badge>
                        </a>
                      )
                    })}
                  </div>
                ) : (
                  <span className="text-muted-foreground italic">Not set</span>
                )}
              </EditableField>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function LeadDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <Skeleton className="h-8 w-40 mb-4" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-5 w-80 mt-2" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(7)].map((_, i) => <div key={i}><Skeleton className="h-5 w-24 mb-2" /><Skeleton className="h-9 w-full" /></div>)}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
            <CardContent className="space-y-4">
              <div><Skeleton className="h-5 w-24 mb-2" /><Skeleton className="h-9 w-full" /></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => <div key={i}><Skeleton className="h-5 w-20 mb-2" /><Skeleton className="h-9 w-full" /></div>)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><Skeleton className="h-6 w-24" /></CardHeader>
            <CardContent>
              <Skeleton className="h-60 w-full" />
              <div className="mt-4 space-y-2">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-24" />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
            <CardContent className="space-y-6">
              {[...Array(4)].map((_, i) => <div key={i}><Skeleton className="h-5 w-24 mb-2" /><Skeleton className="h-9 w-full" /></div>)}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><Skeleton className="h-6 w-24" /></CardHeader>
            <CardContent>
              <Skeleton className="h-5 w-40 mb-2" />
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}