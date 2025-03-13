import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="w-full h-16 bg-white border-b border-gray-200">
      <div className="container mx-auto h-full flex items-center justify-between">
        <Link href="/">
          <a className="text-2xl font-bold text-[#2E4A7D]">MERAKI 2025</a>
        </Link>

        <div className="flex gap-6">
          <Link href="/events">
            <a className="text-gray-600 hover:text-[#2E4A7D]">Events</a>
          </Link>
          <Link href="/blog">
            <a className="text-gray-600 hover:text-[#2E4A7D]">Blog</a>
          </Link>
          <Link href="/speakers">
            <a className="text-gray-600 hover:text-[#2E4A7D]">Speakers</a>
          </Link>
          <Link href="/sponsors">
            <a className="text-gray-600 hover:text-[#2E4A7D]">Sponsors</a>
          </Link>
          <Link href="/contact">
            <a className="text-gray-600 hover:text-[#2E4A7D]">Contact</a>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="outline">Already Registered? Login</Button>
          </Link>
          <Link href="/register">
            <Button>Register Now</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}