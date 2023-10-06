import Image from 'next/image';
import { FC } from 'react';

interface ProductItemProps {
    image: string;
    name: string;
    price: number;
    amountInStock: number;
}

const ProductItem: FC<ProductItemProps> = ({
    image,
    name,
    price,
    amountInStock,
}) => {
    return (
        <article className="max-w-xs flex flex-col gap-4 rounded-xl overflow-hidden bg-white shadow-sm">
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
                <button className="w-16 h-16 p-1 rounded-full flex justify-center items-center bg-white absolute bottom-0 right-8 translate-y-1/2 shadow-xl">
                    <Image
                        width={32}
                        height={32}
                        src="/cart.svg"
                        alt="your cart"
                        className="invert-[0.2]"
                    />
                </button>
            </div>
            <div className="flex flex-col gap-8 p-8">
                <h4 className="font-bold text-xl text-slate-800">{name}</h4>
                <div className="flex items-center justify-between gap-5 flex-wrap">
                    <p className="text-slate-500 font-medium">
                        {amountInStock} remaining
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
