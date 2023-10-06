import { createAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

export const addToCart = createAction(
    'cart/add-to-cart',
    (product: ProductItem) => {
        const cartItem: CartItem = {
            ...product,
            cart_item_id: nanoid(7),
            sub_total: product.price,
            quantity: 1,
        };
        return {
            payload: cartItem,
        };
    },
);

export const removeFromCart = createAction(
    'cart/remove-from-cart',
    (cart_item_id) => {
        return {
            payload: {
                cart_item_id,
            },
        };
    },
);
