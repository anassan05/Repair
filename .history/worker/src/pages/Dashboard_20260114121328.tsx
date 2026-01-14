import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { workerAPI } from '@/services/api';

interface Booking {
  id: string;
  service: string;
  customerName: string;
  address: string;
  scheduledDate: string;
  status: string;
  otp: string;
}

export default function Dashboard() {
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [closeBookingDialogOpen, setCloseBookingDialogOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [completionImage, setCompletionImage] = useState<File | null>(null);
  const [usedNewComponents, setUsedNewComponents] = useState(false);
  const [componentDetails, setComponentDetails] = useState('');
  const [warrantyMonths, setWarrantyMonths] = useState('');
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [closingBooking, setClosingBooking] = useState(false);
  const [assignedBookings, setAssignedBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Get worker data
  const getWorkerData = () => {
    const workerStr = localStorage.getItem('worker');
    if (workerStr) {
      return JSON.parse(workerStr);
    }
    return null;
  };

  // Load assigned bookings on mount
  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    const worker = getWorkerData();
    if (!worker) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const response = await workerAPI.getBookings(worker.id);
      if (response.success) {
        // Transform backend data to match UI format
        const transformedBookings = response.bookings.map((b: any) => ({
          id: b.id,
          service: b.service,
          customerName: b.customer_name,
          address: b.customer_address,
          scheduledDate: b.date,
          status: b.status,
          otp: b.otp,
        }));
        setAssignedBookings(transformedBookings);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickOtpEntry = () => {
    setOtpDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading bookings...</p>
        </div>
      </div>
    );
  }

  const handleVerifyOtp = async () => {
    setVerifyingOtp(true);
    try {
      // API call to verify OTP
      const response = await fetch('/api/worker/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp }),
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedBooking(data.booking);
        setOtpDialogOpen(false);
        setCloseBookingDialogOpen(true);
        setOtp('');
      } else {
        alert('Invalid OTP. Please try again.');
      }
    } catch (error) {
      alert('Error verifying OTP');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleCloseBooking = async () => {
    if (!completionImage) {
      alert('Please upload a completion image');
      return;
    }

    if (usedNewComponents && (!componentDetails || !warrantyMonths)) {
      alert('Please provide component details and warranty period');
      return;
    }

    setClosingBooking(true);
    try {
      const formData = new FormData();
      formData.append('bookingId', selectedBooking?.id || '');
      formData.append('completionImage', completionImage);
      formData.append('usedNewComponents', String(usedNewComponents));
      if (usedNewComponents) {
        formData.append('componentDetails', componentDetails);
        formData.append('warrantyMonths', warrantyMonths);
      }

      const response = await fetch('/api/worker/close-booking', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Booking closed successfully!');
        setCloseBookingDialogOpen(false);
        setSelectedBooking(null);
        setCompletionImage(null);
        setUsedNewComponents(false);
        setComponentDetails('');
        setWarrantyMonths('');
        // Refresh bookings
      } else {
        alert('Error closing booking');
      }
    } catch (error) {
      alert('Error closing booking');
    } finally {
      setClosingBooking(false);
    }
  };

  const startWork = (booking: Booking) => {
    setSelectedBooking(booking);
    setCloseBookingDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Worker Dashboard</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/profile')}>
              Profile
            </Button>
            <Button variant="ghost" onClick={() => {
              localStorage.removeItem('worker');
              navigate('/login');
            }}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Quick OTP Entry */}
        <Card className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardHeader>
            <CardTitle className="text-white">Quick OTP Entry</CardTitle>
            <CardDescription className="text-blue-100">
              Enter customer OTP to close a booking quickly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={handleQuickOtpEntry}
              className="w-full sm:w-auto"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Enter OTP
            </Button>
          </CardContent>
        </Card>

        {/* Today's Assigned Bookings */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Assigned Bookings</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {assignedBookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{booking.service}</CardTitle>
                      <CardDescription>Booking #{booking.id}</CardDescription>
                    </div>
                    <Badge variant={booking.status === 'assigned' ? 'default' : 'secondary'}>
                      {booking.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>Customer:</strong> {booking.customerName}</p>
                    <p><strong>Address:</strong> {booking.address}</p>
                    <p><strong>Date:</strong> {new Date(booking.scheduledDate).toLocaleDateString()}</p>
                  </div>
                  <Button 
                    className="w-full mt-4"
                    onClick={() => startWork(booking)}
                  >
                    Complete Service
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Quick OTP Dialog */}
      <Dialog open={otpDialogOpen} onOpenChange={setOtpDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Customer OTP</DialogTitle>
            <DialogDescription>
              Enter the OTP provided by the customer to verify service completion
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="otp">OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOtpDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleVerifyOtp} disabled={verifyingOtp || otp.length !== 6}>
              {verifyingOtp ? 'Verifying...' : 'Verify & Continue'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Close Booking Dialog */}
      <Dialog open={closeBookingDialogOpen} onOpenChange={setCloseBookingDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Close Booking</DialogTitle>
            <DialogDescription>
              Upload completion image and provide service details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedBooking && (
              <Alert>
                <AlertDescription>
                  <strong>Booking:</strong> {selectedBooking.id} - {selectedBooking.service}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="image">Completion Image *</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setCompletionImage(e.target.files?.[0] || null)}
              />
              <p className="text-sm text-muted-foreground">
                Upload a photo showing the completed work
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="components"
                checked={usedNewComponents}
                onCheckedChange={(checked) => setUsedNewComponents(checked as boolean)}
              />
              <Label htmlFor="components" className="cursor-pointer">
                Did you use any new components?
              </Label>
            </div>

            {usedNewComponents && (
              <div className="space-y-4 pl-6 border-l-2 border-blue-200">
                <div className="space-y-2">
                  <Label htmlFor="components-details">Component Details *</Label>
                  <Textarea
                    id="components-details"
                    placeholder="List the components used (e.g., Compressor, Thermostat, etc.)"
                    value={componentDetails}
                    onChange={(e) => setComponentDetails(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warranty">Warranty Period (months) *</Label>
                  <Input
                    id="warranty"
                    type="number"
                    placeholder="Enter warranty period"
                    value={warrantyMonths}
                    onChange={(e) => setWarrantyMonths(e.target.value)}
                    min="1"
                    max="60"
                  />
                  <p className="text-sm text-muted-foreground">
                    This warranty information will be sent to admin and customer
                  </p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCloseBookingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCloseBooking} disabled={closingBooking}>
              {closingBooking ? 'Closing...' : 'Close Booking'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
