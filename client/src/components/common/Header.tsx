import React from 'react';
import { FaBox, FaHome, FaShoppingCart } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../../redux/store';
import { useGetBannersQuery } from '../../redux/api/banner.api';

const defaultPromoOffers = [
  '🌾 URVA — Delivering the Authentic Rural Aura',
  '✨ Festive Season Sale: Use Code URVA10 for 10% Off',
  '🌱 Discover regional products, makers, and traditions',
  '🚚 Free Shipping across India on orders over ₹999',
  '🛍️ One Village – One Product',
];

const Header: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const { data: announcementData } = useGetBannersQuery('announcement');
  const dynamicOffers =
    announcementData?.banners && announcementData.banners.length > 0
      ? announcementData.banners.filter((b) => b.isActive !== false).map((b) => b.title)
      : defaultPromoOffers;

  const promoOffers = dynamicOffers.length > 0 ? dynamicOffers : defaultPromoOffers;

  const linkClass = "flex flex-col items-center gap-1 text-neutral-800 hover:text-black transition duration-200";

  return (
    <>
      {/* ─── Top Offer & Promo Announcement Marquee Bar (Dynamic Admin Managed) ─── */}
      <div className="w-full bg-[#111111] text-white font-medium text-xs py-2 px-4 overflow-hidden relative z-50 border-b border-neutral-800">
        <div className="relative w-full flex overflow-hidden">
          <div className="animate-marquee flex items-center gap-12 whitespace-nowrap">
            {[...promoOffers, ...promoOffers].map((offer, idx) => (
              <span key={idx} className="flex items-center gap-2 tracking-wide font-sans text-neutral-200">
                <span>{offer}</span>
                <span className="text-neutral-600 ml-6">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <header className="bg-white text-[#111111] border-b border-neutral-200 shadow-xs p-3.5 px-4 md:px-12 relative z-40 transition-all duration-300">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="absolute left-1/2 flex -translate-x-1/2 items-center md:static md:translate-x-0">
            <Link to="/" className="flex items-center gap-2.5">
              <img src="https://res.cloudinary.com/idi6k3ue/image/upload/v1791904965/urvaa/logo.png" alt="URVA — Delivering the Authentic Rural Aura" className="h-11 w-11 md:h-13 md:w-13 object-contain" />
              <span className="hidden flex-col text-[#111111] md:flex">
                <span className="text-lg font-bold tracking-tight md:text-2xl font-sans">URVA</span>
                <span className="hidden text-[9px] font-medium uppercase tracking-[0.14em] text-neutral-500 md:block">Delivering the Authentic Rural Aura</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-7">
            <Link to="/" className={linkClass}>
              <FaHome className="text-base" />
              <span className="text-xs font-sans font-medium">Home</span>
            </Link>

            <Link to="/products" className={linkClass}>
              <FaBox className="text-base" />
              <span className="text-xs font-sans font-medium">Products</span>
            </Link>

            <Link to="/cart" className={`${linkClass} relative`}>
              <FaShoppingCart className="text-base" />
              <span className="text-xs font-sans font-medium">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 font-bold text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center bg-black text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Quick Action Buttons */}
          <div className="md:hidden flex items-center gap-4">
            <Link to="/cart" className="text-neutral-900 hover:text-black transition-colors p-1 relative" aria-label="Cart">
              <FaShoppingCart className="text-lg" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center bg-black text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
