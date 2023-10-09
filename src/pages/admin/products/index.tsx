import DashboardLayout from '@/layouts/DashboardLayout';
import axios from '@/lib/axios';
import { RootState } from '@/redux/store';
import {
    closeDeleteProductkModal,
    closeRestockModal,
    openDeleteProductModal,
    openRestockModal,
} from '@/redux/uiReducer/actions';
import { getProducts } from '@/service/firebase';
import ProtectDashboard from '@/utils/protect-route';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function Products({ products }: { products: ProductItem[] }) {
    return (
        <div className="py-10 text-slate-600 flex flex-col gap-10">
            <header className="flex items-start md:items-center flex-col md:flex-row justify-between">
                <h1 className="text-3xl font-bold text-slate-600">
                    <span>Products</span>
                </h1>
                <Link
                    href="products/new"
                    className="bg-primary-100 text-primary-800 font-semibold text-sm rounded-md px-3 py-2 flex items-center gap-1 clickable"
                >
                    <Image width={24} height={24} alt="plus" src="/plus.svg" />{' '}
                    <span>Add new Product</span>
                </Link>
            </header>
            <section className="grid grid-cols-[repeat(auto-fit,minmax(200px,300px))] gap-5">
                {products.map((product) => (
                    <ProductItem key={product.id} {...product} />
                ))}
            </section>
            <RestockModal />
            <DeleteModal />
        </div>
    );
}

Products.getLayout = (page: React.ReactElement, pageProps: any) => (
    <DashboardLayout>{page}</DashboardLayout>
);

export const getServerSideProps: GetServerSideProps = ProtectDashboard(
    async (ctx: GetServerSidePropsContext) => {
        const products = await getProducts();
        return {
            props: {
                products,
            },
        };
    },
);

export default Products;

const ProductItem: FC<ProductItem> = ({
    id,
    image,
    name,
    price,
    quantity_in_stock,
}) => {
    const dispatch = useDispatch();

    const restock = () => {
        dispatch(openRestockModal(id));
    };

    const deleteProduct = () => {
        dispatch(openDeleteProductModal(id));
    };

    return (
        <article className="bg-white/80 p-3 rounded-lg flex flex-col gap-5">
            <Image
                src={image}
                alt={name}
                width={3000}
                height={300}
                className="rounded-lg aspect-square object-cover object-center"
            />
            <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                    <span className="text-slate-500">Name</span>
                    <span className="text-slate-700 font-bold text-xl">
                        {name}
                    </span>
                </div>
                <div className="flex flex-col">
                    <span className="text-slate-500">Price</span>
                    <span className="text-slate-700 font-bold text-xl">
                        {price}
                    </span>
                </div>
                <div className="flex flex-col">
                    <span className="text-slate-500">Quantity in Stock</span>
                    {quantity_in_stock === 0 ? (
                        <span className="text-red-600 font-bold text-xl">
                            Out of Stock
                        </span>
                    ) : (
                        <span className="text-slate-700 font-bold text-xl">
                            {quantity_in_stock}
                        </span>
                    )}
                </div>
                <div className="flex items-center justify-between gap-2 [&>*]:px-3 [&>*]:py-2 [&>*]:rounded-md [&>*]:grow">
                    <button
                        onClick={restock}
                        className="bg-blue-100 text-blue-800"
                    >
                        Restock
                    </button>
                    <Link
                        href={`products/edit/${id}`}
                        className="bg-orange-100 text-orange-800 text-center"
                    >
                        Edit
                    </Link>
                    <button
                        onClick={deleteProduct}
                        className="bg-red-100 text-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </article>
    );
};

function RestockModal() {
    const [restockAmount, setRestockAmount] = useState('');
    const dispatch = useDispatch();
    const { openRestockModal, productIdForRestock } = useSelector(
        (state: RootState) => state.ui,
    );
    const { replace, asPath } = useRouter();

    const closeModal = () => {
        dispatch(closeRestockModal());
    };

    const preventOutsideClick: React.MouseEventHandler = (e) => {
        e.stopPropagation();
    };

    const onSubmit = async () => {
        try {
            await axios.post('/admin/restock', {
                amount: parseInt(restockAmount),
                productId: productIdForRestock,
            });
            replace(asPath);
        } catch (error: any) {
            alert(error.message);
        }
    };

    if (openRestockModal) {
        return (
            <aside
                onClick={closeModal}
                className="fixed inset-0 w-full h-screen flex items-center justify-center bg-black/30 backdrop-blur-sm p-5 z-10"
            >
                <div
                    onClick={preventOutsideClick}
                    className="relative w-full bg-white rounded-2xl max-w-3xl p-4 flex flex-col gap-10"
                >
                    <button
                        onClick={closeModal}
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
                        Restock
                    </header>
                    <form onSubmit={onSubmit} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-4 w-full">
                            <label htmlFor="full_name">
                                Add new amount of this product you currently
                                have in Stock{' '}
                                <span className="text-red-400">*</span>
                            </label>
                            <input
                                required
                                type="number"
                                name="full_name"
                                value={restockAmount}
                                onChange={(e) =>
                                    setRestockAmount(e.target.value)
                                }
                                className="bg-slate-100 p-3 rounded-md border border-slate-200 w-full"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-primary-100 text-primary-800 font-semibold text-lg rounded-md px-7 py-4 clickable"
                        >
                            Restock
                        </button>
                    </form>
                </div>
            </aside>
        );
    }
    return null;
}
function DeleteModal() {
    const dispatch = useDispatch();
    const { openDeleteProductModal, productIdForDelete } = useSelector(
        (state: RootState) => state.ui,
    );
    const { replace, asPath } = useRouter();

    const closeModal = () => {
        dispatch(closeDeleteProductkModal());
    };

    const preventOutsideClick: React.MouseEventHandler = (e) => {
        e.stopPropagation();
    };

    const deleteProduct = async () => {
        try {
            await axios.post('/admin/delete-product', {
                productId: productIdForDelete,
            });
            replace(asPath);
        } catch (error: any) {
            alert(error.message);
        }
    };

    if (openDeleteProductModal) {
        return (
            <aside
                onClick={closeModal}
                className="fixed inset-0 w-full h-screen flex items-center justify-center bg-black/30 backdrop-blur-sm p-5 z-10"
            >
                <div
                    onClick={preventOutsideClick}
                    className="relative w-full bg-white rounded-2xl max-w-3xl p-4 flex flex-col gap-10"
                >
                    <button
                        onClick={closeModal}
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
                        Delete Product?
                    </header>
                    <div className="flex flex-col gap-5 items-center">
                        <Image
                            src="/delete-cart.svg"
                            alt="delete product"
                            width={150}
                            height={150}
                            className="invert-[0.5]"
                        />
                        <p className="max-w-md text-center">
                            Are you sure you want to delete this product? you
                            will have to create a new one if you delete it
                        </p>
                        <div className="flex items-center gap-5">
                            <button
                                onClick={deleteProduct}
                                className="bg-red-600 text-white font-semibold text-lg rounded-md px-4 py-2 clickable border-2 border-white shadow-lg"
                            >
                                Delete
                            </button>
                            <button
                                onClick={closeModal}
                                className="bg-primary-100/30 text-primary-800 font-semibold text-lg rounded-md px-4 py-2 clickable"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        );
    }
    return null;
}
