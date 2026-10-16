import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFileContract, 
  FaShieldHalved, 
  FaTruckFast, 
  FaArrowRotateLeft, 
  FaEnvelope, 
  FaWhatsapp
} from 'react-icons/fa6';

interface LegalNavProps {
  currentPath: string;
}

const LEGAL_TABS = [
  { path: '/terms', label: 'Terms & Conditions', icon: FaFileContract },
  { path: '/privacy', label: 'Privacy Policy', icon: FaShieldHalved },
  { path: '/shipping-policy', label: 'Shipping & Delivery', icon: FaTruckFast },
  { path: '/refund-policy', label: 'Refund & Returns', icon: FaArrowRotateLeft },
];

export const LegalNav: React.FC<LegalNavProps> = ({ currentPath }) => {
  return (
    <div className="w-full mb-8">
      {/* Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {LEGAL_TABS.map((tab) => {
          const isActive = currentPath === tab.path;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shadow-xs ${
                isActive
                  ? 'bg-[#5A3825] text-[#F4F1EA] shadow-sm scale-102'
                  : 'bg-[#FAF8F4] text-[#5A3825] hover:text-[#3F2618] hover:bg-[#EAE5D9] border border-[#E2D9CC]'
              }`}
            >
              <Icon className={isActive ? 'text-[#F4F1EA]' : 'text-[#8C7364]'} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export const LegalContactCard: React.FC = () => {
  return (
    <div className="mt-12 pt-8 border-t border-[#E2D9CC] bg-[#FAF8F4] p-6 sm:p-8 rounded-2xl border border-[#E2D9CC]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B5A2B] block mb-1">
            GRIEVANCE & CUSTOMER CARE
          </span>
          <h3 className="text-base font-serif font-bold text-[#5A3825]">
            Have questions about our policies or your order?
          </h3>
          <p className="text-xs text-[#8C7364] mt-1 max-w-xl leading-relaxed">
            Our dedicated support team is available Monday to Saturday, 9:00 AM – 7:00 PM IST. We strive to address all customer inquiries and grievances within 24 business hours.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="mailto:urvaaofficial@gmail.com"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F4F1EA] hover:bg-[#EAE5D9] text-[#5A3825] text-xs font-semibold border border-[#E2D9CC] transition shadow-xs"
          >
            <FaEnvelope className="text-[#8B5A2B]" />
            <span>urvaaofficial@gmail.com</span>
          </a>

          <a
            href="https://wa.me/919494957576"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold transition shadow-xs"
          >
            <FaWhatsapp />
            <span>+91 94949 57576</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default LegalNav;
