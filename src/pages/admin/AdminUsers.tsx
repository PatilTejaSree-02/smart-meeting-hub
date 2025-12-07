import { useState } from 'react';
import { format } from 'date-fns';
import { Search, MoreHorizontal, Shield, User as UserIcon, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { mockUsers, mockBookings } from '@/data/mockData';
import { User } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getUserBookingsCount = (userId: string) => {
    return mockBookings.filter((b) => b.userId === userId).length;
  };

  const handleToggleRole = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, role: u.role === 'admin' ? 'user' : 'admin' }
          : u
      )
    );
    toast({
      title: 'Role updated',
      description: 'The user role has been changed.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold">
            Manage Users
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage user accounts and permissions.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Badge variant="secondary">{filteredUsers.length} users</Badge>
      </div>

      {/* Users table */}
      <div className="bg-card rounded-xl shadow-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-heading">User</TableHead>
              <TableHead className="font-heading">Email</TableHead>
              <TableHead className="font-heading">Role</TableHead>
              <TableHead className="font-heading">Bookings</TableHead>
              <TableHead className="font-heading">Joined</TableHead>
              <TableHead className="text-right font-heading">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user, index) => (
              <TableRow
                key={user.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      'capitalize',
                      user.role === 'admin'
                        ? 'border-accent text-accent'
                        : 'border-muted-foreground text-muted-foreground'
                    )}
                  >
                    {user.role === 'admin' ? (
                      <Shield className="h-3 w-3 mr-1" />
                    ) : (
                      <UserIcon className="h-3 w-3 mr-1" />
                    )}
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>{getUserBookingsCount(user.id)} bookings</TableCell>
                <TableCell className="text-muted-foreground">
                  {format(user.createdAt, 'MMM d, yyyy')}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>View Bookings</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleToggleRole(user.id)}>
                        {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
