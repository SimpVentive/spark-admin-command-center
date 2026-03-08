import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface ReportFilterValues {
  dateFrom?: Date;
  dateTo?: Date;
  department?: string;
  location?: string;
  program?: string;
}

interface ReportFiltersProps {
  filters: ReportFilterValues;
  onFiltersChange: (filters: ReportFilterValues) => void;
  departments?: string[];
  locations?: string[];
  programs?: string[];
  onExportPDF?: () => void;
  onExportExcel?: () => void;
  showDepartment?: boolean;
  showLocation?: boolean;
  showProgram?: boolean;
}

export function ReportFilters({
  filters,
  onFiltersChange,
  departments = [],
  locations = [],
  programs = [],
  onExportPDF,
  onExportExcel,
  showDepartment = true,
  showLocation = true,
  showProgram = false,
}: ReportFiltersProps) {
  const update = (partial: Partial<ReportFilterValues>) =>
    onFiltersChange({ ...filters, ...partial });

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-muted/30 rounded-lg border border-border">
      {/* Date From */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className={cn("w-[150px] justify-start text-left font-normal", !filters.dateFrom && "text-muted-foreground")}>
            <CalendarIcon className="mr-2 h-3 w-3" />
            {filters.dateFrom ? format(filters.dateFrom, "MMM d, yyyy") : "From date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={filters.dateFrom} onSelect={(d) => update({ dateFrom: d })} className={cn("p-3 pointer-events-auto")} />
        </PopoverContent>
      </Popover>

      {/* Date To */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className={cn("w-[150px] justify-start text-left font-normal", !filters.dateTo && "text-muted-foreground")}>
            <CalendarIcon className="mr-2 h-3 w-3" />
            {filters.dateTo ? format(filters.dateTo, "MMM d, yyyy") : "To date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={filters.dateTo} onSelect={(d) => update({ dateTo: d })} className={cn("p-3 pointer-events-auto")} />
        </PopoverContent>
      </Popover>

      {showDepartment && departments.length > 0 && (
        <Select value={filters.department || "all"} onValueChange={(v) => update({ department: v === "all" ? undefined : v })}>
          <SelectTrigger className="w-[160px] h-9 text-sm"><SelectValue placeholder="Department" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
      )}

      {showLocation && locations.length > 0 && (
        <Select value={filters.location || "all"} onValueChange={(v) => update({ location: v === "all" ? undefined : v })}>
          <SelectTrigger className="w-[160px] h-9 text-sm"><SelectValue placeholder="Location" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
          </SelectContent>
        </Select>
      )}

      {showProgram && programs.length > 0 && (
        <Select value={filters.program || "all"} onValueChange={(v) => update({ program: v === "all" ? undefined : v })}>
          <SelectTrigger className="w-[180px] h-9 text-sm"><SelectValue placeholder="Program" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Programs</SelectItem>
            {programs.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
      )}

      <div className="ml-auto flex items-center gap-2">
        {onExportPDF && (
          <Button variant="outline" size="sm" onClick={onExportPDF} className="gap-1.5">
            <FileText className="h-3.5 w-3.5" /> PDF
          </Button>
        )}
        {onExportExcel && (
          <Button variant="outline" size="sm" onClick={onExportExcel} className="gap-1.5">
            <FileSpreadsheet className="h-3.5 w-3.5" /> Excel
          </Button>
        )}
      </div>
    </div>
  );
}
