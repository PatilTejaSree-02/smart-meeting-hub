import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import {
  Search,
  Filter,
  Calendar,
  X,
  AlertCircle,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

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
  status: string;
}

/* ---------------- COMPONENT ---------------- */

export default function AdminBookings() {
  const { toast } = useToast();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterDate, setFilterDate] = useState<Date | undefined>();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancellationReason, setCancellationReason] = useState("");

  /* ---------------- FETCH BOOKINGS ---------------- */

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/bookings/admin");
        setBookings(res.data);
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load bookings",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [toast]);

  /* ---------------- FILTERING ---------------- */

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesSearch =
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(b.roomId).includes(searchQuery) ||
        String(b.userId).includes(searchQuery);

      const matchesDate =
        !filterDate ||
        b.bookingDate === format(filterDate, "yyyy-MM-dd");

      return matchesSearch && matchesDate;
    });
  }, [bookings, searchQuery, filterDate]);

  /* ---------------- ACTIONS ---------------- */

  const openCancelDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setCancelDialogOpen(true);
  };

  const handleCancelBooking = () => {
    if (!selectedBooking || !cancellationReason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a cancellation reason.",
        variant: "destructive",
      });
      return;
    }

    setBookings((prev) =>
      prev.map((b) =>
        b.id === selectedBooking.id
          ? { ...b, status: "cancelled" }
          : b
      )
    );

    toast({
      title: "Booking Cancelled",
      description: `Booking "${selectedBooking.title}" cancelled.`,
    });

    setCancelDialogOpen(false);
    setSelectedBooking(null);
    setCancellationReason("");
  };

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
      <div>
        <h1 className="font-heading text-2xl lg:text-3xl font-bold">
          All Bookings
        </h1>
        <p className="text-muted-foreground mt-1">
          View and manage all room bookings.
        </p>
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
              placeholder="Search by title, roomId, userId..."
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
                {filterDate
                  ? format(filterDate, "PP")
                  : "Filter by date"}
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
                <TableCell>Room #{b.roomId}</TableCell>
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
                <TableCell className="text-right">
                  {b.status !== "cancelled" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => openCancelDialog(b)}
                    >
                      Cancel
                    </Button>
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
            <DialogDescription>
              This action cannot be undone.
            </DialogDescription>
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
    </div>
  );
}
