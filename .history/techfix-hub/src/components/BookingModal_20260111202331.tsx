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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-card rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-card border-2 border-border flex items-center justify-center text-muted-foreground hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all z-20 shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Progress Bar */}
        <div className="p-6 pb-0 pr-16">
          <div className="flex items-center gap-2 mb-6">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex-1 flex items-center">
                <div
                  className={`w-full h-2 rounded-full ${
                    s <= step ? "gradient-hero" : "bg-muted"
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
                  className="group p-8 rounded-xl border-2 border-border hover:border-primary/50 text-center transition-all hover:-translate-y-1"
                >
                  <div className="w-16 h-16 mx-auto rounded-xl gradient-hero flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
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
                  className="group p-8 rounded-xl border-2 border-border hover:border-primary/50 text-center transition-all hover:-translate-y-1"
                >
                  <div className="w-16 h-16 mx-auto rounded-xl gradient-hero flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
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
                    className={`p-4 rounded-xl border-2 text-center font-medium transition-all ${
                      selectedBrand === brand
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50 text-foreground"
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
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
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
                          <p className="text-sm text-muted-foreground">{issue.price}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Image Upload */}
              <div className="p-4 border-2 border-dashed border-border rounded-xl text-center">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Upload images of the issue (optional)
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
              <div className="p-4 bg-muted/50 rounded-xl border border-border space-y-3">
                <h3 className="font-medium text-foreground">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Device Type:</span>
                    <span className="text-foreground font-medium">{deviceType === "laptop" ? "Laptop" : "Desktop PC"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Brand:</span>
                    <span className="text-foreground font-medium">{selectedBrand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Issues:</span>
                    <span className="text-foreground font-medium">{selectedIssues.length} selected</span>
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
              <div className="p-4 bg-accent/10 rounded-xl border border-accent/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-foreground font-medium">Estimated Price</span>
                  <span className="text-xl font-display font-bold text-foreground">
                    {deviceType === "laptop" ? "₹799 - ₹7,999" : "₹999 - ₹9,999"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-accent">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">90 Days Warranty Included</span>
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

          {/* Step 4: Success */}
          {step === 5 && (
            <div className="text-center py-8 space-y-6">
              <div className="w-20 h-20 rounded-full gradient-accent flex items-center justify-center mx-auto">
                <Check className="w-10 h-10 text-accent-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                  Booking Confirmed!
                </h2>
                <p className="text-muted-foreground">
                  Our team will contact you shortly to confirm the visit time.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-xl">
                <p className="text-sm text-muted-foreground mb-1">Booking Reference</p>
                <p className="text-lg font-display font-bold text-foreground">
                  REP-{Math.random().toString(36).substr(2, 8).toUpperCase()}
                </p>
              </div>
              <Button variant="hero" size="lg" onClick={onClose}>
                Done
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
