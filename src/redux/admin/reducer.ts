import { appUserLocalStorangeName } from '@/config/app-config';
import { createReducer } from '@reduxjs/toolkit';
import {
    addAdminToState,
    initializeAdmin,
    removeAdminFromState,
} from './actions';

const initialState: Admin = {
    email: '',
    id: '',
    image: '',
    name: '',
};

const adminReducer = createReducer(initialState, (builder) => {
    builder.addCase(initializeAdmin, (state) => {
        let newState = initialState;
        if (typeof window !== 'undefined') {
            let lsStorage = localStorage.getItem(appUserLocalStorangeName);
            if (lsStorage !== null) {
                newState = JSON.parse(lsStorage as string) as Admin;
            }
        }

        return newState;
    });
    builder.addCase(addAdminToState, (state, action) => {
        state = action.payload;
        localStorage.setItem(appUserLocalStorangeName, JSON.stringify(state));
        return state;
    });
    builder.addCase(removeAdminFromState, () => {
        localStorage.removeItem(appUserLocalStorangeName);
        return initialState;
    });
});

export default adminReducer;
