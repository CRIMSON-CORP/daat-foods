import { createReducer } from '@reduxjs/toolkit';
import { addToCart, removeFromCart } from './actions';

const initialState: CartItem[] = [];

const cartReducer = createReducer(initialState, (builder) => {
    builder.addCase(addToCart, (state, action) => {
        state.push(action.payload);
    });
    builder.addCase(removeFromCart, (state, action) => {
        console.log(action.payload);

        return state.filter(
            (cart_item) =>
                cart_item.cart_item_id !== action.payload.cart_item_id,
        );
    });
});

export default cartReducer;
