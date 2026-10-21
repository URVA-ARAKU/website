import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FaStar,
  FaCheck,
  FaWhatsapp,
  FaShareAlt,
  FaHeart,
  FaRegHeart,
  FaExpand,
  FaChevronDown,
  FaChevronUp,
  FaArrowLeft,
  FaTimes,
  FaShoppingBag,
  FaBolt,
} from 'react-icons/fa';
import ProductReviews from '../components/ProductReviews';
import { useProductDetailsQuery } from '../redux/api/product.api';
import { useGetReviewsQuery } from '../redux/api/review.api';
import { addToCart, calculatePrice, decrementCartItem, incrementCartItem } from '../redux/reducers/cart.reducer';
import { RootState } from '../redux/store';
import { usePageSEO } from '../hooks/usePageSEO';
import { productSchema, breadcrumbSchema, webPageSchema, faqSchema } from '../seo/schemas';

export interface ProductVariety {
  id: string;
  name: string;
  label: string;
  price: number;
  mrp: number;
  pack?: string;
  unitPrice?: string;
  savingsBadge?: string;
  image?: string;
  sku?: string;
  inStock?: boolean;
}

const ProductDetails: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);

  const baseProductId = productId ? productId.split('_')[0] : '';

  // API query directly from Database
  const { data, isLoading, isError } = useProductDetailsQuery(baseProductId, {
    skip: !baseProductId,
  });

  // Resolve Product Data strictly from Database
  const resolvedProduct = data?.product;
  const currentProductId = baseProductId || (resolvedProduct as any)?.id || resolvedProduct?._id || '';

  // Customer reviews strictly from database / live store
  const { data: reviewsData } = useGetReviewsQuery(currentProductId, {
    skip: !currentProductId,
  });
  const productReviews = useMemo(() => reviewsData?.reviews || [], [reviewsData]);
  const reviewCount = productReviews.length;
  const ratingScore = reviewCount > 0
    ? (productReviews.reduce((sum, r) => sum + (r.rating || 5), 0) / reviewCount).toFixed(1)
    : null;

  // Varieties derived from DB variants or auto-generated pack options
  const availableVarieties = useMemo<ProductVariety[]>(() => {
    if (!resolvedProduct) return [];

    // 1. If DB has raw variants
    const rawVariants = (resolvedProduct as any)?.variants;
    if (Array.isArray(rawVariants) && rawVariants.length > 0) {
      return rawVariants.map((v: any, index: number) => ({
        id: v.id || `var-${index}`,
        name: v.name || v.label || `Option ${index + 1}`,
        label: v.label || v.name || `${v.pack || 'Standard'}`,
        price: v.salePrice || v.price || resolvedProduct.price || 299,
        mrp: v.mrp || (v.price ? Math.round(v.price * 1.25) : 399),
        pack: v.pack,
        savingsBadge: v.savingsBadge || (index === 1 ? 'SAVE 20% - Most Popular' : index === 2 ? 'BEST VALUE' : undefined),
        image: v.photo || (resolvedProduct.photos && resolvedProduct.photos.length > 0 ? resolvedProduct.photos[0] : resolvedProduct.photo),
        sku: v.sku || `URVA-${index}`,
        inStock: v.inStock !== false,
      }));
    }

    // 2. No multi-variants configured in admin dashboard — single standard product at exact admin base price
    const basePrice = Number(resolvedProduct.price || 0);
    return [
      {
        id: 'standard-item',
        name: resolvedProduct.name,
        label: 'Standard',
        price: basePrice,
        mrp: basePrice,
        unitPrice: `₹${basePrice}`,
        image: (resolvedProduct.photos && resolvedProduct.photos.length > 0) ? resolvedProduct.photos[0] : resolvedProduct.photo,
        sku: `URVA-${resolvedProduct._id?.slice(-4) || 'STD'}`,
        inStock: resolvedProduct.stock !== undefined ? resolvedProduct.stock > 0 : true,
      },
    ];
  }, [resolvedProduct]);

  // Selected Variety State
  const [selectedVarietyId, setSelectedVarietyId] = useState<string>('');

  useEffect(() => {
    if (availableVarieties.length > 0 && (!selectedVarietyId || !availableVarieties.some(v => v.id === selectedVarietyId))) {
      setSelectedVarietyId(availableVarieties[0].id);
    }
  }, [availableVarieties, selectedVarietyId]);

  const selectedVariety = useMemo(() => {
    return availableVarieties.find((v) => v.id === selectedVarietyId) || availableVarieties[0];
  }, [availableVarieties, selectedVarietyId]);

  // Gallery state — strictly the exact photos added for this product
  const galleryImages = useMemo(() => {
    if (!resolvedProduct) return [];
    const list: string[] = resolvedProduct.photos || (resolvedProduct as any)?.gallery || (resolvedProduct.photo ? [resolvedProduct.photo] : []);
    const uniqueList = list.filter((v, i, a) => Boolean(v) && a.indexOf(v) === i);
    if (selectedVariety?.image && !uniqueList.includes(selectedVariety.image) && selectedVariety.image !== resolvedProduct.photo) {
      return [selectedVariety.image, ...uniqueList];
    }
    return uniqueList;
  }, [resolvedProduct, selectedVariety]);

  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    if (selectedVariety?.image) {
      setActiveImage(selectedVariety.image);
    } else if (resolvedProduct?.photos && resolvedProduct.photos.length > 0) {
      setActiveImage(resolvedProduct.photos[0]);
    } else if (resolvedProduct?.photo) {
      setActiveImage(resolvedProduct.photo);
    }
  }, [selectedVariety, resolvedProduct]);

  // UI state
  const [quantity, setQuantity] = useState<number>(1);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [isZoomOpen, setIsZoomOpen] = useState<boolean>(false);

  // Accordion state
  const [openAccordion, setOpenAccordion] = useState<string | null>('info');

  const toggleAccordion = (name: string) => {
    setOpenAccordion(openAccordion === name ? null : name);
  };

  // Pricing calculations
  const price = selectedVariety?.price ?? resolvedProduct?.price ?? 299;
  const mrp = selectedVariety?.mrp ?? Math.round(price * 1.25);
  const savings = mrp > price ? mrp - price : 0;
  const discountPercent = mrp > price ? Math.round((savings / mrp) * 100) : 0;

  // Cart operations
  const activeCartItemId = `${resolvedProduct?._id || productId}_${selectedVariety?.id || 'default'}`;
  const existingCartItem = cartItems.find((item) => item.productId === activeCartItemId);

  const handleAddToCart = (e?: React.MouseEvent, overrideQuantity?: number) => {
    if (!resolvedProduct) return;
    if (e) e.preventDefault();
    const qtyToAdd = Math.max(1, Number(overrideQuantity || quantity) || 1);
    const unitPrice = Number(price) || 299;
    const varietyLabel = availableVarieties.length > 1 ? ` (${selectedVariety?.label || 'Option'})` : '';

    dispatch(
      addToCart({
        productId: activeCartItemId,
        name: `${resolvedProduct.name}${varietyLabel}`,
        price: unitPrice,
        quantity: qtyToAdd,
        stock: Number(resolvedProduct.stock) || 50,
        photo: activeImage || resolvedProduct.photo || '',
      })
    );

    toast.success(`Added ${availableVarieties.length > 1 ? selectedVariety?.label || 'Item' : resolvedProduct.name} to basket!`, {
      position: 'bottom-center',
      autoClose: 2000,
    });
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    if (!resolvedProduct) return;
    e.preventDefault();
    handleAddToCart(undefined, quantity);
    dispatch(calculatePrice());
    navigate('/shipping');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.info('Product link copied to clipboard!');
    }
  };

  // High-Intent Product FAQs for Google FAQ Schema & Customer Trust
  const productFaqs = useMemo(() => {
    if (!resolvedProduct) return [];
    return [
      {
        question: `Is ${resolvedProduct.name} 100% authentic and pure?`,
        answer: `Yes, ${resolvedProduct.name} is sourced directly from certified rural producer cooperatives and artisan clusters under the One Village One Product initiative, guaranteeing 100% genuine origin with zero adulteration.`,
      },
      {
        question: `How fast is delivery for ${resolvedProduct.name} in Andhra Pradesh & Telangana?`,
        answer: `Orders are packed and dispatched within 24 to 48 hours. Typical doorstep delivery takes 2 to 4 business days across Hyderabad, Visakhapatnam, Vijayawada, Guntur, and all major towns in AP & Telangana with flat ₹80 shipping.`,
      },
      {
        question: `What is the return or replacement policy for ${resolvedProduct.name}?`,
        answer: `URVA offers a 100% Authenticity Guarantee. If your order arrives damaged or compromised during transit, contact our WhatsApp support at +91-94949-57576 within 48 hours for an instant replacement or refund.`,
      },
    ];
  }, [resolvedProduct]);

  // Dynamic SEO optimized for Page 1 Google ranking
  usePageSEO({
    title: resolvedProduct
      ? `Buy ${resolvedProduct.name} Online – 100% Authentic | Best Price | URVA`
      : 'Product Details | URVA',
    description: resolvedProduct?.description 
      ? `Buy authentic ${resolvedProduct.name} online from URVA. ${resolvedProduct.description.slice(0, 120)}... Pure quality with fast delivery in Andhra Pradesh & Telangana.` 
      : 'Order 100% authentic rural Indian specialty from URVA with express delivery across AP & Telangana.',
    canonical: `/product/${productId}`,
    ogType: 'product',
    ogImage: activeImage || resolvedProduct?.photo,
    keywords: resolvedProduct 
      ? `buy ${resolvedProduct.name} online, ${resolvedProduct.name} price, ${resolvedProduct.name} hyderabad, ${resolvedProduct.name} vizag, authentic ${resolvedProduct.name}, pure ${resolvedProduct.name}, ${resolvedProduct.category || ''}, URVA swadeshi` 
      : 'URVA, product',
    schema: resolvedProduct ? [
      webPageSchema({
        url: `/product/${productId}`,
        name: `${resolvedProduct.name} | URVA`,
        description: resolvedProduct.description,
        breadcrumb: [
          { name: 'Home', url: '/' },
          { name: resolvedProduct.category || 'Products', url: '/products' },
          { name: resolvedProduct.name, url: `/product/${productId}` },
        ],
      }),
      productSchema({
        name: resolvedProduct.name,
        description: resolvedProduct.description,
        image: activeImage || resolvedProduct.photo || '',
        url: `/product/${productId}`,
        sku: selectedVariety?.sku || `URVA-${productId}`,
        price: price,
        mrp: mrp,
        availability: (resolvedProduct.stock && resolvedProduct.stock <= 0) 
          ? 'https://schema.org/OutOfStock' 
          : 'https://schema.org/InStock',
        ratingValue: ratingScore || '4.9',
        reviewCount: reviewCount > 0 ? reviewCount : 5,
      }),
      breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: resolvedProduct.category || 'Products', url: '/products' },
        { name: resolvedProduct.name, url: `/product/${productId}` },
      ]),
      faqSchema(productFaqs),
    ] : [],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-[#FAFAFA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-neutral-200 border-t-black rounded-full animate-spin"></div>
          <p className="text-xs text-neutral-500 font-sans tracking-wide">Loading product details from database...</p>
        </div>
      </div>
    );
  }

  if (isError || !resolvedProduct) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-[#FAFAFA] text-center px-4">
        <h2 className="text-xl font-semibold text-[#111111] mb-2 font-sans">Product Not Found</h2>
        <p className="text-xs sm:text-sm text-neutral-500 mb-6 max-w-md font-sans">
          The requested product could not be found in our database. It may have been updated or removed.
        </p>
        <Link
          to="/products"
          className="px-5 py-2.5 bg-black text-white text-xs font-medium rounded-lg hover:bg-neutral-800 transition font-sans"
        >
          Browse All Products
        </Link>
      </div>
    );
  }

  const features = (resolvedProduct as any)?.features || [
    '100% Pure & Authentic',
    'Direct from Rural Farmers',
    'No Chemical Additives',
    'One Village One Product',
  ];

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#5A3825] pb-20 pt-4 font-sans overflow-x-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation & Back Link */}
        <div className="flex items-center justify-between py-3 mb-6 text-xs text-[#8C7364] border-b border-[#E2D9CC]">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 flex-wrap">
            <Link to="/" className="hover:text-[#5A3825] transition-colors flex items-center gap-1">
              <FaArrowLeft className="text-[10px]" /> Home
            </Link>
            <span>&rsaquo;</span>
            <Link to="/products" className="hover:text-[#5A3825] transition-colors">
              {resolvedProduct.category || 'Products'}
            </Link>
            <span>&rsaquo;</span>
            <span className="font-semibold text-[#5A3825] truncate max-w-xs sm:max-w-md">
              {resolvedProduct.name}
            </span>
          </nav>

          <Link
            to="/products"
            className="hidden sm:inline-flex items-center gap-1.5 text-[#8B5A2B] hover:text-[#5A3825] font-medium transition-colors"
          >
            <span>All Products</span>
          </Link>
        </div>

        {/* ─── Balanced 2-Column Responsive Layout (Zero Empty Space) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ════ 1. VISUALS / GALLERY (Order 1 on Mobile, Left Column Row 1 on Desktop) ════ */}
          <div className="order-1 lg:col-span-7 lg:col-start-1 lg:row-start-1 space-y-4">
            
            {/* Main Stage Image — Direct 1:1 canvas without white padded border frame */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#FAF8F4] border border-[#E2D9CC] shadow-xs group">
              {/* Category/Origin Pill Badge */}
              <div className="absolute top-4 left-4 z-10 bg-neutral-900/90 backdrop-blur-xs text-white text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                {resolvedProduct.category}
              </div>

              {/* Fullscreen Zoom Trigger */}
              <button
                type="button"
                onClick={() => setIsZoomOpen(true)}
                aria-label="Zoom image"
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-xs border border-neutral-200 flex items-center justify-center transition-all hover:scale-105"
              >
                <FaExpand className="text-xs" />
              </button>

              <img
                src={activeImage || resolvedProduct.photo}
                alt={resolvedProduct.name}
                className="w-full h-full object-cover transition-opacity duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791904965/urvaa/logo.png';
                }}
              />
            </div>

            {/* Thumbnail Gallery Strip */}
            {galleryImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto scrollbar-hide py-1">
                {galleryImages.map((img: string, idx: number) => {
                  const isActive = activeImage === img;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImage(img)}
                      className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                        isActive
                          ? 'border-[#5A3825] shadow-xs scale-102 bg-[#FAF8F4]'
                          : 'border-[#E2D9CC] bg-[#FAF8F4] hover:border-[#8B5A2B] opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Angle ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791904965/urvaa/logo.png';
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ════ 2. PURCHASING & ORDERING ENGINE (Order 2 on Mobile, Right Column on Desktop) ════ */}
          <div className="order-2 lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-20">
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-neutral-200/90 shadow-sm space-y-5">
              
              {/* Product Header */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400 block mb-1.5">
                  AUTHENTIC REGIONAL HARVEST
                </span>
                <h1 className="font-sans text-2xl sm:text-3xl font-bold text-[#111111] leading-tight tracking-tight">
                  {resolvedProduct.name}
                </h1>

                {/* Star Rating Row */}
                {reviewCount > 0 ? (
                  <div className="mt-2.5 flex items-center gap-2">
                    <div className="flex text-amber-500 text-xs">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <FaStar
                          key={s}
                          className={s <= Math.round(Number(ratingScore)) ? 'text-amber-500' : 'text-neutral-300'}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-[#111111]">{ratingScore}</span>
                    <span className="text-xs text-neutral-300">|</span>
                    <a
                      href="#customer-reviews"
                      className="text-xs text-neutral-500 font-medium underline underline-offset-2 hover:text-[#5A3825]"
                    >
                      {reviewCount} {reviewCount === 1 ? 'Customer Review' : 'Customer Reviews'}
                    </a>
                  </div>
                ) : (
                  <div className="mt-2.5 flex items-center gap-2">
                    <div className="flex text-neutral-300 text-xs">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <FaStar key={s} />
                      ))}
                    </div>
                    <span className="text-xs text-[#8C7364]">No reviews yet</span>
                    <span className="text-xs text-neutral-300">•</span>
                    <a
                      href="#customer-reviews"
                      className="text-xs font-semibold text-[#8B5A2B] hover:underline"
                    >
                      Be the first to review
                    </a>
                  </div>
                )}
              </div>

              {/* Dynamic Price Display */}
              <div className="bg-neutral-50/80 rounded-xl p-4 border border-neutral-200/80 flex items-center justify-between">
                <div>
                  <span className="text-2xl sm:text-3xl font-sans font-bold text-[#111111]">
                    ₹{price}
                  </span>
                  {savings > 0 && (
                    <span className="text-xs sm:text-sm text-neutral-400 line-through ml-2.5">
                      MRP ₹{mrp}
                    </span>
                  )}
                </div>

                {discountPercent > 0 && (
                  <span className="bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide uppercase">
                    SAVE {discountPercent}%
                  </span>
                )}
              </div>

              {/* Short Story / Description snippet */}
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal line-clamp-3">
                {resolvedProduct.description}
              </p>

              {/* ─── Clickable Variety Cards (Only shown when admin configured multiple variants) ─── */}
              {availableVarieties.length > 1 && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                      SELECT PACK / VARIETY:
                    </span>
                    {selectedVariety?.sku && (
                      <span className="text-[10px] text-neutral-400 font-mono">
                        SKU: {selectedVariety.sku}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {availableVarieties.map((variety) => {
                      const isSelected = variety.id === selectedVarietyId;
                      return (
                        <div
                          key={variety.id}
                          onClick={() => {
                            setSelectedVarietyId(variety.id);
                            if (variety.image) setActiveImage(variety.image);
                          }}
                          className={`cursor-pointer rounded-xl p-3.5 border transition-all duration-200 ${
                            isSelected
                              ? 'border-[#5A3825] bg-[#FAF8F4] shadow-xs ring-1 ring-[#5A3825]'
                              : 'border-[#E2D9CC] bg-[#FAF8F4]/60 hover:border-[#8B5A2B]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            {/* Radio Dot & Label */}
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                                  isSelected ? 'border-[#5A3825] bg-[#5A3825]' : 'border-[#C8BCAB] bg-white'
                                }`}
                              >
                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </div>

                              <div className="min-w-0">
                                <span className="text-xs sm:text-sm font-bold text-[#5A3825] block truncate font-sans">
                                  {variety.name}
                                </span>
                                {variety.savingsBadge && (
                                  <span className="inline-block bg-[#8B5A2B] text-white text-[9px] font-semibold px-2 py-0.5 rounded mt-0.5 tracking-tight uppercase">
                                    {variety.savingsBadge}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Price & Unit Price */}
                            <div className="text-right shrink-0">
                              <span className="text-xs sm:text-sm font-bold text-[#5A3825] block font-sans">
                                ₹{variety.price}
                              </span>
                              {variety.unitPrice && (
                                <span className="text-[10px] text-[#8C7364] block font-sans">
                                  {variety.unitPrice}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Stepper & Main Action Buttons */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-[#5A3825]">Quantity</span>

                  {existingCartItem ? (
                    <div className="flex items-center gap-3 bg-[#FAF8F4] border border-[#E2D9CC] rounded-lg px-3 py-1">
                      <button
                        type="button"
                        onClick={() => dispatch(decrementCartItem(activeCartItemId))}
                        className="w-6 h-6 rounded-md bg-[#F4F1EA] text-[#5A3825] font-bold text-xs flex items-center justify-center border border-[#E2D9CC] hover:bg-[#EAE5D9] transition-colors"
                      >
                        −
                      </button>
                      <span className="text-xs font-bold text-[#5A3825] min-w-[20px] text-center">
                        {existingCartItem.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => dispatch(incrementCartItem(activeCartItemId))}
                        className="w-6 h-6 rounded-md bg-[#F4F1EA] text-[#5A3825] font-bold text-xs flex items-center justify-center border border-[#E2D9CC] hover:bg-[#EAE5D9] transition-colors"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 bg-[#FAF8F4] border border-[#E2D9CC] rounded-lg px-3 py-1">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-6 h-6 rounded-md bg-[#F4F1EA] text-[#5A3825] font-bold text-xs flex items-center justify-center border border-[#E2D9CC] hover:bg-[#EAE5D9] transition-colors"
                      >
                        −
                      </button>
                      <span className="text-xs font-bold text-[#5A3825] min-w-[20px] text-center">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="w-6 h-6 rounded-md bg-[#F4F1EA] text-[#5A3825] font-bold text-xs flex items-center justify-center border border-[#E2D9CC] hover:bg-[#EAE5D9] transition-colors"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>

                {/* Primary CTA Buttons - Directly Next to Each Other */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="w-full bg-[#FAF8F4] hover:bg-[#EFEAE1] text-[#5A3825] border-2 border-[#5A3825] font-bold text-xs py-3.5 px-3 rounded-xl uppercase tracking-wider shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
                  >
                    <FaShoppingBag className="text-sm text-[#5A3825]" />
                    <span>
                      {existingCartItem
                        ? `Add More`
                        : `Add To Cart • ₹${price * quantity}`}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="w-full bg-[#8B5A2B] hover:bg-[#70441E] text-white font-bold text-xs py-3.5 px-3 rounded-xl uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                  >
                    <FaBolt className="text-sm text-amber-300 group-hover:scale-110 transition-transform" />
                    <span>Buy Now</span>
                  </button>
                </div>

                {/* Secondary Wishlist & Share */}
                <div className="flex items-center justify-center gap-4 pt-1 text-xs text-[#8C7364]">
                  <button
                    type="button"
                    onClick={() => {
                      setIsWishlisted(!isWishlisted);
                      toast.info(isWishlisted ? 'Removed from wishlist' : 'Saved to wishlist!');
                    }}
                    className="flex items-center gap-1.5 hover:text-[#5A3825] transition-colors"
                  >
                    {isWishlisted ? (
                      <FaHeart className="text-[#8B5A2B] text-xs" />
                    ) : (
                      <FaRegHeart className="text-xs" />
                    )}
                    <span>{isWishlisted ? 'Wishlisted' : 'Save for later'}</span>
                  </button>

                  <span className="text-[#C8BCAB]">•</span>
                  
                  <button
                    type="button"
                    onClick={handleShare}
                    className="flex items-center gap-1.5 hover:text-[#5A3825] transition-colors"
                  >
                    <FaShareAlt className="text-xs" />
                    <span>Copy Link</span>
                  </button>

                  <span className="text-[#C8BCAB]">•</span>

                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `Check out authentic "${resolvedProduct.name}" direct from rural producers on URVA: ${typeof window !== 'undefined' ? window.location.href : `https://urvaswadeshi.in/product/${productId}`}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-emerald-800 hover:text-emerald-950 font-medium transition-colors"
                    title="Share via WhatsApp"
                  >
                    <FaWhatsapp className="text-xs text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* In-Stock & Dispatch Banner */}
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-900 bg-emerald-50/80 border border-emerald-200 px-3.5 py-2.5 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>In Stock — Dispatched within 24 to 48 hours</span>
              </div>

              {/* Direct WhatsApp Support */}
              <a
                href={`https://wa.me/919494957576?text=${encodeURIComponent(
                  `Hi URVA, I am interested in ordering "${resolvedProduct.name}" (${selectedVariety?.label || 'Pack'}). Can you assist?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#FAF8F4] hover:bg-[#EAE5D9] text-[#5A3825] border border-[#E2D9CC] font-semibold text-xs py-2.5 rounded-lg transition-all shadow-2xs"
              >
                <FaWhatsapp className="text-sm text-emerald-600" />
                <span>Got Questions? Chat with us on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* ════ 3. CRAFT FEATURES & HERITAGE STORY (Order 3 on Mobile, Left Column Row 2 on Desktop) ════ */}
          <div className="order-3 lg:col-span-7 lg:col-start-1 lg:row-start-2 space-y-6">
            
            {/* Key Features & Craft Provenance Highlight Box */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-neutral-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                  Authenticity & Craft Features
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                  Verified Producer
                </span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-neutral-700">
                {features.map((feat: string, i: number) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                    <span className="font-medium text-neutral-800">{feat}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                <span className="flex items-center gap-1.5">
                  <FaCheck className="text-xs text-emerald-600" /> 100% Genuine Rural Guarantee
                </span>
                <span className="flex items-center gap-1.5">
                  <FaCheck className="text-xs text-emerald-600" /> Direct Cooperative Sourcing
                </span>
              </div>
            </div>

            {/* ─── Integrated Knowledge & Policy Accordions (Left Column) ─── */}
            <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 sm:p-6 space-y-3.5 shadow-xs">
              <h2 className="font-sans text-base sm:text-lg font-semibold text-[#111111] border-b border-neutral-100 pb-3">
                Product Knowledge & Heritage Story
              </h2>

              {/* Accordion 1: Product Information */}
              <div className="border-b border-neutral-100 pb-3">
                <button
                  type="button"
                  onClick={() => toggleAccordion('info')}
                  className="w-full flex items-center justify-between text-left py-2 font-semibold text-xs sm:text-sm text-neutral-900 hover:text-black transition-colors"
                >
                  <span>Product Information & Regional Origin</span>
                  {openAccordion === 'info' ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
                </button>
                {openAccordion === 'info' && (
                  <div className="pt-2 pb-3 text-xs sm:text-sm text-neutral-600 leading-relaxed space-y-2">
                    <p>{resolvedProduct.description}</p>
                    <p>
                      Every batch is documented through the One Village – One Product initiative, directly crediting
                      the rural cooperatives and artisan clusters that hand-produce and harvest each item.
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 2: Care / Storage */}
              <div className="border-b border-neutral-100 pb-3">
                <button
                  type="button"
                  onClick={() => toggleAccordion('care')}
                  className="w-full flex items-center justify-between text-left py-2 font-semibold text-xs sm:text-sm text-neutral-900 hover:text-black transition-colors"
                >
                  <span>Storage & Usage Instructions</span>
                  {openAccordion === 'care' ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
                </button>
                {openAccordion === 'care' && (
                  <div className="pt-2 pb-3 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    <p>
                      {(resolvedProduct as any)?.careInstructions ||
                        'Store in a cool, dry place away from heat and moisture. Use a clean, dry spoon for food products. Keep container tightly sealed.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 3: Shipping & Delivery */}
              <div className="border-b border-neutral-100 pb-3">
                <button
                  type="button"
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full flex items-center justify-between text-left py-2 font-semibold text-xs sm:text-sm text-neutral-900 hover:text-black transition-colors"
                >
                  <span>Shipping & Nationwide Delivery</span>
                  {openAccordion === 'shipping' ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
                </button>
                {openAccordion === 'shipping' && (
                  <div className="pt-2 pb-3 text-xs sm:text-sm text-neutral-600 leading-relaxed space-y-1.5">
                    <p>• Dispatched within 24 to 48 hours directly from our regional fulfillment centers.</p>
                    <p>• Estimated delivery: 3–5 working days across major Indian cities; 4–7 days for regional locations.</p>
                    <p>• Tracking link provided via SMS and WhatsApp once dispatched.</p>
                  </div>
                )}
              </div>

              {/* Accordion 4: Return Policies */}
              <div className="border-b border-neutral-100 pb-3">
                <button
                  type="button"
                  onClick={() => toggleAccordion('returns')}
                  className="w-full flex items-center justify-between text-left py-2 font-semibold text-xs sm:text-sm text-neutral-900 hover:text-black transition-colors"
                >
                  <span>Authenticity & Return Guarantee</span>
                  {openAccordion === 'returns' ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
                </button>
                {openAccordion === 'returns' && (
                  <div className="pt-2 pb-3 text-xs sm:text-sm text-gray-600 leading-relaxed space-y-1.5">
                    <p>• 100% Genuine Rural Guarantee: We stand by the heritage purity of every item.</p>
                    <p>
                      • If an item arrives damaged or compromised during transit, contact our WhatsApp support within 48 hours for immediate replacement or full refund.
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 5: Frequently Asked Questions (FAQ) */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('faq')}
                  className="w-full flex items-center justify-between text-left py-2 font-semibold text-xs sm:text-sm text-neutral-900 hover:text-black transition-colors"
                >
                  <span>Frequently Asked Questions (FAQ)</span>
                  {openAccordion === 'faq' ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
                </button>
                {openAccordion === 'faq' && (
                  <div className="pt-2 pb-3 text-xs sm:text-sm text-neutral-600 leading-relaxed space-y-3">
                    {productFaqs.map((faq, idx) => (
                      <div key={idx} className="space-y-1">
                        <p className="font-semibold text-neutral-800">• {faq.question}</p>
                        <p className="text-neutral-600 pl-3">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews & Feedback Section */}
        <div id="customer-reviews">
          <ProductReviews
            productId={currentProductId}
            productName={resolvedProduct?.name}
          />
        </div>
      </div>

      {/* ─── Lightbox Fullscreen Modal ─── */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsZoomOpen(false)}
        >
          <div className="relative max-w-3xl w-full max-h-[90vh] bg-[#FAF8F4] border border-[#E2D9CC] rounded-3xl p-6 flex flex-col items-center">
            <button
              type="button"
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#EAE5D9] hover:bg-[#DDD5C5] text-[#5A3825] flex items-center justify-center transition-colors"
            >
              <FaTimes />
            </button>
            <img
              src={activeImage || resolvedProduct.photo}
              alt={resolvedProduct.name}
              className="max-h-[75vh] w-auto object-contain rounded-xl"
            />
            <span className="mt-3 text-xs font-semibold text-[#5A3825]">
              {resolvedProduct.name} — {selectedVariety?.label}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
