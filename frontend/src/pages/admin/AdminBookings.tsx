import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import {
  Search,
  Filter,
  Calendar,
  X,
  AlertCircle,
  Plus,
  Pencil,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import api from "@/api/api";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

/* ---------------- TYPES ---------------- */

interface Booking {
  id: number;
  roomId: number;
  userId: number;
  title: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  attendees: number;
  status: string;
}

interface Room {
  id: number;
  name: string;
  capacity: number;
  floor: number;
  building: string;
  isActive: boolean;
}

/* ---------------- COMPONENT ---------------- */

export default function AdminBookings() {
  const { toast } = useToast();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDate, setFilterDate] = useState<Date | undefined>();

  // Cancel dialog
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancellationReason, setCancellationReason] = useState("");

  // Create Booking dialog
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newRoomId, setNewRoomId] = useState<number | null>(null);
  const [newBookingDate, setNewBookingDate] = useState<Date | undefined>();
  const [newStartTime, setNewStartTime] = useState("09:00");
  const [newEndTime, setNewEndTime] = useState("10:00");
  const [newAttendees, setNewAttendees] = useState(1);

  // Reschedule dialog
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>();
  const [rescheduleStart, setRescheduleStart] = useState("09:00");
  const [rescheduleEnd, setRescheduleEnd] = useState("10:00");

  /* ---------------- FETCH DATA ---------------- */

  const fetchRooms = async () => {
    const res = await api.get("/admin/rooms");
    setRooms(res.data);
  };

  const fetchBookings = async () => {
    const res = await api.get("/admin/bookings");
    setBookings(res.data);
  };

  const loadAll = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchRooms(), fetchBookings()]);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load bookings/rooms",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  /* ---------------- FILTERING ---------------- */

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const roomName = rooms.find((r) => r.id === b.roomId)?.name || "";

      const matchesSearch =
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        roomName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(b.userId).includes(searchQuery) ||
        String(b.roomId).includes(searchQuery);

      const matchesDate =
        !filterDate || b.bookingDate === format(filterDate, "yyyy-MM-dd");

      return matchesSearch && matchesDate;
    });
  }, [bookings, searchQuery, filterDate, rooms]);

  /* ---------------- HELPERS ---------------- */

  const clearFilters = () => {
    setSearchQuery("");
    setFilterDate(undefined);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      confirmed: "bg-success/10 text-success border-success/20",
      cancelled: "bg-destructive/10 text-destructive border-destructive/20",
    };
    return variants[status] || "";
  };

  const getRoomLabel = (roomId: number) => {
    const r = rooms.find((x) => x.id === roomId);
    if (!r) return `Room #${roomId}`;
    return `${r.name} (Cap ${r.capacity})`;
  };

  /* ---------------- CANCEL ---------------- */

  const openCancelDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setCancellationReason("");
    setCancelDialogOpen(true);
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    if (!cancellationReason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a cancellation reason.",
        variant: "destructive",
      });
      return;
    }

    try {
      await api.delete(`/admin/bookings/${selectedBooking.id}`);

      toast({
        title: "Booking Cancelled ✅",
        description: `"${selectedBooking.title}" cancelled successfully`,
      });

      setCancelDialogOpen(false);
      setSelectedBooking(null);
      await fetchBookings();
    } catch (err: any) {
      toast({
        title: "Cancel failed ❌",
        description: err?.response?.data?.message || "Could not cancel booking",
        variant: "destructive",
      });
    }
  };

  /* ---------------- CREATE ---------------- */

  const handleCreateBooking = async () => {
    if (!newTitle.trim()) {
      toast({
        title: "Title required",
        description: "Please enter booking title",
        variant: "destructive",
      });
      return;
    }

    if (!newRoomId) {
      toast({
        title: "Room required",
        description: "Please select a room",
        variant: "destructive",
      });
      return;
    }

    if (!newBookingDate) {
      toast({
        title: "Date required",
        description: "Please select booking date",
        variant: "destructive",
      });
      return;
    }

    const room = rooms.find((r) => r.id === newRoomId);
    if (room && newAttendees > room.capacity) {
      toast({
        title: "Too many attendees ❌",
        description: `Max capacity of ${room.name} is ${room.capacity}`,
        variant: "destructive",
      });
      return;
    }

    try {
      await api.post("/admin/bookings", {
        title: newTitle,
        roomId: newRoomId,
        bookingDate: format(newBookingDate, "yyyy-MM-dd"),
        startTime: newStartTime,
        endTime: newEndTime,
        attendees: newAttendees,
      });

      toast({
        title: "Booking Created ✅",
        description: "New booking added successfully",
      });

      setCreateDialogOpen(false);
      setNewTitle("");
      setNewRoomId(null);
      setNewAttendees(1);
      setNewBookingDate(undefined);
      setNewStartTime("09:00");
      setNewEndTime("10:00");

      await fetchBookings();
    } catch (err: any) {
      toast({
        title: "Create failed ❌",
        description:
          err?.response?.data?.message ||
          "Slot already booked / backend error",
        variant: "destructive",
      });
    }
  };

  /* ---------------- RESCHEDULE ---------------- */

  const openRescheduleDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setRescheduleDialogOpen(true);

    setRescheduleDate(new Date(booking.bookingDate));
    setRescheduleStart(booking.startTime);
    setRescheduleEnd(booking.endTime);
  };

  const handleReschedule = async () => {
    if (!selectedBooking) return;

    if (!rescheduleDate) {
      toast({
        title: "Date required",
        description: "Please select new booking date",
        variant: "destructive",
      });
      return;
    }

    try {
      // ✅ FIXED ENDPOINT (matches backend @PutMapping("/{id}"))
      await api.put(`/admin/bookings/${selectedBooking.id}`, {
        bookingDate: format(rescheduleDate, "yyyy-MM-dd"),
        startTime: rescheduleStart,
        endTime: rescheduleEnd,
      });

      toast({
        title: "Rescheduled ✅",
        description: `Booking updated successfully`,
      });

      setRescheduleDialogOpen(false);
      setSelectedBooking(null);
      await fetchBookings();
    } catch (err: any) {
      toast({
        title: "Reschedule failed ❌",
        description:
          err?.response?.data?.message ||
          "New slot already booked / backend error",
        variant: "destructive",
      });
    }
  };

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold">
            All Bookings
          </h1>
          <p className="text-muted-foreground mt-1">
            Admin can view, book, reschedule and cancel bookings.
          </p>
        </div>

        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Booking
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl p-4 shadow-md space-y-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-accent" />
          <span className="font-medium text-sm">Filters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, room name, userId..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

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
                {filterDate ? format(filterDate, "PP") : "Filter by date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={filterDate}
                onSelect={setFilterDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button variant="ghost" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl shadow-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredBookings.map((b) => (
              <TableRow key={b.id}>
                <TableCell>{b.title}</TableCell>
                <TableCell>{getRoomLabel(b.roomId)}</TableCell>
                <TableCell>User #{b.userId}</TableCell>
                <TableCell>
                  {format(new Date(b.bookingDate), "MMM d, yyyy")} <br />
                  <span className="text-xs text-muted-foreground">
                    {b.startTime} – {b.endTime}
                  </span>
                </TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn("capitalize", getStatusBadge(b.status))}
                  >
                    {b.status}
                  </Badge>
                </TableCell>

                <TableCell className="text-right space-x-2">
                  {b.status !== "cancelled" && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openRescheduleDialog(b)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Reschedule
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => openCancelDialog(b)}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}

            {filteredBookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No bookings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Cancel Booking
            </DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label>Reason *</Label>
            <Textarea
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Close
            </Button>
            <Button variant="destructive" onClick={handleCancelBooking}>
              Confirm Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Booking Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Booking</DialogTitle>
            <DialogDescription>Admin can book rooms too.</DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <Label>Title</Label>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>

            <div>
              <Label>Room</Label>
              <Select
                value={newRoomId ? String(newRoomId) : ""}
                onValueChange={(val) => setNewRoomId(Number(val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent>
                  {rooms
                    .filter((r) => r.isActive)
                    .map((room) => (
                      <SelectItem key={room.id} value={String(room.id)}>
                        {room.name} (Cap {room.capacity})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    {newBookingDate ? format(newBookingDate, "PP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={newBookingDate}
                    onSelect={setNewBookingDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={newStartTime}
                  onChange={(e) => setNewStartTime(e.target.value)}
                />
              </div>

              <div>
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={newEndTime}
                  onChange={(e) => setNewEndTime(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label>Attendees</Label>
              <Input
                type="number"
                value={newAttendees}
                onChange={(e) => setNewAttendees(Number(e.target.value))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={handleCreateBooking}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog open={rescheduleDialogOpen} onOpenChange={setRescheduleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Booking</DialogTitle>
            <DialogDescription>Update booking date & time.</DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    {rescheduleDate ? format(rescheduleDate, "PP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={rescheduleDate}
                    onSelect={setRescheduleDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={rescheduleStart}
                  onChange={(e) => setRescheduleStart(e.target.value)}
                />
              </div>

              <div>
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={rescheduleEnd}
                  onChange={(e) => setRescheduleEnd(e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={handleReschedule}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
