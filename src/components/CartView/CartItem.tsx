import {
    changeCartItemQuantity,
    decrementCartItemQuantity,
    incrementCartItemQuantity,
    removeFromCart,
} from '@/redux/cartReducer/actions';
import { RootState } from '@/redux/store';
import Image from 'next/image';
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const CartItem: FC<CartItem> = ({
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
                        className="max-h-[150px] md:max-w-none object-cover object-center"
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
