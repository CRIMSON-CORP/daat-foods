interface ProductItem {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity_in_stock: number;
    created_at: Date;
}

interface CartItem extends ProductItem {
    cart_item_id: string;
    sub_total: number;
    quantity: number;
}

interface User {
    full_name: string;
    phone_number: string;
    email: string;
    address: string;
}

interface Order {
    id?: string;
    user: User;
    cart: CartItem[];
    status: OrderStatus;
    created_at: import('firebase/firestore').FieldValue | string;
    total: number;
    transaction_reference: string;
}

interface Admin {
    id: string;
    email: string;
    name: string;
    image: string;
}

type OrderStatus = 'pending' | 'completed' | 'inprogress' | 'failed';

type FetchRequestStatus = 'idle' | 'loading' | 'success' | 'failed';
