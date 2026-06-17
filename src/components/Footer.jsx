import Link from "next/link";
import { HeartPulse, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-red-950 text-white mt-20">
      <div className="max-w-7xl mx-auto px-5 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}

        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
              <HeartPulse size={26} />
            </div>

            <h2 className="text-2xl font-bold">BloodHero</h2>
          </div>

          <p className="text-red-100 text-sm leading-6">
            A platform to connect blood donors and people who need blood. One
            donation can save a life.
          </p>
        </div>

        {/* Quick Links */}

        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>

          <ul className="space-y-3 text-red-100">
            <li>
              <Link href="/" className="hover:text-white">
                Home
              </Link>
            </li>

            <li>
              <Link href="/donation-requests" className="hover:text-white">
                Donation Requests
              </Link>
            </li>

            <li>
              <Link href="/funding" className="hover:text-white">
                Funding
              </Link>
            </li>

            <li>
              <Link href="/dashboard" className="hover:text-white">
                Dashboard
              </Link>
            </li>
          </ul>
        </div>

        {/* Donation */}

        <div>
          <h3 className="text-lg font-semibold mb-4">Donate Blood</h3>

          <ul className="space-y-3 text-red-100">
            <li>Become a Donor</li>

            <li>Find Blood</li>

            <li>Emergency Request</li>

            <li>Blood Groups</li>
          </ul>
        </div>

        {/* Contact */}

        <div>
          <h3 className="text-lg font-semibold mb-4">Contact</h3>

          <div className="space-y-3 text-red-100 text-sm">
            <p className="flex gap-2 items-center">
              <Mail size={17} />
              support@bloodhero.com
            </p>

            <p className="flex gap-2 items-center">
              <Phone size={17} />
              +880 1234-567890
            </p>

            <p className="flex gap-2 items-center">
              <MapPin size={17} />
              Bangladesh
            </p>
          </div>
        </div>
      </div>

      {/* Bottom */}

      <div className="border-t border-red-800">
        <div className="max-w-7xl mx-auto px-5 py-5 text-center text-sm text-red-200">
          © {new Date().getFullYear()} BloodHero. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
