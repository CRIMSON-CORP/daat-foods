import { createAction } from '@reduxjs/toolkit';

export const initializeAdmin = createAction('admin/initialize-admin', () => {
    return {
        payload: {},
    };
});

export const addAdminToState = createAction(
    'admin/add-admin-to-state',
    (admin: Admin) => {
        return {
            payload: admin,
        };
    },
);

export const removeAdminFromState = createAction(
    'admin/remove-admin-from-state',
    () => {
        return {
            payload: {},
        };
    },
);
