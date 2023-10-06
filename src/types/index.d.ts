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
