import { nanoid } from 'nanoid/non-secure';
import Image from 'next/image';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { usePaystackPayment } from 'react-paystack';
import { useDispatch, useSelector } from 'react-redux';

import axios from '@/lib/axios';

import { RootState } from '@/redux/store';
import { updateUserField } from '@/redux/userReducer/actions';

import { clearCart } from '@/redux/cartReducer/actions';
import delay from '@/utils/delay';

type ModalVies = 'form' | 'success' | 'failed';

export function CheckoutModal({
    closeCheckoutModal,
    closeCartView,
}: {
    closeCheckoutModal: () => void;
    closeCartView: () => void;
}) {
    const [modalView, setModalView] = useState<ModalVies>('form');
    const [orderId, setOrderId] = useState('');

    const closeModalOnBackgroundClick = useCallback(() => {
        closeCheckoutModal();
    }, [closeCheckoutModal]);

    const preventOutsideClick: React.MouseEventHandler = useCallback((e) => {
        e.stopPropagation();
    }, []);

    const Component = modalViews[modalView];

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
                <Component
                    orderId={orderId}
                    setOrderId={setOrderId}
                    setModalView={setModalView}
                    closeCartView={closeCartView}
                    closeCheckoutModal={closeCheckoutModal}
                />
            </div>
        </aside>
    );
}

interface FormProps {
    setModalView: React.Dispatch<React.SetStateAction<ModalVies>>;
    setOrderId: React.Dispatch<React.SetStateAction<string>>;
}

const Form: FC<FormProps> = ({ setModalView, setOrderId }) => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);
    const cart = useSelector((state: RootState) => state.cart);

    const [requestStatus, setRequestStatus] = useState('');

    const { address, email, full_name, phone_number } = user;

    const total = useMemo(() => {
        return cart.reduce((previousValue, currentValue) => {
            return previousValue + currentValue.sub_total;
        }, 0);
    }, [cart]);

    const config = useMemo(
        () => ({
            reference: nanoid(10),
            email,
            amount: total * 100, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
            publicKey: `${process.env.NEXT_PUBLIC_PAYSTACK_API_KEY}`,
        }),
        [email, total],
    );

    const createOrder = useCallback(async () => {
        try {
            const payload: Omit<Order, 'created_at'> = {
                transaction_reference: config.reference,
                cart: cart,
                status: 'pending',
                total,
                user,
            };

            const { data } = await axios.post(
                '/firebase/create-order',
                payload,
            );

            return data;
        } catch (error) {
            throw error;
        }
    }, [cart, config.reference, total, user]);

    const onSuccess = useCallback(() => {
        (async () => {
            try {
                setRequestStatus('Verifying payment...');

                const { data } = await axios.post(
                    '/paystack/verify-transaction',
                    { reference: config.reference },
                );

                setRequestStatus('Payment Verified!');

                await delay(100);

                setRequestStatus('Recording Transaction...');

                await axios.post('/firebase/log-transaction', data.data);

                setRequestStatus('Transaction Recorded!');

                // verify transaction
                await delay(1000);

                // create order and store in databse
                setRequestStatus('Creating your Order...');

                const { ref, created_at } = await createOrder();

                setRequestStatus('Order Created Successfully');

                await delay(1000);

                // finish
                setOrderId(ref);

                dispatch(clearCart());

                setModalView('success');

                await axios.post('/admin/update-order-status', {
                    transaction_reference: config.reference,
                    cart,
                    total,
                    user,
                    status: 'pending',
                    orderId: ref,
                    created_at,
                });
            } catch (error: any) {
                setRequestStatus(
                    `An error ocurred! - ${
                        error?.response?.data?.message ?? error.message
                    }`,
                );

                await delay(3000);

                setModalView('failed');
            }
        })();
    }, [
        cart,
        config.reference,
        createOrder,
        dispatch,
        setModalView,
        setOrderId,
        total,
        user,
    ]);

    const onClose = () => {
        setRequestStatus('');
    };

    const updateField = useCallback(
        (field: keyof User) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                dispatch(updateUserField(field, e.target.value));
            },
        [dispatch],
    );

    const initializePayment = usePaystackPayment(config);

    const onSubmit: React.FormEventHandler = useCallback(
        async (e) => {
            try {
                e.preventDefault();
                setRequestStatus('Creating Payment...');
                //  bring up paystack popup
                initializePayment(onSuccess, onClose);
            } catch (error: any) {
                setRequestStatus(`An error ocurred! - ${error.message}`);
                await delay(3000);
                setModalView('failed');
            }
        },
        [initializePayment, onSuccess, setModalView],
    );
    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
            <div className="flex items-center flex-col md:flex-row w-full gap-5">
                <div className="flex flex-col gap-4 w-full">
                    <label htmlFor="full_name">
                        Full name <span className="text-red-400">*</span>
                    </label>
                    <input
                        required
                        type="text"
                        name="full_name"
                        value={full_name}
                        onChange={updateField('full_name')}
                        className="bg-slate-100 p-3 rounded-md border border-slate-200 w-full"
                    />
                </div>
                <div className="flex flex-col gap-4 w-full">
                    <label htmlFor="full_name">
                        Phone number <span className="text-red-400">*</span>
                    </label>
                    <input
                        required
                        type="tel"
                        name="phone_number"
                        value={phone_number}
                        onChange={updateField('phone_number')}
                        className="bg-slate-100 p-3 rounded-md border border-slate-200 w-full"
                    />
                </div>
            </div>
            <div className="flex flex-col gap-4 w-full">
                <label htmlFor="full_name">
                    Email Address <span className="text-red-400">*</span>
                </label>
                <input
                    required
                    type="email"
                    name="email"
                    value={email}
                    onChange={updateField('email')}
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
                    value={address}
                    onChange={updateField('address')}
                    className="bg-slate-100 p-3 rounded-md border border-slate-200 w-full min-h-[120px]"
                ></textarea>
            </div>
            <button
                type="submit"
                className="bg-primary-100 text-primary-800 font-semibold text-lg rounded-md px-7 py-4 clickable"
            >
                {requestStatus ? (
                    <span className="inline-flex items-center gap-4">
                        {requestStatus}{' '}
                        <span className="w-5 h-5 border-[length:3px] border-t-white rounded-full border-black/30 animate-spin duration-300" />
                    </span>
                ) : (
                    <span>Proceed to pay ₦{total}</span>
                )}
            </button>
        </form>
    );
};

