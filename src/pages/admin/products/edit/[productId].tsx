import DashboardLayout from '@/layouts/DashboardLayout';
import axios from '@/lib/axios';
import { getSingleProduct } from '@/service/firebase';
import convertFileTobase64 from '@/utils/convert-file-to-base64';
import delay from '@/utils/delay';
import ProtectDashboard from '@/utils/protect-route';
import { User } from 'firebase/auth';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface PageProps {
    product: ProductItem;
    productId: string;
}

const acceptedFilesForImage = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/webp',
];
function EditProduct({ product, productId }: PageProps) {
    const [productImageFile, setProductImageFile] = useState<File | null>(null);
    const [productImagePrviewUrl, setproductImagePrviewUrl] = useState('');

    const [productFormData, setProductFormData] = useState({
        name: product.name,
        price: product.price,
        quantity_in_stock: product.quantity_in_stock,
    });

    const [requestStatus, setRequestStatus] =
        useState<FetchRequestStatus>('idle');
    const [requestFeedback, setRequestFeedback] = useState('');

    const { back } = useRouter();

    const handleFileSelect: React.ChangeEventHandler<HTMLInputElement> = (
        e,
    ) => {
        if (e.target.files === null) {
            return;
        }
        if (!acceptedFilesForImage.includes(e.target.files[0].type))
            return alert('Please select an image');
        const file = e.target.files[0];
        setProductImageFile(file);
        setproductImagePrviewUrl(URL.createObjectURL(file));
    };

    const updateField: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setProductFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit: React.FormEventHandler = async (e) => {
        e.preventDefault();
        let productImage = product.image;

        try {
            setRequestStatus('loading');
            if (productImageFile) {
                setRequestFeedback('Uploading image...');
                const imageBase64String =
                    await convertFileTobase64(productImageFile);
                const { data } = await axios.post(
                    '/admin/upload-product-image',
                    {
                        imageBase64: imageBase64String,
                        filename: encodeURI(productImageFile.name),
                    },
                );
                productImage = data.downloadUrl;
                setRequestFeedback('Image Uploaded!');
            }
            await delay(500);
            setRequestFeedback('Updating Product...');
            await axios.post('/admin/update-product', {
                ...productFormData,
                image: productImage,
                id: productId,
            });
            setRequestFeedback('Product Updated!');
            await delay(500);
            back();
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <div className="py-10 text-slate-600 flex flex-col gap-10">
            <header className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-slate-600">
                    <span className="opacity-70">Product</span> / {productId}
                </h1>
            </header>
            <form
                onSubmit={onSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
            >
                <label htmlFor="product-image" className="grow w-full relative">
                    <Image
                        width={500}
                        height={500}
                        alt={product.name}
                        className="aspect-square w-full object-cover object-center"
                        src={productImagePrviewUrl || product.image}
                    />
                    <input
                        type="file"
                        id="product-image"
                        onChange={handleFileSelect}
                        className="opacity-0 absolute top-1/2 left-1/2"
                        accept={acceptedFilesForImage.join(',')}
                    />
                </label>
                <div className="grow w-full">
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col w-full gap-4">
                            <label htmlFor="name">
                                Product name{' '}
                                <span className="text-red-400">*</span>
                            </label>
                            <input
                                required
                                id="name"
                                type="text"
                                name="name"
                                onChange={updateField}
                                value={productFormData.name}
                                className="bg-slate-100 p-3 rounded-md border border-slate-200 w-full"
                            />
                        </div>
                        <div className="flex flex-col gap-4 w-full">
                            <label htmlFor="price">
                                Price <span className="text-red-400">*</span>
                            </label>
                            <input
                                required
                                id="price"
                                type="number"
                                name="price"
                                onChange={updateField}
                                value={productFormData.price}
                                className="bg-slate-100 p-3 rounded-md border border-slate-200 w-full"
                            />
                        </div>
                        <div className="flex flex-col gap-4 w-full">
                            <label htmlFor="quantity_in_stock">
                                Quantity currently in stock{' '}
                                <span className="text-red-400">*</span>
                            </label>
                            <input
                                required
                                type="number"
                                onChange={updateField}
                                id="quantity_in_stock"
                                name="quantity_in_stock"
                                value={productFormData.quantity_in_stock}
                                className="bg-slate-100 p-3 rounded-md border border-slate-200 w-full"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-primary-100 text-primary-800 font-semibold text-lg rounded-md px-7 py-4 clickable"
                        >
                            {requestStatus !== 'idle' ? (
                                <span className="inline-flex items-center gap-4">
                                    {requestFeedback}{' '}
                                    <span className="w-5 h-5 border-[length:3px] border-t-white rounded-full border-black/30 animate-spin duration-300" />
                                </span>
                            ) : (
                                <span>Update Product</span>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default EditProduct;

EditProduct.getLayout = (page: React.ReactElement, pageProps: any) => (
    <DashboardLayout>{page}</DashboardLayout>
);

export const getServerSideProps: GetServerSideProps = ProtectDashboard(
    async (ctx: GetServerSidePropsContext, currentUser: User) => {
        const { productId } = ctx.query;

        if (typeof productId !== 'string') {
            return {
                redirect: {
                    destination: '/admin',
                    statusCode: 301,
                },
            };
        }

        const { product, id } = await getSingleProduct(productId as string);
        return {
            props: {
                product,
                productId: id,
            },
        };
    },
);
