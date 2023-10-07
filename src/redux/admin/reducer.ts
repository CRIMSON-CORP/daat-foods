import { createReducer } from '@reduxjs/toolkit';
import { addAdminToState } from './actions';

const initialState: Admin = {
    email: '',
    id: '',
    image: '',
    name: '',
};

const cartReducer = createReducer(initialState, (builder) => {
    builder.addCase(addAdminToState, (state, action) => {
        state = action.payload;
        return state;
    });
});

export default cartReducer;
