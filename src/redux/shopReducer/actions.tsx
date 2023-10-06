import { createAction } from '@reduxjs/toolkit';

const getProducts = createAction('shop/getProducts', () => {
    return {
        payload: {},
    };
});

const createOrder = createAction('shop/createOrder', () => {
    return {
        payload: {},
    };
});
