interface ProductItem {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity_in_stock: number;
    created_at: Date;
    updated_at?: Date;
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

interface Transaction {
    created_at: import('firebase/firestore').FieldValue | string;
    data: {
        paid_at: string;
        status: 'success' | 'failed';
        message: null;
        source: null;
        fees_split: null;
        requested_amount: number;
        fees: number;
        split: {};
        reference: string;
        created_at: string;
        id: number;
        customer: {
            last_name: string;
            international_format_phone: null;
            metadata: null;
            risk_action: 'default';
            email: string;
            id: number;
            phone: string;
            first_name: string;
            customer_code: string;
        };
        amount: number;
        subaccount: {};
        createdAt: string;
        plan_object: {};
        receipt_number: null;
        channel: 'card' | 'bank-account';
        authorization: {
            brand: 'visa' | 'mastercard';
            receiver_bank_account_number: null;
            last4: string;
            country_code: string;
            bin: string;
            exp_year: string;
            authorization_code: string;
            channel: 'card' | 'bank';
            reusable: boolean;
            exp_month: string;
            account_name: string | null;
            card_type: 'visa' | 'mastercard';
            receiver_bank: string | null;
            signature: string;
            bank: string;
        };
        domain: 'test';
        plan: null;
        currency: 'NGN';
        metadata: {
            user: User;
            cart: CartItem[];
        };
        pos_transaction_data: null;
        order_id: null;
        transaction_date: string;
        paidAt: string;
        ip_address: string;
        fees_breakdown: null;
        gateway_response: 'Successful';
    };
    status: boolean;
    message: 'Verification successful';
}
type OrderStatus = 'pending' | 'completed' | 'inprogress' | 'failed';

type FetchRequestStatus = 'idle' | 'loading' | 'success' | 'failed';
