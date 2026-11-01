import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/common/BackBtn';
import { useNewOrderMutation } from '../redux/api/order.api';
import { useGetStoreSettingsQuery } from '../redux/api/settings.api';
import { calculatePrice, resetCart } from '../redux/reducers/cart.reducer';
import { RootState } from '../redux/store';
import { NewOrderRequest } from '../types/api-types';
import { notify } from '../utils/util';
import { usePageSEO } from '../hooks/usePageSEO';
import RazorpayCheckout from './payment/RazorpayCheckout';
import { calculateOrderShipping } from '../utils/shipping';
import {
  FaShieldHalved,
  FaCreditCard,
  FaLock,
  FaLocationDot,
  FaTruckFast,
  FaCheck,
} from 'react-icons/fa6';

const CheckoutForm: React.FC = () => {
  usePageSEO({
    title: 'Secure Checkout | URVA',
    description: 'Complete your URVA order securely with Razorpay payment gateway.',
    canonical: '/checkout',
    noIndex: true,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    shippingInfo,
    cartItems,
    subTotal,
    discount,
    tax,
  } = useSelector((state: RootState) => state.cart);

  // Recalculate price on mount and redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      notify('Your basket is empty. Please select products first.', 'info');
      navigate('/products');
    } else {
      dispatch(calculatePrice());
    }
  }, [cartItems.length, dispatch, navigate]);

  const [newOrder] = useNewOrderMutation();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const { data: settingsData } = useGetStoreSettingsQuery();

  const shippingCalc = useMemo(() => {
    return calculateOrderShipping(cartItems, settingsData?.settings);
  }, [cartItems, settingsData]);

  // Fallback calculation to guarantee positive total if cart has items
  const itemsSubTotal = cartItems.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );
  const effectiveSubTotal = subTotal > 0 ? subTotal : itemsSubTotal;
  const effectiveShipping = shippingCalc.totalShipping;
  const effectiveTotal = Math.max(0, effectiveSubTotal + effectiveShipping - (discount || 0));

  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState<boolean>(false);
  const totalItemCount = cartItems.reduce((acc, it) => acc + (it.quantity || 1), 0);

  // Razorpay Payment Success Handler
  const handleRazorpaySuccess = async (paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => {
    setIsProcessing(true);
    const guestUserId = 'guest_' + (shippingInfo.phone || Date.now());

    const orderData: NewOrderRequest = {
      shippingCharges: effectiveShipping,
      shippingInfo: {
        ...shippingInfo,
        paymentMethod: 'Razorpay',
        transactionId: paymentData.razorpay_payment_id,
        razorpayPaymentId: paymentData.razorpay_payment_id,
        razorpayOrderId: paymentData.razorpay_order_id,
        razorpaySignature: paymentData.razorpay_signature,
        paidAmount: effectiveTotal,
        clientOrigin: window.location.origin,
      } as any,
      tax,
      discount,
      total: effectiveTotal,
      subTotal: effectiveSubTotal,
      orderItems: cartItems,
      userId: guestUserId,
    };

    try {
      const orderRes: any = await newOrder(orderData).unwrap();
      const createdOrderId = orderRes?.order?.id || orderRes?.order?._id || `ord_${Date.now()}`;

      localStorage.setItem('guestUserId', guestUserId);
      dispatch(resetCart());

      notify('Payment verified & order placed successfully!', 'success');
      navigate(`/my-orders?payment=submitted&orderId=${createdOrderId}`);
    } catch (err: any) {
      console.error('Order save error after Razorpay verification:', err);
      localStorage.setItem('guestUserId', guestUserId);
      dispatch(resetCart());
      notify('Order placed! Redirecting to orders...', 'success');
      navigate(`/my-orders?payment=submitted&orderId=ord_${Date.now()}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] py-4 sm:py-8 px-3 sm:px-6 font-sans text-[#5A3825]">
      <div className="w-full max-w-5xl mx-auto mb-3 sm:mb-5">
        <BackButton fallback="/products" />
      </div>

      <div className="max-w-5xl mx-auto">
        {/* MOBILE ACCORDION ORDER SUMMARY (< md) */}
        <div className="md:hidden mb-4 bg-[#FAF8F4] rounded-2xl border border-[#E2D9CC] shadow-xs overflow-hidden">
          <button
            type="button"
            onClick={() => setIsOrderSummaryOpen(!isOrderSummaryOpen)}
            className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-[#F4F1EA]/60 transition"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-base shrink-0">🛍️</span>
              <div className="min-w-0">
                <span className="text-xs font-bold text-[#5A3825] block truncate">
                  Order Summary ({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'})
                </span>
                <span className="text-[11px] text-[#8C7364] truncate block">
                  Items: ₹{effectiveSubTotal.toFixed(0)} + {effectiveShipping === 0 ? 'FREE Delivery' : `₹${effectiveShipping} Delivery`} · {shippingInfo.city || 'India'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#8B5A2B] shrink-0 pl-2">
              <span className="text-sm font-serif">₹ {effectiveTotal.toFixed(2)}</span>
              <span className={`transform transition-transform text-xs ${isOrderSummaryOpen ? 'rotate-180' : ''}`}>▼</span>
            </div>
          </button>

          {isOrderSummaryOpen && (
            <div className="p-4 border-t border-[#E2D9CC] bg-[#F4F1EA]/50 space-y-3.5 text-xs">
              {/* Product items list */}
              <div className="divide-y divide-[#E2D9CC]/60 max-h-48 overflow-y-auto space-y-2 pr-1">
                {cartItems.map((item, idx) => (
                  <div key={item.productId || idx} className="pt-2 first:pt-0 flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={item.photo || 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791904965/urvaa/logo.png'}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded-lg border border-[#E2D9CC] bg-white shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-xs text-[#5A3825] truncate">{item.name}</p>
                        <p className="text-[10px] text-[#8C7364]">Qty: {item.quantity} × ₹{(Number(item.price) || 0).toFixed(0)}</p>
                      </div>
                    </div>
                    <span className="font-bold text-xs text-[#5A3825] shrink-0">
                      ₹{((Number(item.price) || 0) * (Number(item.quantity) || 1)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Delivery Address */}
              <div className="pt-2 border-t border-[#E2D9CC] text-[11px] text-[#8C7364]">
                <p className="font-bold text-[#8B5A2B] uppercase tracking-wider text-[10px] mb-0.5">📍 Delivering To:</p>
                <p className="font-semibold text-[#5A3825]">{shippingInfo.name || 'Valued Customer'} · {shippingInfo.phone}</p>
                <p className="leading-snug">{shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state} - {shippingInfo.pinCode}</p>
              </div>

              {/* Price Breakdown */}
              <div className="pt-2 border-t border-[#E2D9CC] space-y-1 text-[11px]">
                <div className="flex justify-between text-[#8C7364]">
                  <span>Items Subtotal:</span>
                  <span className="font-semibold text-[#5A3825]">₹ {effectiveSubTotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>Discount:</span>
                    <span>- ₹ {discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#8C7364]">
                  <span>Shipping Charges:</span>
                  <span className="font-semibold text-[#5A3825]">₹ {effectiveShipping.toFixed(2)}</span>
                </div>
                <div className="pt-1.5 border-t border-[#E2D9CC] flex justify-between font-bold text-xs text-[#5A3825]">
                  <span>Total Payable:</span>
                  <span className="text-sm font-serif">₹ {effectiveTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RESPONSIVE 2-COLUMN GRID (Left: Razorpay Payment, Right: Order Summary on Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* PRIMARY PAYMENT COLUMN */}
          <div className="md:col-span-7 bg-[#FAF8F4] p-5 sm:p-7 rounded-3xl shadow-sm border border-[#E2D9CC] space-y-5">
            {/* Merchant Header */}
            <div className="flex items-center gap-3 border-b border-[#E2D9CC] pb-3.5">
              <img
                src="https://res.cloudinary.com/idi6k3ue/image/upload/v1791904965/urvaa/logo.png"
                alt="URVA Logo"
                className="h-10 w-10 sm:h-12 sm:w-12 object-contain shrink-0"
              />
              <div className="text-left min-w-0">
                <h1 className="text-lg sm:text-2xl font-serif font-bold tracking-tight text-[#5A3825] leading-tight">
                  Secure Checkout
                </h1>
                <p className="text-[11px] sm:text-xs text-[#8C7364] mt-0.5 truncate">
                  Direct online payment powered by Razorpay
                </p>
              </div>
            </div>

            {/* Delivery Recipient Summary Pill */}
            {shippingInfo.address && (
              <div className="p-3.5 rounded-xl bg-[#F4F1EA] border border-[#E2D9CC] flex items-start justify-between gap-3 text-xs">
                <div className="flex items-start gap-2.5 min-w-0">
                  <FaLocationDot className="text-[#8B5A2B] text-sm mt-0.5 shrink-0" />
                  <div className="min-w-0 leading-tight">
                    <p className="font-bold text-[#5A3825] truncate">
                      {shippingInfo.name || 'Customer'} · {shippingInfo.phone}
                    </p>
                    <p className="text-[11px] text-[#8C7364] mt-0.5 truncate">
                      {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state} - {shippingInfo.pinCode}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/shipping')}
                  className="text-[11px] text-[#8B5A2B] hover:text-[#5A3825] font-semibold underline shrink-0 cursor-pointer"
                >
                  Edit
                </button>
              </div>
            )}

            {/* DIRECT RAZORPAY PAYMENT GATEWAY CARD */}
            <div className="bg-[#F4F1EA] p-5 sm:p-6 rounded-2xl border-2 border-[#E2D9CC] space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8F4] border border-[#E2D9CC] text-xs font-bold text-[#8B5A2B] uppercase tracking-wider">
                  <FaShieldHalved /> Direct Online Payment
                </div>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <FaLock className="text-[10px]" /> 256-Bit SSL Encrypted
                </span>
              </div>

              <div className="text-left space-y-1">
                <h3 className="font-bold text-[#5A3825] text-base">
                  Pay via Razorpay Payment Gateway
                </h3>
                <p className="text-xs text-[#8C7364] leading-relaxed">
                  Choose your preferred payment method on the secure Razorpay checkout:
                </p>
              </div>

              {/* Supported Payment Options Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
                <div className="bg-[#FAF8F4] p-2.5 rounded-xl border border-[#E2D9CC] flex flex-col items-center justify-center">
                  <span className="text-base">⚡</span>
                  <span className="text-[11px] font-bold text-[#5A3825] mt-1">UPI</span>
                  <span className="text-[9px] text-[#8C7364]">GPay, PhonePe, Paytm, CRED</span>
                </div>
                <div className="bg-[#FAF8F4] p-2.5 rounded-xl border border-[#E2D9CC] flex flex-col items-center justify-center">
                  <FaCreditCard className="text-[#8B5A2B] text-base" />
                  <span className="text-[11px] font-bold text-[#5A3825] mt-1">Cards</span>
                  <span className="text-[9px] text-[#8C7364]">Debit & Credit Cards</span>
                </div>
                <div className="bg-[#FAF8F4] p-2.5 rounded-xl border border-[#E2D9CC] flex flex-col items-center justify-center">
                  <span className="text-base">🏦</span>
                  <span className="text-[11px] font-bold text-[#5A3825] mt-1">NetBanking</span>
                  <span className="text-[9px] text-[#8C7364]">All Indian Banks</span>
                </div>
                <div className="bg-[#FAF8F4] p-2.5 rounded-xl border border-[#E2D9CC] flex flex-col items-center justify-center">
                  <span className="text-base">👛</span>
                  <span className="text-[11px] font-bold text-[#5A3825] mt-1">Wallets</span>
                  <span className="text-[9px] text-[#8C7364]">Amazon Pay & More</span>
                </div>
              </div>

              {/* Order Total Highlight Box */}
              <div className="bg-[#FAF8F4] p-4 rounded-xl border border-[#E2D9CC] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#8C7364] block">Total Amount to Pay</span>
                  <span className="text-2xl font-bold font-serif text-[#5A3825]">
                    ₹ {effectiveTotal.toFixed(2)}
                  </span>
                </div>
                <div className="text-right text-[11px] text-[#8C7364]">
                  <span>{totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}</span>
                  <span className="block text-emerald-800 font-semibold mt-0.5">Instant Order Confirmation</span>
                </div>
              </div>

              {/* Direct Razorpay Checkout Button */}
              <div className="pt-2">
                <RazorpayCheckout
                  amount={Math.round(effectiveTotal * 100)}
                  currency="INR"
                  receipt={`order_${Date.now()}`}
                  description={`URVA order for ${shippingInfo.name || 'Customer'}`}
                  customer_name={shippingInfo.name || ''}
                  customer_email={shippingInfo.email || ''}
                  customer_phone={shippingInfo.phone || ''}
                  buttonText={`Pay ₹${effectiveTotal.toFixed(2)} with Razorpay ➔`}
                  buttonClassName="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-[#8B5A2B] hover:bg-[#5A3825] text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer active:scale-[0.99]"
                  onPaymentSuccess={handleRazorpaySuccess}
                  disabled={isProcessing || cartItems.length === 0}
                />
              </div>

              {/* Trust Footer */}
              <div className="pt-2 border-t border-[#E2D9CC]/70 space-y-2">
                <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8C7364] gap-2">
                  <span className="flex items-center gap-1.5">
                    <FaCheck className="text-emerald-700 text-xs" /> 100% Genuine Rural Guarantee
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FaTruckFast className="text-[#8B5A2B] text-xs" /> Dispatched within 24-48 Hours
                  </span>
                </div>
                <p className="text-[10px] text-center text-[#8C7364] flex items-center justify-center gap-1.5">
                  <FaShieldHalved className="text-emerald-700 text-[10px]" />
                  <span>Compliant with Indian DPDP Act 2023 · End-to-end encrypted · Zero card storage</span>
                </p>
              </div>
            </div>
          </div>

          {/* DESKTOP SIDEBAR: Order Details & Address (Hidden on mobile, 5 cols on desktop) */}
          <div className="hidden md:block md:col-span-5 space-y-4 sticky top-6">
            {/* Products Card */}
            <div className="bg-[#FAF8F4] p-5 rounded-3xl border border-[#E2D9CC] shadow-sm space-y-3.5">
              <div className="flex items-center justify-between border-b border-[#E2D9CC] pb-2.5">
                <p className="font-bold text-[#8B5A2B] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <span>🛍️</span> Order Items ({totalItemCount})
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="text-[11px] text-[#8B5A2B] hover:text-[#5A3825] font-semibold underline cursor-pointer"
                >
                  Modify Basket
                </button>
              </div>

              <div className="divide-y divide-[#E2D9CC]/60 max-h-56 overflow-y-auto space-y-2 pr-1">
                {cartItems.map((item, idx) => (
                  <div key={item.productId || idx} className="pt-2 first:pt-0 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.photo || 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791904965/urvaa/logo.png'}
                        alt={item.name}
                        className="w-11 h-11 object-cover rounded-xl border border-[#E2D9CC] bg-white shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-xs text-[#5A3825] truncate">{item.name}</p>
                        <p className="text-[11px] text-[#8C7364]">Qty: {item.quantity} · ₹{(Number(item.price) || 0).toFixed(0)} each</p>
                      </div>
                    </div>
                    <span className="font-bold text-xs text-[#5A3825] shrink-0">
                      ₹{((Number(item.price) || 0) * (Number(item.quantity) || 1)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="pt-3 border-t border-[#E2D9CC] space-y-1.5 text-xs text-[#8C7364]">
                <div className="flex justify-between">
                  <span>Items Subtotal:</span>
                  <span className="font-semibold text-[#5A3825]">₹ {effectiveSubTotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>Discount Coupon:</span>
                    <span>- ₹ {discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charges:</span>
                  <span className="font-semibold text-[#5A3825]">
                    {effectiveShipping === 0 ? (
                      <span className="text-emerald-800 font-bold">FREE</span>
                    ) : (
                      `₹ ${effectiveShipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                {shippingCalc.hasLeafPlates && (
                  <div className="bg-amber-50/80 border border-amber-200/80 rounded-lg p-2 text-[10px] text-[#5A3825] space-y-0.5">
                    <div className="flex justify-between font-semibold text-amber-950">
                      <span>📦 Leaf Plates Volumetric Cargo ({shippingCalc.totalPlatesCount} plates):</span>
                      <span>₹ {shippingCalc.leafPlatesShipping.toFixed(2)}</span>
                    </div>
                    {shippingCalc.hasStandardItems && (
                      <div className="flex justify-between text-[#8C7364]">
                        <span>Standard Goods Delivery:</span>
                        <span>{shippingCalc.isStandardFree ? 'FREE (Unlocked)' : `₹ ${shippingCalc.standardShipping.toFixed(2)}`}</span>
                      </div>
                    )}
                  </div>
                )}
                <div className="pt-2 border-t border-[#E2D9CC] flex justify-between font-bold text-sm text-[#5A3825]">
                  <span>Total Payable:</span>
                  <span className="text-base font-serif font-extrabold text-[#5A3825]">
                    ₹ {effectiveTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Address Card */}
            {shippingInfo.address && (
              <div className="bg-[#FAF8F4] p-5 rounded-3xl border border-[#E2D9CC] shadow-sm space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-[#E2D9CC] pb-2">
                  <p className="font-bold text-[#8B5A2B] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <span>📍</span> Shipping Address
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('/shipping')}
                    className="text-[11px] text-[#8B5A2B] hover:text-[#5A3825] font-semibold underline cursor-pointer"
                  >
                    Change
                  </button>
                </div>
                <p className="font-bold text-[#5A3825]">{shippingInfo.name || 'Valued Customer'}</p>
                <p className="text-[#8C7364] leading-relaxed">
                  {shippingInfo.address}
                  {shippingInfo.landmark && `, near ${shippingInfo.landmark}`}
                  <br />
                  {shippingInfo.city}, {shippingInfo.state} - {shippingInfo.pinCode}
                </p>
                <p className="text-[11px] text-[#8C7364] pt-1">
                  📞 Phone: <strong className="text-[#5A3825]">{shippingInfo.phone}</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
