// src/app/(dashboard)/page.tsx (Updated)
'use client';

import { useState, useEffect } from 'react';
import { 
  Building2, 
  Film, 
  Calendar, 
  Users, 
  TrendingUp, 
  DollarSign,
  Ticket,
  Star,
  AlertCircle 
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import api from '@/lib/api';
// BƯỚC 1: IMPORT CÁC KIỂU DỮ LIỆU THỰC TẾ
// STEP 1: IMPORT ACTUAL DATA TYPES
import { Cinema, Movie, Showtime } from '@/types'; 


import { mockCinemas, mockMovies, mockShowtimes } from '@/lib/mockData';



interface RecentActivity {
  id: number;
  type: 'showtime' | 'booking' | 'cinema' | 'movie';
  message: string;
  time: string;
}

interface TopPerformingMovie {
  title: string;
  sales: number;
  rating: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalCinemas: 0,
    totalMovies: 0,
    todayShowtimes: 0,
    totalRevenue: 0,
    activeStaff: 0,
    occupancyRate: 0,
  });
  const [loading, setLoading] = useState(true);
  
  // KIỂM TRA LẠI: Đã sử dụng kiểu RecentActivity[] thay vì any[]
  // CHECK: Using RecentActivity[] instead of any[]
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [topMovies, setTopMovies] = useState<TopPerformingMovie[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null); 
        
        /*
        // BƯỚC 2: SỬ DỤNG CÁC KIỂU THỰC TẾ CHO RESPONSE
        // STEP 2: USE ACTUAL TYPES FOR API RESPONSE
        const [cinemasRes, moviesRes, showtimesRes] = await Promise.all([
          api.get<Cinema[]>('/cinemas', { params: { lat: 10.762622, lng: 106.660172 } }),
          api.get<Movie[]>('/movies'),
          api.get<Showtime[]>('/showtimes'),
        ]);
        */

        // ⭐️ REPLACE API CALLS WITH MOCK DATA ⭐️
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay

        const cinemasData: Cinema[] = mockCinemas;
        const moviesData: Movie[] = mockMovies;
        const showtimesData: Showtime[] = mockShowtimes;
        // ⭐️ END OF REPLACEMENT ⭐️

        setStats({
          
          // Lúc này, Typecript đã biết cinemasRes.data là mảng các Cinema object
          // At this point, Typecript knows cinemasRes.data is an array of Cinema objects

          /*
          totalCinemas: cinemasRes.data.length,
          totalMovies: moviesRes.data.length,
          todayShowtimes: showtimesRes.data.length,
          totalRevenue: 125000000, 
          activeStaff: 48,
          occupancyRate: 68.5,
          */

          // SỬ DỤNG DỮ LIỆU MOCK THAY THẾ
          totalCinemas: cinemasData.length,
          totalMovies: moviesData.length,
          todayShowtimes: showtimesData.length,
          // ... other mock stats
          totalRevenue: 125000000, 
          activeStaff: 48,
          occupancyRate: 68.5,
        });

        // Mock data for activities (using the new interface)
        setRecentActivities([
          { id: 1, type: 'showtime', message: 'New showtime created for Avatar 2', time: '5 minutes ago' },
          { id: 2, type: 'booking', message: '12 tickets booked for The Batman', time: '15 minutes ago' },
          { id: 3, type: 'cinema', message: 'Cinestar Hai Bà Trưng updated', time: '1 hour ago' },
          { id: 4, type: 'movie', message: 'New movie "Oppenheimer" added', time: '2 hours ago' },
        ]);

        // Mock data for top movies (using the new interface)
        setTopMovies([
          { title: 'Avatar: The Way of Water', sales: 1250, rating: 4.8 },
          { title: 'The Batman', sales: 980, rating: 4.6 },
          { title: 'Everything Everywhere All at Once', sales: 875, rating: 4.9 },
          { title: 'Spider-Man: No Way Home', sales: 756, rating: 4.7 },
        ]);

      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
        setError('Could not load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { title: 'Total Cinemas', value: stats.totalCinemas, icon: Building2, change: '+2 from last month', changeType: 'positive', color: 'from-blue-500 to-blue-600' },
    { title: 'Active Movies', value: stats.totalMovies, icon: Film, change: '+5 new releases', changeType: 'positive', color: 'from-purple-500 to-purple-600' },
    { title: "Today's Showtimes", value: stats.todayShowtimes, icon: Calendar, change: '24 scheduled', changeType: 'neutral', color: 'from-green-500 to-green-600' },
    { title: 'Occupancy Rate', value: `${stats.occupancyRate}%`, icon: TrendingUp, change: '+5.2% from yesterday', changeType: 'positive', color: 'from-orange-500 to-orange-600' },
    { title: 'Revenue (Today)', value: `${(stats.totalRevenue / 1000000).toFixed(1)}M VNĐ`, icon: DollarSign, change: '+12% from yesterday', changeType: 'positive', color: 'from-pink-500 to-pink-600' },
    { title: 'Active Staff', value: stats.activeStaff, icon: Users, change: '8 on shift now', changeType: 'neutral', color: 'from-indigo-500 to-indigo-600' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-red-50 border border-red-200 rounded-lg">
        <div className="text-center text-red-600">
          <AlertCircle className="h-12 w-12 mx-auto mb-2" />
          <h2 className="text-lg font-semibold">Something went wrong</h2>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Admin! 👋</h1>
        <p className="text-purple-100">
          Here is what is happening with your cinema business today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <p className={`text-sm ${
                  stat.changeType === 'positive' 
                    ? 'text-green-600' 
                    : stat.changeType === 'negative'
                    ? 'text-red-600'
                    : 'text-gray-600'
                }`}>
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest updates from your system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="p-2 rounded-full bg-purple-100">
                    {activity.type === 'showtime' && <Calendar className="h-4 w-4 text-purple-600" />}
                    {activity.type === 'booking' && <Ticket className="h-4 w-4 text-purple-600" />}
                    {activity.type === 'cinema' && <Building2 className="h-4 w-4 text-purple-600" />}
                    {activity.type === 'movie' && <Film className="h-4 w-4 text-purple-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Movies */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Movies</CardTitle>
            <CardDescription>Based on ticket sales this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topMovies.map((movie, index) => (
                <div key={movie.title} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                      <div>
                        <p className="font-medium">{movie.title}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-gray-600">{movie.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{movie.sales}</p>
                    <p className="text-xs text-gray-500">tickets</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Monthly revenue for the past 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
            <div className="text-center text-gray-400">
              <TrendingUp className="h-12 w-12 mx-auto mb-2" />
              <p>Chart visualization would go here</p>
              <p className="text-sm mt-1">Integrate with recharts or similar library</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}