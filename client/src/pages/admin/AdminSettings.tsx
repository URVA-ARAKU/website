import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGetAdminSettingsQuery, useUpdateStoreSettingsMutation } from '../../redux/api/settings.api';
import { StoreSettings } from '../../types/api-types';
import { 
  FaSave, 
  FaStore, 
  FaQrcode, 
  FaTruck, 
  FaYoutube, 
  FaVideo,
  FaShieldAlt, 
  FaEnvelope, 
  FaWhatsapp, 
  FaSync, 
  FaCheckCircle
} from 'react-icons/fa';
import { notify } from '../../utils/util';
import { parseYouTubeVideoId } from '../../utils/youtube';

const AdminSettings: React.FC = () => {
  const { data, isLoading, refetch } = useGetAdminSettingsQuery();
  const [updateStoreSettings, { isLoading: isSaving }] = useUpdateStoreSettingsMutation();

  const [activeTab, setActiveTab] = useState<'general' | 'payment' | 'shipping' | 'youtube' | 'system'>('general');

  // Form State
  const [storeName, setStoreName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportPhone, setSupportPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [officeAddress, setOfficeAddress] = useState('');

  const [upiId, setUpiId] = useState('');
  const [upiPayeeName, setUpiPayeeName] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [enableCod, setEnableCod] = useState(true);
  const [codMaxAmount, setCodMaxAmount] = useState(5000);

  const [freeShippingThreshold, setFreeShippingThreshold] = useState(999);
  const [standardShippingFee, setStandardShippingFee] = useState(80);
  const [expressShippingFee, setExpressShippingFee] = useState(99);
  const [shippingPartner, setShippingPartner] = useState('APSRTC Cargo & India Post');
  const [deliveryNote, setDeliveryNote] = useState('');
  
  // Dedicated Shipping Class for Leaf Plates (High Volumetric Weight)
  const [leafPlatesShippingFee, setLeafPlatesShippingFee] = useState(120);
  const [leafPlatesShippingType, setLeafPlatesShippingType] = useState<'tiered' | 'flat' | 'quantity'>('tiered');
  const [leafPlatesFreeShippingExcluded, setLeafPlatesFreeShippingExcluded] = useState(true);
  const [leafPlatesBasePlates, setLeafPlatesBasePlates] = useState(200);
  const [leafPlatesBaseFee, setLeafPlatesBaseFee] = useState(120);
  const [leafPlatesIncrementPerPlates, setLeafPlatesIncrementPerPlates] = useState(100);
  const [leafPlatesIncrementFee, setLeafPlatesIncrementFee] = useState(60);

  const [youtubeChannelUrl, setYoutubeChannelUrl] = useState('');
  const [youtubeChannelName, setYoutubeChannelName] = useState('');
  const [featuredYoutubeVideoId, setFeaturedYoutubeVideoId] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');

  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    if (data?.settings) {
      const s = data.settings;
      setStoreName(s.storeName || 'URVA Swadeshi');
      setTagline(s.tagline || 'Delivering the Authentic Rural Aura');
      setDescription(s.description || '');
      setSupportEmail(s.supportEmail || 'sales@urvaswadeshi.in');
      setSupportPhone(s.supportPhone || '+91 9494957576');
      setWhatsappNumber(s.whatsappNumber || '+919494957576');
      setOfficeAddress(s.officeAddress || '');

      setUpiId(s.upiId || '9346422451@ybl');
      setUpiPayeeName(s.upiPayeeName || 'URVA Rural Aura');
      setQrCodeUrl(s.qrCodeUrl || '/qr.jpeg');
      setEnableCod(s.enableCod !== false);
      setCodMaxAmount(s.codMaxAmount || 5000);

      setFreeShippingThreshold(s.freeShippingThreshold !== undefined ? Number(s.freeShippingThreshold) : 999);
      setStandardShippingFee(s.standardShippingFee !== undefined ? Number(s.standardShippingFee) : 80);
      setExpressShippingFee(s.expressShippingFee !== undefined ? Number(s.expressShippingFee) : 99);
      setShippingPartner(s.shippingPartner || 'APSRTC Cargo & India Post');
      setDeliveryNote(s.deliveryNote || 'Flat ₹80 Delivery across Andhra Pradesh & Telangana');

      setLeafPlatesShippingFee(s.leafPlatesShippingFee !== undefined ? Number(s.leafPlatesShippingFee) : 120);
      setLeafPlatesShippingType((s.leafPlatesShippingType as any) || 'tiered');
      setLeafPlatesFreeShippingExcluded(s.leafPlatesFreeShippingExcluded !== false);
      setLeafPlatesBasePlates(s.leafPlatesBasePlates !== undefined ? Number(s.leafPlatesBasePlates) : 200);
      setLeafPlatesBaseFee(s.leafPlatesBaseFee !== undefined ? Number(s.leafPlatesBaseFee) : 120);
      setLeafPlatesIncrementPerPlates(s.leafPlatesIncrementPerPlates !== undefined ? Number(s.leafPlatesIncrementPerPlates) : 100);
      setLeafPlatesIncrementFee(s.leafPlatesIncrementFee !== undefined ? Number(s.leafPlatesIncrementFee) : 60);

      setYoutubeChannelUrl(s.youtubeChannelUrl || 'https://www.youtube.com/@urvaswadeshi');
      setYoutubeChannelName(s.youtubeChannelName || 'URVA Rural Heritage');
      setFeaturedYoutubeVideoId(s.featuredYoutubeVideoId || 'aN2sDNVf-Js');
      setInstagramUrl(s.instagramUrl || 'https://instagram.com/urvaswadeshi');
      setFacebookUrl(s.facebookUrl || 'https://facebook.com/urvaswadeshi');

      setMetaTitle(s.metaTitle || 'URVA — Authentic Rural Specialties & Handlooms');
      setMetaDescription(s.metaDescription || '');
      setMaintenanceMode(Boolean(s.maintenanceMode));
    }
  }, [data]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const payload: Partial<StoreSettings> = {
      storeName: storeName.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      supportEmail: supportEmail.trim(),
      supportPhone: supportPhone.trim(),
      whatsappNumber: whatsappNumber.trim(),
      officeAddress: officeAddress.trim(),

      upiId: upiId.trim(),
      upiPayeeName: upiPayeeName.trim(),
      qrCodeUrl: qrCodeUrl.trim() || '/qr.jpeg',
      enableCod,
      codMaxAmount: Number(codMaxAmount) || 5000,

      freeShippingThreshold: Number(freeShippingThreshold) || 999,
      standardShippingFee: Number(standardShippingFee) !== undefined ? Number(standardShippingFee) : 80,
      expressShippingFee: Number(expressShippingFee) || 99,
      shippingPartner: shippingPartner.trim(),
      deliveryNote: deliveryNote.trim(),
      leafPlatesShippingFee: Number(leafPlatesShippingFee) || 120,
      leafPlatesShippingType,
      leafPlatesFreeShippingExcluded,
      leafPlatesBasePlates: Number(leafPlatesBasePlates) || 200,
      leafPlatesBaseFee: Number(leafPlatesBaseFee) || 120,
      leafPlatesIncrementPerPlates: Number(leafPlatesIncrementPerPlates) || 100,
      leafPlatesIncrementFee: Number(leafPlatesIncrementFee) || 60,

      youtubeChannelUrl: youtubeChannelUrl.trim(),
      youtubeChannelName: youtubeChannelName.trim(),
      featuredYoutubeVideoId: parseYouTubeVideoId(featuredYoutubeVideoId),
      instagramUrl: instagramUrl.trim(),
      facebookUrl: facebookUrl.trim(),

      metaTitle: metaTitle.trim(),
      metaDescription: metaDescription.trim(),
      maintenanceMode,
    };

    try {
      await updateStoreSettings(payload).unwrap();
      notify('Store settings and configurations saved successfully!', 'success');
      refetch();
    } catch (err: any) {
      notify(err?.data?.message || 'Failed to save settings', 'error');
    }
  };

  const handleClearCache = async () => {
    try {
      await updateStoreSettings({ updatedAt: new Date().toISOString() }).unwrap();
      notify('API fast cache purged and refreshed successfully', 'success');
      refetch();
    } catch {
      notify('Failed to purge cache', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 font-sans">
        <div className="w-8 h-8 border-2 border-[#5A3825] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-[#5A3825] tracking-tight">Store Settings & Controls</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EAE5D9] text-[#5A3825] border border-[#E2D9CC]">
              Admin Control Panel
            </span>
          </div>
          <p className="text-xs text-[#8C7364] mt-1">
            Configure store preferences, manage direct UPI & checkout parameters, set delivery thresholds, and sync YouTube links.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleClearCache}
            className="bg-[#FAF8F4] hover:bg-[#EAE5D9] text-[#5A3825] font-semibold px-3.5 py-2 rounded-xl text-xs border border-[#E2D9CC] transition flex items-center gap-1.5"
            title="Purge in-memory API response cache"
          >
            <FaSync className="text-xs" />
            <span>Purge Cache</span>
          </button>
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving}
            className="bg-[#5A3825] hover:bg-[#8B5A2B] text-white font-semibold px-5 py-2 rounded-xl text-xs shadow-2xs transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <FaSave className="text-xs" />
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs border-b border-[#E2D9CC]">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2.5 rounded-t-xl font-bold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'general'
              ? 'border-[#5A3825] text-[#5A3825] bg-[#FAF8F4]'
              : 'border-transparent text-[#8C7364] hover:text-[#5A3825]'
          }`}
        >
          <FaStore className="text-xs" /> General Identity
        </button>
        <button
          onClick={() => setActiveTab('payment')}
          className={`px-4 py-2.5 rounded-t-xl font-bold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'payment'
              ? 'border-[#5A3825] text-[#5A3825] bg-[#FAF8F4]'
              : 'border-transparent text-[#8C7364] hover:text-[#5A3825]'
          }`}
        >
          <FaQrcode className="text-xs" /> UPI & Payment
        </button>
        <button
          onClick={() => setActiveTab('shipping')}
          className={`px-4 py-2.5 rounded-t-xl font-bold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'shipping'
              ? 'border-[#5A3825] text-[#5A3825] bg-[#FAF8F4]'
              : 'border-transparent text-[#8C7364] hover:text-[#5A3825]'
          }`}
        >
          <FaTruck className="text-xs" /> Delivery & Shipping
        </button>
        <button
          onClick={() => setActiveTab('youtube')}
          className={`px-4 py-2.5 rounded-t-xl font-bold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'youtube'
              ? 'border-[#5A3825] text-[#5A3825] bg-[#FAF8F4]'
              : 'border-transparent text-[#8C7364] hover:text-[#5A3825]'
          }`}
        >
          <FaYoutube className="text-xs text-rose-600" /> YouTube & Media
        </button>
        <button
          onClick={() => setActiveTab('system')}
          className={`px-4 py-2.5 rounded-t-xl font-bold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'system'
              ? 'border-[#5A3825] text-[#5A3825] bg-[#FAF8F4]'
              : 'border-transparent text-[#8C7364] hover:text-[#5A3825]'
          }`}
        >
          <FaShieldAlt className="text-xs" /> System & Health
        </button>
      </div>

      {/* Tab Panels */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* ─── 1. GENERAL STORE IDENTITY ─── */}
        {activeTab === 'general' && (
          <div className="bg-[#FAF8F4] p-6 rounded-3xl border border-[#E2D9CC] shadow-2xs space-y-5">
            <h2 className="font-serif font-bold text-base text-[#5A3825] border-b border-[#E2D9CC] pb-3">
              Store Profile & Contact Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5A3825] uppercase tracking-wider mb-1.5">
                  Store Brand Name
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CC] bg-[#F4F1EA] text-[#5A3825] text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5A3825] uppercase tracking-wider mb-1.5">
                  Brand Tagline
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CC] bg-[#F4F1EA] text-[#5A3825] text-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5A3825] uppercase tracking-wider mb-1.5">
                Brand Description / About
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CC] bg-[#F4F1EA] text-[#5A3825] text-xs focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5A3825] uppercase tracking-wider mb-1.5">
                  Customer Support Email
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2.5 bg-[#EAE5D9] border border-r-0 border-[#E2D9CC] rounded-l-xl text-xs text-[#8C7364]">
                    <FaEnvelope />
                  </span>
                  <input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-r-xl border border-[#E2D9CC] bg-[#F4F1EA] text-[#5A3825] text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5A3825] uppercase tracking-wider mb-1.5">
                  Helpline Phone
                </label>
                <input
                  type="text"
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CC] bg-[#F4F1EA] text-[#5A3825] text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5A3825] uppercase tracking-wider mb-1.5">
                  WhatsApp Support Number
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2.5 bg-[#EAE5D9] border border-r-0 border-[#E2D9CC] rounded-l-xl text-xs text-emerald-700">
                    <FaWhatsapp />
                  </span>
                  <input
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-r-xl border border-[#E2D9CC] bg-[#F4F1EA] text-[#5A3825] text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5A3825] uppercase tracking-wider mb-1.5">
                Physical Office & Fulfillment Center Address
              </label>
              <input
                type="text"
                value={officeAddress}
                onChange={(e) => setOfficeAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CC] bg-[#F4F1EA] text-[#5A3825] text-xs focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* ─── 2. PAYMENT & UPI SETTINGS ─── */}
        {activeTab === 'payment' && (
          <div className="bg-[#FAF8F4] p-6 rounded-3xl border border-[#E2D9CC] shadow-2xs space-y-5">
            <h2 className="font-serif font-bold text-base text-[#5A3825] border-b border-[#E2D9CC] pb-3">
              UPI Direct Checkout & Payment Controls
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5A3825] uppercase tracking-wider mb-1.5">
                  Primary Receiving UPI ID (VPA) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="9346422451@ybl"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CC] bg-[#F4F1EA] text-[#5A3825] font-mono text-sm focus:outline-none"
                />
                <span className="text-[11px] text-[#8C7364] mt-1 block">
                  Customers make instant UPI payments to this address.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5A3825] uppercase tracking-wider mb-1.5">
                  UPI Payee Display Name
                </label>
                <input
                  type="text"
                  value={upiPayeeName}
                  onChange={(e) => setUpiPayeeName(e.target.value)}
                  placeholder="URVA Rural Aura"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CC] bg-[#F4F1EA] text-[#5A3825] text-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5A3825] uppercase tracking-wider mb-1.5">
                Official QR Code Image URL
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={qrCodeUrl}
                  onChange={(e) => setQrCodeUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CC] bg-[#F4F1EA] text-[#5A3825] text-xs font-mono focus:outline-none"
                />
                {qrCodeUrl && (
                  <a
                    href={qrCodeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-xl bg-[#EAE5D9] hover:bg-[#DDD5C5] text-[#5A3825] text-xs font-semibold shrink-0 transition"
                  >
                    Preview QR
                  </a>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-[#E2D9CC]">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#5A3825]">
                <input
                  type="checkbox"
                  checked={enableCod}
                  onChange={(e) => setEnableCod(e.target.checked)}
                  className="w-4 h-4 rounded text-[#8B5A2B] focus:ring-[#8B5A2B]"
                />
                <span>Enable Cash on Delivery (COD) for eligible pincodes</span>
              </label>

              {enableCod && (
                <div className="mt-3 max-w-xs">
                  <label className="block text-xs text-[#8C7364] mb-1">Maximum Order Value for COD (₹):</label>
                  <input
                    type="number"
                    value={codMaxAmount}
                    onChange={(e) => setCodMaxAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2D9CC] bg-[#F4F1EA] text-[#5A3825] text-xs"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── 3. SHIPPING & DELIVERY SETTINGS ─── */}
        {activeTab === 'shipping' && (
          <div className="bg-[#FAF8F4] p-6 rounded-3xl border border-[#E2D9CC] shadow-2xs space-y-5">
            <div className="border-b border-[#E2D9CC] pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="font-serif font-bold text-base text-[#5A3825]">
                  Shipping & Delivery Charges Management
                </h2>
                <p className="text-xs text-[#8C7364] mt-0.5">
                  Set standard delivery charges, free shipping thresholds, and delivery notes applied across checkout.
                </p>
              </div>
              <span className="self-start sm:self-auto bg-emerald-100 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-200">
                Active: ₹{standardShippingFee} Flat Delivery
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5A3825] uppercase tracking-wider mb-1.5">
                  Standard Delivery Charge (₹) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={standardShippingFee}
                  onChange={(e) => setStandardShippingFee(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CC] bg-[#F4F1EA] text-[#5A3825] text-sm font-bold focus:outline-none focus:ring-1 focus:ring-[#5A3825]"
                />
                <span className="text-[11px] text-[#8C7364] mt-1 block">
                  Delivery amount charged to customers on orders at checkout.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5A3825] uppercase tracking-wider mb-1.5">
                  Free Shipping Minimum (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={freeShippingThreshold}
                  onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CC] bg-[#F4F1EA] text-[#5A3825] text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-[#5A3825]"
                />
                <span className="text-[11px] text-[#8C7364] mt-1 block">
                  Orders equal or higher than this receive 100% free delivery.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5A3825] uppercase tracking-wider mb-1.5">
                  Express Cargo Fee (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={expressShippingFee}
                  onChange={(e) => setExpressShippingFee(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CC] bg-[#F4F1EA] text-[#5A3825] text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-[#5A3825]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-[#5A3825] uppercase tracking-wider mb-1.5">
                  Delivery & Shipping Note for Checkout
                </label>
                <input
                  type="text"
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  placeholder="Flat ₹80 Delivery across Andhra Pradesh & Telangana"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CC] bg-[#F4F1EA] text-[#5A3825] text-xs focus:outline-none focus:ring-1 focus:ring-[#5A3825]"
                />
                <span className="text-[11px] text-[#8C7364] mt-1 block">
                  Shown to customers during checkout and order summary.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5A3825] uppercase tracking-wider mb-1.5">
                  Primary Logistics / Cargo Partner
                </label>
                <input
                  type="text"
                  value={shippingPartner}
                  onChange={(e) => setShippingPartner(e.target.value)}
                  placeholder="APSRTC Cargo & India Post"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CC] bg-[#F4F1EA] text-[#5A3825] text-xs focus:outline-none focus:ring-1 focus:ring-[#5A3825]"
                />
              </div>
            </div>

            {/* Dedicated Shipping Class: Leaf Plates (High Volumetric Weight) */}
            <div className="bg-[#FAF7F2] p-5 rounded-2xl border-2 border-amber-300 space-y-4 mt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/80 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base">📦</span>
                    <h3 className="font-bold text-sm text-[#5A3825]">
                      Shipping Class: Leaf Plates
                    </h3>
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      High Volumetric Weight
                    </span>
                  </div>
                  <p className="text-xs text-[#8C7364] mt-1">
                    Leaf plates consume large cargo space. They are excluded from standard free shipping and charged this separate delivery rate.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#8B5A2B] bg-white px-2.5 py-1 rounded-lg border border-[#E2D9CC]">
                    Active: ₹{leafPlatesBaseFee} (up to {leafPlatesBasePlates} plates) + ₹{leafPlatesIncrementFee} / {leafPlatesIncrementPerPlates} plates
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5A3825] uppercase tracking-wider mb-1.5">
                    Calculation Type
                  </label>
                  <select
                    value={leafPlatesShippingType}
                    onChange={(e) => setLeafPlatesShippingType(e.target.value as 'tiered' | 'flat' | 'quantity')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CC] bg-white text-[#5A3825] text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#5A3825]"
                  >
                    <option value="tiered">Tiered by Plate Count (Scales with Plates - Recommended)</option>
                    <option value="flat">Flat Rate (Fixed fee per order)</option>
                    <option value="quantity">Per Pack / Bundle (₹ × pack count)</option>
                  </select>
                  <span className="text-[11px] text-[#8C7364] mt-1 block">
                    Choose how charges scale as customers order more plates.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5A3825] uppercase tracking-wider mb-1.5">
                    Base Delivery Fee (₹) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={leafPlatesBaseFee}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setLeafPlatesBaseFee(val);
                      setLeafPlatesShippingFee(val);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CC] bg-white text-[#5A3825] text-sm font-bold focus:outline-none focus:ring-1 focus:ring-[#5A3825]"
                    placeholder="120"
                  />
                  <span className="text-[11px] text-[#8C7364] mt-1 block">
                    Delivery fee for up to {leafPlatesBasePlates} plates (e.g. ₹120).
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5A3825] uppercase tracking-wider mb-1.5">
                    Base Plate Capacity (Plates)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={leafPlatesBasePlates}
                    onChange={(e) => setLeafPlatesBasePlates(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CC] bg-white text-[#5A3825] text-sm font-bold focus:outline-none focus:ring-1 focus:ring-[#5A3825]"
                    placeholder="200"
                  />
                  <span className="text-[11px] text-[#8C7364] mt-1 block">
                    Number of plates covered by the base delivery fee.
                  </span>
                </div>
              </div>

              {leafPlatesShippingType === 'tiered' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-amber-200/60">
                  <div>
                    <label className="block text-xs font-bold text-[#5A3825] uppercase tracking-wider mb-1.5">
                      Additional Fee as Plates Increase (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={leafPlatesIncrementFee}
                      onChange={(e) => setLeafPlatesIncrementFee(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CC] bg-white text-[#5A3825] text-sm font-bold focus:outline-none focus:ring-1 focus:ring-[#5A3825]"
                      placeholder="60"
                    />
                    <span className="text-[11px] text-[#8C7364] mt-1 block">
                      Extra delivery charge added per incremental slab (e.g. +₹60).
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5A3825] uppercase tracking-wider mb-1.5">
                      Incremental Slab Size (Plates)
                    </label>
                    <input
                      type="number"
                      min="10"
                      value={leafPlatesIncrementPerPlates}
                      onChange={(e) => setLeafPlatesIncrementPerPlates(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CC] bg-white text-[#5A3825] text-sm font-bold focus:outline-none focus:ring-1 focus:ring-[#5A3825]"
                      placeholder="100"
                    />
                    <span className="text-[11px] text-[#8C7364] mt-1 block">
                      Add the extra fee for every this many additional plates.
                    </span>
                  </div>
                </div>
              )}

              {/* Dynamic Rate Preview */}
              <div className="bg-white/80 p-3 rounded-xl border border-amber-200/80 text-xs text-[#5A3825] space-y-1.5">
                <span className="font-bold text-[11px] uppercase tracking-wider text-[#8B5A2B] block">
                  📈 Live Rate Preview for Customers:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
                  <div className="p-2 rounded-lg bg-[#FAF8F4] border border-[#E2D9CC]">
                    <span className="text-[#8C7364] block">1 – {leafPlatesBasePlates} Plates</span>
                    <strong className="text-[#5A3825] text-xs">₹{leafPlatesBaseFee}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-[#FAF8F4] border border-[#E2D9CC]">
                    <span className="text-[#8C7364] block">{leafPlatesBasePlates + 1} – {leafPlatesBasePlates + leafPlatesIncrementPerPlates} Plates</span>
                    <strong className="text-[#5A3825] text-xs">₹{leafPlatesBaseFee + leafPlatesIncrementFee}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-[#FAF8F4] border border-[#E2D9CC]">
                    <span className="text-[#8C7364] block">{leafPlatesBasePlates + leafPlatesIncrementPerPlates * 2} Plates</span>
                    <strong className="text-[#5A3825] text-xs">₹{leafPlatesBaseFee + leafPlatesIncrementFee * 2}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-[#FAF8F4] border border-[#E2D9CC]">
                    <span className="text-[#8C7364] block">1,000 Plates</span>
                    <strong className="text-[#5A3825] text-xs">
                      ₹{leafPlatesBaseFee + Math.ceil(Math.max(0, 1000 - leafPlatesBasePlates) / leafPlatesIncrementPerPlates) * leafPlatesIncrementFee}
                    </strong>
                  </div>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={leafPlatesFreeShippingExcluded}
                    onChange={(e) => setLeafPlatesFreeShippingExcluded(e.target.checked)}
                    className="w-4 h-4 text-[#8B5A2B] accent-[#8B5A2B] rounded border-[#E2D9CC]"
                  />
                  <span className="text-xs font-semibold text-[#5A3825]">
                    Exclude Leaf Plates from Free Shipping above ₹{freeShippingThreshold}
                  </span>
                </label>
                <span className="text-[11px] text-[#8C7364] mt-0.5 block pl-6">
                  Leaf plates are always charged this progressive volumetric cargo fee regardless of total order amount.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ─── 4. YOUTUBE & SOCIAL INTEGRATION ─── */}
        {activeTab === 'youtube' && (
          <div className="bg-[#FAF8F4] p-6 rounded-3xl border border-[#E2D9CC] shadow-2xs space-y-5">
            <h2 className="font-serif font-bold text-base text-[#5A3825] border-b border-[#E2D9CC] pb-3">
              Official YouTube Channel & Video Integration
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5A3825] uppercase tracking-wider mb-1.5">
                  YouTube Channel URL
                </label>
                <input
                  type="url"
                  value={youtubeChannelUrl}
                  onChange={(e) => setYoutubeChannelUrl(e.target.value)}
                  placeholder="https://www.youtube.com/@urvaswadeshi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CC] bg-[#F4F1EA] text-[#5A3825] text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5A3825] uppercase tracking-wider mb-1.5">
                  Channel Display Name
                </label>
                <input
                  type="text"
                  value={youtubeChannelName}
                  onChange={(e) => setYoutubeChannelName(e.target.value)}
                  placeholder="URVA Rural Heritage"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CC] bg-[#F4F1EA] text-[#5A3825] text-xs focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5A3825] uppercase tracking-wider mb-1.5">
                Featured YouTube Video ID (or URL)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={featuredYoutubeVideoId}
                  onChange={(e) => setFeaturedYoutubeVideoId(parseYouTubeVideoId(e.target.value) || e.target.value)}
                  placeholder="e.g. aN2sDNVf-Js or paste any YouTube URL"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CC] bg-[#F4F1EA] text-[#5A3825] text-xs font-mono focus:outline-none"
                />
                {featuredYoutubeVideoId && (
                  <a
                    href={`https://www.youtube.com/watch?v=${parseYouTubeVideoId(featuredYoutubeVideoId)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold shrink-0 transition flex items-center gap-1.5"
                  >
                    <FaYoutube /> Watch
                  </a>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] text-[#8C7364] mt-1.5">
                <span>Paste any YouTube video or shorts URL — the 11-char ID is extracted automatically.</span>
                {featuredYoutubeVideoId && parseYouTubeVideoId(featuredYoutubeVideoId) && (
                  <span className="font-mono text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                    ID: {parseYouTubeVideoId(featuredYoutubeVideoId)}
                  </span>
                )}
              </div>
            </div>

            {/* Manage YouTube Playlist Videos Link */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold text-[#5A3825] flex items-center gap-1.5">
                  <FaVideo className="text-[#8B5A2B]" />
                  <span>Manage YouTube Showcase Playlist Videos</span>
                </h3>
                <p className="text-[11px] text-[#8C7364] mt-0.5">
                  Add, edit, reorder, or delete videos displayed in the YouTube section on your homepage.
                </p>
              </div>
              <Link
                to="/admin/banners"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5A3825] hover:bg-[#3F2618] text-[#FAF8F4] text-xs font-bold transition shadow-xs shrink-0"
              >
                <span>Open Video Manager →</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E2D9CC]">
              <div>
                <label className="block text-xs font-bold text-[#5A3825] uppercase tracking-wider mb-1.5">
                  Instagram Profile Link
                </label>
                <input
                  type="url"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CC] bg-[#F4F1EA] text-[#5A3825] text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5A3825] uppercase tracking-wider mb-1.5">
                  Facebook Page Link
                </label>
                <input
                  type="url"
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CC] bg-[#F4F1EA] text-[#5A3825] text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ─── 5. SYSTEM CONTROLS & ADMINISTRATIVE HEALTH ─── */}
        {activeTab === 'system' && (
          <div className="bg-[#FAF8F4] p-6 rounded-3xl border border-[#E2D9CC] shadow-2xs space-y-5">
            <h2 className="font-serif font-bold text-base text-[#5A3825] border-b border-[#E2D9CC] pb-3">
              Administrative Security & System Status
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#F4F1EA] p-4 rounded-2xl border border-[#E2D9CC]">
                <div className="flex items-center gap-2 text-emerald-800 text-sm font-bold">
                  <FaCheckCircle /> Database Connection
                </div>
                <p className="text-xs text-[#8C7364] mt-1">Supabase PostgreSQL connected & responsive</p>
              </div>

              <div className="bg-[#F4F1EA] p-4 rounded-2xl border border-[#E2D9CC]">
                <div className="flex items-center gap-2 text-emerald-800 text-sm font-bold">
                  <FaCheckCircle /> Resend Email API
                </div>
                <p className="text-xs text-[#8C7364] mt-1">Ready to send from sales@urvaswadeshi.in</p>
              </div>

              <div className="bg-[#F4F1EA] p-4 rounded-2xl border border-[#E2D9CC]">
                <div className="flex items-center gap-2 text-emerald-800 text-sm font-bold">
                  <FaCheckCircle /> Payment Mode
                </div>
                <p className="text-xs text-[#8C7364] mt-1">Direct PhonePe / Generic UPI QR active</p>
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold text-[#5A3825] uppercase tracking-wider mb-1.5">
                Default Meta Title (SEO)
              </label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CC] bg-[#F4F1EA] text-[#5A3825] text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5A3825] uppercase tracking-wider mb-1.5">
                Default Meta Description (SEO)
              </label>
              <textarea
                rows={2}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CC] bg-[#F4F1EA] text-[#5A3825] text-xs focus:outline-none"
              />
            </div>

            <div className="pt-3 border-t border-[#E2D9CC] flex items-center justify-between">
              <div>
                <span className="font-semibold text-xs text-[#5A3825] block">Store Maintenance Mode</span>
                <span className="text-[11px] text-[#8C7364]">
                  Displays a maintenance notice to visiting customers while keeping admin dashboard accessible.
                </span>
              </div>
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="w-5 h-5 rounded text-[#8B5A2B] focus:ring-[#8B5A2B]"
              />
            </div>
          </div>
        )}

        {/* Save Bar */}
        <div className="flex items-center justify-between p-4 bg-[#FAF8F4] rounded-2xl border border-[#E2D9CC]">
          <span className="text-xs text-[#8C7364]">
            Settings auto-sync across storefront components in real-time.
          </span>
          <button
            type="submit"
            disabled={isSaving}
            className="bg-[#5A3825] hover:bg-[#8B5A2B] text-white font-semibold px-6 py-2.5 rounded-xl text-xs shadow-2xs transition flex items-center gap-2 disabled:opacity-50"
          >
            <FaSave className="text-xs" />
            <span>{isSaving ? 'Saving Configurations...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
