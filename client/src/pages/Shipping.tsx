import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingInfo } from '../redux/reducers/cart.reducer';
import { RootState } from '../redux/store';
import { notify } from '../utils/util';
import BackButton from '../components/common/BackBtn';
import { FaTruck, FaShieldAlt } from 'react-icons/fa';
import { usePageSEO } from '../hooks/usePageSEO';

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const Shipping: React.FC = () => {
    usePageSEO({
        title: 'Shipping Address | URVA',
        description: 'Enter your delivery address for your URVA order.',
        canonical: '/shipping',
        noIndex: true,
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state: RootState) => state.user);
    const { shippingInfo, cartItems } = useSelector((state: RootState) => state.cart);

    // Redirect if cart is empty
    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/cart');
        }
    }, [cartItems.length, navigate]);

    const [name, setName] = useState(shippingInfo.name || user?.name || '');
    const [email, setEmail] = useState(shippingInfo.email || user?.email || '');
    const [address, setAddress] = useState(shippingInfo.address || '');
    const [landmark, setLandmark] = useState(shippingInfo.landmark || '');
    const [city, setCity] = useState(shippingInfo.city || '');
    const [state, setState] = useState(shippingInfo.state || 'Telangana');
    const [pinCode, setPinCode] = useState(shippingInfo.pinCode || '');
    const [phone, setPhone] = useState(shippingInfo.phone || '');

    const latitude = shippingInfo.latitude;
    const longitude = shippingInfo.longitude;

    const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmedName = name.trim();

        if (!trimmedName || !email || !phone || !address || !city || !state || !pinCode) {
            notify('Please fill all required fields', 'error');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            notify('Please enter a valid email address', 'error');
            return;
        }
        if (!/^\d{10}$/.test(phone)) {
            notify('Please enter a valid 10-digit mobile number', 'error');
            return;
        }
        if (!/^\d{6}$/.test(pinCode.trim())) {
            notify('Please enter a valid 6-digit Pincode', 'error');
            return;
        }

        dispatch(saveShippingInfo({
            name: trimmedName,
            email,
            address,
            landmark,
            city,
            state,
            country: 'India',
            pinCode: pinCode.trim(),
            phone,
            latitude,
            longitude,
            deliveryType: 'nearest_landmark',
        }));

        navigate('/checkout');
    };

    const inputClass = "w-full px-4 py-2.5 border border-neutral-200 rounded-lg bg-white text-xs focus:border-black focus:ring-1 focus:ring-black outline-none transition-all placeholder:text-neutral-400";
    const labelClass = "block text-xs font-semibold text-[#111111] uppercase tracking-wider mb-1.5";

    return (
        <div className="min-h-screen bg-[#FAFAFA] py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <BackButton />

                {/* Page Header */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl sm:text-3xl font-sans font-semibold tracking-tight text-[#111111]">
                        Delivery Address
                    </h2>
                    <p className="text-xs text-neutral-500 mt-1">
                        Enter your shipping details for order delivery
                    </p>
                </div>

                {/* Main Form Box */}
                <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs">

                    {/* Standard E-Commerce Address Form */}
                    <form onSubmit={submitHandler} className="space-y-4">
                        {/* Name & Email Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Full Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={inputClass}
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Email Address <span className="text-red-500">*</span></label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={inputClass}
                                    placeholder="Order confirmation email"
                                    required
                                />
                            </div>
                        </div>

                        {/* Phone / WhatsApp Number */}
                        <div>
                            <label className={labelClass}>Phone / WhatsApp Number <span className="text-red-500">*</span></label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className={inputClass}
                                placeholder="10-digit mobile number"
                                required
                            />
                        </div>

                        {/* Flat / House No. & Street Address */}
                        <div>
                            <label className={labelClass}>
                                Flat, House No., Building & Street <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className={inputClass}
                                placeholder="House/Flat No., Building Name, Street"
                                required
                            />
                        </div>

                        {/* Landmark Field */}
                        <div>
                            <label className={labelClass}>Landmark (Optional)</label>
                            <input
                                type="text"
                                value={landmark}
                                onChange={(e) => setLandmark(e.target.value)}
                                className={inputClass}
                                placeholder="e.g. Near HDFC Bank, Opposite Park"
                            />
                        </div>

                        {/* City, State & Pincode Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className={labelClass}>City <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className={inputClass}
                                    placeholder="e.g. Hyderabad"
                                    required
                                />
                            </div>
                            <div>
                                <label className={labelClass}>State <span className="text-red-500">*</span></label>
                                <select
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    className={inputClass}
                                    required
                                >
                                    <option value="">Select State</option>
                                    {INDIAN_STATES.map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Pincode <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={pinCode}
                                    onChange={(e) => setPinCode(e.target.value)}
                                    className={inputClass}
                                    placeholder="6-digit Pincode"
                                    maxLength={6}
                                    required
                                />
                            </div>
                        </div>

                        {/* Security / Delivery Trust Info */}
                        <div className="pt-2 flex items-center justify-between text-xs text-neutral-500 border-t border-neutral-200">
                            <span className="flex items-center gap-1.5 text-neutral-800 font-medium">
                                <FaTruck /> Fast & Secure Pan-India Shipping
                            </span>
                            <span className="flex items-center gap-1 text-emerald-700 font-medium">
                                <FaShieldAlt /> Safe Checkout
                            </span>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-black hover:bg-neutral-800 text-white font-medium py-3.5 px-4 rounded-lg uppercase tracking-wider transition-colors shadow-xs text-xs mt-4 flex items-center justify-center gap-2"
                        >
                            <span>Proceed to Payment ➔</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Shipping;
