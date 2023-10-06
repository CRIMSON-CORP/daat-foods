import { createReducer } from '@reduxjs/toolkit';
import { addAddress, addEmail, addName, addPhoneNumber } from './actions';

const initialState: User = {
    full_name: '',
    phone_number: '',
    email: '',
    address: '',
};
const userReducer = createReducer(initialState, (builder) => {
    builder.addCase(addName, (state, action) => {
        state.full_name = action.payload.name;
    });
    builder.addCase(addPhoneNumber, (state, action) => {
        state.phone_number = action.payload.phone_number;
    });
    builder.addCase(addEmail, (state, action) => {
        state.email = action.payload.email;
    });
    builder.addCase(addAddress, (state, action) => {
        state.address = action.payload.address;
    });
});

export default userReducer;
