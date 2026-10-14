import React, { useState } from 'react';
import { FaSearch, FaShippingFast } from 'react-icons/fa';

const TrackShipment: React.FC = () => {
    const [awbNumber, setAwbNumber] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');

    const handleTrack = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!awbNumber.trim()) {
            alert('Please enter AWB Number');
            return;
        }
        
        if (!mobileNumber.trim() || mobileNumber.length !== 10) {
            alert('Please enter valid 10-digit mobile number');
            return;
        }

        // Redirect to APSRTC tracking page
        const trackingUrl = `https://cargo.apsrtconline.in/track?awb=${awbNumber.trim()}&receiver=${mobileNumber.trim()}`;
        window.open(trackingUrl, '_blank');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f7f4ec] to-white py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#1f5133] text-white mb-4 shadow-lg">
                        <FaShippingFast size={40} />
                    </div>
                    <h1 className="text-4xl font-bold text-[#1f5133] font-serif mb-3">Track Your Shipment</h1>
                    <p className="text-gray-600 text-lg">Enter your AWB number and mobile number to track your order</p>
                </div>

                {/* Tracking Form */}
                <div className="bg-white rounded-2xl shadow-xl border border-[#efe9db] p-8 md:p-10">
                    <form onSubmit={handleTrack} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                                AWB Number *
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your AWB tracking number"
                                value={awbNumber}
                                onChange={(e) => setAwbNumber(e.target.value)}
                                className="w-full border-2 border-[#efe9db] focus:border-[#1f5133] focus:ring-2 focus:ring-[#1f5133]/20 focus:outline-none rounded-xl p-4 text-lg font-mono transition-all"
                            />
                            <p className="text-xs text-gray-500 mt-1">Found in your shipment confirmation email</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                                Mobile Number *
                            </label>
                            <input
                                type="tel"
                                placeholder="Enter 10-digit mobile number"
                                maxLength={10}
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                                className="w-full border-2 border-[#efe9db] focus:border-[#1f5133] focus:ring-2 focus:ring-[#1f5133]/20 focus:outline-none rounded-xl p-4 text-lg font-mono transition-all"
                            />
                            <p className="text-xs text-gray-500 mt-1">Either sender or receiver mobile number</p>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#1f5133] hover:bg-[#163b26] text-white font-bold py-4 px-6 rounded-xl text-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                        >
                            <FaSearch size={18} />
                            Track Shipment
                        </button>
                    </form>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="bg-white rounded-xl border border-[#efe9db] p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-[#1f5133] mb-2">📧 Check Your Email</h3>
                        <p className="text-sm text-gray-600">
                            Your AWB number was sent to you via email when your order was shipped. Look for "Your Order Has Been Shipped" email.
                        </p>
                    </div>

                    <div className="bg-white rounded-xl border border-[#efe9db] p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-[#1f5133] mb-2">📱 Mobile Number</h3>
                        <p className="text-sm text-gray-600">
                            Enter the mobile number you provided during checkout. This is used for shipment verification.
                        </p>
                    </div>
                </div>

                {/* Help Section */}
                <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
                    <h4 className="text-md font-bold text-amber-900 mb-2">Need Help?</h4>
                    <p className="text-sm text-amber-800 mb-3">
                        If you're having trouble tracking your shipment or didn't receive your AWB number, please contact our support team.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <a
                            href="mailto:support@urvaa.in"
                            className="inline-flex items-center justify-center px-4 py-2 bg-white border border-amber-300 text-amber-800 rounded-lg text-sm font-semibold hover:bg-amber-100 transition"
                        >
                            📧 Email Support
                        </a>
                        <a
                            href="/orders"
                            className="inline-flex items-center justify-center px-4 py-2 bg-white border border-amber-300 text-amber-800 rounded-lg text-sm font-semibold hover:bg-amber-100 transition"
                        >
                            📦 View My Orders
                        </a>
                    </div>
                </div>

                {/* Powered By */}
                <div className="text-center mt-8">
                    <p className="text-xs text-gray-400">
                        Tracking powered by APSRTC Logistics
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TrackShipment;

