// src/app/(dashboard)/reports/page.tsx
'use client';

import { useState } from 'react';
import { Download, Calendar as CalendarIcon, TrendingUp, DollarSign, Users, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<Date | undefined>(new Date());
  const [reportType, setReportType] = useState('revenue');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-gray-500 mt-1">View detailed business insights and reports</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenue">Revenue Report</SelectItem>
                <SelectItem value="occupancy">Occupancy Report</SelectItem>
                <SelectItem value="customer">Customer Behavior</SelectItem>
                <SelectItem value="movie">Movie Performance</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full md:w-64">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange ? format(dateRange, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateRange}
                  onSelect={setDateRange}
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Revenue
              </CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-green-600">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3.8B VNĐ</div>
            <p className="text-sm text-green-600 mt-2">+18% vs last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Tickets Sold
              </CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                <Users className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">45,678</div>
            <p className="text-sm text-green-600 mt-2">+12% vs last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Avg Occupancy
              </CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">72.5%</div>
            <p className="text-sm text-green-600 mt-2">+5.2% vs last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Movies
              </CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
                <Film className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">28</div>
            <p className="text-sm text-gray-600 mt-2">5 new releases</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <Tabs defaultValue="revenue">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="movies">Top Movies</TabsTrigger>
          <TabsTrigger value="cinemas">Cinemas</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
              <CardDescription>Monthly revenue analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                <div className="text-center text-gray-400">
                  <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                  <p>Revenue chart visualization</p>
                  <p className="text-sm mt-1">Integrate with charting library (recharts, chart.js)</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-600">Ticket Sales</p>
                  <p className="text-2xl font-bold mt-1">2.8B VNĐ</p>
                  <p className="text-sm text-green-600 mt-1">73% of total</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-600">Concessions</p>
                  <p className="text-2xl font-bold mt-1">850M VNĐ</p>
                  <p className="text-sm text-green-600 mt-1">22% of total</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-600">Other</p>
                  <p className="text-2xl font-bold mt-1">150M VNĐ</p>
                  <p className="text-sm text-gray-600 mt-1">5% of total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movies" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Movies</CardTitle>
              <CardDescription>Based on ticket sales and revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: 'Avatar: The Way of Water', revenue: '450M', tickets: 12500, rating: 4.8 },
                  { title: 'The Batman', revenue: '380M', tickets: 10800, rating: 4.6 },
                  { title: 'Spider-Man: No Way Home', revenue: '320M', tickets: 9200, rating: 4.7 },
                  { title: 'Everything Everywhere', revenue: '280M', tickets: 8500, rating: 4.9 },
                  { title: 'Top Gun: Maverick', revenue: '260M', tickets: 7800, rating: 4.5 },
                ].map((movie, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                      <div>
                        <p className="font-semibold">{movie.title}</p>
                        <p className="text-sm text-gray-600">{movie.tickets.toLocaleString()} tickets sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-purple-600">{movie.revenue} VNĐ</p>
                      <p className="text-sm text-yellow-600">★ {movie.rating}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cinemas" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Cinema Performance</CardTitle>
              <CardDescription>Revenue and occupancy by location</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Cinestar Quốc Thanh', revenue: '680M', occupancy: 78, screens: 8 },
                  { name: 'Cinestar Hai Bà Trưng', revenue: '620M', occupancy: 75, screens: 6 },
                  { name: 'Cinestar Kinh Dương Vương', revenue: '580M', occupancy: 72, screens: 7 },
                  { name: 'Cinestar Mỹ Tho', revenue: '450M', occupancy: 68, screens: 5 },
                ].map((cinema, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">{cinema.name}</p>
                      <p className="text-sm text-gray-600">{cinema.screens} screens</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Revenue</p>
                        <p className="font-bold">{cinema.revenue} VNĐ</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Occupancy</p>
                        <p className="font-bold text-green-600">{cinema.occupancy}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Insights</CardTitle>
              <CardDescription>User behavior and demographics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 border rounded-lg">
                  <h3 className="font-semibold mb-4">Age Distribution</h3>
                  <div className="space-y-3">
                    {[
                      { range: '18-24', percentage: 35 },
                      { range: '25-34', percentage: 40 },
                      { range: '35-44', percentage: 18 },
                      { range: '45+', percentage: 7 },
                    ].map((age) => (
                      <div key={age.range}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{age.range} years</span>
                          <span className="font-semibold">{age.percentage}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                            style={{ width: `${age.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 border rounded-lg">
                  <h3 className="font-semibold mb-4">Peak Hours</h3>
                  <div className="space-y-3">
                    {[
                      { time: '18:00 - 20:00', percentage: 45 },
                      { time: '20:00 - 22:00', percentage: 38 },
                      { time: '14:00 - 18:00', percentage: 12 },
                      { time: '10:00 - 14:00', percentage: 5 },
                    ].map((hour) => (
                      <div key={hour.time}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{hour.time}</span>
                          <span className="font-semibold">{hour.percentage}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-600 to-cyan-600"
                            style={{ width: `${hour.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}