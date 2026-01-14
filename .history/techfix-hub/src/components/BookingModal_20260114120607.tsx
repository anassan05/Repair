import { useState, useEffect } from "react";
import { X, Monitor, Battery, Keyboard, HardDrive, Cpu, Wifi, Upload, ArrowRight, ArrowLeft, Shield, Check, Laptop, PcCase, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { userAPI } from "@/services/api";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: { name: string; phone: string } | null;
}

// Mock saved addresses (in real app, this would come from user context/state)
const savedAddresses = [
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
];

const laptopBrands = ["Dell", "HP", "Lenovo", "ASUS", "Acer", "Apple", "MSI", "Samsung", "Other"];
const pcBrands = ["Dell", "HP", "Lenovo", "ASUS", "Acer", "Intel", "AMD", "Custom Build", "Other"];

const laptopRepairIssues = [
  { icon: Monitor, label: "Screen Issue", description: "Cracked, black, or flickering display", price: "₹2,499 - ₹5,999" },
  { icon: Battery, label: "Battery Problem", description: "Not charging or drains quickly", price: "₹1,999 - ₹3,999" },
  { icon: Keyboard, label: "Keyboard Fix", description: "Keys not working or stuck", price: "₹999 - ₹2,499" },
  { icon: HardDrive, label: "Storage/HDD", description: "Slow performance or data recovery", price: "₹1,499 - ₹4,999" },
  { icon: Cpu, label: "Motherboard", description: "Not powering on or random shutdowns", price: "₹2,999 - ₹7,999" },
  { icon: Wifi, label: "WiFi/Network", description: "Can't connect to internet", price: "₹799 - ₹1,999" },
  { icon: Shield, label: "Not Sure / Need Diagnosis", description: "Let our technician identify the issue", price: "Free Checkup" },
];

const pcRepairIssues = [
  { icon: Monitor, label: "Display Issue", description: "No display or screen problems", price: "₹1,999 - ₹4,999" },
  { icon: Cpu, label: "CPU Problem", description: "Overheating or slow performance", price: "₹2,499 - ₹6,999" },
  { icon: HardDrive, label: "Storage/HDD", description: "Slow performance or data recovery", price: "₹1,499 - ₹4,999" },
  { icon: Cpu, label: "Motherboard", description: "Not powering on or random restarts", price: "₹3,499 - ₹8,999" },
  { icon: Wifi, label: "Network Card", description: "Internet connectivity issues", price: "₹999 - ₹2,499" },
  { icon: Monitor, label: "Graphics Card", description: "Display artifacts or gaming issues", price: "₹2,999 - ₹9,999" },
  { icon: Shield, label: "Not Sure / Need Diagnosis", description: "Let our technician identify the issue", price: "Free Checkup" },
];

