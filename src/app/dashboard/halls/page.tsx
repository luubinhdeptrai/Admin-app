// src/app/(dashboard)/halls/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, MoreVertical, Edit, Trash2, DoorOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import api from '@/lib/api';
import type { Hall, Cinema } from '@/types';

import { mockHalls, mockCinemas } from '@/lib/mockData'; 


export default function HallsPage() {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedHall, setSelectedHall] = useState<Hall | null>(null);
  const [formData, setFormData] = useState({
    cinema_id: '',
    name: '',
    type: 'STANDARD',
    capacity: 0,
    rows: 0,
    screen_type: '',
    sound_system: '',
    status: 'ACTIVE',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      /*
      const [hallsRes, cinemasRes] = await Promise.all([
        api.get('/auditoriums'),
        api.get('/cinemas', { params: { lat: 10.762622, lng: 106.660172 } }),
      ]);
      setHalls(hallsRes.data);
      setCinemas(cinemasRes.data);
      */
      // ⭐️ REPLACE API CALLS WITH MOCK DATA ⭐️
       await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
       setHalls(mockHalls);
       setCinemas(mockCinemas);
      // ⭐️ END OF REPLACEMENT ⭐️
      
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (selectedHall) {
        await api.put(`/auditoriums/${selectedHall.id}`, formData);
        toast({ title: 'Success', description: 'Hall updated successfully' });
      } else {
        await api.post('/auditoriums', {
          ...formData,
          seatLayout: [], // Empty seat layout initially
        });
        toast({ title: 'Success', description: 'Hall created successfully' });
      }
      setDialogOpen(false);
      fetchData();
      resetForm();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save hall',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedHall) return;
    try {
      await api.delete(`/auditoriums/${selectedHall.id}`);
      toast({ title: 'Success', description: 'Hall deleted successfully' });
      setDeleteDialogOpen(false);
      fetchData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete hall',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      cinema_id: '',
      name: '',
      type: 'STANDARD',
      capacity: 0,
      rows: 0,
      screen_type: '',
      sound_system: '',
      status: 'ACTIVE',
    });
    setSelectedHall(null);
  };

  const openEditDialog = (hall: Hall) => {
    setSelectedHall(hall);
    setFormData({
      cinema_id: hall.cinema_id,
      name: hall.name,
      type: hall.type,
      capacity: hall.capacity,
      rows: hall.rows,
      screen_type: hall.screen_type || '',
      sound_system: hall.sound_system || '',
      status: hall.status,
    });
    setDialogOpen(true);
  };

  const filteredHalls = halls.filter((hall) =>
    hall.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      STANDARD: 'bg-gray-100 text-gray-700',
      VIP: 'bg-purple-100 text-purple-700',
      IMAX: 'bg-blue-100 text-blue-700',
      FOUR_DX: 'bg-orange-100 text-orange-700',
      PREMIUM: 'bg-pink-100 text-pink-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: 'bg-green-100 text-green-700',
      MAINTENANCE: 'bg-yellow-100 text-yellow-700',
      CLOSED: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Halls (Auditoriums)</h1>
          <p className="text-gray-500 mt-1">Manage cinema halls and screening rooms</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setDialogOpen(true);
          }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Hall
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search halls..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Halls ({filteredHalls.length})</CardTitle>
          <CardDescription>
            A list of all cinema halls in your system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hall Name</TableHead>
                <TableHead>Cinema</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredHalls.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No halls found
                  </TableCell>
                </TableRow>
              ) : (
                filteredHalls.map((hall) => {
                  const cinema = cinemas.find((c) => c.id === hall.cinema_id);
                  return (
                    <TableRow key={hall.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <DoorOpen className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{hall.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{cinema?.name || 'Unknown'}</TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(hall.type)}>
                          {hall.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{hall.capacity} seats</div>
                          <div className="text-gray-500">{hall.rows} rows</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{hall.screen_type || 'Standard'}</div>
                          <div className="text-gray-500">
                            {hall.sound_system || 'Standard Audio'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(hall.status)}>
                          {hall.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(hall)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedHall(hall);
                                setDeleteDialogOpen(true);
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedHall ? 'Edit Hall' : 'Add New Hall'}
            </DialogTitle>
            <DialogDescription>
              Fill in the hall details below
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cinema">Cinema *</Label>
              <Select
                value={formData.cinema_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, cinema_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select cinema" />
                </SelectTrigger>
                <SelectContent>
                  {cinemas.map((cinema) => (
                    <SelectItem key={cinema.id} value={cinema.id}>
                      {cinema.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Hall Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Hall 1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STANDARD">Standard</SelectItem>
                    <SelectItem value="VIP">VIP</SelectItem>
                    <SelectItem value="IMAX">IMAX</SelectItem>
                    <SelectItem value="FOUR_DX">4DX</SelectItem>
                    <SelectItem value="PREMIUM">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity *</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })
                  }
                  placeholder="150"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rows">Number of Rows *</Label>
                <Input
                  id="rows"
                  type="number"
                  value={formData.rows}
                  onChange={(e) =>
                    setFormData({ ...formData, rows: parseInt(e.target.value) || 0 })
                  }
                  placeholder="10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="screen_type">Screen Type</Label>
                <Input
                  id="screen_type"
                  value={formData.screen_type}
                  onChange={(e) =>
                    setFormData({ ...formData, screen_type: e.target.value })
                  }
                  placeholder="4K Digital"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sound_system">Sound System</Label>
                <Input
                  id="sound_system"
                  value={formData.sound_system}
                  onChange={(e) =>
                    setFormData({ ...formData, sound_system: e.target.value })
                  }
                  placeholder="Dolby Atmos"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-purple-600 to-pink-600"
            >
              {selectedHall ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Hall</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete `${selectedHall?.name}`?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}