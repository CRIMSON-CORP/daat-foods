import useToggle from '@/hooks/useToggle';
import {
    changeCartItemQuantity,
    decrementCartItemQuantity,
    incrementCartItemQuantity,
    removeFromCart,
} from '@/redux/cartReducer/actions';
import { RootState } from '@/redux/store';
import Image from 'next/image';
import React, { FC, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function CartView({ closeCartView }: { closeCartView: () => void }) {
    const cart = useSelector((state: RootState) => state.cart);
    const {
        state: checkoutModalOpen,
        open: openCheckoutModal,
        close: closeCheckoutModal,
    } = useToggle(true);

    const total = useMemo(() => {
        return cart.reduce((previousValue, currentValue) => {
            return previousValue + currentValue.sub_total;
        }, 0);
    }, [cart]);
    useEffect(() => {
        return () => {
            console.log('close');

            closeCheckoutModal();
        };
    }, [closeCheckoutModal]);
    return (
        <aside className="fixed top-0 left-0 h-screen bg-white text-slate-800 w-full py-16 overflow-auto">
            <button
                onClick={closeCartView}
                className="absolute top-5 right-5 invert-[0.5]"
            >
                <Image
                    src="/close.svg"
                    alt="close cart view"
                    width={52}
                    height={52}
                />
            </button>
            <div className="container flex items-stretch flex-col lg:flex-row gap-10">
                <div className="grow flex flex-col gap-10">
                    <header className="flex items-baseline justify-between font-semibold text-3xl py-6 border-b border-gray-200">
                        <h2>Shopping Cart</h2>
                        {cart.length > 0 && <span>{cart.length} Items</span>}
                    </header>
                    <div className="overflow-auto">
                        {cart.length === 0 ? (
                            <h3 className="text-center my-10 text-xl font-bold text-slate-800">
                                No Items currently in Cart
                            </h3>
                        ) : (
                            <table className="text-slate-700 border-spacing-5 border-separate min-w-max w-full">
                                <thead>
                                    <tr className="uppercase font-semibold text-sm ">
                                        <td>product details</td>
                                        <td>quantity</td>
                                        <td>price</td>
                                        <td>total</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.map((cartItem) => (
                                        <CartItem
                                            {...cartItem}
                                            key={cartItem.cart_item_id}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
                {cart.length > 0 && (
                    <CartSummary
                        total={total}
                        openCheckoutModal={openCheckoutModal}
                    />
                )}
                {checkoutModalOpen && (
                    <CheckoutModal
                        total={total}
                        closeCheckoutModal={closeCheckoutModal}
                    />
                )}
            </div>
        </aside>
    );
}

export default CartView;

const CartItem: FC<CartItem> = ({
    image,
    name,
    price,
    sub_total,
    cart_item_id,
    quantity_in_stock,
}) => {
    const dispatch = useDispatch();
    const cartItem = useSelector(
        (state: RootState) =>
            state.cart.find((item) => item.cart_item_id === cart_item_id)
                ?.quantity,
    );

    const incrementQuantity = () => {
        dispatch(incrementCartItemQuantity(cart_item_id));
    };

    const decrememntQuantity = () => {
        dispatch(decrementCartItemQuantity(cart_item_id));
    };

    const onQuantityChange: React.ChangeEventHandler<HTMLInputElement> = (
        e,
    ) => {
        dispatch(changeCartItemQuantity(cart_item_id, e.target.value));
    };

    const removeItemFromCart = () => {
        dispatch(removeFromCart(cart_item_id));
    };

    return (
        <tr>
            <td>
                <div className="flex items-start md:items-center flex-col md:flex-row gap-4">
                    <Image
                        src={image}
                        alt={name}
                        width={200}
                        height={200}
                        className="max-w-[150px] md:max-w-none object-cover object-center"
                    />
                    <div className="flex flex-col gap-2 lg:gap-5">
                        <p className="text-lg font-semibold text-slate-700">
                            {name}
                        </p>
                        <p>{quantity_in_stock} remaining</p>
                        <button
                            onClick={removeItemFromCart}
                            className="flex items-center gap-1 text-white text-sm rounded-md bg-red-500 p-2"
                        >
                            <Image
                                src="/delete-cart.svg"
                                alt="delete cart item"
                                width={16}
                                height={16}
                            />
                            <span>Remove Item</span>
                        </button>
                    </div>
                </div>
            </td>
            <td>
                <div className="flex flex-col md:flex-row items-stretch gap-4">
                    <button
                        onClick={decrememntQuantity}
                        className="p-2 rounded bg-gray-100 flex justify-center"
                    >
                        <Image
                            width={24}
                            height={24}
                            alt="minus"
                            src="/minus.svg"
                        />
                    </button>
                    <input
                        type="number"
                        value={cartItem}
                        onChange={onQuantityChange}
                        className="border border-slate-300 rounded px-2 py-1 text-center max-w-[60px] text-slate-700"
                    />
                    <button
                        onClick={incrementQuantity}
                        className="p-2 rounded bg-gray-100 flex justify-center"
                    >
                        <Image
                            width={24}
                            height={24}
                            alt="plus"
                            src="/plus.svg"
                        />
                    </button>
                </div>
            </td>
            <td className="font-semibold">
                <div className="flex">₦{price}</div>
            </td>
            <td className="font-semibold">
                <div className="flex">₦{sub_total}</div>
            </td>
        </tr>
    );
};

function CartSummary({
    total,
    openCheckoutModal,
}: {
    total: number;
    openCheckoutModal: () => void;
}) {
    const cart = useSelector((state: RootState) => state.cart);

    return (
        <section className="lg:max-w-xs">
            <div className="flex flex-col gap-10">
                <header className="py-6 border-b border-slate-200">
                    <h3 className="text-slate-700 text-3xl font-semibold">
                        Order Summary
                    </h3>
                </header>
                <div className="flex flex-col gap-8">
                    <div className="flex justify-between items-baseline font-semibold uppercase">
                        <span>Items ({cart.length})</span>
                        <span>₦{total}</span>
                    </div>
                    <p className="p-3 rounded bg-blue-100 text-blue-900 text-lg font-medium">
                        <Image
                            width={20}
                            height={24}
                            alt="info"
                            src="/info.svg"
                            className="hue-rotate-30"
                        />
                        Information on cost of delivery will be communicated to
                        you once we&apos;ve confirmed your order and ready to
                        make the delivery to your Door Step
                    </p>
                    <button
                        onClick={openCheckoutModal}
                        className="bg-primary-100 text-primary-800 font-semibold text-lg rounded-md px-7 py-4 clickable"
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </section>
    );
}

function CheckoutModal({
    total,
    closeCheckoutModal,
}: {
    total: number;
    closeCheckoutModal: () => void;
}) {
    const closeModalOnBackgroundClick = () => {
        closeCheckoutModal();
    };

    const preventOutsideClick: React.MouseEventHandler = (e) => {
        e.stopPropagation();
    };

    const checkout = () => {};

    return (
        <aside
            onClick={closeModalOnBackgroundClick}
            className="fixed inset-0 w-full h-screen flex items-center justify-center bg-black/30 backdrop-blur-sm p-5"
        >
            <div
                onClick={preventOutsideClick}
                className="relative w-full bg-white rounded-2xl max-w-3xl p-4 flex flex-col gap-10"
            >
                <button
                    onClick={closeCheckoutModal}
                    className="absolute top-5 right-5 invert-[0.5]"
                >
                    <Image
                        src="/close.svg"
                        alt="close cart view"
                        width={24}
                        height={24}
                    />
                </button>
                <header className="text-center text-xl font-semibold text-slate-600">
                    Checkout
                </header>
                <form className="flex flex-col gap-5">
                    <div className="flex items-center flex-col md:flex-row w-full gap-5">
                        <div className="flex flex-col gap-4 w-full">
                            <label htmlFor="full_name">
                                Full name{' '}
                                <span className="text-red-400">*</span>
                            </label>
                            <input
                                required
                                type="text"
                                name="full_name"
                                className="bg-slate-100 p-3 rounded-md border border-slate-200 w-full"
                            />
                        </div>
                        <div className="flex flex-col gap-4 w-full">
                            <label htmlFor="full_name">
                                Phone number{' '}
                                <span className="text-red-400">*</span>
                            </label>
                            <input
                                required
                                type="tel"
                                name="phone_number"
                                className="bg-slate-100 p-3 rounded-md border border-slate-200 w-full"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 w-full">
                        <label htmlFor="full_name">
                            Email Address{' '}
                            <span className="text-red-400">*</span>
                        </label>
                        <input
                            required
                            type="email"
                            name="email"
                            className="bg-slate-100 p-3 rounded-md border border-slate-200 w-full"
                        />
                    </div>
                    <div className="flex flex-col gap-4 w-full">
                        <label htmlFor="full_name">
                            Home Address <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            required
                            name="address"
                            className="bg-slate-100 p-3 rounded-md border border-slate-200 w-full min-h-[120px]"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="bg-primary-100 text-primary-800 font-semibold text-lg rounded-md px-7 py-4 clickable"
                    >
                        Proceed to pay ₦{total}
                    </button>
                </form>
            </div>
        </aside>
    );
}
