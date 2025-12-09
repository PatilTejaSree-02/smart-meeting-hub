import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Search, Filter, Calendar, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { mockBookings, mockRooms, mockUsers } from '@/data/mockData';
import { Booking } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRoom, setFilterRoom] = useState<string>('all');
  const [filterUser, setFilterUser] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<Date | undefined>();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const { toast } = useToast();

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const room = mockRooms.find((r) => r.id === booking.roomId);
      const user = mockUsers.find((u) => u.id === booking.userId);

      const matchesSearch =
        booking.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user?.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRoom = filterRoom === 'all' || booking.roomId === filterRoom;
      const matchesUser = filterUser === 'all' || booking.userId === filterUser;
      const matchesDate = !filterDate || booking.date === format(filterDate, 'yyyy-MM-dd');

      return matchesSearch && matchesRoom && matchesUser && matchesDate;
    });
  }, [bookings, searchQuery, filterRoom, filterUser, filterDate]);

  const handleCancelBooking = () => {
    if (!selectedBooking || !cancellationReason.trim()) {
      toast({
        title: 'Reason Required',
        description: 'Please provide a reason for cancellation.',
        variant: 'destructive',
      });
      return;
    }

    setBookings((prev) =>
      prev.map((b) =>
        b.id === selectedBooking.id
          ? { ...b, status: 'cancelled' as const, cancellationReason }
          : b
      )
    );

    toast({
      title: 'Booking Cancelled',
      description: `Booking "${selectedBooking.title}" has been cancelled.`,
    });

    setCancelDialogOpen(false);
    setSelectedBooking(null);
    setCancellationReason('');
  };

  const openCancelDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setCancelDialogOpen(true);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterRoom('all');
    setFilterUser('all');
    setFilterDate(undefined);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      confirmed: 'bg-success/10 text-success border-success/20',
      pending: 'bg-warning/10 text-warning border-warning/20',
      cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
    };
    return variants[status as keyof typeof variants] || '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl lg:text-3xl font-bold">
          All Bookings
        </h1>
        <p className="text-muted-foreground mt-1">
          View and manage all room bookings across the organization.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl p-4 shadow-md space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="h-4 w-4 text-accent" />
          <span className="font-medium text-sm">Filters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, room, or user..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Room filter */}
          <Select value={filterRoom} onValueChange={setFilterRoom}>
            <SelectTrigger>
              <SelectValue placeholder="All Rooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rooms</SelectItem>
              {mockRooms.map((room) => (
                <SelectItem key={room.id} value={room.id}>
                  {room.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* User filter */}
          <Select value={filterUser} onValueChange={setFilterUser}>
            <SelectTrigger>
              <SelectValue placeholder="All Users" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              {mockUsers.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !filterDate && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {filterDate ? format(filterDate, 'PP') : 'Pick date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={filterDate}
                onSelect={setFilterDate}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Active filters */}
        {(searchQuery || filterRoom !== 'all' || filterUser !== 'all' || filterDate) && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-3 w-3 mr-1" />
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <Badge variant="secondary">{filteredBookings.length} bookings</Badge>
      </div>

      {/* Bookings table */}
      <div className="bg-card rounded-xl shadow-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-heading">Booking</TableHead>
              <TableHead className="font-heading">Room</TableHead>
              <TableHead className="font-heading">User</TableHead>
              <TableHead className="font-heading">Date & Time</TableHead>
              <TableHead className="font-heading">Status</TableHead>
              <TableHead className="text-right font-heading">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.map((booking, index) => {
              const room = mockRooms.find((r) => r.id === booking.roomId);
              const user = mockUsers.find((u) => u.id === booking.userId);

              return (
                <TableRow
                  key={booking.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium">{booking.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {booking.attendees} attendees
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{room?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Floor {room?.floor}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">
                      {format(new Date(booking.date), 'MMM d, yyyy')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {booking.startTime} - {booking.endTime}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn('capitalize', getStatusBadge(booking.status))}
                    >
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {booking.status !== 'cancelled' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => openCancelDialog(booking)}
                      >
                        Cancel
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {filteredBookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <p className="text-muted-foreground">No bookings found.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Cancel Booking Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Cancel Booking
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="bg-muted/50 rounded-lg p-4 my-4">
              <p className="font-medium">{selectedBooking.title}</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(selectedBooking.date), 'MMMM d, yyyy')} • {selectedBooking.startTime} - {selectedBooking.endTime}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="reason">Cancellation Reason *</Label>
            <Textarea
              id="reason"
              placeholder="Please provide a reason for cancellation..."
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Keep Booking
            </Button>
            <Button variant="destructive" onClick={handleCancelBooking}>
              Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
