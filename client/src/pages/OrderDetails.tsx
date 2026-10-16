import React from 'react';
import { useParams } from 'react-router-dom';
import BackButton from '../components/common/BackBtn';
import { useOrderDetailsQuery } from '../redux/api/order.api';
import { usePageSEO } from '../hooks/usePageSEO';

const OrderDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    usePageSEO({
        title: `Order #${id || ''} | URVA`,
        description: 'View order details and status.',
        canonical: `/order/${id || ''}`,
        noIndex: true,
    });

    const { data, isLoading, isError } = useOrderDetailsQuery(id!);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] bg-[#FAFAFA]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-neutral-200 border-t-black rounded-full animate-spin"></div>
                    <p className="text-xs text-neutral-500 font-sans">Loading order invoice...</p>
                </div>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-[#FAFAFA] p-4 text-center">
                <BackButton fallback="/my-orders" />
                <p className="text-4xl mb-3">📄</p>
                <h2 className="text-xl font-sans font-semibold text-[#111111] mb-2">Order Not Found</h2>
                <p className="text-xs text-neutral-500 max-w-sm mb-4">Could not find order details for ID: {id}</p>
            </div>
        );
    }

    const { order } = data;

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'delivered':
                return 'bg-[#5A3825] text-white border-[#3F2618]';
            case 'shipped':
                return 'bg-[#8B5A2B] text-white border-[#70441E]';
            case 'processing':
                return 'bg-[#FAF8F4] text-[#5A3825] border-[#E2D9CC]';
            default:
                return 'bg-[#FAF8F4] text-[#5A3825] border-[#E2D9CC]';
        }
    };

    return (
        <div className="min-h-screen bg-[#F4F1EA] py-6 sm:py-10 px-4">
            <div className="max-w-4xl mx-auto space-y-6">
                <BackButton fallback="/my-orders" />

                <div className="bg-[#FAF8F4] rounded-2xl p-5 sm:p-8 shadow-sm border border-[#E2D9CC] space-y-6">
                    {/* Header Banner */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-[#E2D9CC] gap-3">
                        <div>
                            <span className="text-xs font-mono text-[#8C7364] block">ORDER RECEIPT</span>
                            <h1 className="text-lg sm:text-2xl font-serif font-bold tracking-tight text-[#5A3825] break-all">ID: {order._id}</h1>
                            <p className="text-xs text-[#8C7364] mt-0.5 font-normal">Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                        <div>
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${getStatusBadge(order.status)}`}>
                                {order.status}
                            </span>
                        </div>
                    </div>

                    {/* Shipping & Customer Details Card */}
                    <div className="bg-[#F4F1EA] p-4 sm:p-5 rounded-xl border border-[#E2D9CC] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                        <div>
                            <h3 className="font-semibold text-[#5A3825] text-xs uppercase tracking-wider mb-2">Delivery Address</h3>
                            <p className="font-medium text-[#5A3825]">{order.shippingInfo.address}</p>
                            <p className="text-[#8C7364]">{order.shippingInfo.city}, {order.shippingInfo.state} - {order.shippingInfo.pinCode}</p>
                            <p className="text-[#8C7364]">{order.shippingInfo.country}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-[#5A3825] text-xs uppercase tracking-wider mb-2">Customer Details</h3>
                            <p className="text-[#8C7364]">Phone: <span className="font-semibold text-[#5A3825]">{order.shippingInfo.phone}</span></p>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div>
                        <h3 className="text-base sm:text-lg font-serif font-bold text-[#5A3825] mb-4">Order Items</h3>
                        
                        {/* Mobile Item Cards (Visible on small screens) */}
                        <div className="md:hidden space-y-3">
                            {order.orderItems.map((item, index) => (
                                <div key={item._id || index} className="bg-[#F4F1EA] p-3.5 rounded-xl border border-[#E2D9CC] flex items-center gap-3">
                                    <img src={item.photo} alt={item.name} className="h-14 w-14 object-contain rounded-lg bg-white p-1 border border-[#E2D9CC] flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-xs text-[#5A3825] truncate">{item.name}</p>
                                        <p className="text-xs text-[#8C7364]">Qty: {item.quantity} × ₹{item.price.toFixed(2)}</p>
                                        <p className="text-xs font-semibold text-[#5A3825] mt-0.5">₹ {(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table (Hidden on small screens) */}
                        <div className="hidden md:block overflow-x-auto rounded-xl border border-[#E2D9CC]">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-[#EAE5D9]">
                                    <tr className="border-b border-[#E2D9CC] text-xs font-semibold text-[#5A3825] uppercase tracking-wider">
                                        <th className="p-4">Product</th>
                                        <th className="p-4">Quantity</th>
                                        <th className="p-4">Unit Price</th>
                                        <th className="p-4 text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E2D9CC] text-sm">
                                    {order.orderItems.map((item, index) => (
                                        <tr className="hover:bg-[#FAF8F4]/80 transition-colors" key={item._id || `item-${index}`}>
                                            <td className="p-4">
                                                <div className="flex items-center space-x-3">
                                                    <img src={item.photo} alt={item.name} className="h-12 w-12 object-contain rounded-lg bg-white p-1 border border-[#E2D9CC]" />
                                                    <span className="font-semibold text-[#5A3825]">{item.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 font-medium text-[#5A3825]">{item.quantity}</td>
                                            <td className="p-4 font-medium text-[#5A3825]">₹ {item.price.toFixed(2)}</td>
                                            <td className="p-4 font-bold text-[#5A3825] text-right">₹ {(item.price * item.quantity).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Order Summary Box */}
                    <div className="bg-[#F4F1EA] p-5 rounded-xl border border-[#E2D9CC] space-y-2 text-xs sm:text-sm">
                        <h3 className="font-serif font-bold text-base text-[#5A3825] pb-2 border-b border-[#E2D9CC]">Payment Breakdown</h3>
                        <div className="flex justify-between text-[#8C7364] pt-1">
                            <span>Subtotal</span>
                            <span className="font-semibold text-[#5A3825]">₹ {order.subtotal.toFixed(2)}</span>
                        </div>
                        {order.tax > 0 && (
                            <div className="flex justify-between text-[#8C7364]">
                                <span>Taxes</span>
                                <span className="font-semibold text-[#5A3825]">₹ {order.tax.toFixed(2)}</span>
                            </div>
                        )}
                        {order.shippingCharges > 0 && (
                            <div className="flex justify-between text-[#8C7364]">
                                <span>Shipping Charges</span>
                                <span className="font-semibold text-[#5A3825]">₹ {order.shippingCharges.toFixed(2)}</span>
                            </div>
                        )}
                        {order.discount > 0 && (
                            <div className="flex justify-between text-[#8B5A2B] font-semibold">
                                <span>Discount</span>
                                <span>-₹ {order.discount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="pt-3 border-t border-[#E2D9CC] flex justify-between items-baseline font-serif font-bold text-base text-[#5A3825]">
                            <span>Total Paid</span>
                            <span className="text-xl sm:text-2xl font-extrabold text-[#5A3825]">₹ {order.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
