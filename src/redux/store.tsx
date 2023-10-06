import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartReducer/reducer';

const store = configureStore({
    reducer: {
        cart: cartReducer,
    },
});

store.getState;

export default store;
export type RootState = ReturnType<typeof store.getState>;
