import React from 'react';
import { FaWhatsapp, FaEnvelope, FaPhone, FaInstagram } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#111111] text-white font-sans border-t border-neutral-800">
      {/* ─── Main Footer Content Grid ─── */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
        {/* Column 1: Brand & Social (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          <Link to="/" className="inline-block">
            <div className="w-20 h-20 bg-white p-2 rounded-xl flex items-center justify-center overflow-hidden transition-transform duration-300 hover:scale-105">
              <img src="https://res.cloudinary.com/idi6k3ue/image/upload/v1791904965/urvaa/logo.png" alt="URVA — Delivering the Authentic Rural Aura" className="w-full h-full object-contain" />
            </div>
          </Link>

          <div>
            <h4 className="text-lg font-semibold tracking-tight text-white">URVA</h4>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed font-normal max-w-sm">
              Delivering the Authentic Rural Aura. Discover regional products and the stories, skills, and traditions behind them.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3 pt-2">
            <a
              href="https://www.instagram.com/urvaa_in/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram @urvaa_in"
              title="Follow URVA on Instagram (@urvaa_in)"
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white text-base transition-all duration-300 hover:scale-110 shadow-sm"
            >
              <FaInstagram />
            </a>
            <a
              href="https://wa.me/919494957576"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              title="Chat with URVA on WhatsApp"
              className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center text-white text-base transition-all duration-300 hover:scale-110 shadow-sm"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>

        {/* Column 2 & 3 Wrapper for Mobile 2-column layout */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-6">
          {/* Company Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-xs uppercase tracking-widest text-neutral-300 pb-1">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400 font-normal">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Explore Products</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">My Rural Basket</Link></li>
            </ul>
          </div>

          {/* Customer Care & Policies Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-xs uppercase tracking-widest text-neutral-300 pb-1">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400 font-normal">
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-white transition-colors">Shipping & Delivery</Link></li>
              <li><Link to="/refund-policy" className="hover:text-white transition-colors">Refund & Returns</Link></li>
            </ul>
          </div>
        </div>

        {/* Column 4: Contact */}
        <div className="lg:col-span-3 space-y-4 text-xs text-neutral-400">
          <h4 className="font-semibold text-xs uppercase tracking-widest text-neutral-300 pb-1">
            Get in Touch
          </h4>

          <div className="flex items-start gap-3">
            <FaPhone className="text-white text-xs mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-semibold text-neutral-400 block tracking-wider">Phone</span>
              <a href="tel:+919494957576" className="hover:text-white transition-colors font-medium text-neutral-300">+91 94949 57576</a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FaEnvelope className="text-white text-xs mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-semibold text-neutral-400 block tracking-wider">Customer Support</span>
              <a href="mailto:urvaaofficial@gmail.com" className="hover:text-white transition-colors font-medium text-neutral-300">urvaaofficial@gmail.com</a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-neutral-800 py-6 text-center text-xs text-neutral-400">
        <p>© {new Date().getFullYear()} URVA. Delivering the Authentic Rural Aura. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
