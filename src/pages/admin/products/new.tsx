import DashboardLayout from '@/layouts/DashboardLayout';
import axios from '@/lib/axios';
import convertFileTobase64 from '@/utils/convert-file-to-base64';
import delay from '@/utils/delay';
import Head from 'next/head';
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
function NewProduct() {
    const [productImageFile, setProductImageFile] = useState<File | null>(null);
    const [productImagePrviewUrl, setproductImagePrviewUrl] = useState('');

    const [productFormData, setProductFormData] = useState({
        name: '',
        price: '',
        quantity_in_stock: '',
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
        if (!productImageFile)
            return alert('Please add a picture of the product');
        try {
            setRequestStatus('loading');
            setRequestFeedback('Uploading image...');
            const imageBase64String =
                await convertFileTobase64(productImageFile);
            const { data } = await axios.post('/admin/upload-product-image', {
                imageBase64: imageBase64String,
                filename: encodeURI(productImageFile.name),
            });
            setRequestFeedback('Image Uploaded!');
            await delay(500);
            setRequestFeedback('Uploading Product...');
            await axios.post('/admin/upload-product', {
                ...productFormData,
                image: data.downloadUrl,
            });
            setRequestFeedback('Product Uploaded!');
            await delay(500);
            back();
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <div className="py-10 text-slate-600 flex flex-col gap-10">
            <Head>
                <title>Add new Product | Admin | Daat Foods</title>
            </Head>
            <header className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-slate-600">
                    <span className="">New Product</span>
                </h1>
            </header>
            <form
                onSubmit={onSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
            >
                <label htmlFor="product-image" className="grow w-full relative">
                    {productImagePrviewUrl ? (
                        <Image
                            width={500}
                            height={500}
                            alt="product preview"
                            src={productImagePrviewUrl}
                            className="aspect-square w-full object-cover object-center"
                        />
                    ) : (
                        <div className="rounded-2xl border-dotted border-4 border-gray-200 h-fullw-full aspect-square flex flex-col justify-center items-center gap-5 p-6">
                            <Image
                                width={100}
                                height={100}
                                src="/plus.svg"
                                alt="product preview"
                                className="invert-[0.8]"
                            />
                            <p className="text-gray-500 text-xl text-center">
                                Add Product picture
                            </p>
                        </div>
                    )}
                    <input
                        type="file"
                        id="product-image"
                        onChange={handleFileSelect}
                        className="opacity-0 w-0 absolute top-1/2 left-1/2"
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
                                <span>Upload Product</span>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default NewProduct;

NewProduct.getLayout = (page: React.ReactElement, pageProps: any) => (
    <DashboardLayout>{page}</DashboardLayout>
);
