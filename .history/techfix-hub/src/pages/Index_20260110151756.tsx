import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import StatsSection from "@/components/sections/StatsSection";
import ServicesSection from "@/components/sections/ServicesSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import MembershipSection from "@/components/sections/MembershipSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import BrandsSection from "@/components/sections/BrandsSection";
import CTASection from "@/components/sections/CTASection";
import BookingModal from "@/components/BookingModal";

interface IndexProps {
  currentUser: { name: string; phone: string } | null;
}

const Index = ({ currentUser }: IndexProps) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const openBooking = () => setIsBookingOpen(true);

  return (
    <div className="min-h-screen bg-background">
      <Header onBookRepair={openBooking} />
      <main>
        <HeroSection onBookRepair={openBooking} />
        <StatsSection />
        <ServicesSection />
        <BrandsSection />
        <HowItWorksSection />
        <MembershipSection />
        <TestimonialsSection />
        <CTASection onBookRepair={openBooking} />
      </main>
      <Footer />
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        currentUser={currentUser}
      />
    </div>
  );
};

export default Index;
