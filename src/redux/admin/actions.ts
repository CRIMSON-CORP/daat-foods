import { createAction } from '@reduxjs/toolkit';

export const addAdminToState = createAction(
    'admin/add-admin-to-state',
    (admin: Admin) => {
        return {
            payload: admin,
        };
    },
);
