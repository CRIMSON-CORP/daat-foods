import { createAction } from '@reduxjs/toolkit';

export const updateUserField = createAction(
    'user/update-field',
    (field: keyof User, value: string) => {
        return {
            payload: {
                field,
                value,
            },
        };
    },
);
