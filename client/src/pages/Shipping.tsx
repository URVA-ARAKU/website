import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { calculatePrice, saveShippingInfo, updateShippingFee } from '../redux/reducers/cart.reducer';
import { RootState } from '../redux/store';
import { notify } from '../utils/util';
import BackButton from '../components/common/BackBtn';
import { usePageSEO } from '../hooks/usePageSEO';
import { useGetStoreSettingsQuery } from '../redux/api/settings.api';

const INDIAN_STATES = [
    "Andhra Pradesh",
    "Telangana"
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
    const { shippingInfo, cartItems, subTotal, total, shippingCharges } = useSelector((state: RootState) => state.cart);
    const { data: settingsData } = useGetStoreSettingsQuery();

    useEffect(() => {
        if (settingsData?.settings?.standardShippingFee !== undefined) {
            dispatch(updateShippingFee(settingsData.settings.standardShippingFee));
        }
    }, [settingsData, dispatch]);

    // Ensure price is calculated and redirect if cart is empty
    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/cart');
        } else {
            dispatch(calculatePrice());
        }
    }, [cartItems.length, navigate, dispatch]);

    const activeShippingFee = settingsData?.settings?.standardShippingFee !== undefined
        ? Number(settingsData.settings.standardShippingFee)
        : (shippingCharges || 80);

    const [name, setName] = useState(shippingInfo.name || user?.name || '');
    const [email, setEmail] = useState(shippingInfo.email || user?.email || '');
    const [address, setAddress] = useState(shippingInfo.address || '');
    const [landmark, setLandmark] = useState(shippingInfo.landmark || '');
    const [city, setCity] = useState(shippingInfo.city || '');
    const [state, setState] = useState(
        shippingInfo.state && ["Andhra Pradesh", "Telangana"].includes(shippingInfo.state)
            ? shippingInfo.state
            : 'Telangana'
    );
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

    const inputClass = "w-full px-4 py-2.5 border border-[#E2D9CC] rounded-lg bg-[#F4F1EA] text-[#5A3825] text-xs focus:border-[#8B5A2B] focus:ring-1 focus:ring-[#8B5A2B] outline-none transition-all placeholder:text-[#8C7364]";
    const labelClass = "block text-xs font-semibold text-[#5A3825] uppercase tracking-wider mb-1.5";

    return (
        <div className="min-h-screen bg-[#F4F1EA] py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <BackButton />

                {/* Page Header */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#5A3825]">
                        Delivery Address
                    </h2>
                    <p className="text-xs text-[#8C7364] mt-1 font-normal">
                        Enter your shipping details for order delivery
                    </p>
                </div>

                {/* Selected Items Quick Preview */}
                {cartItems.length > 0 && (
                    <div className="bg-[#FAF8F4] rounded-2xl border border-[#E2D9CC] p-4 mb-4 shadow-sm">
                        <div className="flex items-center justify-between text-xs border-b border-[#E2D9CC] pb-2 mb-2.5">
                            <span className="font-bold text-[#8B5A2B] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                                <span>🛍️</span> Selected Products ({cartItems.reduce((acc, it) => acc + (it.quantity || 1), 0)} items)
                            </span>
                            <span className="font-bold text-[#5A3825]">
                                Total: ₹{(total > 0 ? total : subTotal > 0 ? subTotal + activeShippingFee : cartItems.reduce((acc, it) => acc + (Number(it.price) || 0) * (Number(it.quantity) || 1), 0) + activeShippingFee).toFixed(2)}
                            </span>
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-1">
                            {cartItems.map((item, idx) => (
                                <div key={item.productId || idx} className="flex items-center gap-2.5 bg-[#F4F1EA] px-3 py-2 rounded-xl border border-[#E2D9CC] flex-shrink-0">
                                    <img
                                        src={item.photo || 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791904965/urvaa/logo.png'}
                                        alt={item.name}
                                        className="w-10 h-10 rounded-lg object-cover border border-[#E2D9CC] bg-white flex-shrink-0"
                                    />
                                    <div className="text-[11px] leading-tight max-w-[160px]">
                                        <p className="font-semibold text-[#5A3825] truncate">{item.name}</p>
                                        <p className="text-[#8C7364] mt-0.5">Qty: {item.quantity} · ₹{(Number(item.price) || 0).toFixed(0)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Main Form Box */}
                <div className="bg-[#FAF8F4] rounded-2xl border border-[#E2D9CC] p-6 shadow-sm">

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

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-[#8B5A2B] hover:bg-[#5A3825] text-white font-semibold py-3.5 px-4 rounded-lg uppercase tracking-wider transition-colors shadow-sm text-xs mt-4 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <span>Proceed to Pay with UPI &gt;</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Shipping;
