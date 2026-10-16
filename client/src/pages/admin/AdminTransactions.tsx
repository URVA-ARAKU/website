import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAllOrdersQuery, useUpdateOrderStatusMutation } from '../../redux/api/order.api';
import { Order } from '../../types/api-types';
import { 
  FaQrcode, 
  FaSearch, 
  FaCopy, 
  FaCheck, 
  FaRupeeSign, 
  FaExternalLinkAlt, 
  FaWhatsapp, 
  FaTimes, 
  FaCheckCircle, 
  FaClock, 
  FaImage,
  FaShieldAlt
} from 'react-icons/fa';
import dayjs from 'dayjs';
import { notify } from '../../utils/util';

const AdminTransactions: React.FC = () => {
  const { data, isLoading, isError, refetch } = useAllOrdersQuery('');
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'needs_verification' | 'verified'>('all');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [selectedProof, setSelectedProof] = useState<{ url: string; orderId: string; utr?: string } | null>(null);

  const orders: Order[] = data?.orders || [];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    notify(`${label} copied to clipboard`, 'success');
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleQuickVerify = async (orderId: string) => {
    try {
      await updateOrderStatus({ orderId, status: 'Processing' }).unwrap();
      notify('Payment verified! Order moved to Processing.', 'success');
      refetch();
    } catch {
      notify('Failed to update order status', 'error');
    }
  };

  // Helper to extract customer info
  const getCustomerInfo = (order: Order) => {
    const info: any = order.shippingInfo || {};
    let rawName = info.name || info.fullName || info.customerName || '';
    if (!rawName && typeof order.user === 'object' && (order.user as any)?.name) {
      rawName = (order.user as any).name;
    }
    const name = rawName?.trim() || 'Guest Customer';
    const phone = info.phone || info.mobile || '';
    return { name, phone };
  };

  // Filtered UPI orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const info = order.shippingInfo as any;
      const utr = info?.transactionId || '';
      const status = order.status?.toLowerCase() || 'pending';
      const customer = getCustomerInfo(order);

      // Filter category
      if (filterType === 'needs_verification') {
        if (status !== 'pending') return false;
      } else if (filterType === 'verified') {
        if (status === 'pending' || status === 'cancelled') return false;
      }

      // Search matching
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;

      return (
        order._id?.toLowerCase().includes(q) ||
        utr.toLowerCase().includes(q) ||
        customer.name.toLowerCase().includes(q) ||
        customer.phone.toLowerCase().includes(q)
      );
    });
  }, [orders, searchQuery, filterType]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    let totalUpiOrders = 0;
    let totalVolume = 0;
    let pendingVerification = 0;
    let verifiedCount = 0;

    orders.forEach((o) => {
      totalUpiOrders += 1;
      totalVolume += Number(o.total || 0);
      const st = o.status?.toLowerCase();
      if (st === 'pending') {
        pendingVerification += 1;
      } else if (st === 'processing' || st === 'shipped' || st === 'delivered') {
        verifiedCount += 1;
      }
    });

    return { totalUpiOrders, totalVolume, pendingVerification, verifiedCount };
  }, [orders]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-[#8B5A2B] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#FAF8F4] p-8 rounded-3xl border border-[#E2D9CC] text-center shadow-2xs max-w-md mx-auto my-12 font-sans">
        <p className="text-rose-700 font-semibold mb-2 text-sm">Error loading transactions.</p>
        <button
          onClick={() => refetch()}
          className="bg-[#5A3825] text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#8B5A2B] transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-[#5A3825] tracking-tight">UPI Transactions & Proofs</h1>
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#EAE5D9] text-[#5A3825] border border-[#E2D9CC]">
              PhonePe / Generic UPI
            </span>
          </div>
          <p className="text-xs text-[#8C7364] mt-1">
            Reconcile direct UPI payments to <span className="font-mono font-semibold text-[#5A3825]">9346422451@ybl</span>, inspect UTR reference numbers, and verify screenshot proofs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="bg-[#FAF8F4] hover:bg-[#EAE5D9] text-[#5A3825] font-semibold px-4 py-2 rounded-xl text-xs border border-[#E2D9CC] transition"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FAF8F4] p-4 rounded-2xl border border-[#E2D9CC] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7364]">Total UPI Volume</span>
            <div className="w-8 h-8 rounded-lg bg-[#F4F1EA] text-[#5A3825] flex items-center justify-center text-sm border border-[#E2D9CC]">
              <FaRupeeSign />
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-[#5A3825] mt-2 tracking-tight">
            ₹{metrics.totalVolume.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
          <p className="text-[11px] text-[#8C7364] mt-0.5">Across all direct orders</p>
        </div>

        <div className="bg-[#FAF8F4] p-4 rounded-2xl border border-[#E2D9CC] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7364]">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-[#F4F1EA] text-[#5A3825] flex items-center justify-center text-sm border border-[#E2D9CC]">
              <FaQrcode />
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-[#5A3825] mt-2 tracking-tight">{metrics.totalUpiOrders}</p>
          <p className="text-[11px] text-[#8C7364] mt-0.5">Direct UPI checkout</p>
        </div>

        <div className="bg-[#FAF8F4] p-4 rounded-2xl border border-[#E2D9CC] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Needs Verification</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center text-sm border border-amber-200">
              <FaClock />
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-amber-800 mt-2 tracking-tight">{metrics.pendingVerification}</p>
          <p className="text-[11px] text-amber-700 font-medium mt-0.5">Pending admin approval</p>
        </div>

        <div className="bg-[#FAF8F4] p-4 rounded-2xl border border-[#E2D9CC] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Verified & Approved</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center text-sm border border-emerald-200">
              <FaCheckCircle />
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-emerald-800 mt-2 tracking-tight">{metrics.verifiedCount}</p>
          <p className="text-[11px] text-emerald-700 font-medium mt-0.5">Processed orders</p>
        </div>
      </div>

      {/* Merchant Account Info Banner */}
      <div className="bg-[#FAF8F4] p-4 rounded-2xl border border-[#E2D9CC] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#5A3825] text-white flex items-center justify-center text-base shrink-0">
            <FaShieldAlt />
          </div>
          <div>
            <p className="font-semibold text-[#5A3825]">Active Payment Receiver</p>
            <p className="text-[#8C7364] mt-0.5">
              Receiving UPI VPA: <span className="font-mono font-bold text-[#5A3825]">9346422451@ybl</span> (PhonePe QR Code)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto">
          <a
            href="/qr.jpeg"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F4F1EA] hover:bg-[#EAE5D9] text-[#5A3825] font-semibold border border-[#E2D9CC] transition"
          >
            <FaImage className="text-xs" /> View Active QR Code
          </a>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#FAF8F4] p-5 rounded-2xl border border-[#E2D9CC] shadow-2xs space-y-4">
        <div className="relative">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7364] text-xs" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by 12-digit UTR, Order ID, customer name or phone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2D9CC] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]/10 bg-[#F4F1EA] focus:bg-white placeholder-[#8C7364] transition text-[#5A3825]"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8C7364] hover:text-[#5A3825]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
              filterType === 'all'
                ? 'bg-[#5A3825] text-[#F4F1EA] font-semibold shadow-2xs'
                : 'bg-[#F4F1EA] text-[#5A3825] hover:bg-[#EAE5D9] border border-[#E2D9CC]'
            }`}
          >
            All Transactions ({orders.length})
          </button>
          <button
            onClick={() => setFilterType('needs_verification')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition flex items-center gap-1.5 ${
              filterType === 'needs_verification'
                ? 'bg-amber-800 text-white font-semibold shadow-2xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <span>Needs Verification</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-amber-200/50">
              {metrics.pendingVerification}
            </span>
          </button>
          <button
            onClick={() => setFilterType('verified')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition flex items-center gap-1.5 ${
              filterType === 'verified'
                ? 'bg-emerald-800 text-white font-semibold shadow-2xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <span>Approved & Processed</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-emerald-200/50">
              {metrics.verifiedCount}
            </span>
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-[#FAF8F4] rounded-3xl border border-[#E2D9CC] shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-[#E2D9CC] flex items-center justify-between">
          <h2 className="font-serif font-bold text-[#5A3825] text-sm tracking-tight">
            Transaction Records ({filteredOrders.length})
          </h2>
          {(searchQuery || filterType !== 'all') && (
            <button
              onClick={() => { setSearchQuery(''); setFilterType('all'); }}
              className="text-xs font-semibold text-[#8B5A2B] hover:text-[#5A3825] hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-14 h-14 rounded-2xl bg-[#F4F1EA] text-[#8C7364] text-xl flex items-center justify-center mx-auto mb-3 border border-[#E2D9CC]">
              <FaQrcode />
            </div>
            <p className="text-[#5A3825] font-semibold mb-1 text-sm">No transactions found</p>
            <p className="text-xs text-[#8C7364] max-w-sm mx-auto">
              No transactions matched your search or verification filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E2D9CC] text-left text-xs">
              <thead className="bg-[#EAE5D9] text-[#5A3825] font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">Order & Date</th>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Amount</th>
                  <th className="px-5 py-3.5">UTR / Transaction ID</th>
                  <th className="px-5 py-3.5">Proof Screenshot</th>
                  <th className="px-5 py-3.5">Order Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2D9CC] bg-[#FAF8F4]">
                {filteredOrders.map((order) => {
                  const customer = getCustomerInfo(order);
                  const info = order.shippingInfo as any;
                  const utr = info?.transactionId || '';
                  const screenshot = info?.paymentScreenshot || '';
                  const isPending = order.status?.toLowerCase() === 'pending';

                  return (
                    <tr key={order._id} className="hover:bg-[#F4F1EA]/60 transition-colors">
                      {/* Order & Date */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-semibold text-[#5A3825]">
                            #{order._id?.slice(0, 8)}
                          </span>
                          <button
                            onClick={() => handleCopy(order._id, 'Order ID')}
                            className="text-[#8C7364] hover:text-[#5A3825] transition"
                            title="Copy Order ID"
                          >
                            {copiedText === order._id ? (
                              <FaCheck className="text-emerald-600 text-[10px]" />
                            ) : (
                              <FaCopy className="text-[10px]" />
                            )}
                          </button>
                        </div>
                        <span className="text-[11px] text-[#8C7364] block mt-0.5">
                          {order.createdAt ? dayjs(order.createdAt).format('DD MMM YYYY, hh:mm A') : 'Recent'}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-3.5">
                        <span className="font-semibold text-[#5A3825] block text-xs">
                          {customer.name}
                        </span>
                        {customer.phone && (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[11px] text-[#8C7364] font-mono">{customer.phone}</span>
                            <a
                              href={`https://wa.me/91${customer.phone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(customer.name)},%20we%20are%20verifying%20your%20URVA%20order%20payment%20(Order%20%23${order._id?.slice(0, 8)})...`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-700 hover:text-emerald-800"
                              title="Chat on WhatsApp"
                            >
                              <FaWhatsapp className="text-xs" />
                            </a>
                          </div>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-3.5">
                        <span className="font-bold text-[#5A3825] text-xs block">
                          ₹{Number(order.total || 0).toFixed(2)}
                        </span>
                        <span className="text-[10px] text-[#8C7364] block">Direct UPI</span>
                      </td>

                      {/* UTR */}
                      <td className="px-5 py-3.5">
                        {utr ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-semibold text-[#5A3825] bg-[#F4F1EA] px-2 py-0.5 rounded border border-[#E2D9CC]">
                              {utr}
                            </span>
                            <button
                              onClick={() => handleCopy(utr, 'UTR')}
                              className="text-[#8C7364] hover:text-[#5A3825] transition"
                              title="Copy UTR"
                            >
                              {copiedText === utr ? (
                                <FaCheck className="text-emerald-600 text-[10px]" />
                              ) : (
                                <FaCopy className="text-[10px]" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-[#8C7364] italic">Not provided</span>
                        )}
                      </td>

                      {/* Screenshot Proof */}
                      <td className="px-5 py-3.5">
                        {screenshot ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedProof({ url: screenshot, orderId: order._id, utr })}
                              className="w-10 h-10 rounded-lg overflow-hidden border border-[#E2D9CC] hover:ring-2 hover:ring-[#8B5A2B] transition shrink-0 group relative bg-black/5"
                              title="Click to view full screenshot proof"
                            >
                              <img
                                src={screenshot}
                                alt="Payment proof"
                                className="w-full h-full object-cover group-hover:scale-105 transition"
                              />
                            </button>
                            <button
                              onClick={() => setSelectedProof({ url: screenshot, orderId: order._id, utr })}
                              className="text-[11px] font-semibold text-[#8B5A2B] hover:text-[#5A3825] hover:underline flex items-center gap-1"
                            >
                              View Proof
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-[#8C7364] italic">No proof attached</span>
                        )}
                      </td>

                      {/* Order Status */}
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                            order.status?.toLowerCase() === 'delivered'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : order.status?.toLowerCase() === 'processing' || order.status?.toLowerCase() === 'shipped'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : order.status?.toLowerCase() === 'cancelled'
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {order.status || 'Pending'}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isPending && (
                            <button
                              onClick={() => handleQuickVerify(order._id)}
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-2xs transition flex items-center gap-1"
                              title="Approve payment and transition order to Processing"
                            >
                              <FaCheck className="text-[10px]" /> Verify
                            </button>
                          )}
                          <button
                            onClick={() => navigate(`/admin/orders/${order._id}`)}
                            className="px-2.5 py-1.5 rounded-xl bg-[#F4F1EA] hover:bg-[#EAE5D9] text-[#5A3825] font-semibold text-xs border border-[#E2D9CC] transition flex items-center gap-1"
                          >
                            <FaExternalLinkAlt className="text-[10px]" /> Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Proof Preview Modal */}
      {selectedProof && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedProof(null)}
        >
          <div 
            className="bg-[#FAF8F4] rounded-2xl max-w-2xl w-full p-5 border border-[#E2D9CC] shadow-2xl relative max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E2D9CC]">
              <div>
                <h3 className="font-serif font-bold text-[#5A3825] text-base">Payment Screenshot Proof</h3>
                <p className="text-xs text-[#8C7364] mt-0.5">
                  Order #{selectedProof.orderId?.slice(0, 8)} {selectedProof.utr ? `• UTR: ${selectedProof.utr}` : ''}
                </p>
              </div>
              <button
                onClick={() => setSelectedProof(null)}
                className="w-8 h-8 rounded-full bg-[#F4F1EA] hover:bg-[#EAE5D9] text-[#5A3825] flex items-center justify-center transition border border-[#E2D9CC]"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto my-4 rounded-xl border border-[#E2D9CC] bg-[#F4F1EA] flex items-center justify-center p-2">
              <img
                src={selectedProof.url}
                alt="Payment screenshot proof full"
                className="max-h-[65vh] w-auto object-contain rounded-lg shadow-xs"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#E2D9CC] text-xs">
              <a
                href={selectedProof.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8B5A2B] hover:text-[#5A3825] font-semibold underline flex items-center gap-1"
              >
                Open in new tab <FaExternalLinkAlt className="text-[10px]" />
              </a>
              <button
                onClick={() => setSelectedProof(null)}
                className="px-4 py-2 rounded-xl bg-[#5A3825] text-[#F4F1EA] font-semibold hover:bg-[#8B5A2B] transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTransactions;
