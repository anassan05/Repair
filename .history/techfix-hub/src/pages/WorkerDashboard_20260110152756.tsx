import { useState, useEffect } from "react";
import { 
  Wrench, 
  MapPin, 
  Phone, 
  Calendar,
  CheckCircle,
  Clock,
  Upload,
  Camera,
  Hash,
  Package,
  AlertCircle,
  LogOut,
  User,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface WorkerDashboardProps {
  currentWorker: any;
  onLogout: () => void;
}

const WorkerDashboard = ({ currentWorker, onLogout }: WorkerDashboardProps) => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [completionData, setCompletionData] = useState({
    photos: [] as string[],
    componentsUsed: false,
    componentsList: "",
    warrantyMonths: 0,
    notes: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadAssignedBookings();
    const interval = setInterval(loadAssignedBookings, 10000);
    return () => clearInterval(interval);
  }, [currentWorker]);

  const loadAssignedBookings = () => {
    const allBookings = JSON.parse(localStorage.getItem('repairBookings') || '[]');
    const myBookings = allBookings.filter(
      (b: any) => b.assignedWorker === currentWorker.workerId && b.status !== 'Completed' && b.status !== 'Cancelled'
    );
    setBookings(myBookings);
  };

  const generateOTP = (booking: any) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Update booking with OTP
    const allBookings = JSON.parse(localStorage.getItem('repairBookings') || '[]');
    const updatedBookings = allBookings.map((b: any) =>
      b.id === booking.id ? { ...b, workerOtp: otp, otpGeneratedAt: new Date().toISOString() } : b
    );
    localStorage.setItem('repairBookings', JSON.stringify(updatedBookings));
    
    alert(`OTP sent to customer: ${otp}\n(In production, this would be sent via SMS to ${booking.phone})`);
    setSelectedBooking({ ...booking, workerOtp: otp });
    setIsOtpDialogOpen(true);
  };

  const verifyOTP = () => {
    if (otp === selectedBooking?.workerOtp) {
      // Update status to In Progress
      const allBookings = JSON.parse(localStorage.getItem('repairBookings') || '[]');
      const updatedBookings = allBookings.map((b: any) =>
        b.id === selectedBooking.id 
          ? { ...b, status: 'In Progress', workerStartedAt: new Date().toISOString() } 
          : b
      );
      localStorage.setItem('repairBookings', JSON.stringify(updatedBookings));
      
      setIsOtpDialogOpen(false);
      setOtp("");
      loadAssignedBookings();
      alert("Service started! OTP verified successfully.");
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const readers = Array.from(files).map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });
      
      Promise.all(readers).then(results => {
        setCompletionData(prev => ({
          ...prev,
          photos: [...prev.photos, ...results]
        }));
      });
    }
  };

  const completeBooking = () => {
    if (completionData.photos.length === 0) {
      alert("Please upload at least one photo before completing the service.");
      return;
    }

    if (completionData.componentsUsed && !completionData.componentsList) {
      alert("Please list the components used.");
      return;
    }

    // Update booking with completion data
    const allBookings = JSON.parse(localStorage.getItem('repairBookings') || '[]');
    const updatedBookings = allBookings.map((b: any) =>
      b.id === selectedBooking.id 
        ? { 
            ...b, 
            status: 'Completed',
            completedAt: new Date().toISOString(),
            completionPhotos: completionData.photos,
            componentsUsed: completionData.componentsUsed,
            componentsList: completionData.componentsList,
            warrantyMonths: completionData.componentsUsed ? completionData.warrantyMonths : 0,
            workerNotes: completionData.notes,
            completedBy: currentWorker.workerId,
            completedByName: currentWorker.name,
          } 
        : b
    );
    localStorage.setItem('repairBookings', JSON.stringify(updatedBookings));
    
    setIsCompleteDialogOpen(false);
    setSelectedBooking(null);
    setCompletionData({
      photos: [],
      componentsUsed: false,
      componentsList: "",
      warrantyMonths: 0,
      notes: "",
    });
    loadAssignedBookings();
    alert("Service completed successfully!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Assigned':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'In Progress':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const stats = {
    assigned: bookings.filter(b => b.status === 'Assigned').length,
    inProgress: bookings.filter(b => b.status === 'In Progress').length,
    total: bookings.length,
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
                <h1 className="text-xl font-display font-bold">Worker Portal</h1>
                <p className="text-xs text-muted-foreground">Welcome, {currentWorker.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/worker/profile')}
                className="gap-2"
              >
                <User className="w-4 h-4" />
                Profile
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
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assigned Jobs</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.assigned}</div>
              <p className="text-xs text-muted-foreground">Waiting to start</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Wrench className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
              <p className="text-xs text-muted-foreground">Currently working</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Active</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All assignments</p>
            </CardContent>
          </Card>
        </div>

        {/* Bookings List */}
        <Card>
          <CardHeader>
            <CardTitle>My Assigned Jobs</CardTitle>
            <CardDescription>
              Jobs assigned to you by admin
            </CardDescription>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <Wrench className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No jobs assigned</h3>
                <p className="text-muted-foreground">
                  Check back later for new assignments
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{booking.id}</h3>
                          <Badge variant="outline" className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-foreground">{booking.device}</p>
                        <p className="text-sm text-muted-foreground">{booking.issue}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span>{booking.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{booking.phone}</span>
                      </div>
                      <div className="flex items-start gap-2 text-muted-foreground md:col-span-2">
                        <MapPin className="w-4 h-4 mt-0.5" />
                        <span>{booking.address}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {booking.status === 'Assigned' && (
                        <Button
                          size="sm"
                          onClick={() => generateOTP(booking)}
                          className="gradient-hero"
                        >
                          <Hash className="w-4 h-4 mr-2" />
                          Start Service (Send OTP)
                        </Button>
                      )}
                      {booking.status === 'In Progress' && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setIsCompleteDialogOpen(true);
                          }}
                          className="gradient-hero"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Complete Service
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* OTP Verification Dialog */}
      <Dialog open={isOtpDialogOpen} onOpenChange={setIsOtpDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Customer OTP</DialogTitle>
            <DialogDescription>
              Ask customer for the OTP sent to their phone
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Enter OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="text-center text-2xl tracking-widest"
              />
            </div>
            <Button onClick={verifyOTP} className="w-full gradient-hero">
              Verify & Start Service
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Complete Service Dialog */}
      <Dialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Complete Service</DialogTitle>
            <DialogDescription>
              Upload photos and provide service details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Photo Upload */}
            <div className="space-y-2">
              <Label>Upload Photos *</Label>
              <div className="border-2 border-dashed rounded-lg p-4">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photoUpload"
                />
                <label
                  htmlFor="photoUpload"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <Camera className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload photos
                  </span>
                </label>
              </div>
              {completionData.photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {completionData.photos.map((photo, idx) => (
                    <img
                      key={idx}
                      src={photo}
                      alt={`Service photo ${idx + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Components Used */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="componentsUsed"
                  checked={completionData.componentsUsed}
                  onChange={(e) => setCompletionData({
                    ...completionData,
                    componentsUsed: e.target.checked
                  })}
                  className="rounded"
                />
                <Label htmlFor="componentsUsed">New components used</Label>
              </div>
            </div>

            {completionData.componentsUsed && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="componentsList">Components List *</Label>
                  <Textarea
                    id="componentsList"
                    placeholder="List all components replaced (e.g., Screen LCD, Battery, Keyboard)"
                    value={completionData.componentsList}
                    onChange={(e) => setCompletionData({
                      ...completionData,
                      componentsList: e.target.value
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warranty">Warranty Period (Months)</Label>
                  <Input
                    id="warranty"
                    type="number"
                    min="0"
                    max="24"
                    value={completionData.warrantyMonths}
                    onChange={(e) => setCompletionData({
                      ...completionData,
                      warrantyMonths: parseInt(e.target.value) || 0
                    })}
                  />
                </div>
              </>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Service Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any additional notes about the service..."
                value={completionData.notes}
                onChange={(e) => setCompletionData({
                  ...completionData,
                  notes: e.target.value
                })}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsCompleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 gradient-hero"
                onClick={completeBooking}
              >
                Complete Service
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkerDashboard;
