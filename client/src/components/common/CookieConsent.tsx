import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShieldHalved, FaXmark } from 'react-icons/fa6';

const CONSENT_STORAGE_KEY = 'urva_dpdp_cookie_consent_v1';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    try {
      const storedConsent = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!storedConsent) {
        // Small delay to prevent layout jump on immediate load
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // LocalStorage access restricted / private browsing
      setIsVisible(false);
    }
  }, []);

  const handleAccept = (type: 'all' | 'essential') => {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({
        status: type,
        timestamp: new Date().toISOString(),
      }));
    } catch {
      // Ignore storage errors
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie and Data Protection Consent"
      className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-50 bg-[#FAF8F4] border-2 border-[#E2D9CC] rounded-2xl shadow-xl p-4 sm:p-5 text-[#5A3825] transition-all animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl" role="img" aria-label="Cookie">🍪</span>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#8B5A2B]">
            <FaShieldHalved className="text-xs" /> DPDP Act 2023 Consent
          </span>
        </div>
        <button
          type="button"
          onClick={() => handleAccept('essential')}
          className="text-[#8C7364] hover:text-[#5A3825] p-1 rounded-md transition cursor-pointer"
          aria-label="Close consent notice"
        >
          <FaXmark className="text-sm" />
        </button>
      </div>

      <p className="text-xs text-[#5A3825] leading-relaxed mb-3">
        In accordance with India&apos;s <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong>, URVA uses essential cookies and local storage to preserve your shopping basket, save delivery preferences, and ensure secure payments. We never sell your personal information.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#E2D9CC]/60">
        <Link
          to="/privacy"
          className="text-[11px] font-semibold text-[#8B5A2B] hover:text-[#5A3825] underline cursor-pointer"
        >
          Privacy Policy & Rights
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleAccept('essential')}
            className="px-3 py-1.5 text-xs font-semibold text-[#5A3825] bg-[#F4F1EA] hover:bg-[#EAE5D9] border border-[#E2D9CC] rounded-lg transition cursor-pointer"
          >
            Essential Only
          </button>
          <button
            type="button"
            onClick={() => handleAccept('all')}
            className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#8B5A2B] hover:bg-[#5A3825] rounded-lg transition shadow-xs cursor-pointer"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
