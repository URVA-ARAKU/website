import React from 'react';
import { WeightVariant } from '../../utils/weightVariants';

type Props = {
  variants: WeightVariant[];
  selectedVariantId?: string;
  onSelect: (id: string) => void;
};

const VariantSelector: React.FC<Props> = ({ variants, selectedVariantId, onSelect }) => {
  if (!variants || variants.length === 0) return null;

  return (
    <div className="my-4 bg-[#F4F1EA] p-4 rounded-2xl border border-[#E2D9CC] space-y-2.5 font-sans">
      <label className="block text-xs font-semibold text-[#5A3825] uppercase tracking-wider">
        Select Pack Quantity / Weight:
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {variants.map((variant) => {
          const isVariantOutOfStock = variant.inStock === false;
          const isSelected = selectedVariantId === variant.id;
          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => !isVariantOutOfStock && onSelect(variant.id)}
              disabled={isVariantOutOfStock}
              aria-pressed={isSelected}
              className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-0.5 relative cursor-pointer ${
                isVariantOutOfStock
                  ? 'border-[#E2D9CC] bg-[#F4F1EA] cursor-not-allowed opacity-50 text-[#5A3825]/40'
                  : isSelected
                    ? 'border-2 border-[#5A3825] bg-[#5A3825] text-[#FAF8F4] shadow-xs'
                    : 'border-[#E2D9CC] bg-[#FAF8F4] text-[#5A3825] hover:border-[#8B5A2B]'
              }`}
            >
              <div className="flex flex-col items-center">
                <span className={`text-xs font-semibold ${isVariantOutOfStock ? 'text-[#5A3825]/40' : isSelected ? 'text-[#FAF8F4]' : 'text-[#5A3825]'}`}>
                  {variant.name || variant.label || variant.pack}
                </span>

                {isVariantOutOfStock ? (
                  <span className="text-[9px] font-medium text-[#5A3825]/50 mt-1">Out of Stock</span>
                ) : (
                  <>
                    <span className={`text-base font-bold mt-0.5 ${isSelected ? 'text-[#FAF8F4]' : 'text-[#5A3825]'}`}>₹{variant.salePrice ?? variant.price ?? 0}</span>
                    {variant.mrp > (variant.salePrice ?? variant.price ?? 0) && (
                      <span className={`text-[10px] line-through ${isSelected ? 'text-[#FAF8F4]/70' : 'text-[#8B5A2B]'}`}>
                        MRP ₹{variant.mrp}
                      </span>
                    )}
                    {variant.bulkPrice && (
                      <span className={`text-[10px] mt-0.5 block ${isSelected ? 'text-[#FAF8F4]/80' : 'text-[#8B5A2B]'}`}>
                        Bulk: ₹{variant.bulkPrice} (MOQ {variant.bulkMOQ ?? '—'})
                      </span>
                    )}
                    {variant.pack && (
                      <span className={`text-[10px] mt-0.5 block ${isSelected ? 'text-[#FAF8F4]/80' : 'text-[#8B5A2B]'}`}>
                        {variant.pack}
                      </span>
                    )}
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VariantSelector;
