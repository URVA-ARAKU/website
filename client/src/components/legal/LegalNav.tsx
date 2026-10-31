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
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B5A2B] block mb-1">
            STATUTORY GRIEVANCE REDRESSAL & DATA PROTECTION OFFICER (DPDP ACT 2023)
          </span>
          <h3 className="text-base font-serif font-bold text-[#5A3825]">
            Have questions about your data privacy or order?
          </h3>
          <p className="text-xs text-[#8C7364] mt-1 max-w-xl leading-relaxed">
            Under India&apos;s <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong> and the Consumer Protection (E-Commerce) Rules, you have the right to access, rectify, or request erasure of your personal data. All data queries and customer grievances are acknowledged within 48 hours and resolved promptly.
          </p>
          <div className="mt-3 text-[11px] text-[#5A3825] space-y-1">
            <p><strong>Designated Officer:</strong> Grievance Redressal & Data Protection Officer</p>
            <p><strong>Entity / Data Fiduciary:</strong> URVA (Urva Swadeshi), Araku Valley, Andhra Pradesh, India</p>
            <p><strong>Response SLA:</strong> Acknowledgement within 48 hours · Resolution within 30 days</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col items-start gap-3 shrink-0">
          <a
            href="mailto:urvaaofficial@gmail.com"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F4F1EA] hover:bg-[#EAE5D9] text-[#5A3825] text-xs font-semibold border border-[#E2D9CC] transition shadow-xs w-full justify-center"
          >
            <FaEnvelope className="text-[#8B5A2B]" />
            <span>urvaaofficial@gmail.com</span>
          </a>

          <a
            href="https://wa.me/919494957576"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold transition shadow-xs w-full justify-center"
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
