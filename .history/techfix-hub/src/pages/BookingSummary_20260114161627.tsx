import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { userAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface Booking {
  id: string;
  service: string;
  date: string;
  time: string;
  status: 'pending' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
  worker_name?: string;
  worker_phone?: string;
  amount: number;
  otp?: string;
  completion_image?: string;
  rating?: number;
  used_components?: number;
  component_details?: string;
  warranty_months?: number;
  warranty_expiry?: string;
}

export default function BookingSummary() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load bookings from backend
  useEffect(() => {
    const loadBookings = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.id) {
          toast({
            title: "Error",
            description: "Please login to view bookings",
            variant: "destructive",
          });
          return;
        }

        const response = await userAPI.getBookings(user.id);
        if (response.success) {
          console.log('Bookings loaded:', response.bookings);
          response.bookings.forEach((b: Booking) => {
            if (b.otp) {
              console.log(`Booking ${b.id} has OTP: ${b.otp}, Status: ${b.status}`);
            }
          });
          setBookings(response.bookings);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load bookings",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
    // Refresh every 30 seconds to reduce lag
    const interval = setInterval(loadBookings, 30000);
    return () => clearInterval(interval);
  }, [toast]);

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

  const viewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setDetailsOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
          <p className="text-muted-foreground">View and track all your service bookings</p>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Bookings</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="warranty">With Warranty</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{booking.service}</CardTitle>
                      <CardDescription>Booking #{booking.id}</CardDescription>
                    </div>
                    <Badge variant={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Show OTP prominently at the top for active bookings */}
                  {booking.otp && ['pending', 'assigned', 'in-progress'].includes(booking.status) && (
                    <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-300 shadow-md">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">🔐</span>
                        <p className="font-bold text-blue-900 text-base sm:text-lg">Your Service OTP</p>
                      </div>
                      <p className="text-3xl sm:text-4xl font-mono font-bold text-blue-600 tracking-wider mb-2">{booking.otp}</p>
                      <p className="text-xs sm:text-sm text-blue-700 font-medium">⚠️ Share this OTP with the worker to verify service completion</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2 text-sm">
                      <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                      <p><strong>Time:</strong> {booking.time}</p>
                      <p><strong>Amount:</strong> ₹{booking.amount}</p>
                      {booking.worker_name && (
                        <>
                          <p><strong>Worker:</strong> {booking.worker_name}</p>
                          <p><strong>Contact:</strong> {booking.worker_phone}</p>
                        </>
                      )}
                    </div>
                    
                    {booking.status === 'completed' && (
                      <div className="space-y-2">
                        {booking.rating && (
                          <p><strong>Rating:</strong> {'⭐'.repeat(booking.rating)}</p>
                        )}
                        {booking.used_components && (
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="font-semibold text-sm mb-1">Components Replaced</p>
                            <p className="text-sm">{booking.component_details}</p>
                            <p className="text-sm mt-1">
                              <strong>Warranty:</strong> {booking.warranty_months} months
                            </p>
                            <p className="text-sm">
                              <strong>Valid Until:</strong> {booking.warranty_expiry && new Date(booking.warranty_expiry).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => viewDetails(booking)}
                  >
                    View Full Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="active">
            {bookings.filter(b => ['pending', 'assigned', 'in-progress'].includes(b.status)).map((booking) => (
              <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{booking.service}</CardTitle>
                      <CardDescription>Booking #{booking.id}</CardDescription>
                    </div>
                    <Badge variant={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Show OTP prominently */}
                  {booking.otp && (
                    <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-300 shadow-md">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">🔐</span>
                        <p className="font-bold text-blue-900 text-lg">Your Service OTP</p>
                      </div>
                      <p className="text-4xl font-mono font-bold text-blue-600 tracking-wider mb-2">{booking.otp}</p>
                      <p className="text-sm text-blue-700 font-medium">⚠️ Share this OTP with the worker to verify service completion</p>
                    </div>
                  )}
                  
                  <div className="space-y-2 text-sm">
                    <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {booking.time}</p>
                    {booking.worker_name && <p><strong>Worker:</strong> {booking.worker_name}</p>}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => viewDetails(booking)}
                  >
                    View Full Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="completed">
            {bookings.filter(b => b.status === 'completed').map((booking) => (
              <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{booking.service}</CardTitle>
                      <CardDescription>Booking #{booking.id}</CardDescription>
                    </div>
                    <Badge variant="default">Completed</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {booking.completionImage && (
                      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <img src={booking.completionImage} alt="Completion" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="space-y-2 text-sm">
                      <p><strong>Completed:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                      <p><strong>Worker:</strong> {booking.workerName}</p>
                      <p><strong>Amount Paid:</strong> ₹{booking.amount}</p>
                      {booking.rating && <p><strong>Your Rating:</strong> {'⭐'.repeat(booking.rating)}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="warranty">
            {bookings.filter(b => b.used_components).map((booking) => (
              <Card key={booking.id} className="hover:shadow-lg transition-shadow border-blue-200">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{booking.service}</CardTitle>
                      <CardDescription>Booking #{booking.id}</CardDescription>
                    </div>
                    <Badge variant="secondary">Under Warranty</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold mb-2">Warranty Information</h4>
                      <div className="space-y-1 text-sm">
                        <p><strong>Components:</strong> {booking.component_details}</p>
                        <p><strong>Warranty Period:</strong> {booking.warranty_months} months</p>
                        <p><strong>Valid Until:</strong> {booking.warranty_expiry && new Date(booking.warranty_expiry).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-sm space-y-1">
                      <p><strong>Completed:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                      <p><strong>Worker:</strong> {booking.workerName}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:max-w-[90vw]">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>Complete information about booking #{selectedBooking?.id}</DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold">Service</p>
                  <p>{selectedBooking.service}</p>
                </div>
                <div>
                  <p className="font-semibold">Status</p>
                  <Badge variant={getStatusColor(selectedBooking.status)}>
                    {selectedBooking.status}
                  </Badge>
                </div>
                <div>
                  <p className="font-semibold">Date</p>
                  <p>{new Date(selectedBooking.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-semibold">Time</p>
                  <p>{selectedBooking.time}</p>
                </div>
                <div>
                  <p className="font-semibold">Amount</p>
                  <p>₹{selectedBooking.amount}</p>
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
                  <p className="text-sm"><strong>Contact:</strong> {selectedBooking.worker_phone}</p>
                </div>
              )}

              {console.log('Details Dialog - OTP:', selectedBooking.otp, 'Status:', selectedBooking.status)}
              {selectedBooking.otp && ['pending', 'assigned', 'in-progress'].includes(selectedBooking.status) && (
                <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-300 shadow-md">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-3xl">🔐</span>
                    <p className="font-bold text-blue-900 text-xl">Your Service OTP</p>
                  </div>
                  <p className="text-5xl font-mono font-bold text-blue-600 tracking-wider mb-3">{selectedBooking.otp}</p>
                  <p className="text-sm text-blue-700 font-medium">⚠️ Share this OTP with the worker to verify service completion</p>
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

              {selectedBooking.used_components && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="font-semibold mb-2">Components & Warranty</p>
                  <div className="space-y-1 text-sm">
                    <p><strong>Components Used:</strong> {selectedBooking.component_details}</p>
                    <p><strong>Warranty Period:</strong> {selectedBooking.warranty_months} months</p>
                    <p><strong>Valid Until:</strong> {selectedBooking.warranty_expiry && new Date(selectedBooking.warranty_expiry).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
