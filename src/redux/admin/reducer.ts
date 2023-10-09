import { appUserLocalStorangeName } from '@/config/app-config';
import { createReducer } from '@reduxjs/toolkit';
import { addAdminToState, removeAdminFromState } from './actions';

let initialState: Admin = {
    email: '',
    id: '',
    image: '',
    name: '',
};

if (typeof window !== 'undefined') {
    if (localStorage.getItem(appUserLocalStorangeName) !== null) {
        initialState = JSON.parse(
            localStorage.getItem(appUserLocalStorangeName) as string,
        ) as Admin;
    }
}

const adminReducer = createReducer(initialState, (builder) => {
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
