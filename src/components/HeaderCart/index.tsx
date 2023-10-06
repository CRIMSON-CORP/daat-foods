import { RootState } from '@/redux/store';
import Image from 'next/image';
import { useSelector } from 'react-redux';

function HeaderCart({ openCartView }: { openCartView: () => void }) {
    const cartLength = useSelector((state: RootState) => state.cart.length);
    return (
        <button
            onClick={openCartView}
            className="relative w-12 h-12 rounded-full flex justify-center border border-white/10 items-center bg-white/25 backdrop-blur-lg"
        >
            <Image width={24} height={24} src="/cart.svg" alt="your cart" />
            {cartLength > 0 && (
                <span className="absolute top-0 right-0 leading-none w-5 h-5 translate-x-1/4 -translate-y-1/4 aspect-square rounded-full flex justify-center items-center text-white p-1 bg-red-400">
                    {cartLength}
                </span>
            )}
        </button>
    );
}

export default HeaderCart;
