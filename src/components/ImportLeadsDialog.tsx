import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Upload } from "lucide-react"
import { Lead, LeadRemark } from "@/hooks/useLeads"
import Papa from "papaparse"
import { useToast } from "@/hooks/use-toast"
import { Constants } from "@/integrations/supabase/types"

type LeadImport = Omit<Lead, "id" | "created_at" | "updated_at">

interface ImportLeadsDialogProps {
  onImport: (leads: LeadImport[]) => Promise<void>
  remarkFilter?: string
}

const HEADER_MAPPING_LEAD1: { [key: string]: keyof LeadImport } = {
  "First Name": "firstname", "Last Name": "lastname", "Email": "emailaddress", "Work Phone": "workphone",
  "Cell Phone 1": "cellphone1", "Home Phone": "homephone", "Cell Phone 2": "cellphone2", "Source": "source",
  "Lead Type": "leadtype", "Remarks": "remarks", "Last Contact": "lastcontact", "Called by": "calledby",
};
const REQUIRED_COLUMNS_LEAD1 = ["First Name", "Last Name"];
const OPTIONAL_COLUMNS_LEAD1 = Object.keys(HEADER_MAPPING_LEAD1).filter(h => !REQUIRED_COLUMNS_LEAD1.includes(h));

const HEADER_MAPPING_LEAD2: { [key: string]: keyof LeadImport | "fullname" } = {
    "Last Contact": "lastcontact", "Called by": "calledby", "Full Name": "fullname", "Phone": "workphone",
    "Email": "emailaddress", "Property Address": "property_address", "City": "city", "State": "state",
    "ZIP Code": "zip_code", "Source": "source", "Lead Type": "leadtype", "Remarks": "remarks", "Link": "link",
};
const REQUIRED_COLUMNS_LEAD2 = ["Full Name"];
const OPTIONAL_COLUMNS_LEAD2 = Object.keys(HEADER_MAPPING_LEAD2).filter(h => !REQUIRED_COLUMNS_LEAD2.includes(h));


export function ImportLeadsDialog({ onImport, remarkFilter }: ImportLeadsDialogProps) {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const { toast } = useToast()

  const isLead2 = remarkFilter === 'Lead 2'
  const HEADER_MAPPING = isLead2 ? HEADER_MAPPING_LEAD2 : HEADER_MAPPING_LEAD1;
  const USER_REQUIRED_COLUMNS = isLead2 ? REQUIRED_COLUMNS_LEAD2 : REQUIRED_COLUMNS_LEAD1;
  const USER_OPTIONAL_COLUMNS = isLead2 ? OPTIONAL_COLUMNS_LEAD2 : OPTIONAL_COLUMNS_LEAD1;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleImport = () => {
    if (!file) {
      toast({ title: "No file selected", description: "Please select a CSV file to import.", variant: "destructive" })
      return
    }

    setIsImporting(true)

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const headers = results.meta.fields || []
        const missingColumns = USER_REQUIRED_COLUMNS.filter(col => !headers.includes(col))

        if (missingColumns.length > 0) {
          toast({ title: "Invalid CSV format", description: `Missing required columns: ${missingColumns.join(", ")}`, variant: "destructive" })
          setIsImporting(false)
          return
        }

        const leadsToImport = results.data
          .map((row: any) => {
            const lead: Partial<LeadImport> = {}
            for (const userHeader in HEADER_MAPPING) {
              if (row[userHeader] !== undefined && row[userHeader] !== null && row[userHeader] !== '') {
                const internalField = HEADER_MAPPING[userHeader as keyof typeof HEADER_MAPPING];
                if (internalField !== 'fullname') {
                    (lead as any)[internalField] = row[userHeader];
                }
              }
            }
            
            if (isLead2 && row['Full Name']) {
                const fullName = String(row['Full Name']).trim();
                const spaceIndex = fullName.lastIndexOf(' ');
                if (spaceIndex > 0 && spaceIndex < fullName.length -1) {
                    lead.firstname = fullName.substring(0, spaceIndex);
                    lead.lastname = fullName.substring(spaceIndex + 1);
                } else {
                    lead.firstname = fullName;
                    lead.lastname = "";
                }
            }

            if (!lead.remarks || !(Constants.public.Enums.lead_remarks as readonly string[]).includes(lead.remarks)) {
              lead.remarks = (remarkFilter || "Lead 1") as LeadRemark
            }

            return lead
          })
          .filter(lead => lead.firstname) as LeadImport[]

        if (leadsToImport.length === 0) {
          toast({ title: "No leads to import", description: "The selected file is empty or does not contain valid lead data.", variant: "destructive" })
          setIsImporting(false)
          return
        }

        try {
          await onImport(leadsToImport)
          setOpen(false)
          setFile(null)
        } catch (error) {
          // Error toast is handled in useLeads
        } finally {
          setIsImporting(false)
        }
      },
      error: (error) => {
        console.error("Error parsing CSV:", error)
        toast({ title: "CSV Parsing Error", description: "There was an error parsing your file. Please ensure it's a valid CSV.", variant: "destructive" })
        setIsImporting(false)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Import CSV
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Leads from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file to bulk-add leads. The file must contain the required columns.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="csv-file">CSV File</Label>
            <Input id="csv-file" type="file" accept=".csv" onChange={handleFileChange} />
          </div>
          <div className="text-sm text-muted-foreground">
            <p className="font-medium">Expected Columns:</p>
            <p><strong>Required:</strong> {USER_REQUIRED_COLUMNS.join(", ")}</p>
            <p><strong>Optional:</strong> {USER_OPTIONAL_COLUMNS.join(", ")}</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleImport} disabled={!file || isImporting}>
            {isImporting ? "Importing..." : "Import Leads"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}