const BookingModal = ({ isOpen, onClose, currentUser }: BookingModalProps) => {
  const [step, setStep] = useState(0);
  const [deviceType, setDeviceType] = useState<"laptop" | "pc" | "">("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    savedAddresses.find(a => a.isDefault)?.id || null
  );
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    phone: currentUser?.phone || "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    description: "",
  });

  // Update form data when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.name,
        phone: currentUser.phone,
      }));
    }
  }, [currentUser]);
  
  const brands = deviceType === "laptop" ? laptopBrands : pcBrands;
  const repairIssues = deviceType === "laptop" ? laptopRepairIssues : pcRepairIssues;

  const toggleIssue = (issue: string) => {
    setSelectedIssues(prev =>
      prev.includes(issue) ? prev.filter(i => i !== issue) : [...prev, issue]
    );
  };

  const handleSubmit = async () => {
    // Get selected address details
    let addressDetails = "";
    if (useNewAddress) {
      addressDetails = `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`;
    } else {
      const selectedAddress = savedAddresses.find(a => a.id === selectedAddressId);
      if (selectedAddress) {
        addressDetails = `${selectedAddress.address}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`;
      }
    }

    // Get user from localStorage
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const customerId = user?.id || `USR${Date.now()}`;

    try {
      const response = await userAPI.createBooking({
        customerId: customerId.toString(),
        customerName: formData.name,
        customerPhone: formData.phone,
        customerAddress: addressDetails,
        service: `${deviceType === "laptop" ? "Laptop" : "Desktop PC"} - ${selectedBrand} - ${selectedIssues.join(", ")}`,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      });

      if (response.success) {
        setStep(5); // Show success
      } else {
        alert('Error creating booking: ' + (response.message || 'Unknown error'));
        console.error('Booking error:', response);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Error creating booking. Please try again.');
      console.error('Error creating booking:', error);
      alert('Error creating booking. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 border border-border/50">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-muted/80 backdrop-blur-sm border border-border flex items-center justify-center text-muted-foreground hover:bg-destructive/90 hover:text-white hover:border-destructive hover:scale-110 transition-all duration-200 z-20 shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Progress Bar */}
        <div className="p-6 pb-4 pr-16">
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex-1">
                <div
                  className={`w-full h-2.5 rounded-full transition-all duration-300 ${
                    s <= step ? "gradient-hero shadow-sm" : "bg-muted"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 pt-0">
          {/* Step 0: Device Type Selection */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                  Select Device Type
                </h2>
                <p className="text-muted-foreground">
                  Choose the type of device you need to repair.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setDeviceType("laptop");
                    setStep(1);
                  }}
                  className="group p-8 rounded-xl border-2 border-border hover:border-primary hover:shadow-lg bg-card hover:bg-accent/5 text-center transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-16 h-16 mx-auto rounded-xl gradient-hero flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                    <Laptop className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                    Laptop
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Portable computers and notebooks
                  </p>
                </button>

                <button
                  onClick={() => {
                    setDeviceType("pc");
                    setStep(1);
                  }}
                  className="group p-8 rounded-xl border-2 border-border hover:border-primary hover:shadow-lg bg-card hover:bg-accent/5 text-center transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-16 h-16 mx-auto rounded-xl gradient-hero flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                    <PcCase className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                    Desktop PC
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Desktop computers and workstations
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Brand Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                  Select Your {deviceType === "laptop" ? "Laptop" : "PC"} Brand
                </h2>
                <p className="text-muted-foreground">
                  Choose the brand of your {deviceType === "laptop" ? "laptop" : "desktop PC"} for accurate pricing.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {brands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => setSelectedBrand(brand)}
                    className={`p-4 rounded-xl border-2 text-center font-medium transition-all duration-200 ${
                      selectedBrand === brand
                        ? "border-primary bg-primary/10 text-primary shadow-md scale-105"
                        : "border-border hover:border-primary/50 hover:bg-accent/5 text-foreground hover:scale-105"
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" size="lg" onClick={() => {
                  setStep(0);
                  setSelectedBrand("");
                }}>
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </Button>
                <Button
                  variant="hero"
                  size="lg"
                  className="flex-1"
                  disabled={!selectedBrand}
                  onClick={() => setStep(2)}
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Issue Selection */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                  What's the Issue?
                </h2>
                <p className="text-muted-foreground">
                  Select the problems you're facing. You can choose multiple or select "Not Sure" for diagnosis.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {repairIssues.map((issue) => {
                  const isSelected = selectedIssues.includes(issue.label);
                  const isNotSure = issue.label.includes("Not Sure");
                  return (
                    <button
                      key={issue.label}
                      onClick={() => toggleIssue(issue.label)}
                      className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                        isSelected
                          ? "border-primary bg-primary/10 shadow-md scale-[1.02]"
                          : "border-border hover:border-primary/50 hover:bg-accent/5 hover:scale-[1.02]"
                      } ${isNotSure ? "md:col-span-2" : ""}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isSelected ? "gradient-hero text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}>
                          <issue.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium mb-1 ${isSelected ? "text-primary" : "text-foreground"}`}>
                            {issue.label}
                          </p>
                          <p className="text-xs text-muted-foreground mb-1">{issue.description}</p>
                          <p className={`text-sm font-semibold ${isNotSure ? "text-accent" : "text-muted-foreground"}`}>
                            {issue.price}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Image Upload */}
              <div className="p-6 border-2 border-dashed border-border rounded-xl text-center hover:border-primary/50 hover:bg-accent/5 transition-all duration-200 cursor-pointer group">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Upload images of the issue
                </p>
                <p className="text-xs text-muted-foreground">
                  Optional - helps us diagnose better
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" size="lg" onClick={() => {
                  setStep(1);
                  setSelectedIssues([]);
                }}>
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </Button>
                <Button
                  variant="hero"
                  size="lg"
                  className="flex-1"
                  disabled={selectedIssues.length === 0}
                  onClick={() => setStep(3)}
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Contact Details & Address */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                  Your Details & Address
                </h2>
                <p className="text-muted-foreground">
                  Enter your contact information and select delivery address.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Full Name
                  </label>
                  <Input
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Phone Number
                  </label>
                  <Input
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                {/* Address Selection */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Pickup/Delivery Address
                  </label>
                  
                  {/* Saved Addresses */}
                  <div className="space-y-2 mb-3">
                    {savedAddresses.map((addr) => (
                      <button
                        key={addr.id}
                        onClick={() => {
                          setSelectedAddressId(addr.id);
                          setUseNewAddress(false);
                        }}
                        className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                          selectedAddressId === addr.id && !useNewAddress
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <MapPin className={`w-5 h-5 mt-0.5 ${
                            selectedAddressId === addr.id && !useNewAddress
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant={addr.isDefault ? "default" : "outline"} className="text-xs">
                                {addr.type}
                              </Badge>
                              {addr.isDefault && (
                                <Badge className="text-xs gradient-hero border-0 text-primary-foreground">
                                  Default
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm font-medium text-foreground">{addr.address}</p>
                            <p className="text-xs text-muted-foreground">
                              {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}

                    {/* Add New Address Option */}
                    <button
                      onClick={() => setUseNewAddress(true)}
                      className={`w-full p-3 rounded-lg border-2 transition-all ${
                        useNewAddress
                          ? "border-primary bg-primary/10"
                          : "border-dashed border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          useNewAddress
                            ? "gradient-hero text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          <Plus className="w-5 h-5" />
                        </div>
                        <span className={`font-medium ${
                          useNewAddress ? "text-primary" : "text-foreground"
                        }`}>
                          Add New Address
                        </span>
                      </div>
                    </button>
                  </div>

                  {/* New Address Form */}
                  {useNewAddress && (
                    <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Street Address</label>
                        <Textarea
                          placeholder="Flat/House No., Building, Street"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          rows={2}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm font-medium mb-1 block">City</label>
                          <Input
                            placeholder="City"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">State</label>
                          <Input
                            placeholder="State"
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Pincode</label>
                        <Input
                          placeholder="6-digit pincode"
                          value={formData.pincode}
                          onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                          maxLength={6}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Additional Details (Optional)
                  </label>
                  <Textarea
                    placeholder="Describe your issue in detail..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>

              {/* Booking Summary */}
              <div className="p-5 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-primary/20 space-y-3 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
                    <Check className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground">Booking Summary</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Device Type:</span>
                    <span className="text-foreground font-semibold">{deviceType === "laptop" ? "Laptop" : "Desktop PC"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Brand:</span>
                    <span className="text-foreground font-semibold">{selectedBrand}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Issues:</span>
                    <Badge className="gradient-hero border-0 text-primary-foreground">{selectedIssues.length} selected</Badge>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" size="lg" onClick={() => setStep(2)}>
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </Button>
                <Button
                  variant="hero"
                  size="lg"
                  className="flex-1"
                  disabled={
                    !formData.name ||
                    !formData.phone ||
                    (!selectedAddressId && !useNewAddress) ||
                    (useNewAddress && (!formData.address || !formData.city || !formData.state || !formData.pincode))
                  }
                  onClick={() => setStep(4)}
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                  Review & Confirm
                </h2>
                <p className="text-muted-foreground">
                  Please review your booking details before confirming.
                </p>
              </div>

              {/* Price Summary */}
              <div className="p-6 bg-gradient-to-br from-accent/10 to-primary/5 rounded-xl border-2 border-accent/30 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Estimated Price Range</p>
                    <p className="text-2xl font-display font-bold text-foreground">
                      {deviceType === "laptop" ? "₹799 - ₹7,999" : "₹999 - ₹9,999"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-accent/20 rounded-lg">
                  <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-accent">90 Days Warranty</p>
                    <p className="text-xs text-muted-foreground">On all repairs & parts</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" size="lg" onClick={() => setStep(2)}>
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </Button>
                <Button
                  variant="hero"
                  size="lg"
                  className="flex-1"
                  onClick={handleSubmit}
                >
                  Book Repair Now
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 5: Success */}
          {step === 5 && (
            <div className="text-center py-12 space-y-6 animate-in fade-in zoom-in-95 duration-500">
              <div className="relative">
                <div className="w-24 h-24 rounded-full gradient-hero flex items-center justify-center mx-auto shadow-2xl animate-in zoom-in duration-500">
                  <Check className="w-12 h-12 text-primary-foreground" />
                </div>
                <div className="absolute inset-0 w-24 h-24 rounded-full gradient-hero opacity-20 animate-ping mx-auto" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-display font-bold text-foreground">
                  Booking Confirmed!
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Our expert team will contact you shortly to confirm the visit time and provide further details.
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl border border-primary/20 max-w-sm mx-auto">
                <p className="text-sm font-medium text-muted-foreground mb-2">Booking Reference</p>
                <p className="text-2xl font-display font-bold text-foreground tracking-wide">
                  REP-{Math.random().toString(36).substr(2, 8).toUpperCase()}
                </p>
                <p className="text-xs text-muted-foreground mt-2">Save this for tracking your repair</p>
              </div>
              <div className="flex flex-col gap-2 max-w-sm mx-auto">
                <Button variant="hero" size="lg" onClick={onClose} className="w-full shadow-lg">
                  Done
                </Button>
                <Button variant="outline" size="lg" onClick={() => window.location.href = '/profile'} className="w-full">
                  View My Bookings
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
