export const revalidateTimeout = 24 * 60 * 60; // a day
export const appCookieName = 'daat-foods-auth-token';
export const appUserLocalStorangeName = 'user';

export const adminDashboardNavLinks = [
    {
        url: '/admin',
        iconPath: '/cart.svg',
        label: 'Orders',
    },
    {
        url: '/admin/products',
        iconPath: '/package.svg',
        label: 'Products',
    },
];
