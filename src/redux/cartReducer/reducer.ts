import { createReducer } from '@reduxjs/toolkit';
import {
    addToCart,
    changeCartItemQuantity,
    decrementCartItemQuantity,
    incrementCartItemQuantity,
    removeFromCart,
} from './actions';

const initialState: CartItem[] = [];

const cartReducer = createReducer(initialState, (builder) => {
    builder.addCase(addToCart, (state, action) => {
        state.push(action.payload);
        return state;
    });
    builder.addCase(removeFromCart, (state, action) => {
        return state.filter(
            (cart_item) =>
                cart_item.cart_item_id !== action.payload.cart_item_id,
        );
    });
    builder.addCase(incrementCartItemQuantity, (state, action) => {
        state.map((cartItem) => {
            if (cartItem.quantity >= cartItem.quantity_in_stock)
                return cartItem;
            if (cartItem.cart_item_id === action.payload.cart_item_id) {
                cartItem.quantity++;
                cartItem.sub_total = cartItem.quantity * cartItem.price;
                return cartItem;
            } else {
                return cartItem;
            }
        });
    });
    builder.addCase(decrementCartItemQuantity, (state, action) => {
        state.map((cartItem) => {
            if (cartItem.quantity <= 1) return cartItem;
            if (cartItem.cart_item_id === action.payload.cart_item_id) {
                cartItem.quantity--;
                cartItem.sub_total = cartItem.quantity * cartItem.price;
                return cartItem;
            } else {
                return cartItem;
            }
        });
    });
    builder.addCase(changeCartItemQuantity, (state, action) => {
        state.map((cartItem) => {
            if (
                action.payload.count <= 0 ||
                action.payload.count >= cartItem.quantity_in_stock
            )
                return cartItem;
            if (cartItem.cart_item_id === action.payload.cart_item_id) {
                cartItem.quantity = parseInt(action.payload.count);
                cartItem.sub_total = cartItem.quantity * cartItem.price;
                return cartItem;
            } else {
                return cartItem;
            }
        });
    });
});

export default cartReducer;
