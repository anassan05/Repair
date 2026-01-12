import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, LogOut } from 'lucide-react';

interface Report {
  id: string;
  bookingId: string;
  workerName: string;
  customerName: string;
  service: string;
  completedDate: string;
  rating: number;
  usedComponents: boolean;
  componentDetails?: string;
  warrantyMonths?: number;
  amount: number;
  status: string;
}

interface ComponentUsage {
  component: string;
  quantity: number;
  totalCost: number;
  bookings: number;
}

export default function Reports() {
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState('this-month');
  const [workerFilter, setWorkerFilter] = useState('all');

  // Mock data
  const reports: Report[] = [
    {
      id: '1',
      bookingId: 'BK045',
      workerName: 'Rajesh Kumar',
      customerName: 'John Doe',
      service: 'AC Repair',
      completedDate: '2026-01-09',
      rating: 5,
      usedComponents: true,
      componentDetails: 'Compressor, Gas Refill',
      warrantyMonths: 12,
      amount: 3500,
      status: 'completed',
    },
    {
      id: '2',
      bookingId: 'BK043',
      workerName: 'Amit Patel',
      customerName: 'Jane Smith',
      service: 'Washing Machine Service',
      completedDate: '2026-01-08',
      rating: 4,
      usedComponents: false,
      amount: 800,
      status: 'completed',
    },
    {
      id: '3',
      bookingId: 'BK040',
      workerName: 'Rajesh Kumar',
      customerName: 'Mike Johnson',
      service: 'Refrigerator Repair',
      completedDate: '2026-01-07',
      rating: 5,
      usedComponents: true,
      componentDetails: 'Thermostat',
      warrantyMonths: 6,
      amount: 1500,
      status: 'completed',
    },
  ];

  const componentUsage: ComponentUsage[] = [
    { component: 'Compressor', quantity: 5, totalCost: 15000, bookings: 5 },
    { component: 'Thermostat', quantity: 12, totalCost: 18000, bookings: 12 },
    { component: 'Gas Refill', quantity: 20, totalCost: 10000, bookings: 20 },
    { component: 'Motor', quantity: 8, totalCost: 24000, bookings: 8 },
  ];

  const stats = {
    totalBookings: reports.length,
    totalRevenue: reports.reduce((sum, r) => sum + r.amount, 0),
    avgRating: (reports.reduce((sum, r) => sum + r.rating, 0) / reports.length).toFixed(1),
    componentsUsed: reports.filter(r => r.usedComponents).length,
    warrantyActive: reports.filter(r => r.usedComponents).length,
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground">View comprehensive reports and insights</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="this-week">This Week</SelectItem>
            <SelectItem value="this-month">This Month</SelectItem>
            <SelectItem value="last-month">Last Month</SelectItem>
            <SelectItem value="this-year">This Year</SelectItem>
          </SelectContent>
        </Select>

        <Select value={workerFilter} onValueChange={setWorkerFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select worker" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Workers</SelectItem>
            <SelectItem value="WKR001">Rajesh Kumar</SelectItem>
            <SelectItem value="WKR002">Amit Patel</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Report
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Bookings</CardDescription>
            <CardTitle className="text-3xl">{stats.totalBookings}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-3xl">₹{stats.totalRevenue}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Average Rating</CardDescription>
            <CardTitle className="text-3xl">{stats.avgRating} ⭐</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Components Used</CardDescription>
            <CardTitle className="text-3xl">{stats.componentsUsed}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active Warranties</CardDescription>
            <CardTitle className="text-3xl">{stats.warrantyActive}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="bookings">
        <TabsList>
          <TabsTrigger value="bookings">Booking Reports</TabsTrigger>
          <TabsTrigger value="components">Component Usage</TabsTrigger>
          <TabsTrigger value="workers">Worker Performance</TabsTrigger>
          <TabsTrigger value="warranty">Warranty Tracking</TabsTrigger>
        </TabsList>

        {/* Bookings Tab */}
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Completed Bookings</CardTitle>
              <CardDescription>All completed service bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Worker</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Components</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-mono">{report.bookingId}</TableCell>
                      <TableCell>{report.service}</TableCell>
                      <TableCell>{report.workerName}</TableCell>
                      <TableCell>{report.customerName}</TableCell>
                      <TableCell>{new Date(report.completedDate).toLocaleDateString()}</TableCell>
                      <TableCell>₹{report.amount}</TableCell>
                      <TableCell>{'⭐'.repeat(report.rating)}</TableCell>
                      <TableCell>
                        {report.usedComponents ? (
                          <Badge variant="secondary">Yes</Badge>
                        ) : (
                          <Badge variant="outline">No</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Components Tab */}
        <TabsContent value="components">
          <Card>
            <CardHeader>
              <CardTitle>Component Usage Report</CardTitle>
              <CardDescription>Track components used across all bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Component</TableHead>
                    <TableHead>Quantity Used</TableHead>
                    <TableHead>Total Cost</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead>Avg Cost/Unit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {componentUsage.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.component}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>₹{item.totalCost}</TableCell>
                      <TableCell>{item.bookings}</TableCell>
                      <TableCell>₹{Math.round(item.totalCost / item.quantity)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workers Tab */}
        <TabsContent value="workers">
          <Card>
            <CardHeader>
              <CardTitle>Worker Performance</CardTitle>
              <CardDescription>Individual worker statistics and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Worker</TableHead>
                    <TableHead>Total Jobs</TableHead>
                    <TableHead>Avg Rating</TableHead>
                    <TableHead>Revenue Generated</TableHead>
                    <TableHead>Components Used</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Rajesh Kumar</TableCell>
                    <TableCell>47</TableCell>
                    <TableCell>4.6 ⭐</TableCell>
                    <TableCell>₹235,000</TableCell>
                    <TableCell>28</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Amit Patel</TableCell>
                    <TableCell>32</TableCell>
                    <TableCell>4.3 ⭐</TableCell>
                    <TableCell>₹160,000</TableCell>
                    <TableCell>15</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Warranty Tab */}
        <TabsContent value="warranty">
          <Card>
            <CardHeader>
              <CardTitle>Warranty Tracking</CardTitle>
              <CardDescription>Active warranties and component replacements</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Components</TableHead>
                    <TableHead>Warranty Period</TableHead>
                    <TableHead>Expires On</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.filter(r => r.usedComponents).map((report) => {
                    const expiryDate = new Date(report.completedDate);
                    expiryDate.setMonth(expiryDate.getMonth() + (report.warrantyMonths || 0));
                    const isActive = expiryDate > new Date();

                    return (
                      <TableRow key={report.id}>
                        <TableCell className="font-mono">{report.bookingId}</TableCell>
                        <TableCell>{report.customerName}</TableCell>
                        <TableCell>{report.service}</TableCell>
                        <TableCell>{report.componentDetails}</TableCell>
                        <TableCell>{report.warrantyMonths} months</TableCell>
                        <TableCell>{expiryDate.toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={isActive ? 'default' : 'secondary'}>
                            {isActive ? 'Active' : 'Expired'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
