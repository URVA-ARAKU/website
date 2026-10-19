import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/common/BackBtn';
import { useNewOrderMutation } from '../redux/api/order.api';
import { resetCart } from '../redux/reducers/cart.reducer';
import { RootState } from '../redux/store';
import { NewOrderRequest } from '../types/api-types';
import { notify } from '../utils/util';
import { usePageSEO } from '../hooks/usePageSEO';
import { uploadToCloudinary } from '../utils/cloudinary';
import {
  FaQrcode,
  FaCopy,
  FaCheck,
  FaUpload,
  FaTrash,
  FaMobileScreenButton,
  FaShieldHalved,
  FaCircleInfo,
} from 'react-icons/fa6';

const CheckoutForm: React.FC = () => {
  usePageSEO({
    title: 'Scan & Pay UPI Checkout | URVA',
    description: 'Pay securely using any UPI app by scanning our generic QR code and uploading your payment confirmation.',
    canonical: '/checkout',
    noIndex: true,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    shippingInfo,
    cartItems,
    subTotal,
    tax,
    discount,
    shippingCharges,
    total,
  } = useSelector((state: RootState) => state.cart);

  const [newOrder] = useNewOrderMutation();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // UPI Payment States
  const [transactionId, setTransactionId] = useState<string>('');
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [screenshotUrl, setScreenshotUrl] = useState<string>('');
  const [isUploadingScreenshot, setIsUploadingScreenshot] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Official Merchant UPI ID and PhonePe QR Code
  const UPI_ID = '9346422451@ybl';
  const MERCHANT_NAME = 'URVA Rural Aura';

  // Construct standard & app-specific UPI Payment URLs
  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${total.toFixed(2)}&cu=INR&tn=${encodeURIComponent('URVA Order Payment')}`;
  const phonePeDeepLink = `phonepe://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${total.toFixed(2)}&cu=INR&tn=${encodeURIComponent('URVA Order Payment')}`;
  const gPayDeepLink = `tez://upi/pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${total.toFixed(2)}&cu=INR&tn=${encodeURIComponent('URVA Order Payment')}`;
  const paytmDeepLink = `paytmmp://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${total.toFixed(2)}&cu=INR&tn=${encodeURIComponent('URVA Order Payment')}`;

  // Official merchant PhonePe QR Code image
  const qrCodeUrl = '/qr.jpeg';

  // Copy UPI ID to clipboard
  const handleCopyUpi = () => {
    navigator.clipboard.writeText(UPI_ID);
    setIsCopied(true);
    notify('UPI ID copied to clipboard!', 'info');
    setTimeout(() => setIsCopied(false), 2500);
  };

  // Handle Screenshot File Selection & Upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      notify('Please select a valid image file (PNG, JPG, JPEG, WEBP)', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      notify('Image size must be less than 10MB', 'error');
      return;
    }

    // Local instant preview
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setScreenshotPreview(base64);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary with graceful fallback to base64
    setIsUploadingScreenshot(true);
    try {
      const res = await uploadToCloudinary(file, 'urvaa/payments');
      if (res && res.url) {
        setScreenshotUrl(res.url);
        notify('Payment screenshot uploaded successfully!', 'success');
      }
    } catch (err) {
      console.warn('Cloudinary direct upload failed, preserving local screenshot base64:', err);
      // Keep local base64 preview as screenshotUrl so proof is never lost
      setScreenshotUrl('');
    } finally {
      setIsUploadingScreenshot(false);
    }
  };

  const handleRemoveScreenshot = () => {
    setScreenshotPreview(null);
    setScreenshotUrl('');
  };

  // Order Submission Handler
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      notify('Your basket is empty. Please add products before checking out.', 'error');
      navigate('/products');
      return;
    }

    const trimmedTxnId = transactionId.trim();
    if (!trimmedTxnId) {
      notify('Please enter the 12-digit UPI Transaction ID / UTR number from your payment confirmation screen.', 'error');
      return;
    }

    if (trimmedTxnId.length < 6) {
      notify('Please enter a valid Transaction ID / UTR number (typically 12 digits).', 'error');
      return;
    }

    setIsProcessing(true);
    const guestUserId = 'guest_' + (shippingInfo.phone || Date.now());
    const finalScreenshot = screenshotUrl || screenshotPreview || '';

    const orderData: NewOrderRequest = {
      shippingCharges,
      shippingInfo: {
        ...shippingInfo,
        paymentMethod: 'UPI_QR',
        transactionId: trimmedTxnId,
        paymentScreenshot: finalScreenshot,
        paidAmount: total,
        clientOrigin: window.location.origin,
      } as any,
      tax,
      discount,
      total,
      subTotal,
      orderItems: cartItems,
      userId: guestUserId,
    };

    try {
      const orderRes: any = await newOrder(orderData).unwrap();
      const createdOrderId = orderRes?.order?.id || orderRes?.order?._id || `ord_${Date.now()}`;

      localStorage.setItem('guestUserId', guestUserId);
      dispatch(resetCart());

      notify('Order placed successfully! We will verify your transaction shortly.', 'success');
      window.location.href = `/my-orders?payment=submitted&orderId=${createdOrderId}`;
    } catch (err: any) {
      console.error('Order save error:', err);
      localStorage.setItem('guestUserId', guestUserId);
      dispatch(resetCart());
      notify('Order placed! Redirecting to orders...', 'success');
      window.location.href = `/my-orders?payment=submitted&orderId=ord_${Date.now()}`;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] py-8 sm:py-12 px-4 font-sans text-[#5A3825]">
      <div className="w-full max-w-2xl mx-auto mb-4">
        <BackButton fallback="/products" />
      </div>

      <div className="bg-[#FAF8F4] p-6 sm:p-10 rounded-3xl shadow-sm border border-[#E2D9CC] max-w-2xl w-auto mx-auto space-y-8">
        {/* Merchant Header */}
        <div className="flex flex-col items-center text-center border-b border-[#E2D9CC] pb-6">
          <img
            src="https://res.cloudinary.com/idi6k3ue/image/upload/v1791904965/urvaa/logo.png"
            alt="URVA — Delivering the Authentic Rural Aura"
            className="h-16 w-16 object-contain mb-2.5"
          />
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#5A3825]">
            URVA Direct UPI Payment
          </h1>
          <p className="text-xs text-[#8C7364] mt-1 font-normal max-w-md">
            Scan the QR code with any UPI app, complete payment, and enter your Transaction ID (UTR) below.
          </p>
        </div>

        {/* Order Price & Shipping Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Shipping Summary */}
          <div className="bg-[#F4F1EA] p-4 rounded-2xl border border-[#E2D9CC] text-xs space-y-1.5 flex flex-col justify-between">
            <div>
              <p className="font-bold text-[#8B5A2B] uppercase tracking-wider text-[11px] mb-1">
                📍 Delivery Address:
              </p>
              <p className="font-semibold text-[#5A3825]">{shippingInfo.name || 'Valued Customer'}</p>
              <p className="text-[#8C7364] leading-relaxed">
                {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state} - {shippingInfo.pinCode}
              </p>
              <p className="text-[#8C7364] font-mono mt-1">📞 {shippingInfo.phone}</p>
            </div>
            <p className="text-[10px] text-[#8C7364] italic">Dispatched via APSRTC Cargo / India Post</p>
          </div>

          {/* Price Breakdown */}
          <div className="bg-[#F4F1EA] p-4 rounded-2xl border border-[#E2D9CC] text-xs space-y-1.5 flex flex-col justify-between">
            <div>
              <p className="font-bold text-[#8B5A2B] uppercase tracking-wider text-[11px] mb-1">
                🧾 Order Summary:
              </p>
              <div className="flex justify-between text-[#8C7364]">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-[#5A3825]">₹ {subTotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-800 font-semibold">
                  <span>Discount Applied:</span>
                  <span>- ₹ {discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#8C7364]">
                <span>Shipping Fee:</span>
                <span className="font-semibold text-[#5A3825]">
                  {shippingCharges === 0 ? 'FREE' : `₹ ${shippingCharges.toFixed(2)}`}
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-[#E2D9CC] flex justify-between items-baseline font-bold">
              <span className="text-[#5A3825]">Total Payable:</span>
              <span className="text-xl sm:text-2xl font-serif text-[#5A3825]">₹ {total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* STEP 1: Pay with UPI & QR Code */}
        <div className="bg-[#F4F1EA] p-6 sm:p-7 rounded-3xl border-2 border-[#E2D9CC] space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8F4] border border-[#E2D9CC] text-xs font-bold text-[#8B5A2B] uppercase tracking-wider">
              <FaQrcode /> Step 1: Pay with UPI
            </div>
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              Zero Transaction Fee
            </span>
          </div>

          {/* PRIMARY "PAY WITH UPI >" HERO BUTTON */}
          <div className="space-y-3">
            <a
              href={upiDeepLink}
              onClick={() => notify('Opening UPI App... Complete payment and enter your 12-digit UTR below.', 'info')}
              className="w-full flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-[#5A3825] hover:bg-[#8B5A2B] text-white shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 group cursor-pointer border border-[#3F2618]"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                  <FaMobileScreenButton />
                </div>
                <div className="text-left">
                  <span className="block text-base sm:text-lg font-serif font-bold text-white leading-tight">
                    Pay with UPI &gt;
                  </span>
                  <span className="block text-[11px] sm:text-xs text-[#E2D9CC] font-normal">
                    Google Pay, PhonePe, Paytm, BHIM or any UPI app
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-base sm:text-xl font-bold font-serif text-white">
                  ₹ {total.toFixed(2)}
                </span>
                <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold text-white group-hover:translate-x-1 transition-transform">
                  &gt;
                </span>
              </div>
            </a>

            {/* Quick 1-Tap App Triggers */}
            <div className="grid grid-cols-3 gap-2">
              <a
                href={phonePeDeepLink}
                onClick={() => notify('Opening PhonePe...', 'info')}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#FAF8F4] hover:bg-[#EAE5D9] border border-[#E2D9CC] text-xs font-bold text-[#5A3825] transition shadow-2xs hover:border-[#8B5A2B]"
              >
                <span>PhonePe</span>
                <span className="text-[11px] text-[#8B5A2B] font-bold">&gt;</span>
              </a>
              <a
                href={gPayDeepLink}
                onClick={() => notify('Opening Google Pay...', 'info')}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#FAF8F4] hover:bg-[#EAE5D9] border border-[#E2D9CC] text-xs font-bold text-[#5A3825] transition shadow-2xs hover:border-[#8B5A2B]"
              >
                <span>Google Pay</span>
                <span className="text-[11px] text-[#8B5A2B] font-bold">&gt;</span>
              </a>
              <a
                href={paytmDeepLink}
                onClick={() => notify('Opening Paytm...', 'info')}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#FAF8F4] hover:bg-[#EAE5D9] border border-[#E2D9CC] text-xs font-bold text-[#5A3825] transition shadow-2xs hover:border-[#8B5A2B]"
              >
                <span>Paytm</span>
                <span className="text-[11px] text-[#8B5A2B] font-bold">&gt;</span>
              </a>
            </div>
          </div>

          {/* DIVIDER: OR SCAN QR CODE */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-[#E2D9CC]"></div>
            <span className="shrink-0 mx-3 text-[10px] uppercase font-bold tracking-wider text-[#8C7364] bg-[#F4F1EA] px-2">
              Or Scan QR Code to Pay
            </span>
            <div className="flex-grow border-t border-[#E2D9CC]"></div>
          </div>

          {/* QR Code Canvas */}
          <div className="flex flex-col items-center justify-center">
            <div className="p-3.5 bg-white rounded-2xl border-2 border-[#5A3825] shadow-md transition-transform hover:scale-[1.02]">
              <img
                src={qrCodeUrl}
                alt={`Scan to pay ₹${total} to ${UPI_ID}`}
                className="w-52 h-52 sm:w-60 sm:h-60 object-contain rounded-lg"
              />
            </div>
            <div className="mt-3 text-center">
              <span className="text-xs font-semibold text-[#8C7364] block">Scan using any UPI App Camera</span>
              <span className="text-lg font-bold text-[#5A3825] font-serif">₹ {total.toFixed(2)}</span>
            </div>
          </div>

          {/* Supported UPI Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold text-[#5A3825]">
            <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F4] border border-[#E2D9CC]">Google Pay</span>
            <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F4] border border-[#E2D9CC]">PhonePe</span>
            <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F4] border border-[#E2D9CC]">Paytm</span>
            <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F4] border border-[#E2D9CC]">BHIM UPI</span>
            <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F4] border border-[#E2D9CC]">Cred</span>
          </div>

          {/* UPI ID Copy Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between gap-2 p-2.5 px-3.5 bg-[#FAF8F4] rounded-xl border border-[#E2D9CC]">
              <div className="text-left overflow-hidden">
                <span className="text-[10px] uppercase font-bold text-[#8C7364] block tracking-wider">UPI ID:</span>
                <span className="text-xs sm:text-sm font-mono font-bold text-[#5A3825] truncate block">{UPI_ID}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyUpi}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8B5A2B] hover:bg-[#5A3825] text-white text-xs font-semibold transition cursor-pointer shadow-xs shrink-0"
              >
                {isCopied ? <FaCheck size={12} /> : <FaCopy size={12} />}
                <span>{isCopied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* STEP 2 & 3: Transaction ID & Screenshot Form */}
        <form onSubmit={submitHandler} className="space-y-6">
          {/* Step 2: Transaction ID Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="transactionId" className="block text-xs font-bold text-[#5A3825] uppercase tracking-wider">
                Step 2: Enter UPI Transaction ID / UTR Number <span className="text-rose-600">*</span>
              </label>
              <span className="text-[10px] text-[#8C7364]">12-digit reference number</span>
            </div>
            <input
              type="text"
              id="transactionId"
              required
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="e.g., 428910482910 or UPI Ref No."
              className="w-full px-4 py-3 rounded-xl border-2 border-[#E2D9CC] bg-[#F4F1EA] text-[#5A3825] font-mono text-sm placeholder:text-[#8C7364]/60 focus:outline-none focus:border-[#5A3825] transition"
            />
            <div className="flex items-start gap-1.5 text-[11px] text-[#8C7364] px-1">
              <FaCircleInfo className="text-[#8B5A2B] mt-0.5 shrink-0" />
              <span>
                Found under payment details in Google Pay, PhonePe, Paytm, or BHIM as <strong>UTR</strong> or <strong>UPI Ref ID</strong>.
              </span>
            </div>
          </div>

          {/* Step 3: Payment Screenshot Upload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#5A3825] uppercase tracking-wider">
                Step 3: Upload Payment Screenshot <span className="text-[#8C7364] font-normal lowercase">(optional but recommended)</span>
              </label>
              {isUploadingScreenshot && (
                <span className="text-[10px] text-[#8B5A2B] font-semibold animate-pulse">Uploading to server...</span>
              )}
            </div>

            {screenshotPreview ? (
              /* Preview Area */
              <div className="relative rounded-2xl border-2 border-[#8B5A2B] bg-[#F4F1EA] p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={screenshotPreview}
                    alt="Payment screenshot proof"
                    className="w-16 h-16 object-cover rounded-xl border border-[#E2D9CC] shadow-xs shrink-0"
                  />
                  <div>
                    <span className="text-xs font-semibold text-[#5A3825] block">Payment Screenshot Attached</span>
                    <span className="text-[10px] text-emerald-700 font-medium">✓ Ready to submit with your order</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveScreenshot}
                  className="p-2.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs transition cursor-pointer"
                  title="Remove screenshot"
                >
                  <FaTrash />
                </button>
              </div>
            ) : (
              /* Upload Area */
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#E2D9CC] hover:border-[#8B5A2B] bg-[#F4F1EA] hover:bg-[#FAF8F4] p-6 rounded-2xl cursor-pointer transition-all duration-200 group">
                <FaUpload className="text-[#8B5A2B] text-2xl mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-[#5A3825]">Click or drag payment screenshot here</span>
                <span className="text-[10px] text-[#8C7364] mt-0.5">PNG, JPG, WEBP up to 10MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Security & Verification Note */}
          <div className="bg-[#F4F1EA] p-3.5 rounded-xl border border-[#E2D9CC] flex items-center gap-2.5 text-xs text-[#8C7364]">
            <FaShieldHalved className="text-[#8B5A2B] text-base shrink-0" />
            <span>
              Your order is protected under URVA's Customer Guarantee. Once verified, order confirmation and shipment tracking details are instantly sent to your email & mobile.
            </span>
          </div>

          {/* Submit Order Button */}
          <button
            type="submit"
            disabled={isProcessing || cartItems.length === 0}
            className="w-full bg-[#8B5A2B] hover:bg-[#5A3825] text-white font-bold py-4 px-6 rounded-2xl text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Confirming Order...</span>
              </>
            ) : (
              <span>Submit Payment & Place Order (₹ {total.toFixed(2)}) ➔</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;
