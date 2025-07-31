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
import { Lead } from "@/hooks/useLeads"
import Papa from "papaparse"
import { useToast } from "@/hooks/use-toast"

interface ImportLeadsDialogProps {
  onImport: (leads: Omit<Lead, "id" | "created_at" | "updated_at">[]) => Promise<void>
}

const REQUIRED_COLUMNS = ["firstname", "lastname"]
const OPTIONAL_COLUMNS = [
  "emailaddress", "workphone", "cellphone1", "homephone", "cellphone2",
  "source", "leadtype", "remarks", "lastcontact", "calledby"
]
const ALL_COLUMNS = [...REQUIRED_COLUMNS, ...OPTIONAL_COLUMNS]

export function ImportLeadsDialog({ onImport }: ImportLeadsDialogProps) {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleImport = () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to import.",
        variant: "destructive",
      })
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
          toast({
            title: "Invalid CSV format",
            description: `Missing required columns: ${missingColumns.join(", ")}`,
            variant: "destructive",
          })
          setIsImporting(false)
          return
        }

        const leadsToImport = results.data
          .map((row: any) => {
            const lead: any = {}
            for (const col of ALL_COLUMNS) {
              if (row[col] !== undefined && row[col] !== null && row[col] !== '') {
                lead[col] = row[col]
              }
            }
            // Set default remarks if not provided
            if (!lead.remarks) {
              lead.remarks = "Leads"
            }
            return lead
          })
          .filter(lead => lead.firstname && lead.lastname) // Ensure required fields are present

        if (leadsToImport.length === 0) {
          toast({
            title: "No leads to import",
            description: "The selected file is empty or does not contain valid lead data.",
            variant: "destructive",
          })
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
        toast({
          title: "CSV Parsing Error",
          description: "There was an error parsing your file. Please ensure it's a valid CSV.",
          variant: "destructive",
        })
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
            Upload a CSV file to bulk-add leads. The file must contain 'firstname' and 'lastname' columns.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="csv-file">CSV File</Label>
            <Input id="csv-file" type="file" accept=".csv" onChange={handleFileChange} />
          </div>
          <div className="text-sm text-muted-foreground">
            <p className="font-medium">Expected Columns:</p>
            <p><strong>Required:</strong> {REQUIRED_COLUMNS.join(", ")}</p>
            <p><strong>Optional:</strong> {OPTIONAL_COLUMNS.join(", ")}</p>
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