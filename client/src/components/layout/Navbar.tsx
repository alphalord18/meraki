import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/events", label: "Events" },
    { href: "/blog", label: "Blog" },
    { href: "/speakers", label: "Speakers" },
    { href: "/sponsors", label: "Sponsors" },
    { href: "/contact", label: "Contact" }
  ];

  return (
    <nav className="w-full h-16 bg-white border-b border-gray-200">
      <div className="container mx-auto h-full flex items-center justify-between">
        <Link href="/">
          <a className="text-2xl font-bold text-[#2E4A7D]">MERAKI 2025</a>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href}>
              <a className="text-gray-600 hover:text-[#2E4A7D]">{link.label}</a>
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/login">
            <Button variant="outline">Already Registered? Login</Button>
          </Link>
          <Link href="/register">
            <Button>Register Now</Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                {navLinks.map(link => (
                  <Link key={link.href} href={link.href}>
                    <a 
                      className="text-lg px-2 py-1 hover:text-[#2E4A7D]"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </a>
                  </Link>
                ))}
                <div className="flex flex-col gap-2 mt-4">
                  <Link href="/login">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setIsOpen(false)}
                    >
                      Already Registered? Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button 
                      className="w-full"
                      onClick={() => setIsOpen(false)}
                    >
                      Register Now
                    </Button>
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}