import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, X } from "lucide-react"
import { Lead, LeadFilters as LeadFiltersType } from "@/hooks/useLeads"

interface LeadFiltersProps {
  onFilterChange: (filters: LeadFiltersType) => void
  calledByUsers: string[]
  leads: Lead[]
}

export function LeadFilters({ onFilterChange, calledByUsers, leads }: LeadFiltersProps) {
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

  const sources = [...new Set(leads.map(lead => lead.source).filter(Boolean))] as string[]
  const leadTypes = [...new Set(leads.map(lead => lead.leadtype).filter(Boolean))] as string[]

  const hasActiveFilters = Object.values(filters).some(v => v)

  return (
    <div className="flex flex-col md:flex-row gap-2 items-center w-full">
      <div className="relative flex-grow w-full md:w-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={filters.searchTerm || ""}
          onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
          placeholder="Search leads..."
          className="pl-10"
        />
      </div>

      <Select value={filters.source || ""} onValueChange={(value) => handleFilterChange("source", value)}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="All Sources" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Sources</SelectItem>
          {sources.map(source => <SelectItem key={source} value={source}>{source}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={filters.leadtype || ""} onValueChange={(value) => handleFilterChange("leadtype", value)}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="All Lead Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Lead Types</SelectItem>
          {leadTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={filters.calledby || ""} onValueChange={(value) => handleFilterChange("calledby", value)}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="All Users" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Users</SelectItem>
          {calledByUsers.map(user => <SelectItem key={user} value={user}>{user}</SelectItem>)}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button variant="ghost" onClick={clearAll} className="w-full md:w-auto">
          <X className="h-4 w-4 mr-2" />
          Clear
        </Button>
      )}
    </div>
  )
}