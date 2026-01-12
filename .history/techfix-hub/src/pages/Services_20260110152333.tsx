import { useState } from "react";
import { 
  Monitor, 
  Battery, 
  Keyboard, 
  HardDrive, 
  Cpu, 
  Wifi,
  Laptop,
  PcCase,
  ArrowRight,
  Shield,
  Clock,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BookingModal from "@/components/BookingModal";

interface ServicesProps {
  currentUser: { name: string; phone: string } | null;
}

const laptopServices = [
  {
    icon: Monitor,
    title: "Screen Replacement",
    description: "Cracked or damaged screen? We replace with genuine LCD/LED panels.",
    fullDescription: "Professional screen replacement service for all laptop models. We use only genuine OEM or high-quality aftermarket panels with full HD resolution support.",
    price: "₹2,499",
    warranty: "90 Days",
    timeframe: "2-3 Hours",
  },
  {
    icon: Battery,
    title: "Battery Replacement",
    description: "Restore your laptop's battery life with original capacity batteries.",
    fullDescription: "Replace worn-out batteries with genuine or high-quality compatible batteries. Full capacity restoration with safety certification.",
    price: "₹1,999",
    warranty: "180 Days",
    timeframe: "1-2 Hours",
  },
  {
    icon: Keyboard,
    title: "Keyboard Repair",
    description: "Fix broken keys or full keyboard replacement with exact matches.",
    fullDescription: "Individual key replacement or complete keyboard assembly replacement. We match your exact keyboard layout and language.",
    price: "₹999",
    warranty: "90 Days",
    timeframe: "1-2 Hours",
  },
  {
    icon: HardDrive,
    title: "SSD/HDD Upgrade",
    description: "Boost speed with SSD upgrade or recover data from failed drives.",
    fullDescription: "Upgrade to blazing-fast SSD or increase storage capacity. Includes data migration, OS installation, and drive optimization.",
    price: "₹1,499",
    warranty: "1 Year",
    timeframe: "2-4 Hours",
  },
  {
    icon: Cpu,
    title: "Motherboard Repair",
    description: "Expert chip-level repair for all motherboard issues.",
    fullDescription: "Advanced chip-level motherboard repair including power issues, USB ports, charging problems, and component replacement.",
    price: "₹2,999",
    warranty: "90 Days",
    timeframe: "1-2 Days",
  },
  {
    icon: Wifi,
    title: "WiFi/Network Fix",
    description: "Resolve connectivity issues and WiFi card replacements.",
    fullDescription: "Diagnose and fix WiFi connectivity issues, replace network cards, and optimize wireless performance.",
    price: "₹799",
    warranty: "60 Days",
    timeframe: "1-2 Hours",
  },
];

const pcServices = [
  {
    icon: Monitor,
    title: "Display/Monitor Fix",
    description: "Fix display issues, graphics card problems, and monitor connections.",
    fullDescription: "Complete display troubleshooting including monitor issues, graphics card problems, cable connections, and display settings optimization.",
    price: "₹1,999",
    warranty: "90 Days",
    timeframe: "2-3 Hours",
  },
  {
    icon: Cpu,
    title: "CPU Upgrade/Repair",
    description: "Upgrade processors or fix overheating and performance issues.",
    fullDescription: "Professional CPU upgrade service including thermal paste application, cooler installation, and BIOS configuration. Fix overheating and performance issues.",
    price: "₹2,499",
    warranty: "180 Days",
    timeframe: "2-4 Hours",
  },
  {
    icon: HardDrive,
    title: "Storage Solutions",
    description: "SSD/HDD installation, upgrades, and data recovery services.",
    fullDescription: "Complete storage solutions including SSD installation, RAID configuration, data migration, and professional data recovery services.",
    price: "₹1,499",
    warranty: "1 Year",
    timeframe: "2-4 Hours",
  },
  {
    icon: Cpu,
    title: "Motherboard Service",
    description: "Professional motherboard repair and component replacements.",
    fullDescription: "Expert motherboard diagnostics and repair including capacitor replacement, power circuit repair, and component-level troubleshooting.",
    price: "₹3,499",
    warranty: "90 Days",
    timeframe: "2-3 Days",
  },
  {
    icon: Wifi,
    title: "Network Card Fix",
    description: "Repair or replace network cards, fix connectivity issues.",
    fullDescription: "Network card installation and configuration, driver updates, connectivity troubleshooting, and ethernet port repairs.",
    price: "₹999",
    warranty: "60 Days",
    timeframe: "1-2 Hours",
  },
  {
    icon: Monitor,
    title: "Graphics Card",
    description: "GPU repair, upgrade, and performance optimization services.",
    fullDescription: "Graphics card upgrade, driver optimization, thermal paste replacement, and gaming performance tuning for maximum FPS.",
    price: "₹2,999",
    warranty: "120 Days",
    timeframe: "2-3 Hours",
  },
];

const Services = ({ currentUser }: ServicesProps) => {
  const [selectedType, setSelectedType] = useState<"laptop" | "pc">("laptop");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const services = selectedType === "laptop" ? laptopServices : pcServices;

  const handleBookService = (serviceTitle: string) => {
    setSelectedService(serviceTitle);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4 sm:mb-6">
                Complete Repair Services
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8">
                Professional laptop and desktop PC repair services with certified technicians, 
                genuine parts, and comprehensive warranties.
              </p>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            {/* Device Type Toggle */}
            <div className="flex justify-center mb-8 sm:mb-12">
              <div className="inline-flex items-center gap-1 sm:gap-2 p-1 sm:p-1.5 bg-muted rounded-xl w-full max-w-md">
                <button
                  onClick={() => setSelectedType("laptop")}
                  className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-all flex-1 ${
                    selectedType === "laptop"
                      ? "gradient-hero text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Laptop className="w-4 h-4" />
                  <span className="text-sm sm:text-base">Laptop</span>
                </button>
                <button
                  onClick={() => setSelectedType("pc")}
                  className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-all flex-1 ${
                    selectedType === "pc"
                      ? "gradient-hero text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <PcCase className="w-4 h-4" />
                  <span className="text-sm sm:text-base">Desktop PC</span>
                </button>
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
              {services.map((service, index) => (
                <div
                  key={service.title}
                  className="group relative bg-card rounded-2xl p-4 sm:p-6 border border-border hover:border-primary/30 shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Icon */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl gradient-hero flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform">
                    <service.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg sm:text-xl font-display font-semibold text-foreground mb-2">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm mb-4">
                    {service.fullDescription}
                  </p>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                      <span className="text-muted-foreground">{service.timeframe}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                      <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
                      <span className="text-muted-foreground">{service.warranty} Warranty</span>
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground">Starting from</p>
                        <p className="text-xl sm:text-2xl font-display font-bold text-foreground">{service.price}</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="group-hover:bg-primary group-hover:text-primary-foreground text-xs sm:text-sm"
                        onClick={() => handleBookService(service.title)}
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>

                  {/* Hover Arrow */}
                  <div className="absolute top-4 sm:top-6 right-4 sm:right-6 w-8 h-8 rounded-full bg-muted flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                </div>
              ))}
            </div>

            {/* Why Choose Us */}
            <div className="mt-16 sm:mt-20 max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-center text-foreground mb-8 sm:mb-12">
                Why Choose Our Services
              </h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                <div className="text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl gradient-hero flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">Certified Technicians</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    All our technicians are certified and have years of experience in laptop and PC repairs.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl gradient-hero flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">Genuine Parts</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    We use only genuine OEM or high-quality aftermarket parts with warranty coverage.
                  </p>
                </div>
                <div className="text-center sm:col-span-2 md:col-span-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl gradient-hero flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">Quick Turnaround</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Most repairs completed within the same day with our efficient service process.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => {
          setIsBookingOpen(false);
          setSelectedService(null);
        }}
        currentUser={currentUser}
      />
    </div>
  );
};

export default Services;
