import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { ArrowLeft, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface Booking {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  service: string;
  date: string;
  time: string;
  status: 'pending' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
  worker_id?: string;
  worker_name?: string;
  amount: number;
  otp?: string;
  completion_image?: string;
  rating?: number;
  used_components?: number;
  component_details?: string;
  warranty_months?: number;
  warranty_expiry?: string;
}

interface Worker {
  id: string;
  name: string;
  specialty: string;
  phone: string;
}

export default function AdminBookingSummary() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load data from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        const [bookingsRes, workersRes] = await Promise.all([
          adminAPI.getBookings(statusFilter === 'all' ? undefined : statusFilter),
          adminAPI.getWorkers(),
        ]);

        if (bookingsRes.success) setBookings(bookingsRes.bookings);
        if (workersRes.success) setWorkers(workersRes.workers);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, [statusFilter, toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in-progress': return 'secondary';
      case 'assigned': return 'outline';
      case 'pending': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'default';
    }
  };

  const filteredBookings = statusFilter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === statusFilter);

  const handleAssignWorker = (booking: Booking) => {
    setSelectedBooking(booking);
    setAssignDialogOpen(true);
  };

  const confirmAssignment = async () => {
    if (selectedBooking && selectedWorker) {
      try {
        const response = await adminAPI.assignWorker(selectedBooking.id, selectedWorker);

        if (response.success) {
          toast({
            title: "Worker Assigned",
            description: "Worker has been notified",
          });

          // Refresh bookings
          const bookingsRes = await adminAPI.getBookings(statusFilter === 'all' ? undefined : statusFilter);
          if (bookingsRes.success) setBookings(bookingsRes.bookings);

          setAssignDialogOpen(false);
          setSelectedWorker('');
        }
      } catch (error) {
        toast({
          title: "Assignment Failed",
          description: "Please try again",
          variant: "destructive",
        });
      }
    }
  };

  const viewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setDetailsOpen(true);
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    active: bookings.filter(b => ['assigned', 'in-progress'].includes(b.status)).length,
    completed: bookings.filter(b => b.status === 'completed').length,
    revenue: bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.amount, 0),
    withWarranty: bookings.filter(b => b.used_components).length,
  };

  if (loading) {
    return (
      <div className="p-8">
        <p>Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Booking Management</h1>
        <p className="text-muted-foreground">View and manage all service bookings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-3xl">{stats.pending}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active</CardDescription>
            <CardTitle className="text-3xl">{stats.active}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl">{stats.completed}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Revenue</CardDescription>
            <CardTitle className="text-2xl">₹{stats.revenue}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Warranty</CardDescription>
            <CardTitle className="text-3xl">{stats.withWarranty}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Bookings</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>Manage and track service bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Worker</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-mono">{booking.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{booking.customer_name}</div>
                      <div className="text-sm text-muted-foreground">{booking.customer_phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{booking.service}</TableCell>
                  <TableCell>
                    <div>
                      <div>{new Date(booking.date).toLocaleDateString()}</div>
                      <div className="text-sm text-muted-foreground">{booking.time}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {booking.worker_name ? (
                      <div>
                        <div className="font-medium">{booking.worker_name}</div>
                        <div className="text-sm text-muted-foreground">{booking.worker_id}</div>
                      </div>
                    ) : (
                      <Badge variant="outline">Not Assigned</Badge>
                    )}
                  </TableCell>
                  <TableCell>₹{booking.amount}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => viewDetails(booking)}
                      >
                        Details
                      </Button>
                      {booking.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleAssignWorker(booking)}
                        >
                          Assign
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Assign Worker Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Worker</DialogTitle>
            <DialogDescription>
              Select a worker for booking #{selectedBooking?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Service: {selectedBooking?.service}</Label>
              <Label>Customer: {selectedBooking?.customer_name}</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="worker">Select Worker</Label>
              <Select value={selectedWorker} onValueChange={setSelectedWorker}>
                <SelectTrigger id="worker">
                  <SelectValue placeholder="Choose a worker" />
                </SelectTrigger>
                <SelectContent>
                  {workers.map((worker) => (
                    <SelectItem key={worker.id} value={worker.id}>
                      {worker.name} - {worker.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmAssignment} disabled={!selectedWorker}>
              Assign Worker
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>Complete information for booking #{selectedBooking?.id}</DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold">Customer</p>
                  <p>{selectedBooking.customer_name}</p>
                  <p className="text-muted-foreground">{selectedBooking.customer_phone}</p>
                </div>
                <div>
                  <p className="font-semibold">Service</p>
                  <p>{selectedBooking.service}</p>
                </div>
                <div>
                  <p className="font-semibold">Date & Time</p>
                  <p>{new Date(selectedBooking.date).toLocaleDateString()}</p>
                  <p>{selectedBooking.time}</p>
                </div>
                <div>
                  <p className="font-semibold">Amount</p>
                  <p>₹{selectedBooking.amount}</p>
                </div>
                <div>
                  <p className="font-semibold">Status</p>
                  <Badge variant={getStatusColor(selectedBooking.status)}>
                    {selectedBooking.status}
                  </Badge>
                </div>
                {selectedBooking.rating && (
                  <div>
                    <p className="font-semibold">Rating</p>
                    <p>{'⭐'.repeat(selectedBooking.rating)}</p>
                  </div>
                )}
              </div>

              {selectedBooking.worker_name && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-semibold mb-2">Worker Information</p>
                  <p className="text-sm"><strong>Name:</strong> {selectedBooking.worker_name}</p>
                  <p className="text-sm"><strong>ID:</strong> {selectedBooking.worker_id}</p>
                </div>
              )}

              {selectedBooking.otp && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-semibold mb-2">Customer OTP</p>
                  <p className="text-2xl font-mono">{selectedBooking.otp}</p>
                </div>
              )}

              {selectedBooking.completionImage && (
                <div>
                  <p className="font-semibold mb-2">Completion Image</p>
                  <img 
                    src={selectedBooking.completionImage} 
                    alt="Completion" 
                    className="w-full rounded-lg"
                  />
                </div>
              )}

              {selectedBooking.usedComponents && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="font-semibold mb-2">Components & Warranty</p>
                  <div className="space-y-1 text-sm">
                    <p><strong>Components Used:</strong> {selectedBooking.componentDetails}</p>
                    <p><strong>Warranty Period:</strong> {selectedBooking.warrantyMonths} months</p>
                    <p><strong>Valid Until:</strong> {selectedBooking.warrantyExpiry && new Date(selectedBooking.warrantyExpiry).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
