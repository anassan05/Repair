import { useState } from "react";
import { Phone, User as UserIcon, ArrowRight, Shield, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  onLogin: (userData: { name: string; phone: string }) => void;
}

const UserLogin = ({ onLogin }: LoginProps) => {
  const [step, setStep] = useState<'phone' | 'otp' | 'name'>('phone');
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [generatedOTP, setGeneratedOTP] = useState("");
  const navigate = useNavigate();

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone number
    if (!phone || phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    // Generate a 6-digit OTP
    const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(newOTP);
    
    // In real app, this would send SMS
    console.log("Generated OTP:", newOTP);
    alert(`Your OTP is: ${newOTP}\n(In production, this would be sent via SMS)`);
    
    setError("");
    setStep('otp');
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp !== generatedOTP) {
      setError("Invalid OTP. Please try again.");
      return;
    }

    // Check if user exists
    const existingUser = localStorage.getItem(`user_${phone}`);
    
    if (existingUser) {
      const userData = JSON.parse(existingUser);
      onLogin(userData);
      navigate('/');
    } else {
      // New user - ask for name
      setError("");
      setStep('name');
    }
  };

  const handleCompleteName = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || name.length < 2) {
      setError("Please enter your name");
      return;
    }

    const userData = { name, phone };
    
    // Save user data
    localStorage.setItem(`user_${phone}`, JSON.stringify(userData));
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    onLogin(userData);
    navigate('/');
  };

  const handleSkipLogin = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="w-16 h-16 mx-auto rounded-xl gradient-hero flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-display">
            {step === 'phone' && 'Welcome to CareMyLap'}
            {step === 'otp' && 'Verify OTP'}
            {step === 'name' && 'Complete Your Profile'}
          </CardTitle>
          <CardDescription>
            {step === 'phone' && 'Enter your phone number to continue'}
            {step === 'otp' && `We sent a code to ${phone}`}
            {step === 'name' && 'Tell us your name to get started'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Phone Number Step */}
          {step === 'phone' && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              <Button type="submit" className="w-full gradient-hero">
                Send OTP
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                className="w-full" 
                onClick={handleSkipLogin}
              >
                Skip for now
              </Button>
            </form>
          )}

          {/* OTP Verification Step */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="text-center text-2xl tracking-widest"
                  required
                />
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              <Button type="submit" className="w-full gradient-hero">
                Verify OTP
                <Check className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                className="w-full" 
                onClick={() => setStep('phone')}
              >
                Change Number
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                OTP displayed in popup (demo mode)
              </p>
            </form>
          )}

          {/* Name Entry Step */}
          {step === 'name' && (
            <form onSubmit={handleCompleteName} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              <Button type="submit" className="w-full gradient-hero">
                Complete Profile
                <Check className="w-4 h-4 ml-2" />
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserLogin;
