import { useState } from 'react';
import { Plus, Pencil, Trash2, MoreHorizontal, Search, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { mockRooms, amenitiesList } from '@/data/mockData';
import { Room } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function AdminRooms() {
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [deleteRoom, setDeleteRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    floor: '',
    description: '',
    amenities: [] as string[],
  });
  const { toast } = useToast();

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleActive = (roomId: string) => {
    setRooms((prev) =>
      prev.map((r) =>
        r.id === roomId ? { ...r, isActive: !r.isActive } : r
      )
    );
    toast({
      title: 'Room status updated',
      description: 'The room availability has been changed.',
    });
  };

  const handleDeleteRoom = () => {
    if (!deleteRoom) return;
    setRooms((prev) => prev.filter((r) => r.id !== deleteRoom.id));
    toast({
      title: 'Room deleted',
      description: `${deleteRoom.name} has been removed from the system.`,
    });
    setDeleteRoom(null);
  };

  const handleAddRoom = () => {
    if (!formData.name || !formData.capacity || !formData.floor) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const newRoom: Room = {
      id: String(rooms.length + 1),
      name: formData.name,
      capacity: parseInt(formData.capacity),
      floor: parseInt(formData.floor),
      description: formData.description,
      amenities: formData.amenities,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
      isActive: true,
    };

    setRooms([...rooms, newRoom]);
    setIsAddDialogOpen(false);
    resetForm();
    toast({
      title: 'Room Added',
      description: `${newRoom.name} has been created successfully.`,
    });
  };

  const handleEditRoom = () => {
    if (!editingRoom || !formData.name || !formData.capacity || !formData.floor) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setRooms((prev) =>
      prev.map((r) =>
        r.id === editingRoom.id
          ? {
              ...r,
              name: formData.name,
              capacity: parseInt(formData.capacity),
              floor: parseInt(formData.floor),
              description: formData.description,
              amenities: formData.amenities,
            }
          : r
      )
    );

    setEditingRoom(null);
    resetForm();
    toast({
      title: 'Room Updated',
      description: 'Room information has been updated successfully.',
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      capacity: '',
      floor: '',
      description: '',
      amenities: [],
    });
  };

  const openEditDialog = (room: Room) => {
    setFormData({
      name: room.name,
      capacity: String(room.capacity),
      floor: String(room.floor),
      description: room.description || '',
      amenities: room.amenities,
    });
    setEditingRoom(room);
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const RoomFormContent = () => (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">Room Name *</Label>
        <Input
          id="name"
          placeholder="e.g., Innovation Hub"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="capacity">Capacity *</Label>
          <Input
            id="capacity"
            type="number"
            placeholder="10"
            min={1}
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="floor">Floor *</Label>
          <Input
            id="floor"
            type="number"
            placeholder="1"
            min={1}
            value={formData.floor}
            onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          placeholder="Brief description of the room"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Facilities</Label>
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg">
          {amenitiesList.map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                id={amenity}
                checked={formData.amenities.includes(amenity)}
                onCheckedChange={() => toggleAmenity(amenity)}
              />
              <Label htmlFor={amenity} className="text-sm font-normal cursor-pointer">
                {amenity}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold">
            Manage Rooms
          </h1>
          <p className="text-muted-foreground mt-1">
            Add, edit, and manage meeting room configurations.
          </p>
        </div>
        <Button variant="accent" onClick={openAddDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Room
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search rooms..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Badge variant="secondary">{filteredRooms.length} rooms</Badge>
      </div>

      {/* Rooms table */}
      <div className="bg-card rounded-xl shadow-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-heading">Room</TableHead>
              <TableHead className="font-heading">Capacity</TableHead>
              <TableHead className="font-heading">Floor</TableHead>
              <TableHead className="font-heading">Facilities</TableHead>
              <TableHead className="font-heading">Status</TableHead>
              <TableHead className="text-right font-heading">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRooms.map((room, index) => (
              <TableRow
                key={room.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={room.image}
                        alt={room.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{room.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {room.description}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{room.capacity} people</TableCell>
                <TableCell>Floor {room.floor}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {room.amenities.slice(0, 2).map((amenity) => (
                      <Badge key={amenity} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                    {room.amenities.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{room.amenities.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={room.isActive}
                      onCheckedChange={() => handleToggleActive(room.id)}
                    />
                    <span className="text-sm">
                      {room.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(room)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setDeleteRoom(room)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add Room Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Room</DialogTitle>
            <DialogDescription>
              Create a new meeting room with its details and facilities.
            </DialogDescription>
          </DialogHeader>
          <RoomFormContent />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="accent" onClick={handleAddRoom}>
              Create Room
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Room Dialog */}
      <Dialog open={!!editingRoom} onOpenChange={() => setEditingRoom(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
            <DialogDescription>
              Update room details and facilities.
            </DialogDescription>
          </DialogHeader>
          <RoomFormContent />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingRoom(null)}>
              Cancel
            </Button>
            <Button variant="accent" onClick={handleEditRoom}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteRoom} onOpenChange={() => setDeleteRoom(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Room
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteRoom?.name}</strong>? This action
              cannot be undone and will remove all associated booking history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRoom}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete Room
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
