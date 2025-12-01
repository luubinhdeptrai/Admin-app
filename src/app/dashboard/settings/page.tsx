// src/app/(dashboard)/settings/page.tsx
'use client';

import { useState } from 'react';
import { Save, Bell, Lock, User, Globe, CreditCard, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

export default function SettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Profile Settings
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@cinestar.vn',
    phone: '+84 123 456 789',
    role: 'Super Admin',
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    newBooking: true,
    dailyReport: true,
    systemAlerts: true,
    marketingEmails: false,
  });

  // System Settings
  const [system, setSystem] = useState({
    language: 'vi',
    timezone: 'Asia/Ho_Chi_Minh',
    dateFormat: 'DD/MM/YYYY',
    currency: 'VND',
  });

  // Theme Settings
  const [theme, setTheme] = useState({
    mode: 'dark',
    accentColor: 'purple',
  });

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // await api.put('/settings/profile', profile);
      setTimeout(() => {
        toast({
          title: 'Success',
          description: 'Profile settings saved successfully',
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save profile settings',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        toast({
          title: 'Success',
          description: 'Notification preferences saved successfully',
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save notification settings',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account and application preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Lock className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-2">
            <Globe className="h-4 w-4" />
            System
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your account profile information and email address
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-3xl font-bold">
                  AD
                </div>
                <div>
                  <Button variant="outline">Change Avatar</Button>
                  <p className="text-sm text-gray-500 mt-2">JPG, GIF or PNG. Max size 2MB.</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" value={profile.role} disabled />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Notification Channels</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, emailNotifications: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                    </div>
                    <Switch
                      checked={notifications.smsNotifications}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, smsNotifications: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Notification Types</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New Bookings</p>
                      <p className="text-sm text-gray-500">Get notified when a new booking is made</p>
                    </div>
                    <Switch
                      checked={notifications.newBooking}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, newBooking: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Daily Reports</p>
                      <p className="text-sm text-gray-500">Receive daily performance reports</p>
                    </div>
                    <Switch
                      checked={notifications.dailyReport}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, dailyReport: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">System Alerts</p>
                      <p className="text-sm text-gray-500">Important system notifications</p>
                    </div>
                    <Switch
                      checked={notifications.systemAlerts}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, systemAlerts: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Marketing Emails</p>
                      <p className="text-sm text-gray-500">Promotional content and updates</p>
                    </div>
                    <Switch
                      checked={notifications.marketingEmails}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, marketingEmails: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveNotifications}
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Enable 2FA</p>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <Switch />
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Active Sessions</h3>
                <div className="space-y-3">
                  {[
                    { device: 'Chrome on Windows', location: 'Ho Chi Minh City, Vietnam', time: 'Current session' },
                    { device: 'Safari on iPhone', location: 'Ho Chi Minh City, Vietnam', time: '2 hours ago' },
                  ].map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{session.device}</p>
                        <p className="text-sm text-gray-500">{session.location} • {session.time}</p>
                      </div>
                      {index !== 0 && (
                        <Button variant="outline" size="sm">
                          Revoke
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Save className="mr-2 h-4 w-4" />
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Preferences</CardTitle>
              <CardDescription>
                Configure system-wide settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={system.language} onValueChange={(value) => setSystem({ ...system, language: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vi">Tiếng Việt</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={system.timezone} onValueChange={(value) => setSystem({ ...system, timezone: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Ho_Chi_Minh">Ho Chi Minh (GMT+7)</SelectItem>
                      <SelectItem value="Asia/Bangkok">Bangkok (GMT+7)</SelectItem>
                      <SelectItem value="Asia/Singapore">Singapore (GMT+8)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date-format">Date Format</Label>
                  <Select value={system.dateFormat} onValueChange={(value) => setSystem({ ...system, dateFormat: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={system.currency} onValueChange={(value) => setSystem({ ...system, currency: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VND">VND (₫)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Advanced Options</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Automatic Backups</p>
                      <p className="text-sm text-gray-500">Automatically backup data daily</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Debug Mode</p>
                      <p className="text-sm text-gray-500">Enable detailed error logging</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">API Rate Limiting</p>
                      <p className="text-sm text-gray-500">Limit API requests per minute</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Settings */}
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Subscription</CardTitle>
              <CardDescription>
                Manage your subscription and payment methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 border-2 border-purple-200 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold">Enterprise Plan</h3>
                    <p className="text-gray-600">Unlimited cinemas & features</p>
                  </div>
                  <Badge className="bg-purple-600 text-white">Active</Badge>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">$299</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center text-white font-bold text-xs">
                        VISA
                      </div>
                      <div>
                        <p className="font-medium">•••• •••• •••• 4242</p>
                        <p className="text-sm text-gray-500">Expires 12/2025</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Default</Badge>
                  </div>
                  <Button variant="outline" className="w-full">
                    + Add Payment Method
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Billing History</h3>
                <div className="space-y-2">
                  {[
                    { date: 'Jan 1, 2025', amount: '$299.00', status: 'Paid' },
                    { date: 'Dec 1, 2024', amount: '$299.00', status: 'Paid' },
                    { date: 'Nov 1, 2024', amount: '$299.00', status: 'Paid' },
                  ].map((invoice, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{invoice.date}</p>
                        <p className="text-sm text-gray-500">{invoice.amount}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-green-100 text-green-700">{invoice.status}</Badge>
                        <Button variant="ghost" size="sm">Download</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Theme</h3>
                <div className="grid grid-cols-3 gap-4">
                  {['light', 'dark', 'auto'].map((mode) => (
                    <button
                      key={mode}
                      className={`p-4 border-2 rounded-lg text-center capitalize ${
                        theme.mode === mode ? 'border-purple-600 bg-purple-50' : 'border-gray-200'
                      }`}
                      onClick={() => setTheme({ ...theme, mode })}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Accent Color</h3>
                <div className="grid grid-cols-6 gap-3">
                  {[
                    { name: 'purple', color: 'bg-purple-600' },
                    { name: 'blue', color: 'bg-blue-600' },
                    { name: 'green', color: 'bg-green-600' },
                    { name: 'red', color: 'bg-red-600' },
                    { name: 'orange', color: 'bg-orange-600' },
                    { name: 'pink', color: 'bg-pink-600' },
                  ].map((color) => (
                    <button
                      key={color.name}
                      className={`h-12 rounded-lg ${color.color} ${
                        theme.accentColor === color.name ? 'ring-4 ring-offset-2 ring-gray-400' : ''
                      }`}
                      onClick={() => setTheme({ ...theme, accentColor: color.name })}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}