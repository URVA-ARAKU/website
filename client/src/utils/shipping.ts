import { CartItem, StoreSettings } from '../types/api-types';

export const SHIPPING_CLASS_LEAF_PLATES = 'Leaf Plates';
export const SHIPPING_CLASS_STANDARD = 'Standard';

/**
 * Determines whether a product or cart item belongs to the 'Leaf Plates' shipping class.
 * High volumetric weight items are assigned to this class.
 */
export const isLeafPlateItem = (item?: {
  name?: string;
  category?: string;
  shippingClass?: string;
}): boolean => {
  if (!item) return false;
  if (item.shippingClass === SHIPPING_CLASS_LEAF_PLATES) return true;
  if (item.shippingClass === SHIPPING_CLASS_STANDARD) return false;

  const probe = `${item.name || ''} ${item.category || ''}`.toLowerCase();
  return (
    probe.includes('leaf plate') ||
    probe.includes('leaf plates') ||
    probe.includes('siali') ||
    probe.includes('modugu') ||
    probe.includes('areca') ||
    (probe.includes('leaf') && probe.includes('plate'))
  );
};

/**
 * Detects the number of individual leaf plates per pack/unit from product or variant title.
 * Examples:
 * - "Pack of 100" -> 100
 * - "Pack of 50" -> 50
 * - "Pack of 200" -> 200
 * - Default fallback -> 100
 */
export const getPlateCountPerUnit = (item?: { name?: string; category?: string }): number => {
  if (!item) return 100;
  const text = `${item.name || ''} ${item.category || ''}`.toLowerCase();

  // Try matching explicit "pack of <N>" or "<N> pack"
  const packMatch = text.match(/pack\s+of\s+(\d+)/i) || text.match(/(\d+)\s*pack/i);
  if (packMatch && packMatch[1]) {
    const val = parseInt(packMatch[1], 10);
    if (!isNaN(val) && val > 0) return val;
  }

  // Look for common plate quantities: 50, 100, 150, 200, 250, 300, 500, 1000
  const commonMatch = text.match(/\b(50|100|150|200|250|300|400|500|1000)\b/);
  if (commonMatch && commonMatch[1]) {
    const val = parseInt(commonMatch[1], 10);
    if (!isNaN(val) && val > 0) return val;
  }

  // Fallback: Default bundle is 100 plates
  return 100;
};

/**
 * Calculates total individual leaf plates in cart.
 */
export const getTotalLeafPlatesInCart = (items: CartItem[]): number => {
  if (!items || items.length === 0) return 0;
  return items.reduce((total, it) => {
    if (!isLeafPlateItem(it)) return total;
    const countPerUnit = getPlateCountPerUnit(it);
    const qty = Math.max(1, Number(it.quantity) || 1);
    return total + countPerUnit * qty;
  }, 0);
};

export interface OrderShippingCalculation {
  totalShipping: number;
  standardShipping: number;
  leafPlatesShipping: number;
  hasLeafPlates: boolean;
  hasStandardItems: boolean;
  isStandardFree: boolean;
  standardSubTotal: number;
  leafPlatesSubTotal: number;
  totalSubTotal: number;
  freeShippingThreshold: number;
  amountNeededForFreeStandardShipping: number;
  leafPlatesCount: number; // total pack units
  totalPlatesCount: number; // total individual plate count (e.g. 200, 400, 600)
  leafPlatesBasePlates: number; // threshold e.g. 200 plates
  leafPlatesBaseFee: number; // base fee e.g. ₹120
  leafPlatesIncrementFee: number; // incremental fee per 100 plates e.g. ₹60
  leafPlatesShippingType: 'tiered' | 'flat' | 'quantity';
}

/**
 * Calculates shipping charges for any cart.
 * Specifically handles the business requirement:
 * 1. 'Leaf Plates' shipping class is excluded from 'Free Shipping above ₹1000' rule.
 * 2. 'Leaf Plates' delivery scales dynamically with plate count:
 *    - Base fee (e.g. ₹120) covers up to 200 plates.
 *    - As plates increase beyond 200, courier charges increase proportionally (+₹60 per 100 plates).
 * 3. All other (standard) items get Free Shipping over ₹1000 as usual.
 */
