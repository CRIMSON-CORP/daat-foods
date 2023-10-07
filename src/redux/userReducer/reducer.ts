import { createReducer } from '@reduxjs/toolkit';
import { updateUserField } from './actions';

const initialState: User = {
    full_name: '',
    phone_number: '',
    email: '',
    address: '',
};
const userReducer = createReducer(initialState, (builder) => {
    builder.addCase(updateUserField, (state, action) => {
        state[action.payload.field] = action.payload.value;
    });
});

export default userReducer;
