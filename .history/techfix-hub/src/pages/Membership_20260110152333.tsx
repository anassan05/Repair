import { Check, Crown, Star, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface MembershipProps {
  currentUser: { name: string; phone: string } | null;
}

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: "₹999",
    period: "/year",
    description: "Perfect for occasional repairs",
    icon: Zap,
    features: [
      "1 Free Diagnostic",
      "10% Off on All Repairs",
      "Priority Booking",
      "60 Days Extended Warranty",
      "Email Support",
    ],
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹2,499",
    period: "/year",
    description: "Best value for regular users",
    icon: Star,
    features: [
      "3 Free Diagnostics",
      "20% Off on All Repairs",
      "Same Day Service",
      "180 Days Extended Warranty",
      "1 Free Cleaning Service",
      "24/7 Phone Support",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "₹4,999",
    period: "/year",
    description: "For businesses & power users",
    icon: Crown,
    features: [
      "Unlimited Diagnostics",
      "30% Off on All Repairs",
      "Dedicated Technician",
      "1 Year Extended Warranty",
      "4 Free Cleaning Services",
      "On-site AMC Support",
      "Fleet Management Dashboard",
    ],
    popular: false,
  },
];

const Membership = ({ currentUser }: MembershipProps) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    // In real app, navigate to checkout or payment page
    setTimeout(() => {
      alert(`Selected ${plans.find(p => p.id === planId)?.name} plan. Redirecting to payment...`);
      navigate('/profile');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20 sm:pt-24 pb-12 sm:pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-warning/10 border border-warning/20 mb-4 sm:mb-6">
              <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-warning" />
              <span className="text-xs sm:text-sm font-medium text-warning">Membership Plans</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4 sm:mb-6">
              Save More with Membership
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
              Join our membership program for exclusive discounts, priority service, 
              and extended warranty benefits.
            </p>
          </div>

          {/* Plans Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative p-6 sm:p-8 border ${
                  plan.popular 
                    ? "border-primary shadow-glow sm:scale-105" 
                    : "border-border shadow-card"
                } transition-all duration-300 hover:shadow-lg`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full gradient-hero text-primary-foreground text-xs sm:text-sm font-semibold">
                    Most Popular
                  </div>
                )}

                {/* Icon */}
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${plan.popular ? "gradient-hero" : "bg-primary/10"} flex items-center justify-center mb-4 sm:mb-5`}>
                  <plan.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${plan.popular ? "text-primary-foreground" : "text-primary"}`} />
                </div>

                {/* Plan Info */}
                <h3 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-1">
                  {plan.name}
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm mb-4">{plan.description}</p>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-5 sm:mb-6">
                  <span className="text-3xl sm:text-4xl font-display font-bold text-foreground">{plan.price}</span>
                  <span className="text-sm sm:text-base text-muted-foreground">{plan.period}</span>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 sm:gap-3">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-accent" />
                      </div>
                      <span className="text-xs sm:text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button 
                  variant={plan.popular ? "hero" : "outline"} 
                  className="w-full"
                  size="lg"
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={selectedPlan === plan.id}
                >
                  {selectedPlan === plan.id ? "Processing..." : "Get Started"}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </Card>
            ))}
          </div>

          {/* FAQ or Additional Info */}
          <div className="mt-16 sm:mt-20 max-w-4xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-4">
              All Plans Include
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
              <div className="p-4 sm:p-6 bg-card rounded-xl border border-border">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl gradient-hero flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Check className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-foreground mb-2">No Hidden Fees</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Transparent pricing with no surprise charges.
                </p>
              </div>
              <div className="p-4 sm:p-6 bg-card rounded-xl border border-border">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl gradient-hero flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Check className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-foreground mb-2">Cancel Anytime</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  No long-term commitment. Cancel whenever you want.
                </p>
              </div>
              <div className="p-4 sm:p-6 bg-card rounded-xl border border-border sm:col-span-2 md:col-span-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl gradient-hero flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Check className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-foreground mb-2">30-Day Money Back</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Not satisfied? Get a full refund within 30 days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Membership;
