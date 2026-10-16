import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BackButton from '../components/common/BackBtn';
import { useMyOrdersQuery } from '../redux/api/order.api';
import { notify } from '../utils/util';
import { usePageSEO } from '../hooks/usePageSEO';

const MyOrders: React.FC = () => {
    usePageSEO({
        title: 'My Orders | URVA',
        description: 'Track and view your URVA orders.',
        canonical: '/my-orders',
        noIndex: true,
    });

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Use guestUserId from localStorage for order tracking
    const guestUserId = localStorage.getItem('guestUserId') || '';

    const { data, isLoading, isError } = useMyOrdersQuery(guestUserId);

    useEffect(() => {
        const paymentStatus = searchParams.get('payment');
        const orderId = searchParams.get('orderId');
        if (paymentStatus === 'success') {
            notify('Payment successful! Your order has been placed.', 'success');
            if (orderId) {
                navigate(`/order/${orderId}`, { replace: true });
            } else {
                window.history.replaceState({}, '', window.location.pathname);
            }
        } else if (paymentStatus === 'fail') {
            notify('Payment failed or cancelled. Please try again.', 'error');
            window.history.replaceState({}, '', window.location.pathname);
        }
    }, [searchParams, navigate]);

    if (!guestUserId) {
        return (
            <div className="min-h-screen bg-[#F4F1EA] py-8 px-4 flex justify-center">
                <div className="max-w-xl w-full p-6 bg-[#FAF8F4] rounded-2xl border border-[#E2D9CC] shadow-sm text-center">
                    <BackButton fallback="/" />
                    <h2 className="text-2xl font-serif font-bold mb-4 text-[#5A3825]">My Orders</h2>
                    <p className="text-[#8C7364] text-sm">No orders found. Place an order to see it here.</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F4F1EA] flex items-center justify-center">
                <p className="text-center text-lg text-[#5A3825]">Loading orders...</p>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="min-h-screen bg-[#F4F1EA] flex items-center justify-center">
                <p className="text-center text-lg text-red-600">Error loading orders</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F4F1EA] py-8 px-4">
            <div className="container mx-auto p-6 bg-[#FAF8F4] rounded-2xl border border-[#E2D9CC] shadow-sm max-w-5xl">
                <BackButton />
                <h2 className="text-2xl font-serif font-bold tracking-tight mb-6 text-center text-[#5A3825]">My Orders</h2>
                {data.orders.length === 0 ? (
                    <p className="text-center text-sm text-[#8C7364] py-8">No orders found</p>
                ) : (
                    <div className="overflow-x-auto rounded-xl border border-[#E2D9CC]">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#EAE5D9]">
                                <tr className="border-b border-[#E2D9CC] text-xs font-semibold text-[#5A3825] uppercase tracking-wider">
                                    <th className="p-4">Order ID</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Total</th>
                                    <th className="p-4 text-right">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E2D9CC] text-xs sm:text-sm">
                                {data.orders.map((order) => (
                                    <tr className="hover:bg-[#FAF8F4]/80 transition-colors" key={order._id}>
                                        <td className="p-4 font-mono text-xs text-[#5A3825]">{order._id}</td>
                                        <td className="p-4 text-[#8C7364]">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4">
                                            <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#F4F1EA] text-[#5A3825] border border-[#E2D9CC]">
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4 font-bold text-[#5A3825]">₹ {order.total.toFixed(2)}</td>
                                        <td className="p-4 text-right">
                                            <button
                                                className="bg-[#8B5A2B] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#5A3825] transition-colors shadow-2xs"
                                                onClick={() => navigate(`/order/${order._id}`)}
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
