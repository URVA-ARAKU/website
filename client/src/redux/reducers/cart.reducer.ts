import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CartReducerIntialState, CartItem, ShippingInfo } from "../../types/api-types";

const getInitialCartItems = (): CartItem[] => {
    try {
        const item = localStorage.getItem('cartItems');
        return item ? JSON.parse(item) : [];
    } catch {
        return [];
    }
};

const getInitialShippingInfo = (): ShippingInfo => {
    try {
        const info = localStorage.getItem('shippingInfo');
        if (info) return JSON.parse(info);
    } catch {}
    return {
        name: '',
        email: '',
        address: '',
        city: 'Hyderabad',
        state: 'Telangana',
        country: 'India',
        pinCode: '',
        phone: '',
        landmark: '',
        latitude: undefined,
        longitude: undefined,
        deliveryType: 'current_location'
    };
};

const initialCartItems = getInitialCartItems();
const initialSubTotal = initialCartItems.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
);
const initialShipping = initialCartItems.length > 0 ? 80 : 0;

const initialState: CartReducerIntialState = {
    loading: false,
    cartItems: initialCartItems,
    subTotal: initialSubTotal,
    tax: 0,
    shippingCharges: initialShipping,
    discount: 0,
    total: Math.max(0, initialSubTotal + initialShipping),
    shippingInfo: getInitialShippingInfo()
};

const updateCartTotals = (state: CartReducerIntialState) => {
    const subTotal = state.cartItems.reduce(
        (acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 1),
        0
    );
    state.subTotal = subTotal;
    state.shippingCharges = state.cartItems.length > 0 ? 80 : 0; // Flat ₹80 shipping charges for AP & Telangana
    state.tax = 0;
    if (state.discount > subTotal) {
        state.discount = subTotal;
    }
    state.total = Math.max(0, subTotal + state.shippingCharges - (state.discount || 0));
};

const saveToLocalStorage = (state: CartReducerIntialState) => {
    localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    localStorage.setItem('shippingInfo', JSON.stringify(state.shippingInfo));
};

export const cartReducer = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            state.loading = true;

            const index = state.cartItems.findIndex(item => item.productId === action.payload.productId);

            if (index !== -1) {
                // If the item already exists in the cart, increment its quantity
                // Limit the quantity to the stock available
                state.cartItems[index].quantity = Math.min(
                    state.cartItems[index].quantity + action.payload.quantity,
                    action.payload.stock
                );
            } else {
                // If the item doesn't exist in the cart, add it
                state.cartItems.push(action.payload);
            }

            updateCartTotals(state);
            state.loading = false;
            saveToLocalStorage(state); // Save to localStorage
        },
        removeCartItem: (state, action: PayloadAction<string>) => {
            state.loading = true;
            state.cartItems = state.cartItems.filter(item => item.productId !== action.payload);
            updateCartTotals(state);
            state.loading = false;
            saveToLocalStorage(state); // Save to localStorage
        },
        incrementCartItem: (state, action: PayloadAction<string>) => {
            const item = state.cartItems.find(item => item.productId === action.payload);
            if (item && item.quantity < item.stock) {
                item.quantity += 1;
                updateCartTotals(state);
                saveToLocalStorage(state); // Save to localStorage
            }
        },
        decrementCartItem: (state, action: PayloadAction<string>) => {
            const item = state.cartItems.find(item => item.productId === action.payload);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
                updateCartTotals(state);
                saveToLocalStorage(state); // Save to localStorage
            } else if (item && item.quantity === 1) {
                state.cartItems = state.cartItems.filter(item => item.productId !== action.payload);
                updateCartTotals(state);
                saveToLocalStorage(state); // Save to localStorage
            }
        },
        calculatePrice: (state) => {
            updateCartTotals(state);
        },
        discountApplied: (state, action: PayloadAction<number>) => {
            state.discount = Number(action.payload) || 0;
            updateCartTotals(state);
            saveToLocalStorage(state); // Save to localStorage
        },
        saveShippingInfo: (state, action: PayloadAction<ShippingInfo>) => {
            state.shippingInfo = action.payload;
            saveToLocalStorage(state); // Save to localStorage
        },
        resetCart: (state) => {
            localStorage.removeItem('cartItems');
            localStorage.removeItem('shippingInfo');
            state.cartItems = [];
            state.subTotal = 0;
            state.tax = 0;
            state.shippingCharges = 0;
            state.discount = 0;
            state.total = 0;
        }
    }
});

export const { addToCart, removeCartItem, incrementCartItem, decrementCartItem, calculatePrice, discountApplied, resetCart, saveShippingInfo } = cartReducer.actions;
export default cartReducer.reducer;
