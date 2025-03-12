import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-[#1B1B1F] text-white py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">MERAKI 2025</h3>
          <p className="text-gray-400">Where Creativity Meets Expression</p>
        </div>
        
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/events">
                <a className="text-gray-400 hover:text-white">Events</a>
              </Link>
            </li>
            <li>
              <Link href="/blog">
                <a className="text-gray-400 hover:text-white">Blog</a>
              </Link>
            </li>
            <li>
              <Link href="/register">
                <a className="text-gray-400 hover:text-white">Register</a>
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Connect</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/contact">
                <a className="text-gray-400 hover:text-white">Contact Us</a>
              </Link>
            </li>
            <li>
              <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
            </li>
            <li>
              <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Subscribe</h4>
          <p className="text-gray-400 mb-4">Stay updated with our newsletter</p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-white/10 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFC857]"
            />
            <button className="bg-[#FFC857] text-black px-4 py-2 rounded-md hover:bg-[#FFC857]/90">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="container mx-auto mt-8 pt-8 border-t border-white/10">
        <p className="text-center text-gray-400">
          © {new Date().getFullYear()} Meraki 2025. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
