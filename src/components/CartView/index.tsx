import useToggle from '@/hooks/useToggle';
import { RootState } from '@/redux/store';
import Image from 'next/image';
import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';
import { CheckoutModal } from './CheckoutModal';

function CartView({ closeCartView }: { closeCartView: () => void }) {
    const cart = useSelector((state: RootState) => state.cart);

    const {
        state: checkoutModalOpen,
        open: openCheckoutModal,
        close: closeCheckoutModal,
    } = useToggle();

    const total = useMemo(() => {
        return cart.reduce((previousValue, currentValue) => {
            return previousValue + currentValue.sub_total;
        }, 0);
    }, [cart]);

    useEffect(() => {
        return closeCheckoutModal;
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
                        closeCartView={closeCartView}
                        closeCheckoutModal={closeCheckoutModal}
                    />
                )}
            </div>
        </aside>
    );
}

export default CartView;
