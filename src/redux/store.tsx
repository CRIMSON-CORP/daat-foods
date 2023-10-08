import { configureStore } from '@reduxjs/toolkit';
import adminReducer from './admin/reducer';
import cartReducer from './cartReducer/reducer';
import uiReducer from './uiReducer/reducer';
import userReducer from './userReducer/reducer';

const store = configureStore({
    reducer: {
        cart: cartReducer,
        user: userReducer,
        admin: adminReducer,
        ui: uiReducer,
    },
});

store.getState;

export default store;
export type RootState = ReturnType<typeof store.getState>;
