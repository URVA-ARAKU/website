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
  leafPlatesCount: number;
  leafPlatesFeePerUnit: number;
  leafPlatesShippingType: 'flat' | 'quantity';
}

/**
 * Calculates shipping charges for any cart.
 * Specifically handles the business requirement:
 * 1. 'Leaf Plates' shipping class is excluded from 'Free Shipping above ₹1000' rule.
 * 2. 'Leaf Plates' has its own separate shipping fee (Flat or quantity-based).
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

  const leafPlatesFee = settings?.leafPlatesShippingFee !== undefined
    ? Number(settings.leafPlatesShippingFee)
    : 120;

  const leafPlatesShippingType = settings?.leafPlatesShippingType === 'quantity'
    ? 'quantity'
    : 'flat';

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
      leafPlatesFeePerUnit: leafPlatesFee,
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

  if (hasLeafPlates) {
    if (leafPlatesFreeShippingExcluded) {
      if (leafPlatesShippingType === 'quantity') {
        leafPlatesShipping = leafPlatesFee * leafPlatesCount;
      } else {
        leafPlatesShipping = leafPlatesFee;
      }
    } else {
      // If store owner turns off exclusion, respects threshold
      if (totalSubTotal >= freeShippingThreshold) {
        leafPlatesShipping = 0;
      } else {
        leafPlatesShipping = leafPlatesFee;
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
    leafPlatesFeePerUnit: leafPlatesFee,
    leafPlatesShippingType,
  };
};

