import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Mail } from 'lucide-react';

const socials = [
  { href: 'https://facebook.com', label: 'Facebook', Icon: Facebook },
  { href: 'https://twitter.com', label: 'Twitter', Icon: Twitter },
  { href: 'https://instagram.com', label: 'Instagram', Icon: Instagram },
  { href: 'https://youtube.com', label: 'YouTube', Icon: Youtube },
  { href: 'https://linkedin.com', label: 'LinkedIn', Icon: Linkedin },
  { href: 'mailto:contact@example.com', label: 'Email', Icon: Mail },
];

const SiteFooter = () => {
  return (
    <footer className="relative mt-12 bg-gradient-to-b from-white to-orange-50 border-t border-orange-100">
      <div className="absolute inset-x-0 -top-6 h-6 bg-gradient-to-r from-amber-400/30 via-orange-300/20 to-amber-400/30 blur" />
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-extrabold text-gray-900">Bal Krishna Nivas</h3>
            <p className="mt-2 text-sm text-gray-600">Family heritage portal preserving memories, roots, and relationships.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              <Link to="/about" className="hover:text-gray-900">About</Link>
              <Link to="/family" className="hover:text-gray-900">Family</Link>
              <Link to="/news" className="hover:text-gray-900">News</Link>
              <Link to="/events" className="hover:text-gray-900">Events</Link>
              <Link to="/relationships" className="hover:text-gray-900">Relationships</Link>
              <Link to="/dashboard" className="hover:text-gray-900">Dashboard</Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Connect</h4>
            <div className="flex items-center gap-3">
              {socials.map(({ href, label, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                   className="group inline-flex items-center justify-center w-9 h-9 rounded-full border border-orange-200 text-orange-600 hover:bg-orange-50 hover:shadow transition">
                  <Icon size={16} className="group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-orange-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Bal Krishna Nivas. All rights reserved.</p>
          <p className="text-xs">Made with care for the family • v1.0</p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;






