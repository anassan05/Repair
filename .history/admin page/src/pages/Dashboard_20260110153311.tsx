import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LogOut, 
  RefreshCw, 
  Search, 
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  Wrench,
  Phone,
  MapPin,
  Calendar,
  Package,
  DollarSign,
  Star,
  MessageSquare,
  TrendingUp,
  Users,
  Laptop,
  UserCog
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Booking {
  id: string;
  device: string;
  issue: string;
  date: string;
  status: string;
  cost: string;
  discount: string;
  rating: number;
  name: string;
  phone: string;
  address: string;
  description: string;
  assignedWorker?: string;
  workerName?: string;
}

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [workers, setWorkers] = useState<any[]>([]);
  const [selectedWorkerForAssignment, setSelectedWorkerForAssignment] = useState("");

  const loadBookings = () => {
    const savedBookings = localStorage.getItem('repairBookings');
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }
    
    // Load workers
    const savedWorkers = localStorage.getItem('workers');
    if (savedWorkers) {
      setWorkers(JSON.parse(savedWorkers).filter((w: any) => w.active));
    }
  };

  useEffect(() => {
    loadBookings();
    
    // Auto-refresh every 5 seconds
    const interval = setInterval(loadBookings, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || booking.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const updateBookingStatus = (bookingId: string, newStatus: string, cost?: string) => {
    const updatedBookings = bookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: newStatus, ...(cost && { cost }) }
        : booking
    );
    setBookings(updatedBookings);
    localStorage.setItem('repairBookings', JSON.stringify(updatedBookings));
  };
  
  const assignWorkerToBooking = (bookingId: string, workerId: string) => {
    const worker = workers.find(w => w.workerId === workerId);
    if (!worker) return;
    
    const updatedBookings = bookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, assignedWorker: workerId, workerName: worker.name, status: 'Assigned' }
        : booking
    );
    setBookings(updatedBookings);
    localStorage.setItem('repairBookings', JSON.stringify(updatedBookings));
    setSelectedWorkerForAssignment("");
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'in progress':
        return <Wrench className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'in progress':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'completed':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'Pending').length,
    inProgress: bookings.filter(b => b.status === 'In Progress').length,
    completed: bookings.filter(b => b.status === 'Completed').length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg gradient-hero flex items-center justify-center">
                <Wrench className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold">TechFix Admin</h1>
                <p className="text-xs text-muted-foreground">Repair Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadBookings}
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={onLogout}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All repair requests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Awaiting action</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Wrench className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
              <p className="text-xs text-muted-foreground">Being repaired</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">Successfully done</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by ID, device, or customer name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        <Card>
          <CardHeader>
            <CardTitle>Repair Bookings ({filteredBookings.length})</CardTitle>
            <CardDescription>
              Manage and track all customer repair requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <Laptop className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== "all" 
                    ? "Try adjusting your search or filter" 
                    : "Waiting for customers to book repairs"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedBooking(booking);
                      setIsDetailOpen(true);
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{booking.id}</h3>
                          <Badge variant="outline" className={getStatusColor(booking.status)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(booking.status)}
                              {booking.status}
                            </span>
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-foreground">{booking.device}</p>
                        <p className="text-sm text-muted-foreground">{booking.issue}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-foreground">{booking.cost}</p>
                        {booking.discount !== "₹0" && (
                          <p className="text-xs text-green-600">Discount: {booking.discount}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{booking.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{booking.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{booking.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Booking Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  Booking Details - {selectedBooking.id}
                </DialogTitle>
                <DialogDescription>
                  View and manage this repair booking
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Worker Assignment */}
                <div className="space-y-3">
                  <Label>Assign Worker</Label>
                  {selectedBooking.assignedWorker ? (
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-accent/50">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{selectedBooking.workerName}</span>
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-600">
                          Assigned
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => assignWorkerToBooking(selectedBooking.id, "")}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Select
                        value={selectedWorkerForAssignment}
                        onValueChange={setSelectedWorkerForAssignment}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select a worker" />
                        </SelectTrigger>
                        <SelectContent>
                          {workers.length === 0 ? (
                            <div className="p-2 text-sm text-muted-foreground">
                              No active workers available
                            </div>
                          ) : (
                            workers.map((worker) => (
                              <SelectItem key={worker.workerId} value={worker.workerId}>
                                {worker.name} ({worker.workerId})
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={() => {
                          if (selectedWorkerForAssignment) {
                            assignWorkerToBooking(selectedBooking.id, selectedWorkerForAssignment);
                          }
                        }}
                        disabled={!selectedWorkerForAssignment}
                      >
                        Assign
                      </Button>
                    </div>
                  )}
                </div>

                {/* Status Update */}
                <div className="space-y-3">
                  <Label>Update Status</Label>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={selectedBooking.status === "Pending" ? "default" : "outline"}
                      onClick={() => updateBookingStatus(selectedBooking.id, "Pending")}
                      className="flex-1"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Pending
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedBooking.status === "In Progress" ? "default" : "outline"}
                      onClick={() => updateBookingStatus(selectedBooking.id, "In Progress")}
                      className="flex-1"
                    >
                      <Wrench className="w-4 h-4 mr-2" />
                      In Progress
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedBooking.status === "Completed" ? "default" : "outline"}
                      onClick={() => updateBookingStatus(selectedBooking.id, "Completed")}
                      className="flex-1"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Completed
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Device Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Device:</span>
                      <span className="font-medium">{selectedBooking.device}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Issue:</span>
                      <span className="font-medium">{selectedBooking.issue}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Customer Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">{selectedBooking.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-medium">{selectedBooking.phone}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-muted-foreground">Address:</span>
                      <span className="font-medium text-right max-w-xs">{selectedBooking.address}</span>
                    </div>
                  </div>
                </div>

                {selectedBooking.description && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Additional Notes</h4>
                    <p className="text-sm text-muted-foreground">{selectedBooking.description}</p>
                  </div>
                )}

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Pricing</h4>
                  <div className="space-y-2">
                    <Label htmlFor="cost">Repair Cost</Label>
                    <div className="flex gap-2">
                      <Input
                        id="cost"
                        placeholder="Enter cost (e.g., ₹2,500)"
                        defaultValue={selectedBooking.cost !== "TBD" ? selectedBooking.cost : ""}
                      />
                      <Button
                        onClick={() => {
                          const input = document.getElementById('cost') as HTMLInputElement;
                          if (input.value) {
                            updateBookingStatus(selectedBooking.id, selectedBooking.status, input.value);
                            setIsDetailOpen(false);
                          }
                        }}
                      >
                        Update
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsDetailOpen(false)}
                  >
                    Close
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      updateBookingStatus(selectedBooking.id, "Cancelled");
                      setIsDetailOpen(false);
                    }}
                  >
                    Cancel Booking
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
