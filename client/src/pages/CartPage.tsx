import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import BackButton from '../components/common/BackBtn';
import { useApplyCouponMutation } from '../redux/api/coupon.api';
import { calculatePrice, decrementCartItem, discountApplied, incrementCartItem, removeCartItem, resetCart } from '../redux/reducers/cart.reducer';
import { RootState } from '../redux/store';
import { notify } from '../utils/util';
import { usePageSEO } from '../hooks/usePageSEO';

const Cart: React.FC = () => {
  usePageSEO({
    title: 'My Rural Basket | URVA',
    description: 'Review the products in your URVA basket before checkout.',
    canonical: '/cart',
    noIndex: true,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, subTotal, total, discount } = useSelector((state: RootState) => state.cart);

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');

  const [applyCoupon, { isLoading: isApplyingCoupon }] = useApplyCouponMutation();

  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems, dispatch, discount]);

  const handleIncrement = (productId: string) => {
    dispatch(incrementCartItem(productId));
  };

  const handleDecrement = (productId: string) => {
    dispatch(decrementCartItem(productId));
  };

  const handleRemove = (productId: string) => {
    dispatch(removeCartItem(productId));
  };

  const handleClearCart = () => {
    dispatch(resetCart());
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const response = await applyCoupon({ code: couponCode }).unwrap();
      dispatch(discountApplied(response.coupon.amount));
      setAppliedCoupon(couponCode);
      setCouponCode('');
      notify('Coupon applied successfully!', 'success');
    } catch (error) {
      notify('Invalid coupon code', 'error');
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(discountApplied(0));
    setAppliedCoupon('');
    notify('Coupon removed', 'info');
  };

  const getPhotoUrl = (photoUrl?: string) => {
    if (!photoUrl) return 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791904965/urvaa/logo.png';
    return photoUrl;
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] py-6 sm:py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <BackButton fallback="/products" />

        <div className="bg-[#FAF8F4] rounded-2xl p-5 sm:p-8 shadow-sm border border-[#E2D9CC]">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#5A3825] mb-6">My Rural Basket</h1>

          {cartItems.length === 0 ? (
            <div className="py-12 text-center space-y-4">
              <p className="text-5xl">🧺</p>
              <h2 className="text-xl font-serif font-bold text-[#5A3825]">Your basket is currently empty</h2>
              <p className="text-xs sm:text-sm text-[#8C7364] max-w-sm mx-auto font-normal">
                Your basket is waiting for something worth discovering.
              </p>
              <Link
                to="/products"
                className="inline-block bg-[#8B5A2B] hover:bg-[#5A3825] text-white font-semibold px-6 py-3 rounded-lg text-xs uppercase tracking-wider transition-colors shadow-sm mt-2"
              >
                Browse All Products ➔
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Left Column - Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                
                {/* Mobile Cards (Visible below md) */}
                <div className="md:hidden space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.productId} className="bg-[#F4F1EA]/70 p-4 rounded-xl border border-[#E2D9CC] flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/product/${item.productId.split('_')[0]}`}
                          className="flex-shrink-0"
                        >
                          <img
                            src={getPhotoUrl(item.photo)}
                            alt={item.name}
                            className="h-16 w-16 object-contain rounded-lg bg-white p-1 border border-[#E2D9CC]"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791904965/urvaa/logo.png';
                            }}
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link to={`/product/${item.productId.split('_')[0]}`}>
                            <h3 className="font-semibold text-sm text-[#5A3825] truncate">{item.name}</h3>
                          </Link>
                          <p className="text-xs text-[#8C7364]">₹ {item.price.toFixed(2)} per unit</p>
                          <p className="text-xs font-semibold text-[#5A3825] mt-0.5">Subtotal: ₹ {(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <button
                          onClick={() => handleRemove(item.productId)}
                          className="text-[#8C7364] hover:text-red-600 p-1 text-xs font-bold"
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#E2D9CC]">
                        <span className="text-xs text-[#8C7364] font-medium">Quantity:</span>
                        <div className="flex items-center gap-2 bg-[#FAF8F4] border border-[#E2D9CC] rounded-lg px-2.5 py-1">
                          <button
                            onClick={() => handleDecrement(item.productId)}
                            className="w-6 h-6 rounded-md bg-[#F4F1EA] text-[#5A3825] font-bold text-xs flex items-center justify-center hover:bg-[#EAE5D9]"
                          >
                            −
                          </button>
                          <span className="text-xs font-semibold text-[#5A3825] w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleIncrement(item.productId)}
                            className="w-6 h-6 rounded-md bg-[#F4F1EA] text-[#5A3825] font-bold text-xs flex items-center justify-center hover:bg-[#EAE5D9]"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table (Hidden below md) */}
                <div className="hidden md:block overflow-x-auto rounded-xl border border-[#E2D9CC]">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#EAE5D9]">
                      <tr className="border-b border-[#E2D9CC] text-xs font-semibold text-[#5A3825] uppercase tracking-wider">
                        <th className="p-4">Product</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Quantity</th>
                        <th className="p-4">Subtotal</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2D9CC] text-sm">
                      {cartItems.map((item) => (
                        <tr className="hover:bg-[#FAF8F4]/80 transition-colors" key={item.productId}>
                          <td className="p-4">
                            <Link
                              to={`/product/${item.productId.split('_')[0]}`}
                              className="flex items-center space-x-3 group"
                            >
                              <img
                                src={getPhotoUrl(item.photo)}
                                alt={item.name}
                                className="h-14 w-14 object-contain rounded-lg bg-white p-1 border border-[#E2D9CC]"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791904965/urvaa/logo.png';
                                }}
                              />
                              <span className="font-semibold text-sm text-[#5A3825] group-hover:text-[#8B5A2B]">{item.name}</span>
                            </Link>
                          </td>
                          <td className="p-4 text-sm font-medium text-[#5A3825]">₹ {item.price.toFixed(2)}</td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2 bg-[#FAF8F4] border border-[#E2D9CC] rounded-lg px-2 py-1 w-max">
                              <button
                                onClick={() => handleDecrement(item.productId)}
                                className="w-6 h-6 rounded-md bg-[#F4F1EA] text-[#5A3825] font-bold text-xs flex items-center justify-center border border-[#E2D9CC] hover:bg-[#EAE5D9]"
                              >
                                −
                              </button>
                              <span className="text-xs font-semibold text-[#5A3825] w-6 text-center">{item.quantity}</span>
                              <button
                                onClick={() => handleIncrement(item.productId)}
                                className="w-6 h-6 rounded-md bg-[#F4F1EA] text-[#5A3825] font-bold text-xs flex items-center justify-center border border-[#E2D9CC] hover:bg-[#EAE5D9]"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="p-4 text-sm font-semibold text-[#5A3825]">₹ {(item.price * item.quantity).toFixed(2)}</td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleRemove(item.productId)}
                              className="text-[#8C7364] hover:text-red-600 text-xs font-medium hover:underline transition-colors"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Bottom Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
                  <Link
                    to="/products"
                    className="w-full sm:w-auto text-center border border-[#E2D9CC] bg-[#FAF8F4] text-[#5A3825] font-medium px-5 py-2.5 rounded-lg text-xs hover:bg-[#EAE5D9] transition-colors"
                  >
                    ← Continue Shopping
                  </Link>
                  <button
                    onClick={handleClearCart}
                    className="w-full sm:w-auto text-center text-[#8C7364] hover:text-red-600 font-medium text-xs py-2 px-4 underline"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>

              {/* Right Column - Cart Summary */}
              <div className="bg-[#FAF8F4] p-5 sm:p-6 rounded-xl border border-[#E2D9CC] shadow-sm space-y-4">
                <h2 className="font-serif font-bold text-base text-[#5A3825] pb-3 border-b border-[#E2D9CC]">Order Summary</h2>

                <div className="space-y-2.5 text-xs sm:text-sm">
                  <div className="flex justify-between text-[#8C7364]">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#5A3825]">₹ {subTotal.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-[#8B5A2B] font-semibold">
                      <span>Discount Coupon</span>
                      <span>-₹ {discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#8C7364]">
                    <span>Shipping Charges</span>
                    <span className="text-[#5A3825] font-medium">Calculated at Checkout</span>
                  </div>

                  <div className="pt-3 border-t border-[#E2D9CC] flex justify-between items-baseline font-bold text-base text-[#5A3825]">
                    <span>Total Amount</span>
                    <span className="text-xl sm:text-2xl font-extrabold text-[#5A3825]">₹ {(total - discount).toFixed(2)}</span>
                  </div>
                </div>

                {/* Coupon Code Input */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-[#5A3825] uppercase tracking-wider mb-1">Have a Coupon?</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      className="flex-grow px-3 py-2 rounded-lg border border-[#E2D9CC] bg-[#F4F1EA] text-xs uppercase font-mono text-[#5A3825] placeholder:text-[#8C7364] focus:outline-none focus:border-[#8B5A2B]"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={!!appliedCoupon}
                    />
                    {appliedCoupon ? (
                      <button
                        onClick={handleRemoveCoupon}
                        className="bg-red-500 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={handleApplyCoupon}
                        disabled={isApplyingCoupon}
                        className="bg-[#8B5A2B] hover:bg-[#5A3825] text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                </div>

                {/* Proceed Button */}
                <button
                  onClick={() => navigate('/shipping')}
                  className="w-full bg-[#8B5A2B] hover:bg-[#5A3825] text-white font-semibold py-3.5 px-4 rounded-lg text-xs uppercase tracking-widest transition-colors shadow-sm text-center block mt-4"
                >
                  Proceed to Checkout ➔
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
