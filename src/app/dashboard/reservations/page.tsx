// src/app/(dashboard)/reservations/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, CheckCircle, XCircle } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import api from '@/lib/api';
import { format } from 'date-fns';

interface Reservation {
  id: string;
  userId: string;
  userName: string;
  movieTitle: string;
  cinemaName: string;
  showtime: string;
  seats: string[];
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED';
  createdAt: string;
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      // Mock data - replace with real API call
      const mockData: Reservation[] = [
        {
          id: '1',
          userId: 'user1',
          userName: 'Nguyen Van A',
          movieTitle: 'Avatar: The Way of Water',
          cinemaName: 'Cinestar Quốc Thanh',
          showtime: '2025-01-15T19:30:00',
          seats: ['A1', 'A2', 'A3'],
          totalAmount: 255000,
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
          createdAt: '2025-01-10T10:30:00',
        },
        {
          id: '2',
          userId: 'user2',
          userName: 'Tran Thi B',
          movieTitle: 'The Batman',
          cinemaName: 'Cinestar Hai Bà Trưng',
          showtime: '2025-01-16T20:00:00',
          seats: ['B5', 'B6'],
          totalAmount: 170000,
          status: 'PENDING',
          paymentStatus: 'PENDING',
          createdAt: '2025-01-11T14:20:00',
        },
        {
          id: '3',
          userId: 'user3',
          userName: 'Le Van C',
          movieTitle: 'Spider-Man: No Way Home',
          cinemaName: 'Cinestar Kinh Dương Vương',
          showtime: '2025-01-14T18:00:00',
          seats: ['C3', 'C4'],
          totalAmount: 180000,
          status: 'CANCELLED',
          paymentStatus: 'REFUNDED',
          createdAt: '2025-01-09T09:15:00',
        },
      ];
      setReservations(mockData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch reservations',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setDetailDialogOpen(true);
  };

  const handleUpdateStatus = async (id: string, status: 'CONFIRMED' | 'CANCELLED') => {
    try {
      // await api.patch(`/reservations/${id}`, { status });
      toast({
        title: 'Success',
        description: `Reservation ${status.toLowerCase()} successfully`,
      });
      fetchReservations();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update reservation',
        variant: 'destructive',
      });
    }
  };

  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.movieTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.cinemaName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || reservation.status.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: reservations.length,
    confirmed: reservations.filter((r) => r.status === 'CONFIRMED').length,
    pending: reservations.filter((r) => r.status === 'PENDING').length,
    cancelled: reservations.filter((r) => r.status === 'CANCELLED').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-700';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-700';
      case 'PENDING':
        return 'bg-orange-100 text-orange-700';
      case 'REFUNDED':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reservations</h1>
          <p className="text-gray-500 mt-1">Manage all ticket reservations</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Reservations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Confirmed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.confirmed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Cancelled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.cancelled}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by customer name, movie, or cinema..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reservations Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Reservations ({filteredReservations.length})</CardTitle>
          <CardDescription>
            A list of all ticket reservations in your system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Movie</TableHead>
                    <TableHead>Cinema</TableHead>
                    <TableHead>Showtime</TableHead>
                    <TableHead>Seats</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : filteredReservations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8">
                        No reservations found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredReservations.map((reservation) => (
                      <TableRow key={reservation.id}>
                        <TableCell className="font-medium">
                          #{reservation.id}
                        </TableCell>
                        <TableCell>{reservation.userName}</TableCell>
                        <TableCell>{reservation.movieTitle}</TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {reservation.cinemaName}
                        </TableCell>
                        <TableCell>
                          {format(new Date(reservation.showtime), 'MMM dd, HH:mm')}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {reservation.seats.slice(0, 3).map((seat) => (
                              <Badge key={seat} variant="secondary" className="text-xs">
                                {seat}
                              </Badge>
                            ))}
                            {reservation.seats.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{reservation.seats.length - 3}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {reservation.totalAmount.toLocaleString()} VNĐ
                        </TableCell>
                        <TableCell>
                          <Badge className={getPaymentStatusColor(reservation.paymentStatus)}>
                            {reservation.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(reservation.status)}>
                            {reservation.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewDetails(reservation)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {reservation.status === 'PENDING' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    handleUpdateStatus(reservation.id, 'CONFIRMED')
                                  }
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    handleUpdateStatus(reservation.id, 'CANCELLED')
                                  }
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reservation Details</DialogTitle>
            <DialogDescription>
              Complete information about this reservation
            </DialogDescription>
          </DialogHeader>
          {selectedReservation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Booking ID</p>
                  <p className="font-medium">#{selectedReservation.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-medium">{selectedReservation.userName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Movie</p>
                  <p className="font-medium">{selectedReservation.movieTitle}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cinema</p>
                  <p className="font-medium">{selectedReservation.cinemaName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Showtime</p>
                  <p className="font-medium">
                    {format(new Date(selectedReservation.showtime), 'PPP HH:mm')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Seats</p>
                  <p className="font-medium">{selectedReservation.seats.join(', ')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-medium text-lg">
                    {selectedReservation.totalAmount.toLocaleString()} VNĐ
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created At</p>
                  <p className="font-medium">
                    {format(new Date(selectedReservation.createdAt), 'PPP HH:mm')}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Badge className={getStatusColor(selectedReservation.status)}>
                  {selectedReservation.status}
                </Badge>
                <Badge className={getPaymentStatusColor(selectedReservation.paymentStatus)}>
                  {selectedReservation.paymentStatus}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}