import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addToCart, incrementCartItem, decrementCartItem } from '../redux/reducers/cart.reducer';
import { RootState } from '../redux/store';
import { Product } from '../types/api-types';
import { optimizeCloudinaryUrl } from '../utils/cloudinaryOptimize';

interface ProductCardProps {
  product: Product;
  showDescription?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showDescription = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);

  // Parse variants configured in Admin Dashboard
  const rawVariants = Array.isArray(product.variants) ? product.variants : [];
  const hasVariants = rawVariants.length > 0;

  // Selected variant state
  const [selectedVariantId, setSelectedVariantId] = useState<string>(() => {
    if (hasVariants) {
      return rawVariants[0].id || rawVariants[0].name || rawVariants[0].label || '0';
    }
    return '';
  });

  // Current active variant
  const selectedVariant = hasVariants
    ? rawVariants.find(
        (v: any, idx: number) =>
          (v.id || v.name || v.label || idx.toString()) === selectedVariantId
      ) || rawVariants[0]
    : null;

  // Pricing calculations
  const currentPrice = selectedVariant
    ? Number(selectedVariant.salePrice || selectedVariant.price || product.price || 0)
    : Number(product.price || 0);

  const currentMrp = selectedVariant
    ? Number(selectedVariant.mrp || 0)
    : Number((product as any).mrp || 0);

  const hasDiscount = currentMrp > currentPrice;
  const discountPercent = hasDiscount
    ? Math.round(((currentMrp - currentPrice) / currentMrp) * 100)
    : 0;

  // Stock calculations
  const currentStock = selectedVariant
    ? Number(selectedVariant.stock ?? product.stock ?? 50)
    : Number(product.stock ?? 50);

  const isOutOfStock = selectedVariant
    ? selectedVariant.inStock === false || currentStock <= 0
    : product.stock <= 0;

  // Cart operations
  const activeCartItemId = hasVariants && selectedVariant
    ? `${product._id}_${selectedVariant.id || selectedVariant.name || selectedVariant.label}`
    : product._id;

  const cartItem = cartItems.find((item) => item.productId === activeCartItemId);

  const handleAddToCart = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (isOutOfStock) return;

    const variantLabel = hasVariants && selectedVariant
      ? ` (${selectedVariant.name || selectedVariant.label || selectedVariant.pack || 'Standard'})`
      : '';

    dispatch(
      addToCart({
        productId: activeCartItemId,
        name: `${product.name}${variantLabel}`,
        price: currentPrice,
        quantity: 1,
        stock: currentStock,
        photo: selectedVariant?.photo || product.photo,
      })
    );

    toast.success(`Added ${product.name}${variantLabel} to cart!`, {
      position: 'bottom-center',
      autoClose: 1800,
    });
  };

  const handleIncrement = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (cartItem && cartItem.quantity < currentStock) {
      dispatch(incrementCartItem(cartItem.productId));
    }
  };

  const handleDecrement = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (cartItem) {
      dispatch(decrementCartItem(cartItem.productId));
    }
  };

  const handleGoToCart = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigate('/cart');
  };

  const getPhotoUrl = (photoUrl?: string) => {
    if (!photoUrl) return 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791904965/urvaa/logo.png';
    return optimizeCloudinaryUrl(photoUrl, 1024);
  };

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="bg-[#FAF8F4] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full group relative cursor-pointer font-sans border-0"
    >
      {/* Top Image Container — 1:1 aspect-square matching 1024x1024 images */}
      <div className="relative bg-[#F4F1EA] aspect-square w-full overflow-hidden">
        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-2.5 left-2.5 z-10 bg-[#E5A93C] text-[#2C1810] font-bold text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md shadow-xs tracking-tight">
            {discountPercent}% OFF
          </span>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-[#FAF8F4]/85 z-20 flex items-center justify-center">
            <span className="bg-[#EAE5D9] text-[#5A3825] text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full border border-[#E2D9CC]">
              Out of Stock
            </span>
          </div>
        )}

        <img
          src={getPhotoUrl(selectedVariant?.photo || product.photo)}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-95"
        />
      </div>

      {/* Product Information Section */}
      <div className="flex flex-col flex-1 p-3.5 sm:p-4.5">
        {/* Product Title */}
        <h3 className="text-xs sm:text-sm md:text-base font-semibold text-[#5A3825] leading-snug line-clamp-2 group-hover:text-[#8B5A2B] transition-colors mb-1.5 min-h-[2.1rem] sm:min-h-[2.6rem]">
          {product.name}
        </h3>

        {/* Price row with strike-through MRP */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-sm sm:text-base md:text-lg font-bold text-[#5A3825]">
            ₹ {currentPrice.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-xs sm:text-sm text-neutral-400 line-through font-normal">
              ₹ {currentMrp.toLocaleString()}
            </span>
          )}
        </div>

        {/* Short Subtitle / Description (hidden by default on product cards/homepage) */}
        {showDescription && (
          <p className="text-[11px] sm:text-xs text-[#8C7364] font-normal leading-relaxed line-clamp-2 mb-3">
            {product.description || 'Authentic single-origin harvest, hand-crafted with traditional methods.'}
          </p>
        )}

        {/* Quantity / Variant Dropdown Selector (only when product has packs/variants) */}
        {hasVariants && (
          <div className="relative my-2" onClick={(e) => e.stopPropagation()}>
            <select
              value={selectedVariantId}
              onChange={(e) => setSelectedVariantId(e.target.value)}
              className="w-full bg-white border border-neutral-300 hover:border-[#5A3825] text-neutral-800 font-medium text-xs sm:text-sm rounded-full px-3.5 py-1.5 pr-8 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#5A3825] transition-all shadow-2xs"
            >
              {rawVariants.map((v: any, index: number) => {
                const vId = v.id || v.name || v.label || index.toString();
                const vLabel = v.name || v.label || v.pack || `Option ${index + 1}`;
                return (
                  <option key={vId} value={vId} className="text-neutral-800 py-1">
                    {vLabel}
                  </option>
                );
              })}
            </select>
            <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-neutral-600 text-[10px]">
              ▼
            </div>
          </div>
        )}

        {/* Action Button: Direct Add to Cart or Quantity Controls */}
        <div className="mt-auto pt-2">
          {cartItem ? (
            <div className="flex flex-col gap-1.5" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between bg-white border border-[#D5C9B8] rounded-full px-3 py-1 shadow-2xs">
                <button
                  type="button"
                  onClick={handleDecrement}
                  className="w-6 h-6 rounded-full bg-[#FAF8F4] border border-[#E2D9CC] text-[#5A3825] font-bold flex items-center justify-center hover:bg-[#EAE5D9] transition-colors text-xs"
                >
                  −
                </button>
                <span className="text-xs font-semibold text-[#5A3825]">
                  {cartItem.quantity} in Cart
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  className="w-6 h-6 rounded-full bg-[#FAF8F4] border border-[#E2D9CC] text-[#5A3825] font-bold flex items-center justify-center hover:bg-[#EAE5D9] transition-colors text-xs"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={handleGoToCart}
                className="w-full bg-[#5A3825] hover:bg-[#3F2618] text-white font-medium text-xs py-1.5 rounded-full uppercase tracking-wider transition-colors shadow-2xs text-center"
              >
                Go to Cart &rarr;
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full font-semibold text-xs sm:text-sm py-2.5 px-3 rounded-full transition-all flex items-center justify-center tracking-wide active:scale-[0.99] ${
                isOutOfStock
                  ? 'bg-[#EAE5D9] text-[#8C7364] cursor-not-allowed'
                  : 'bg-[#8B5A2B] hover:bg-[#5A3825] text-white shadow-xs'
              }`}
            >
              <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
