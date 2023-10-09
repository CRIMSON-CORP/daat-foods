export const revalidateTimeout = 24 * 60 * 60; // a day
export const appCookieName = 'daat-foods-auth-token';
export const appUserLocalStorangeName = 'user';

export const adminDashboardNavLinks = [
    {
        url: '/admin/',
        iconPath: '/cart.svg',
        label: 'Orders',
        urlMatch: [undefined, 'order'],
    },
    {
        url: '/admin/products',
        iconPath: '/package.svg',
        label: 'Products',
        urlMatch: ['products'],
    },
    {
        url: '/admin/transactions',
        iconPath: '/credit-card.svg',
        label: 'Transaction',
        urlMatch: ['transactions'],
    },
];
