import { Laptop, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    services: [
      { label: "Screen Repair", href: "#" },
      { label: "Battery Replacement", href: "#" },
      { label: "Keyboard Repair", href: "#" },
      { label: "SSD Upgrade", href: "#" },
      { label: "Motherboard Repair", href: "#" },
    ],
    company: [
      { label: "About Us", href: "#" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contact", href: "#contact" },
    ],
    support: [
      { label: "FAQs", href: "#" },
      { label: "Warranty Policy", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Refund Policy", href: "#" },
    ],
    admin: [
      { label: "Admin Login", href: "http://localhost:5175", external: true },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Instagram, href: "#" },
    { icon: Linkedin, href: "#" },
  ];

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 sm:gap-10 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#home" className="flex items-center gap-2 mb-4 sm:mb-6">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl gradient-hero flex items-center justify-center">
                <Laptop className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
              </div>
              <span className="text-lg sm:text-xl font-display font-bold text-primary-foreground">
                CareMyLap<span className="text-primary">.com</span>
              </span>
            </a>
            <p className="text-primary-foreground/70 text-sm sm:text-base mb-4 sm:mb-6 max-w-sm">
              Expert laptop repair services at your doorstep. Transparent pricing, 
              genuine parts, and warranty on all repairs.
            </p>
            <div className="space-y-2 sm:space-y-3">
              <a href="tel:+919876543210" className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <Phone className="w-4 h-4 flex-shrink-0" />
                +91 98765 43210
              </a>
              <a href="mailto:support@caremylap.com" className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <Mail className="w-4 h-4 flex-shrink-0" />
                support@caremylap.com
              </a>
              <div className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-primary-foreground/70">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>Delhi NCR, Mumbai, Bangalore, Hyderabad</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm sm:text-base font-display font-semibold text-primary-foreground mb-3 sm:mb-4">Services</h4>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-xs sm:text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm sm:text-base font-display font-semibold text-primary-foreground mb-3 sm:mb-4">Company</h4>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-xs sm:text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm sm:text-base font-display font-semibold text-primary-foreground mb-3 sm:mb-4">Support</h4>
            <ul className="space-y-2 sm:space-y-2 sm:space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-xs sm:text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Admin */}
          <div>
            <h4 className="text-sm sm:text-base font-display font-semibold text-primary-foreground mb-3 sm:mb-4">Admin</h4>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.admin.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors flex items-center gap-1"
                  >
                    {link.label}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/50 text-xs sm:text-sm text-center md:text-left">
            © 2025 CareMyLap.com. All rights reserved.
          </p>
          <div className="flex items-center gap-3 sm:gap-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
