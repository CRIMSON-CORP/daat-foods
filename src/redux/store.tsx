import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartReducer/reducer';
import userReducer from './userReducer/reducer';

const store = configureStore({
    reducer: {
        cart: cartReducer,
        user: userReducer,
    },
});

store.getState;

export default store;
export type RootState = ReturnType<typeof store.getState>;
