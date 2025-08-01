import { useState, useRef } from "react"
import { Button, buttonVariants } from "@/components/ui/button"
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
import { Upload, FileText, Download } from "lucide-react"
import { Lead, LeadRemark } from "@/hooks/useLeads"
import Papa from "papaparse"
import { useToast } from "@/hooks/use-toast"
import { Constants } from "@/integrations/supabase/types"
import { cn } from "@/lib/utils"

type LeadImport = Omit<Lead, "id" | "created_at" | "updated_at">

interface ImportLeadsDialogProps {
  onImport: (leads: LeadImport[]) => Promise<void>
  remarkFilter?: string
}

const HEADER_MAPPING: { [key: string]: keyof LeadImport } = {
  "First Name": "firstname",
  "Last Name": "lastname",
  "Last Contact": "lastcontact",
  "Called by": "calledby",
  "Phone": "workphone",
  "Email": "emailaddress",
  "Property Address": "property_address",
  "City": "city",
  "State": "state",
  "ZIP Code": "zip_code",
  "Source": "source",
  "Lead Type": "leadtype",
  "Remarks": "remarks",
  "Link": "link",
};

const REQUIRED_COLUMNS = ["First Name", "Last Name"];
const OPTIONAL_COLUMNS = Object.keys(HEADER_MAPPING).filter(h => !REQUIRED_COLUMNS.includes(h));

export function ImportLeadsDialog({ onImport, remarkFilter }: ImportLeadsDialogProps) {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const { toast } = useToast()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
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
        const missingColumns = REQUIRED_COLUMNS.filter(col => !headers.includes(col))

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
                (lead as any)[internalField] = row[userHeader];
              }
            }

            if (!lead.remarks || !(Constants.public.Enums.lead_remarks as readonly string[]).includes(lead.remarks)) {
              lead.remarks = (remarkFilter || "Lead 1") as LeadRemark
            }

            return lead
          })
          .filter(lead => lead.firstname && lead.lastname) as LeadImport[]

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
            Upload a CSV file to bulk-add leads. Download the template to ensure the format is correct.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>CSV File</Label>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
                Choose File
              </Button>
              <div className="flex-1 text-sm text-muted-foreground p-2 border border-dashed rounded-md h-10 flex items-center">
                <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">{file?.name || "No file selected"}</span>
              </div>
            </div>
            <Input
              ref={inputRef}
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            <a
              href="/lead_template.csv"
              download="lead_template.csv"
              className={cn(buttonVariants({ variant: "link" }), "p-0 h-auto flex items-center gap-2")}
            >
              <Download className="h-4 w-4" />
              Download Template
            </a>
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