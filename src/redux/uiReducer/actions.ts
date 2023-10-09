import { createAction } from '@reduxjs/toolkit';

export const openRestockModal = createAction(
    'ui/open-restock-modal',
    (product_id: string) => {
        return {
            payload: {
                product_id: product_id,
            },
        };
    },
);

export const closeRestockModal = createAction('ui/close-restock-modal', () => {
    return {
        payload: {},
    };
});

export const openDeleteProductModal = createAction(
    'ui/open-delete-product-modal',
    (product_id: string) => {
        return {
            payload: {
                product_id: product_id,
            },
        };
    },
);

export const closeDeleteProductkModal = createAction(
    'ui/close-delete-product-modal',
    () => {
        return {
            payload: {},
        };
    },
);

export const openSideBar = createAction('ui/open-side-bar', () => {
    return {
        payload: {},
    };
});

export const closeSideBar = createAction('ui/close-side-bar', () => {
    return {
        payload: {},
    };
});
