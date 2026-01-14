import { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Crown, 
  Calendar,
  Wrench,
  Star,
  TrendingUp,
  Save,
  X,
  Zap,
  Plus,
  Trash2,
  Edit,
  ShoppingBag,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";

// Mock user data
const initialUserData = {
  name: "Mohammed Anas",
  email: "mohammed.anas@example.com",
  phone: "+91 98765 43210",
  addresses: [
    {
      id: 1,
      type: "Home",
      address: "123 Tech Street, Bangalore",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
      isDefault: true,
    },
    {
      id: 2,
      type: "Office",
      address: "45 Business Park, MG Road",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560002",
      isDefault: false,
    },
  ],
  memberSince: "January 2025",
  membership: {
    plan: "Pro",
    status: "Active",
    renewalDate: "January 15, 2027",
    usedDiagnostics: 1,
    totalDiagnostics: 3,
  },
  stats: {
    totalRepairs: 8,
    totalSpent: "₹24,850",
    savedAmount: "₹4,970",
    avgRating: 4.8,
  },
};

interface Address {
  id: number;
  type: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface ProfileProps {
  currentUser: { name: string; phone: string };
  onLogout: () => void;
}

const mockRepairHistory = [
  {
    id: "REP-2026-001",
    device: "Laptop - Dell Inspiron",
    issue: "Screen Replacement",
    date: "2026-01-05",
    status: "Completed",
    cost: "₹3,499",
    discount: "₹700",
    rating: 5,
  },
  {
    id: "REP-2025-087",
    device: "Desktop PC - Custom Build",
    issue: "Graphics Card Upgrade",
    date: "2025-12-20",
    status: "Completed",
    cost: "₹5,999",
    discount: "₹1,200",
    rating: 5,
  },
  {
    id: "REP-2025-065",
    device: "Laptop - HP Pavilion",
    issue: "Battery Replacement",
    date: "2025-11-15",
    status: "Completed",
    cost: "₹2,799",
    discount: "₹560",
    rating: 4,
  },
];

const Profile = ({ currentUser, onLogout }: ProfileProps) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    ...initialUserData,
    name: currentUser.name,
    phone: currentUser.phone,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(userData);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [selectedRepair, setSelectedRepair] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [newAddress, setNewAddress] = useState<Address>({
    id: 0,
    type: "Home",
    address: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });
  const [bookings, setBookings] = useState<any[]>([]);

  // Load bookings from backend API
  useEffect(() => {
    const loadBookings = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.id) {
          const response = await fetch(`http://localhost:3000/api/user/bookings/${user.id}`);
          const data = await response.json();
          if (data.success) {
            // Transform backend data to match UI format
            const transformedBookings = data.bookings.map((b: any) => ({
              id: b.id,
              device: b.service.split(' - ')[0] + ' - ' + b.service.split(' - ')[1],
              issue: b.service.split(' - ').slice(2).join(', '),
              date: b.date,
              status: b.status.charAt(0).toUpperCase() + b.status.slice(1),
              cost: b.amount ? `₹${b.amount}` : 'TBD',
              discount: '₹0',
              rating: b.rating || 0,
            }));
            setBookings([...transformedBookings, ...mockRepairHistory]);
            return;
          }
        }
      } catch (error) {
        console.error('Error loading bookings:', error);
      }
      // Fallback to mock data
      setBookings(mockRepairHistory);
    };
    loadBookings();
  }, [currentUser.phone]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(userData);
  };

  const handleSave = () => {
    setUserData(editedData);
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(userData);
  };

  const handleAddAddress = () => {
    const id = Math.max(...userData.addresses.map(a => a.id), 0) + 1;
    const addressToAdd = { ...newAddress, id };
    setUserData({
      ...userData,
      addresses: [...userData.addresses, addressToAdd],
    });
    setNewAddress({
      id: 0,
      type: "Home",
      address: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: false,
    });
    setIsAddingAddress(false);
    alert("Address added successfully!");
  };

  const handleDeleteAddress = (id: number) => {
    if (userData.addresses.length === 1) {
      alert("You must have at least one address!");
      return;
    }
    setUserData({
      ...userData,
      addresses: userData.addresses.filter(a => a.id !== id),
    });
    alert("Address deleted successfully!");
  };

  const handleSetDefault = (id: number) => {
    setUserData({
      ...userData,
      addresses: userData.addresses.map(a => ({
        ...a,
        isDefault: a.id === id,
      })),
    });
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddressId(address.id);
    setNewAddress(address);
    setIsAddingAddress(true);
  };

  const handleUpdateAddress = () => {
    setUserData({
      ...userData,
      addresses: userData.addresses.map(a =>
        a.id === editingAddressId ? newAddress : a
      ),
    });
    setNewAddress({
      id: 0,
      type: "Home",
      address: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: false,
    });
    setIsAddingAddress(false);
    setEditingAddressId(null);
    alert("Address updated successfully!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-accent/10 text-accent border-accent/20";
      case "In Progress":
        return "bg-warning/10 text-warning border-warning/20";
      case "Pending":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Profile Header */}
          <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl gradient-hero flex items-center justify-center">
                    <User className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full gradient-hero flex items-center justify-center border-2 border-card">
                    <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-foreground" />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-1">
                    {userData.name}
                  </h1>
                  <Badge className="gradient-hero border-0 text-primary-foreground text-xs sm:text-sm">
                    {userData.membership.plan} Member
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={() => navigate('/services')} 
                  className="gradient-hero"
                  size="lg"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Book Service Now
                </Button>
              {!isEditing ? (
                <Button onClick={handleEdit} className="w-full sm:w-auto">Edit Profile</Button>
              ) : (
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button onClick={handleSave} variant="hero" className="flex-1 sm:flex-initial">
                    <Save className="w-4 h-4" />
                    <span className="hidden sm:inline">Save</span>
                  </Button>
                  <Button onClick={handleCancel} variant="outline" className="flex-1 sm:flex-initial">
                    <X className="w-4 h-4" />
                    <span className="hidden sm:inline">Cancel</span>
                  </Button>
                </div>
              )}
              </div>
            </div>

            {!isEditing ? (
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  {userData.email}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  {userData.phone}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Name</label>
                    <Input
                      value={editedData.name}
                      onChange={(e) => setEditedData({...editedData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Email</label>
                    <Input
                      type="email"
                      value={editedData.email}
                      onChange={(e) => setEditedData({...editedData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Phone</label>
                    <Input
                      value={editedData.phone}
                      onChange={(e) => setEditedData({...editedData, phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <Card className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Wrench className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold">{userData.stats.totalRepairs}</p>
                  <p className="text-xs text-muted-foreground">Repairs</p>
                </div>
              </div>
            </Card>
            <Card className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold">{userData.stats.totalSpent}</p>
                  <p className="text-xs text-muted-foreground">Spent</p>
                </div>
              </div>
            </Card>
            <Card className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-warning" />
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold">{userData.stats.savedAmount}</p>
                  <p className="text-xs text-muted-foreground">Saved</p>
                </div>
              </div>
            </Card>
            <Card className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold">{userData.stats.avgRating}</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Membership Card */}
          <Card className="p-4 sm:p-6 mb-4 sm:mb-6 border-primary/30">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-warning" />
                  <h2 className="text-lg sm:text-xl font-display font-bold">
                    {userData.membership.plan} Membership
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Active until {userData.membership.renewalDate}
                </p>
              </div>
              <Button onClick={() => navigate('/membership')} className="w-full sm:w-auto" size="sm">
                Upgrade Plan
              </Button>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Free Diagnostics Used</span>
                <span className="text-sm font-bold">
                  {userData.membership.usedDiagnostics} / {userData.membership.totalDiagnostics}
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full gradient-hero transition-all"
                  style={{ width: `${(userData.membership.usedDiagnostics / userData.membership.totalDiagnostics) * 100}%` }}
                />
              </div>
            </div>
          </Card>

          {/* Addresses Section */}
          <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h2 className="text-lg sm:text-xl font-display font-bold">
                Saved Addresses ({userData.addresses.length})
              </h2>
              <Button 
                onClick={() => {
                  setIsAddingAddress(true);
                  setEditingAddressId(null);
                }}
                size="sm"
                className="w-full sm:w-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Address</span>
              </Button>
            </div>

            {/* Add/Edit Address Form */}
            {isAddingAddress && (
              <Card className="p-3 sm:p-4 mb-3 sm:mb-4 border-2 border-primary/30">
                <h3 className="text-sm sm:text-base font-semibold mb-3">
                  {editingAddressId ? "Edit Address" : "New Address"}
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs sm:text-sm font-medium mb-1 block">Address Type</label>
                    <div className="flex gap-2">
                      {["Home", "Office", "Other"].map((type) => (
                        <button
                          key={type}
                          onClick={() => setNewAddress({ ...newAddress, type })}
                          className={`flex-1 px-3 py-2 rounded-lg border-2 text-xs sm:text-sm font-medium transition-all ${
                            newAddress.type === type
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Street Address</label>
                    <Textarea
                      placeholder="Flat/House No., Building Name, Street"
                      value={newAddress.address}
                      onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium mb-1 block">City</label>
                      <Input
                        placeholder="City"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">State</label>
                      <Input
                        placeholder="State"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Pincode</label>
                    <Input
                      placeholder="6-digit pincode"
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                      maxLength={6}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={editingAddressId ? handleUpdateAddress : handleAddAddress}
                      disabled={!newAddress.address || !newAddress.city || !newAddress.state || !newAddress.pincode}
                      className="flex-1"
                    >
                      <Save className="w-4 h-4" />
                      {editingAddressId ? "Update" : "Save"} Address
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddingAddress(false);
                        setEditingAddressId(null);
                        setNewAddress({
                          id: 0,
                          type: "Home",
                          address: "",
                          city: "",
                          state: "",
                          pincode: "",
                          isDefault: false,
                        });
                      }}
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Address List */}
            <div className="space-y-3">
              {userData.addresses.map((address) => (
                <Card
                  key={address.id}
                  className={`p-3 sm:p-4 ${
                    address.isDefault ? "border-2 border-primary/50" : "border border-border"
                  }`}
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge variant={address.isDefault ? "default" : "outline"} className="text-xs">
                          {address.type}
                        </Badge>
                        {address.isDefault && (
                          <Badge className="gradient-hero border-0 text-primary-foreground text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-foreground mb-1">{address.address}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {address.city}, {address.state} - {address.pincode}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditAddress(address)}
                        className="flex-1 sm:flex-initial"
                      >
                        <Edit className="w-4 h-4" />
                        <span className="ml-1 sm:hidden">Edit</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteAddress(address.id)}
                        className="flex-1 sm:flex-initial"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="ml-1 sm:hidden">Delete</span>
                      </Button>
                    </div>
                  </div>
                  {!address.isDefault && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full mt-3"
                      onClick={() => handleSetDefault(address.id)}
                    >
                      Set as Default
                    </Button>
                  )}
                </Card>
              ))}
            </div>
          </Card>

          {/* Repair History */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-display font-bold mb-4">
              Repair History ({bookings.length})
            </h2>
            <div className="space-y-3">
              {bookings.map((repair) => (
                <div 
                  key={repair.id} 
                  className="p-3 sm:p-4 border border-border rounded-lg hover:border-primary/30 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedRepair(repair);
                    setDetailsOpen(true);
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="text-sm sm:text-base font-semibold">{repair.device}</h4>
                        <Badge className={getStatusColor(repair.status) + " text-xs"}>
                          {repair.status}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">{repair.issue}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-base sm:text-lg font-bold">{repair.cost}</p>
                      {repair.discount && repair.discount !== "₹0" && (
                        <p className="text-xs text-accent">Saved {repair.discount}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        {new Date(repair.date).toLocaleDateString()}
                      </span>
                      <span className="text-xs">ID: {repair.id}</span>
                    </div>
                    {repair.rating > 0 && (
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < repair.rating
                                ? "fill-warning text-warning"
                                : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRepair(repair);
                      setDetailsOpen(true);
                    }}
                  >
                    <Info className="w-3 h-3 mr-1" />
                    View Full Details
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>

      {/* Repair Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Repair Details</DialogTitle>
            <DialogDescription>Complete information about your repair</DialogDescription>
          </DialogHeader>
          {selectedRepair && (
            <div className="space-y-4">
              {/* Show OTP first if available */}
              {selectedRepair.otp && (
                <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-300 shadow-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-3xl">🔐</span>
                    <p className="font-bold text-blue-900 text-xl">Your Service OTP</p>
                  </div>
                  <p className="text-4xl sm:text-5xl font-mono font-bold text-blue-600 tracking-wider mb-3">{selectedRepair.otp}</p>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <p className="text-sm text-blue-900 font-semibold mb-1">⚠️ IMPORTANT: Save This OTP</p>
                    <p className="text-xs text-blue-800">Share this with the worker to verify service completion</p>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Booking ID</p>
                  <p className="font-mono">{selectedRepair.id}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Status</p>
                  <Badge className={getStatusColor(selectedRepair.status)}>
                    {selectedRepair.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Device</p>
                  <p>{selectedRepair.device}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Date</p>
                  <p>{new Date(selectedRepair.date).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-1">Issue Description</p>
                <p className="text-sm">{selectedRepair.issue}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Cost</p>
                  <p className="text-lg font-bold">{selectedRepair.cost}</p>
                </div>
                {selectedRepair.discount && selectedRepair.discount !== "₹0" && (
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Discount Applied</p>
                    <p className="text-lg font-bold text-accent">{selectedRepair.discount}</p>
                  </div>
                )}
              </div>

              {selectedRepair.rating > 0 && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">Your Rating</p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < selectedRepair.rating
                            ? "fill-warning text-warning"
                            : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/services')}
                >
                  Book Another Service
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Profile;
