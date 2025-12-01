// src/app/(dashboard)/staff/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, MoreVertical, Edit, Trash2, UserCheck, UserX } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import api from '@/lib/api';
import type { Staff } from '@/types';
import { format } from 'date-fns';

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: 'STAFF',
    email: '',
    phone: '',
    status: 'ACTIVE',
    locationId: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await api.get('/staff');
      setStaff(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch staff',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (selectedStaff) {
        await api.put(`/staff/${selectedStaff.id}`, formData);
        toast({ title: 'Success', description: 'Staff updated successfully' });
      } else {
        await api.post('/staff', {
          ...formData,
          hiredAt: new Date().toISOString(),
        });
        toast({ title: 'Success', description: 'Staff created successfully' });
      }
      setDialogOpen(false);
      fetchStaff();
      resetForm();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save staff',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedStaff) return;
    try {
      await api.delete(`/staff/${selectedStaff.id}`);
      toast({ title: 'Success', description: 'Staff deleted successfully' });
      setDeleteDialogOpen(false);
      fetchStaff();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete staff',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: 'STAFF',
      email: '',
      phone: '',
      status: 'ACTIVE',
      locationId: '',
    });
    setSelectedStaff(null);
  };

  const openEditDialog = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setFormData({
      name: staffMember.name,
      role: staffMember.role,
      email: staffMember.email,
      phone: staffMember.phone,
      status: staffMember.status,
      locationId: staffMember.locationId,
    });
    setDialogOpen(true);
  };

  const filteredStaff = staff.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeStaff = filteredStaff.filter(s => s.status === 'ACTIVE');
  const inactiveStaff = filteredStaff.filter(s => s.status === 'INACTIVE');

  const getStatusColor = (status: string) => {
    return status === 'ACTIVE'
      ? 'bg-green-100 text-green-700'
      : 'bg-gray-100 text-gray-700';
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      MANAGER: 'bg-purple-100 text-purple-700',
      SUPERVISOR: 'bg-blue-100 text-blue-700',
      STAFF: 'bg-gray-100 text-gray-700',
      CASHIER: 'bg-yellow-100 text-yellow-700',
      TECHNICIAN: 'bg-orange-100 text-orange-700',
    };
    return colors[role] || 'bg-gray-100 text-gray-700';
  };

  const StaffTable = ({ data }: { data: Staff[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Hired Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8">
              No staff members found
            </TableCell>
          </TableRow>
        ) : (
          data.map((staffMember) => (
            <TableRow key={staffMember.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                    {staffMember.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium">{staffMember.name}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getRoleColor(staffMember.role)}>
                  {staffMember.role}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{staffMember.email}</div>
                  <div className="text-gray-500">{staffMember.phone}</div>
                </div>
              </TableCell>
              <TableCell>
                {format(new Date(staffMember.hiredAt), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(staffMember.status)}>
                  {staffMember.status}
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
                    <DropdownMenuItem onClick={() => openEditDialog(staffMember)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedStaff(staffMember);
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
          ))
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
          <p className="text-gray-500 mt-1">Manage your cinema staff members</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setDialogOpen(true);
          }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Staff
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Staff
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{staff.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Staff
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{activeStaff.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Inactive Staff
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-600">{inactiveStaff.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search staff by name, email, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Staff Members</CardTitle>
          <CardDescription>
            A list of all staff members in your system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All ({filteredStaff.length})</TabsTrigger>
              <TabsTrigger value="active">Active ({activeStaff.length})</TabsTrigger>
              <TabsTrigger value="inactive">Inactive ({inactiveStaff.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6">
              <StaffTable data={filteredStaff} />
            </TabsContent>
            <TabsContent value="active" className="mt-6">
              <StaffTable data={activeStaff} />
            </TabsContent>
            <TabsContent value="inactive" className="mt-6">
              <StaffTable data={inactiveStaff} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
            </DialogTitle>
            <DialogDescription>
              Fill in the staff member details below
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="John Doe"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="0901234567"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MANAGER">Manager</SelectItem>
                    <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
                    <SelectItem value="STAFF">Staff</SelectItem>
                    <SelectItem value="CASHIER">Cashier</SelectItem>
                    <SelectItem value="TECHNICIAN">Technician</SelectItem>
                  </SelectContent>
                </Select>
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
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
              {selectedStaff ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Staff Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete `${selectedStaff?.name}`? This action cannot be undone.
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