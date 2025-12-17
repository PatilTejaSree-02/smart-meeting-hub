import { useState } from 'react';
import { format } from 'date-fns';
import { Clock, Users, Calendar, MapPin, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Room } from '@/types';
import { timeSlots } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface BookingModalProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (booking: {
    roomId: string;
    date: string;
    startTime: string;
    endTime: string;
    title: string;
    attendees: number;
  }) => void;
}

export function BookingModal({ room, isOpen, onClose, onConfirm }: BookingModalProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [title, setTitle] = useState('');
  const [attendees, setAttendees] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  if (!room) return null;

  const handleSubmit = async () => {
    if (!date || !title) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    if (attendees > room.capacity) {
      toast({
        title: 'Too many attendees',
        description: `This room has a maximum capacity of ${room.capacity} people.`,
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    onConfirm({
      roomId: room.id,
      date: format(date, 'yyyy-MM-dd'),
      startTime,
      endTime,
      title,
      attendees,
    });

    setIsSubmitting(false);
    toast({
      title: 'Booking confirmed!',
      description: `${room.name} has been booked for ${format(date, 'PPP')}.`,
    });
    onClose();
  };

  const availableEndTimes = timeSlots.filter((slot) => slot > startTime);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
        {/* Room header */}
        <div className="relative h-40">
          <img
            src={room.image}
            alt={room.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6">
            <h2 className="font-heading font-bold text-2xl text-primary-foreground">
              {room.name}
            </h2>
            <div className="flex items-center gap-3 mt-1 text-primary-foreground/80 text-sm">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {room.capacity}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                Floor {room.floor}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <DialogHeader className="sr-only">
            <DialogTitle>Book {room.name}</DialogTitle>
            <DialogDescription>Fill in the details to book this room.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Meeting title */}
            <div className="space-y-2">
              <Label htmlFor="title">Meeting Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Weekly Team Standup"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label>Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time slots */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Select value={startTime} onValueChange={setStartTime}>
                  <SelectTrigger>
                    <Clock className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.slice(0, -1).map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>End Time</Label>
                <Select value={endTime} onValueChange={setEndTime}>
                  <SelectTrigger>
                    <Clock className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableEndTimes.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Attendees */}
            <div className="space-y-2">
              <Label htmlFor="attendees">Number of Attendees</Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="attendees"
                  type="number"
                  min={1}
                  max={room.capacity}
                  className="pl-10"
                  value={attendees}
                  onChange={(e) => setAttendees(parseInt(e.target.value) || 1)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Maximum capacity: {room.capacity} people
              </p>
            </div>

            {/* Amenities */}
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                Available Amenities
              </Label>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {room.amenities.map((amenity) => (
                  <Badge key={amenity} variant="secondary" className="text-xs">
                    <Check className="h-3 w-3 mr-1" />
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6 gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="accent" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Booking...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Confirm Booking
                </>
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
