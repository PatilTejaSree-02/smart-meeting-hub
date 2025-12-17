import { format } from 'date-fns';
import { Calendar, Clock, Users, MapPin, MoreHorizontal, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Booking } from '@/types';
import { mockRooms } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface BookingTableProps {
  bookings: Booking[];
  onCancel?: (bookingId: string) => void;
  showRoom?: boolean;
}

export function BookingTable({ bookings, onCancel, showRoom = true }: BookingTableProps) {
  const getRoom = (roomId: string) => mockRooms.find((r) => r.id === roomId);

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success/10 text-success border-success/20';
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'cancelled':
        return 'bg-destructive/10 text-destructive border-destructive/20';
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-xl">
        <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
        <h3 className="font-medium text-lg mb-1">No bookings found</h3>
        <p className="text-muted-foreground text-sm">
          You haven't made any bookings yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl shadow-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-heading">Meeting</TableHead>
            {showRoom && <TableHead className="font-heading">Room</TableHead>}
            <TableHead className="font-heading">Date & Time</TableHead>
            <TableHead className="font-heading">Attendees</TableHead>
            <TableHead className="font-heading">Status</TableHead>
            <TableHead className="text-right font-heading">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking, index) => {
            const room = getRoom(booking.roomId);
            return (
              <TableRow
                key={booking.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TableCell className="font-medium">{booking.title}</TableCell>
                {showRoom && (
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={room?.image}
                          alt={room?.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{room?.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          Floor {room?.floor}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                )}
                <TableCell>
                  <div className="flex flex-col">
                    <span className="flex items-center gap-1.5 text-sm">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      {format(new Date(booking.date), 'MMM d, yyyy')}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {booking.startTime} - {booking.endTime}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-1.5 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    {booking.attendees}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn('capitalize', getStatusColor(booking.status))}
                  >
                    {booking.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Reschedule</DropdownMenuItem>
                      {booking.status !== 'cancelled' && onCancel && (
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => onCancel(booking.id)}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel Booking
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
