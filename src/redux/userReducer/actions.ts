import { createAction } from '@reduxjs/toolkit';

export const addName = createAction('user/add-name', (name: string) => {
    return {
        payload: {
            name,
        },
    };
});

export const addPhoneNumber = createAction(
    'user/add-phone-number',
    (phone_number: string) => {
        return {
            payload: {
                phone_number,
            },
        };
    },
);

export const addEmail = createAction('user/add-Email', (email: string) => {
    return {
        payload: {
            email,
        },
    };
});

export const addAddress = createAction('user/add-address', (address) => {
    return {
        payload: {
            address,
        },
    };
});
