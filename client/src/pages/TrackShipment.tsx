import React, { useState } from 'react';
import { FaSearch, FaShippingFast } from 'react-icons/fa';
import { usePageSEO } from '../hooks/usePageSEO';
import { webPageSchema, breadcrumbSchema } from '../seo/schemas';

const TrackShipment: React.FC = () => {
    const [awbNumber, setAwbNumber] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');

    usePageSEO({
        title: 'Track Your Shipment & Order Delivery | URVA',
        description: 'Track the real-time shipping status and delivery progress of your authentic rural Indian goods ordered from URVA.',
        canonical: '/track-shipment',
        keywords: 'track order, track shipment, URVA delivery tracking, APSRTC cargo tracking, rural goods delivery status',
        schema: [
            webPageSchema({
                url: '/track-shipment',
                name: 'Track Your Shipment | URVA',
                description: 'Real-time consignment tracking for orders placed on URVA.',
                breadcrumb: [
                    { name: 'Home', url: '/' },
                    { name: 'Track Shipment', url: '/track-shipment' },
                ],
            }),
            breadcrumbSchema([
                { name: 'Home', url: '/' },
                { name: 'Track Shipment', url: '/track-shipment' },
            ]),
        ],
    });

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
        <div className="min-h-screen bg-[#F4F1EA] py-12 px-4 font-sans">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#5A3825] text-[#FAF8F4] mb-4 shadow-lg">
                        <FaShippingFast size={36} />
                    </div>
                    <h1 className="text-4xl font-bold text-[#5A3825] font-serif mb-3">Track Your Shipment</h1>
                    <p className="text-[#5A3825]/75 text-base">Enter your AWB number and mobile number to track your order in real-time</p>
                </div>

                {/* Tracking Form */}
                <div className="bg-[#FAF8F4] rounded-3xl shadow-xl border border-[#E2D9CC] p-8 md:p-10">
                    <form onSubmit={handleTrack} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-[#5A3825] mb-2 uppercase tracking-wider">
                                AWB Number *
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your AWB tracking number"
                                value={awbNumber}
                                onChange={(e) => setAwbNumber(e.target.value)}
                                className="w-full border-2 border-[#E2D9CC] bg-[#F4F1EA] focus:border-[#5A3825] focus:ring-2 focus:ring-[#5A3825]/20 focus:outline-none rounded-xl p-4 text-base font-mono text-[#5A3825] transition-all"
                            />
                            <p className="text-xs text-[#5A3825]/60 mt-1">Found in your shipment confirmation email or SMS</p>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#5A3825] mb-2 uppercase tracking-wider">
                                Mobile Number *
                            </label>
                            <input
                                type="tel"
                                placeholder="Enter 10-digit mobile number"
                                maxLength={10}
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                                className="w-full border-2 border-[#E2D9CC] bg-[#F4F1EA] focus:border-[#5A3825] focus:ring-2 focus:ring-[#5A3825]/20 focus:outline-none rounded-xl p-4 text-base font-mono text-[#5A3825] transition-all"
                            />
                            <p className="text-xs text-[#5A3825]/60 mt-1">Either sender or receiver mobile number</p>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#8B5A2B] hover:bg-[#5A3825] text-[#FAF8F4] font-bold py-4 px-6 rounded-xl text-base transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-3 cursor-pointer"
                        >
                            <FaSearch size={16} />
                            Track Shipment
                        </button>
                    </form>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="bg-[#FAF8F4] rounded-2xl border border-[#E2D9CC] p-6 shadow-sm">
                        <h3 className="text-base font-bold text-[#5A3825] mb-2">📧 Check Your Email</h3>
                        <p className="text-xs text-[#5A3825]/75 leading-relaxed">
                            Your AWB number was sent to you via email when your order was dispatched. Look for "Your Order Has Been Shipped" notification.
                        </p>
                    </div>

                    <div className="bg-[#FAF8F4] rounded-2xl border border-[#E2D9CC] p-6 shadow-sm">
                        <h3 className="text-base font-bold text-[#5A3825] mb-2">📱 Mobile Number</h3>
                        <p className="text-xs text-[#5A3825]/75 leading-relaxed">
                            Enter the mobile number you provided during checkout. This is used for shipment identity verification.
                        </p>
                    </div>
                </div>

                {/* Help Section */}
                <div className="mt-8 bg-[#FAF8F4] border border-[#E2D9CC] rounded-2xl p-6">
                    <h4 className="text-sm font-bold text-[#5A3825] mb-2">Need Assistance?</h4>
                    <p className="text-xs text-[#5A3825]/75 mb-4 leading-relaxed">
                        If you're having trouble tracking your shipment or didn't receive your AWB number, please contact our support team.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <a
                            href="mailto:support@urvaswadeshi.in"
                            className="inline-flex items-center justify-center px-4 py-2 bg-[#F4F1EA] border border-[#E2D9CC] text-[#5A3825] rounded-xl text-xs font-semibold hover:bg-[#E2D9CC] transition"
                        >
                            📧 Email Support
                        </a>
                        <a
                            href="/my-orders"
                            className="inline-flex items-center justify-center px-4 py-2 bg-[#F4F1EA] border border-[#E2D9CC] text-[#5A3825] rounded-xl text-xs font-semibold hover:bg-[#E2D9CC] transition"
                        >
                            📦 View My Orders
                        </a>
                    </div>
                </div>

                {/* Powered By */}
                <div className="text-center mt-8">
                    <p className="text-xs text-[#8B5A2B]/80 font-medium">
                        Logistics powered by APSRTC Cargo & India Post
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TrackShipment;

