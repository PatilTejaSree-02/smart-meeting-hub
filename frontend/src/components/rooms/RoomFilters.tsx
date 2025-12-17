import { Calendar, Users, Building2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { RoomFilter } from '@/types';

interface RoomFiltersProps {
  filters: RoomFilter;
  onFilterChange: (filters: RoomFilter) => void;
}

export function RoomFilters({ filters, onFilterChange }: RoomFiltersProps) {
  const selectedDate = filters.date ? new Date(filters.date) : undefined;

  return (
    <div className="bg-card rounded-xl p-4 lg:p-6 shadow-md mb-6 animate-slide-up">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-accent" />
        <h2 className="font-heading font-semibold text-lg">Find a Room</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Date picker */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, 'PPP') : 'Select date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={(date) =>
                  onFilterChange({ ...filters, date: date?.toISOString().split('T')[0] })
                }
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Capacity */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Min. Capacity</Label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              placeholder="Any"
              className="pl-10"
              min={1}
              value={filters.capacity || ''}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  capacity: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
            />
          </div>
        </div>

        {/* Floor */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Floor</Label>
          <Select
            value={filters.floor?.toString() || 'all'}
            onValueChange={(value) =>
              onFilterChange({
                ...filters,
                floor: value === 'all' ? undefined : parseInt(value),
              })
            }
          >
            <SelectTrigger>
              <Building2 className="mr-2 h-4 w-4" />
              <SelectValue placeholder="All floors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All floors</SelectItem>
              <SelectItem value="1">Floor 1</SelectItem>
              <SelectItem value="2">Floor 2</SelectItem>
              <SelectItem value="3">Floor 3</SelectItem>
              <SelectItem value="4">Floor 4</SelectItem>
              <SelectItem value="5">Floor 5</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear filters */}
        <div className="flex items-end">
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => onFilterChange({})}
          >
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
