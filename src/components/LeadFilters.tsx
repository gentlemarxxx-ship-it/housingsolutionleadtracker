import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Filter, X, Search } from "lucide-react"
import { LeadFilters as LeadFiltersType } from "@/hooks/useLeads"

interface LeadFiltersProps {
  onFilterChange: (filters: LeadFiltersType) => void
  calledByUsers: string[]
}

export function LeadFilters({ onFilterChange }: LeadFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<LeadFiltersType>({})

  const handleFilterChange = (key: keyof LeadFiltersType, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearAll = () => {
    setFilters({})
    onFilterChange({})
  }

  const hasActiveSpecificFilters = Object.entries(filters).some(
    ([key, value]) => key !== 'searchTerm' && value
  );

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="search-term"
            value={filters.searchTerm || ""}
            onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
            placeholder="Search by name, email, phone, etc..."
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Advanced Filters
            {hasActiveSpecificFilters && (
              <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                {Object.values(filters).filter((v, i) => Object.keys(filters)[i] !== 'searchTerm' && v).length}
              </span>
            )}
          </Button>
          
          {(hasActiveSpecificFilters || filters.searchTerm) && (
            <Button variant="ghost" size="sm" onClick={clearAll}>
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-lg bg-card">
          <div>
            <Label htmlFor="filter-firstname">First Name</Label>
            <Input
              id="filter-firstname"
              value={filters.firstname || ""}
              onChange={(e) => handleFilterChange("firstname", e.target.value)}
              placeholder="Filter by first name..."
            />
          </div>
          
          <div>
            <Label htmlFor="filter-lastname">Last Name</Label>
            <Input
              id="filter-lastname"
              value={filters.lastname || ""}
              onChange={(e) => handleFilterChange("lastname", e.target.value)}
              placeholder="Filter by last name..."
            />
          </div>
          
          <div>
            <Label htmlFor="filter-workphone">Work Phone</Label>
            <Input
              id="filter-workphone"
              value={filters.workphone || ""}
              onChange={(e) => handleFilterChange("workphone", e.target.value)}
              placeholder="Filter by work phone..."
            />
          </div>
          
          <div>
            <Label htmlFor="filter-cellphone1">Cell Phone 1</Label>
            <Input
              id="filter-cellphone1"
              value={filters.cellphone1 || ""}
              onChange={(e) => handleFilterChange("cellphone1", e.target.value)}
              placeholder="Filter by cell phone..."
            />
          </div>
          
          <div>
            <Label htmlFor="filter-homephone">Home Phone</Label>
            <Input
              id="filter-homephone"
              value={filters.homephone || ""}
              onChange={(e) => handleFilterChange("homephone", e.target.value)}
              placeholder="Filter by home phone..."
            />
          </div>
          
          <div>
            <Label htmlFor="filter-source">Source</Label>
            <Input
              id="filter-source"
              value={filters.source || ""}
              onChange={(e) => handleFilterChange("source", e.target.value)}
              placeholder="Filter by source..."
            />
          </div>
          
          <div>
            <Label htmlFor="filter-leadtype">Lead Type</Label>
            <Input
              id="filter-leadtype"
              value={filters.leadtype || ""}
              onChange={(e) => handleFilterChange("leadtype", e.target.value)}
              placeholder="Filter by lead type..."
            />
          </div>
          
          <div>
            <Label htmlFor="filter-remarks">Remarks</Label>
            <Select
              value={filters.remarks || ""}
              onValueChange={(value) => handleFilterChange("remarks", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All remarks" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All remarks</SelectItem>
                <SelectItem value="Leads">Leads</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Decline">Decline</SelectItem>
                <SelectItem value="No Answer">No Answer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="filter-calledby">Called By</Label>
            <Select
              value={filters.calledby || ""}
              onValueChange={(value) => handleFilterChange("calledby", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All users</SelectItem>
                <SelectItem value="Ian">Ian</SelectItem>
                <SelectItem value="Yhome">Yhome</SelectItem>
                <SelectItem value="Luisa">Luisa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  )
}