export const calculateOrderShipping = (
  cartItems: CartItem[],
  settings?: Partial<StoreSettings>
): OrderShippingCalculation => {
  const freeShippingThreshold = settings?.freeShippingThreshold !== undefined
    ? Number(settings.freeShippingThreshold)
    : 999;

  const standardBaseFee = settings?.standardShippingFee !== undefined
    ? Number(settings.standardShippingFee)
    : 80;

  const leafPlatesBaseFee = settings?.leafPlatesBaseFee !== undefined
    ? Number(settings.leafPlatesBaseFee)
    : (settings?.leafPlatesShippingFee !== undefined ? Number(settings.leafPlatesShippingFee) : 120);

  const leafPlatesBasePlates = settings?.leafPlatesBasePlates !== undefined
    ? Number(settings.leafPlatesBasePlates)
    : 200;

  const leafPlatesIncrementPerPlates = settings?.leafPlatesIncrementPerPlates !== undefined
    ? Number(settings.leafPlatesIncrementPerPlates)
    : 100;

  const leafPlatesIncrementFee = settings?.leafPlatesIncrementFee !== undefined
    ? Number(settings.leafPlatesIncrementFee)
    : 60;

  const leafPlatesShippingType = settings?.leafPlatesShippingType === 'flat'
    ? 'flat'
    : settings?.leafPlatesShippingType === 'quantity'
    ? 'quantity'
    : 'tiered'; // Default to tiered volumetric scaling

  const leafPlatesFreeShippingExcluded = settings?.leafPlatesFreeShippingExcluded !== false;

  if (!cartItems || cartItems.length === 0) {
    return {
      totalShipping: 0,
      standardShipping: 0,
      leafPlatesShipping: 0,
      hasLeafPlates: false,
      hasStandardItems: false,
      isStandardFree: false,
      standardSubTotal: 0,
      leafPlatesSubTotal: 0,
      totalSubTotal: 0,
      freeShippingThreshold,
      amountNeededForFreeStandardShipping: 0,
      leafPlatesCount: 0,
      totalPlatesCount: 0,
      leafPlatesBasePlates,
      leafPlatesBaseFee,
      leafPlatesIncrementFee,
      leafPlatesShippingType,
    };
  }

  const standardItems: CartItem[] = [];
  const leafPlateItems: CartItem[] = [];

  for (const item of cartItems) {
    if (isLeafPlateItem(item)) {
      leafPlateItems.push(item);
    } else {
      standardItems.push(item);
    }
  }

  const standardSubTotal = standardItems.reduce(
    (acc, it) => acc + (Number(it.price) || 0) * (Number(it.quantity) || 1),
    0
  );

  const leafPlatesSubTotal = leafPlateItems.reduce(
    (acc, it) => acc + (Number(it.price) || 0) * (Number(it.quantity) || 1),
    0
  );

  const totalSubTotal = standardSubTotal + leafPlatesSubTotal;

  const hasStandardItems = standardItems.length > 0;
  const hasLeafPlates = leafPlateItems.length > 0;

  // 1. Standard Products Free Shipping logic (Threshold check)
  let standardShipping = 0;
  let isStandardFree = false;
  let amountNeededForFreeStandardShipping = 0;

  if (hasStandardItems) {
    if (standardSubTotal >= freeShippingThreshold) {
      standardShipping = 0;
      isStandardFree = true;
      amountNeededForFreeStandardShipping = 0;
    } else {
      standardShipping = standardBaseFee;
      isStandardFree = false;
      amountNeededForFreeStandardShipping = Math.max(0, freeShippingThreshold - standardSubTotal);
    }
  }

  // 2. Leaf Plates Dedicated Shipping logic (Excluded from free shipping rule due to volumetric weight)
  let leafPlatesShipping = 0;
  const leafPlatesCount = leafPlateItems.reduce(
    (acc, it) => acc + (Number(it.quantity) || 1),
    0
  );

  const totalPlatesCount = getTotalLeafPlatesInCart(leafPlateItems);

  if (hasLeafPlates) {
    if (leafPlatesFreeShippingExcluded) {
      if (leafPlatesShippingType === 'flat') {
        leafPlatesShipping = leafPlatesBaseFee;
      } else if (leafPlatesShippingType === 'quantity') {
        leafPlatesShipping = leafPlatesBaseFee * leafPlatesCount;
      } else {
        // TIERED VOLUMETRIC SCALING (Client request: ₹120 suitable for 200 plates, increases as plates increase)
        if (totalPlatesCount <= leafPlatesBasePlates) {
          leafPlatesShipping = leafPlatesBaseFee;
        } else {
          const extraPlates = totalPlatesCount - leafPlatesBasePlates;
          const extraSteps = Math.ceil(extraPlates / Math.max(1, leafPlatesIncrementPerPlates));
          leafPlatesShipping = leafPlatesBaseFee + extraSteps * leafPlatesIncrementFee;
        }
      }
    } else {
      // If store owner turned off exclusion, respects threshold
      if (totalSubTotal >= freeShippingThreshold) {
        leafPlatesShipping = 0;
      } else {
        leafPlatesShipping = leafPlatesBaseFee;
      }
    }
  }

  const totalShipping = standardShipping + leafPlatesShipping;

  return {
    totalShipping,
    standardShipping,
    leafPlatesShipping,
    hasLeafPlates,
    hasStandardItems,
    isStandardFree,
    standardSubTotal,
    leafPlatesSubTotal,
    totalSubTotal,
    freeShippingThreshold,
    amountNeededForFreeStandardShipping,
    leafPlatesCount,
    totalPlatesCount,
    leafPlatesBasePlates,
    leafPlatesBaseFee,
    leafPlatesIncrementFee,
    leafPlatesShippingType,
  };
};
