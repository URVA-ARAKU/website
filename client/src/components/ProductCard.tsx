import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, incrementCartItem, decrementCartItem } from '../redux/reducers/cart.reducer';
import { RootState } from '../redux/store';
import { Product } from '../types/api-types';
import { optimizeCloudinaryUrl } from '../utils/cloudinaryOptimize';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);

  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;

  let displayPrice = product.price;
  let priceLabel = '';

  if (hasVariants) {
    const prices = product.variants
      .map((v: any) => v.salePrice || v.price || 0)
      .filter((p: number) => p > 0);
    if (prices.length > 0) {
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      displayPrice = minPrice;
      priceLabel = minPrice !== maxPrice ? `₹ ${minPrice.toLocaleString()} – ₹ ${maxPrice.toLocaleString()}` : `₹ ${minPrice.toLocaleString()}`;
    }
  }

  const formattedPrice = priceLabel || `₹ ${displayPrice.toLocaleString()}`;
  const isOutOfStock = product.stock <= 0;
  const cartItem = cartItems.find((item) => item.productId === product._id);

  const handleAddToCart = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (isOutOfStock) return;

    if (hasVariants) {
      navigate(`/product/${product._id}`);
      return;
    }

    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        price: displayPrice,
        quantity: 1,
        stock: product.stock,
        photo: product.photo,
      })
    );
  };

  const handleIncrement = (event: React.MouseEvent) => {
    event.stopPropagation();
    dispatch(incrementCartItem(product._id));
  };

  const handleDecrement = (event: React.MouseEvent) => {
    event.stopPropagation();
    dispatch(decrementCartItem(product._id));
  };

  const handleGoToCart = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigate('/cart');
  };

  const getPhotoUrl = (photoUrl?: string) => {
    if (!photoUrl) return 'https://res.cloudinary.com/idi6k3ue/image/upload/v1791904965/urvaa/logo.png';
    return optimizeCloudinaryUrl(photoUrl, 400);
  };

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="bg-[#FAF8F4] rounded-2xl p-4 sm:p-5 border border-[#E2D9CC] hover:border-[#8B5A2B] hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full group relative cursor-pointer font-sans"
    >
      {/* Top Image Container */}
      <div className="relative bg-[#F4F1EA] rounded-xl flex items-center justify-center aspect-square mb-4 overflow-hidden group-hover:bg-[#EAE5D9] transition-colors border border-[#E2D9CC]/60">
        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-[#FAF8F4]/85 z-20 flex items-center justify-center rounded-xl">
            <span className="bg-[#EAE5D9] text-[#5A3825] text-[10px] sm:text-xs font-semibold px-3 py-1 rounded-full border border-[#E2D9CC]">
              Out of Stock
            </span>
          </div>
        )}

        <img
          src={getPhotoUrl(product.photo)}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Product Information Section */}
      <div className="flex flex-col flex-1">
        {/* Title + Price Row */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-sm sm:text-base font-semibold text-[#5A3825] leading-snug line-clamp-2 group-hover:text-[#8B5A2B] transition-colors flex-1">
            {product.name}
          </h3>
          <span className="text-sm sm:text-base font-semibold text-[#5A3825] whitespace-nowrap">
            {formattedPrice}
          </span>
        </div>

        {/* Short Subtitle / Description */}
        <p className="text-xs text-[#8C7364] font-normal leading-relaxed line-clamp-2 mb-4">
          {product.description || 'Authentic single-origin harvest, hand-crafted with traditional methods.'}
        </p>

        {/* Action Button & More Details */}
        <div className="mt-auto pt-2">
          {!hasVariants && cartItem ? (
            <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between bg-[#F4F1EA] border border-[#E2D9CC] rounded-lg px-3 py-1.5">
                <button
                  type="button"
                  onClick={handleDecrement}
                  className="w-6 h-6 rounded-md bg-[#FAF8F4] border border-[#E2D9CC] text-[#5A3825] font-bold flex items-center justify-center hover:bg-[#EAE5D9] transition-colors text-xs"
                >
                  −
                </button>
                <span className="text-xs font-semibold text-[#5A3825]">
                  {cartItem.quantity} in Cart
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  className="w-6 h-6 rounded-md bg-[#FAF8F4] border border-[#E2D9CC] text-[#5A3825] font-bold flex items-center justify-center hover:bg-[#EAE5D9] transition-colors text-xs"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={handleGoToCart}
                className="w-full bg-[#5A3825] hover:bg-[#3F2618] text-white font-medium text-xs py-2.5 rounded-lg uppercase tracking-wider transition-colors shadow-xs"
              >
                Go to Cart
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full font-medium text-xs py-3 rounded-lg transition-all flex items-center justify-center tracking-widest uppercase ${
                isOutOfStock
                  ? 'bg-[#EAE5D9] text-[#8C7364] cursor-not-allowed'
                  : 'bg-[#8B5A2B] hover:bg-[#5A3825] text-white shadow-xs'
              }`}
            >
              <span>
                {isOutOfStock
                  ? 'Out of Stock'
                  : hasVariants
                    ? 'Select Options'
                    : 'Add to Cart'}
              </span>
            </button>
          )}

          {/* Clean 'More details →' Link */}
          <div className="mt-3 text-center">
            <span className="inline-flex items-center gap-1 text-xs font-medium text-[#8B5A2B] group-hover:text-[#5A3825] group-hover:underline underline-offset-4 transition-colors">
              More details &rarr;
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
