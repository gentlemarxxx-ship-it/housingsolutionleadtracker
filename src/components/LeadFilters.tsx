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
import { Filter, X } from "lucide-react"
import { LeadFilters as LeadFiltersType } from "@/hooks/useLeads"
import { CalledByInput } from "./CalledByInput"

interface LeadFiltersProps {
  onFilterChange: (filters: LeadFiltersType) => void
  calledByUsers: string[]
}

export function LeadFilters({ onFilterChange, calledByUsers }: LeadFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<LeadFiltersType>({})

  const handleFilterChange = (key: keyof LeadFiltersType, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    setFilters({})
    onFilterChange({})
  }

  const hasActiveFilters = Object.values(filters).some(value => value)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
              {Object.values(filters).filter(Boolean).length}
            </span>
          )}
        </Button>
        
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear Filters
          </Button>
        )}
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
            <CalledByInput
              value={filters.calledby || ""}
              onChange={(value) => handleFilterChange("calledby", value)}
              suggestions={calledByUsers}
            />
          </div>
        </div>
      )}
    </div>
  )
}