import { RootState } from '@/redux/store';
import Image from 'next/image';
import { useSelector } from 'react-redux';

export function CartSummary({
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
