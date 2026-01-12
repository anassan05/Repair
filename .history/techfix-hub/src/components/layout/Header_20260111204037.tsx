import { useState } from "react";
import { Menu, X, Phone, Laptop, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

interface HeaderProps {
  onBookRepair?: () => void;
}

const Header = ({ onBookRepair }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Membership", href: "/membership" },
    { label: "Profile", href: "/profile" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center shadow-md">
              <Laptop className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold text-foreground">
              TechFix<span className="text-primary">Hub</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  if (link.href.startsWith('/')) {
                    e.preventDefault();
                    navigate(link.href);
                  }
                }}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <a href="tel:+919876543210" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
              <Phone className="w-4 h-4" />
              +91 98765 43210
            </a>
            <Button variant="outline" size="lg" onClick={() => navigate('/profile')}>
              <User className="w-4 h-4" />
            </Button>
            <Button variant="hero" size="lg" onClick={onBookRepair} data-book-button>
              Book Repair
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-foreground"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    if (link.href.startsWith('/')) {
                      e.preventDefault();
                      navigate(link.href);
                    }
                    setIsMenuOpen(false);
                  }}
                  className="px-4 py-3 text-base font-medium text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 px-4 flex flex-col gap-3">
                <a href="tel:+919876543210" className="flex items-center gap-2 text-base font-medium text-foreground">
                  <Phone className="w-5 h-5 text-primary" />
                  +91 98765 43210
                </a>
                <Button variant="outline" size="lg" className="w-full" onClick={() => { setIsMenuOpen(false); navigate('/profile'); }}>
                  <User className="w-4 h-4" />
                  Profile
                </Button>
                <Button variant="hero" size="lg" className="w-full" onClick={() => { setIsMenuOpen(false); onBookRepair?.(); }}>
                  Book Repair
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full"
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = '/';
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