function Success({
    orderId,
    closeCartView,
}: {
    orderId: string;
    closeCartView: () => void;
}) {
    const copyOrderId = () => {
        window.navigator.clipboard.writeText(orderId).then(() => {
            alert('Order id copied to your clipboard!');
        });
    };
    return (
        <section className="flex flex-col items-center text-center gap-6 py-6">
            <Image
                src="/success.svg"
                alt="payment sucess"
                width={260}
                height={260}
            />
            <h3 className="text-slate-700 text-2xl font-semibold">
                Payment Successful!
            </h3>
            <p className="max-w-xl">
                Your order has been created!, your{' '}
                <span className="font-semibold">Order Id</span> is{' '}
                <span className="font-bold">{orderId}</span>, please copy it as
                it would be used to retrive your order in future, we would react
                out to you through the Email and phone number your provided
            </p>
            <div className="flex items-center gap-4">
                <button
                    type="submit"
                    onClick={copyOrderId}
                    className="bg-primary-100 text-primary-800 font-semibold rounded-md px-6 py-3 clickable flex items-center gap-4"
                >
                    Copy Order ID{' '}
                    <Image
                        src="/copy.svg"
                        alt="copy order id"
                        width={24}
                        height={24}
                    />
                </button>
                <button
                    type="submit"
                    onClick={closeCartView}
                    className="bg-primary-100 text-primary-800 font-semibold rounded-md px-6 py-3 clickable flex items-center gap-4"
                >
                    Finish{' '}
                    <Image
                        src="/check.svg"
                        alt="finsih"
                        width={24}
                        height={24}
                    />
                </button>
            </div>
        </section>
    );
}

function Failed({
    setModalView,
}: {
    setModalView: React.Dispatch<
        React.SetStateAction<'form' | 'sucess' | 'failed'>
    >;
}) {
    const retry = () => {
        setModalView('form');
    };
    return (
        <section className="flex flex-col items-center text-center gap-6 py-6">
            <Image
                src="/failed.svg"
                alt="payment failed"
                width={289}
                height={251}
            />
            <h3 className="text-slate-700 text-2xl font-semibold">
                Payment failed, please try again.
            </h3>
            <button
                type="submit"
                onClick={retry}
                className="bg-primary-100 text-primary-800 font-semibold text-lg rounded-md px-7 py-4 clickable flex items-center gap-4"
            >
                Try again{' '}
                <Image
                    src="/retry.svg"
                    alt="retry order"
                    width={24}
                    height={24}
                />
            </button>
        </section>
    );
}

const modalViews: Record<ModalVies, any> = {
    form: Form,
    success: Success,
    failed: Failed,
};
