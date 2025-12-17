import { Users, MapPin, Check } from 'lucide-react';
import { Room } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface RoomCardProps {
  room: Room;
  isAvailable?: boolean;
  onBook?: () => void;
}

export function RoomCard({ room, isAvailable = true, onBook }: RoomCardProps) {
  return (
    <div className="group relative bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 animate-fade-in">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={room.image}
          alt={room.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
        
        {/* Status badge */}
        <Badge
          className={cn(
            "absolute top-3 right-3",
            isAvailable 
              ? "bg-success/90 text-success-foreground hover:bg-success" 
              : "bg-destructive/90 text-destructive-foreground hover:bg-destructive"
          )}
        >
          {isAvailable ? 'Available' : 'Occupied'}
        </Badge>

        {/* Room name overlay */}
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="font-heading font-bold text-xl text-primary-foreground">
            {room.name}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            {room.capacity} people
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            Floor {room.floor}
          </span>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {room.amenities.slice(0, 3).map((amenity) => (
            <Badge key={amenity} variant="secondary" className="text-xs">
              {amenity}
            </Badge>
          ))}
          {room.amenities.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{room.amenities.length - 3}
            </Badge>
          )}
        </div>

        {/* Book button */}
        <Button
          onClick={onBook}
          disabled={!isAvailable}
          className="w-full"
          variant={isAvailable ? 'accent' : 'secondary'}
        >
          {isAvailable ? (
            <>
              <Check className="h-4 w-4" />
              Book Now
            </>
          ) : (
            'Not Available'
          )}
        </Button>
      </div>
    </div>
  );
}
