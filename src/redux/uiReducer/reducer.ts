import { createReducer } from '@reduxjs/toolkit';
import {
    closeDeleteProductkModal,
    closeRestockModal,
    openDeleteProductModal,
    openRestockModal,
} from './actions';

const initialState = {
    openRestockModal: false,
    productIdForRestock: '',
    openDeleteProductModal: false,
    productIdForDelete: '',
};

const uiReducer = createReducer(initialState, (builder) => {
    builder.addCase(openRestockModal, (state, action) => {
        state.openRestockModal = true;
        state.productIdForRestock = action.payload.product_id;
    });
    builder.addCase(closeRestockModal, (state) => {
        state.openRestockModal = false;
        state.productIdForRestock = '';
    });
    builder.addCase(openDeleteProductModal, (state, action) => {
        state.openDeleteProductModal = true;
        state.productIdForDelete = action.payload.product_id;
    });
    builder.addCase(closeDeleteProductkModal, (state) => {
        state.openDeleteProductModal = false;
        state.productIdForDelete = '';
    });
});

export default uiReducer;
