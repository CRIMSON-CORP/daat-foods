import { addToCart, removeFromCart } from '@/redux/cartReducer/actions';
import { RootState } from '@/redux/store';
import Image from 'next/image';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const ProductItem: FC<ProductItem> = (props) => {
    const { image, name, price, quantity_in_stock, id } = props;

    const outOfStock = quantity_in_stock <= 0;

    return (
        <article
            className={`max-w-xs flex flex-col gap-4 rounded-xl overflow-hidden bg-white shadow-sm ${
                outOfStock ? 'opacity-50' : 'opacity-100'
            }`}
        >
            <div className="relative">
                <div className="overflow-hidden aspect-[3/2.5]">
                    <Image
                        alt={name}
                        src={image}
                        width={320}
                        height={320}
                        className="w-full h-full object-cover object-center"
                    />
                </div>
                <AddToCartButton productId={id} props={props} />
            </div>
            <div className="flex flex-col gap-8 p-8">
                <h4 className="font-bold text-xl text-slate-800">{name}</h4>
                <div className="flex items-center justify-between gap-5 flex-wrap">
                    <p className="text-slate-500 font-medium">
                        {quantity_in_stock} remaining
                    </p>
                    <p className="text-slate-500 font-medium">
                        ₦{price.toLocaleString()}
                    </p>
                </div>
            </div>
        </article>
    );
};

export default ProductItem;

interface AddToCartButtonProps {
    productId: string;
    props: ProductItem;
}

function AddToCartButton({ productId, props }: AddToCartButtonProps) {
    const dispatch = useDispatch();
    const cartItem = useSelector((state: RootState) =>
        state.cart.find((cartItem) => cartItem.id === productId),
    );

    const { quantity_in_stock } = props;

    const existInCart = cartItem !== undefined;

    const outOfStock = quantity_in_stock <= 0;

    const addProductToCart = () => {
        dispatch(addToCart(props));
    };

    const removeProductFromCart = () => {
        dispatch(removeFromCart(cartItem?.cart_item_id));
    };

    if (existInCart) {
        return (
            <button
                disabled={outOfStock}
                onClick={removeProductFromCart}
                className="w-16 h-16 p-1 rounded-full flex justify-center items-center bg-red-500 absolute bottom-0 right-8 translate-y-1/2 shadow-xl"
            >
                <Image
                    width={32}
                    height={32}
                    src="/delete-cart.svg"
                    alt="your cart"
                    className=""
                />
            </button>
        );
    }
    return (
        <button
            disabled={outOfStock}
            onClick={addProductToCart}
            className="w-16 h-16 p-1 rounded-full flex justify-center items-center bg-white absolute bottom-0 right-8 translate-y-1/2 shadow-xl"
        >
            <Image
                width={32}
                height={32}
                src="/cart.svg"
                alt="your cart"
                className="invert-[0.5]"
            />
        </button>
    );
}
