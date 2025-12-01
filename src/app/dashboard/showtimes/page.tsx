// src/app/(dashboard)/showtimes/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Plus, Calendar as CalendarIcon, Clock, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import api from '@/lib/api';
import type { Showtime, Movie, Cinema, Hall } from '@/types';
import { format } from 'date-fns';

import { mockShowtimes, mockMovies, mockCinemas, mockHalls } from '@/lib/mockData'; 


export default function ShowtimesPage() {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [formData, setFormData] = useState({
    movie_id: '',
    cinema_id: '',
    hall_id: '',
    start_time: '',
    end_time: '',
    format: 'TWO_D',
    language: 'vi',
    subtitles: ['en'],
    base_price: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    try {
      setLoading(true);

      /*
      const [showtimesRes, moviesRes, cinemasRes] = await Promise.all([
        api.get('/showtimes', {
          params: { date: format(selectedDate, 'yyyy-MM-dd') }
        }),
        api.get('/movies'),
        api.get('/cinemas', { params: { lat: 10.762622, lng: 106.660172 } }),
      ]);
      setShowtimes(showtimesRes.data);
      setMovies(moviesRes.data);
      setCinemas(cinemasRes.data);
      */

      // ⭐️ THAY THẾ API CALLS BẰNG MOCK DATA VÀ DELAY
       await new Promise(resolve => setTimeout(resolve, 600)); 

      // Lọc dữ liệu showtime theo ngày đang chọn
      const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
      const filteredShowtimes = mockShowtimes.filter(st => 
      format(new Date(st.start_time), 'yyyy-MM-dd') === selectedDateStr
    );
      setShowtimes(filteredShowtimes);
      setMovies(mockMovies);
      setCinemas(mockCinemas);
     // ⭐️ KẾT THÚC PHẦN THAY THẾ

     
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

  const fetchHalls = async (cinemaId: string) => {
    try {
      const response = await api.get('/auditoriums', {
        params: { cinemaId }
      });
      setHalls(response.data);
    } catch (error) {
      console.error('Failed to fetch halls');
    }
  };

  const handleSubmit = async () => {
    try {
      await api.post('/showtimes', formData);
      toast({ title: 'Success', description: 'Showtime created successfully' });
      setDialogOpen(false);
      fetchData();
      resetForm();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create showtime',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/showtimes/${id}`);
      toast({ title: 'Success', description: 'Showtime deleted successfully' });
      fetchData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete showtime',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      movie_id: '',
      cinema_id: '',
      hall_id: '',
      start_time: '',
      end_time: '',
      format: 'TWO_D',
      language: 'vi',
      subtitles: ['en'],
      base_price: 0,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-700';
      case 'SELLING':
        return 'bg-green-100 text-green-700';
      case 'SOLD_OUT':
        return 'bg-red-100 text-red-700';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-700';
      case 'COMPLETED':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const groupedShowtimes = showtimes.reduce((acc, showtime) => {
    const movieId = showtime.movie_id;
    if (!acc[movieId]) {
      acc[movieId] = [];
    }
    acc[movieId].push(showtime);
    return acc;
  }, {} as Record<string, Showtime[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Showtimes</h1>
          <p className="text-gray-500 mt-1">Manage movie showtimes and schedules</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setDialogOpen(true);
          }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Showtime
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-60">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(selectedDate, 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                />
              </PopoverContent>
            </Popover>
            <div className="text-sm text-gray-500">
              {showtimes.length} showtimes scheduled
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="py-12 text-center">Loading...</CardContent>
          </Card>
        ) : Object.keys(groupedShowtimes).length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              No showtimes scheduled for this date
            </CardContent>
          </Card>
        ) : (
          Object.entries(groupedShowtimes).map(([movieId, movieShowtimes]) => {
            const movie = movies.find((m) => m.id === movieId);
            return (
              <Card key={movieId}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{movie?.title || 'Unknown Movie'}</span>
                    <Badge variant="secondary">
                      {movieShowtimes.length} sessions
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {movie?.durationMinutes} mins · {movie?.ageRating}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {movieShowtimes.map((showtime) => {
                      const cinema = cinemas.find((c) => c.id === showtime.cinema_id);
                      return (
                        <Card key={showtime.id} className="relative">
                          <CardContent className="pt-6">
                            <div className="space-y-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="font-semibold text-lg">
                                    {format(new Date(showtime.start_time), 'HH:mm')}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {cinema?.name}
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(showtime.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="h-4 w-4" />
                                {format(new Date(showtime.start_time), 'HH:mm')} -{' '}
                                {format(new Date(showtime.end_time), 'HH:mm')}
                              </div>

                              <div className="flex items-center justify-between">
                                <Badge className={getStatusColor(showtime.status)}>
                                  {showtime.status}
                                </Badge>
                                <div className="text-sm font-semibold">
                                  {showtime.base_price.toLocaleString()} VNĐ
                                </div>
                              </div>

                              <div className="text-sm text-gray-500">
                                {showtime.available_seats}/{showtime.total_seats} seats available
                              </div>

                              <div className="flex gap-2">
                                <Badge variant="outline">{showtime.format}</Badge>
                                <Badge variant="outline">{showtime.language}</Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Add Showtime Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Showtime</DialogTitle>
            <DialogDescription>
              Schedule a new movie showtime
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="movie">Movie *</Label>
              <Select
                value={formData.movie_id}
                onValueChange={(value) => {
                  const movie = movies.find((m) => m.id === value);
                  setFormData({ 
                    ...formData, 
                    movie_id: value,
                    end_time: formData.start_time ? 
                      new Date(new Date(formData.start_time).getTime() + (movie?.durationMinutes || 0) * 60000).toISOString() 
                      : ''
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select movie" />
                </SelectTrigger>
                <SelectContent>
                  {movies.map((movie) => (
                    <SelectItem key={movie.id} value={movie.id}>
                      {movie.title} ({movie.durationMinutes} mins)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cinema">Cinema *</Label>
              <Select
                value={formData.cinema_id}
                onValueChange={(value) => {
                  setFormData({ ...formData, cinema_id: value, hall_id: '' });
                  fetchHalls(value);
                }}
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

            <div className="space-y-2">
              <Label htmlFor="hall">Hall *</Label>
              <Select
                value={formData.hall_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, hall_id: value })
                }
                disabled={!formData.cinema_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select hall" />
                </SelectTrigger>
                <SelectContent>
                  {halls.map((hall) => (
                    <SelectItem key={hall.id} value={hall.id}>
                      {hall.name} ({hall.type}) - {hall.capacity} seats
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_time">Start Time *</Label>
                <Input
                  id="start_time"
                  type="datetime-local"
                  value={formData.start_time}
                  onChange={(e) => {
                    const movie = movies.find((m) => m.id === formData.movie_id);
                    const startTime = e.target.value;
                    const endTime = movie
                      ? new Date(new Date(startTime).getTime() + movie.durationMinutes * 60000)
                          .toISOString()
                          .slice(0, 16)
                      : '';
                    setFormData({ 
                      ...formData, 
                      start_time: startTime,
                      end_time: endTime
                    });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_time">End Time</Label>
                <Input
                  id="end_time"
                  type="datetime-local"
                  value={formData.end_time}
                  disabled
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="format">Format</Label>
                <Select
                  value={formData.format}
                  onValueChange={(value) =>
                    setFormData({ ...formData, format: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TWO_D">2D</SelectItem>
                    <SelectItem value="THREE_D">3D</SelectItem>
                    <SelectItem value="IMAX">IMAX</SelectItem>
                    <SelectItem value="FOUR_DX">4DX</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) =>
                    setFormData({ ...formData, language: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vi">Vietnamese</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="base_price">Base Price (VNĐ) *</Label>
                <Input
                  id="base_price"
                  type="number"
                  value={formData.base_price}
                  onChange={(e) =>
                    setFormData({ ...formData, base_price: parseFloat(e.target.value) || 0 })
                  }
                  placeholder="85000"
                />
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
              Create Showtime
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}