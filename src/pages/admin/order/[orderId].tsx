import DashboardLayout from '@/layouts/DashboardLayout';
import axios from '@/lib/axios';
import { getSingleOrder } from '@/service/firebase';
import { serverTimestamp } from 'firebase/firestore';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { createContext, useCallback, useContext, useState } from 'react';

interface PageProps {
    order: Order;
    orderId: string;
}

const OrderDetailsContext = createContext<Order & { orderId: string }>({
    cart: [],
    created_at: serverTimestamp(),
    status: 'pending',
    total: 0,
    transaction_reference: '',
    user: {
        address: '',
        email: '',
        full_name: '',
        phone_number: '',
    },
    id: '',
    orderId: '',
});

function Order({ order, orderId }: PageProps) {
    const [orderStatus, setOrderStatus] = useState<OrderStatus>(order.status);

    const updateOrderStatus = useCallback(
        async (status: string) => {
            try {
                const { data } = await axios.post(
                    '/admin/update-order-status',
                    {
                        status,
                        orderId,
                    },
                );
                setOrderStatus(data.status);
            } catch (error: any) {
                alert(error.message);
            }
        },
        [orderId],
    );

    return (
        <div className="py-10 text-slate-600 flex flex-col gap-10">
            <Head>
                <title>{orderId} | Orders | Admin | Daat Foods</title>
            </Head>
            <h1 className="text-3xl font-bold text-slate-600">
                <span className="opacity-70">Order</span> / {orderId}
            </h1>
            <OrderDetailsContext.Provider value={{ ...order, orderId }}>
                <div className="flex flex-wrap gap-6">
                    <div className="flex flex-col grow gap-6">
                        <ItemSummary />
                        <CustomerDetails />
                        <DeliveryAddress />
                    </div>
                    <div className="flex flex-col grow gap-6">
                        <OrderSummary status={orderStatus} />
                        <UpdateOrderStatus
                            orderStatus={orderStatus}
                            updateOrderStatus={updateOrderStatus}
                        />
                    </div>
                </div>
            </OrderDetailsContext.Provider>
        </div>
    );
}

export default Order;

Order.getLayout = (page: React.ReactElement, pageProps: any) => (
    <DashboardLayout>{page}</DashboardLayout>
);

export const getServerSideProps: GetServerSideProps = async (
    ctx: GetServerSidePropsContext,
) => {
    const { orderId } = ctx.query;

    if (typeof orderId !== 'string') {
        return {
            redirect: {
                destination: '/admin',
                statusCode: 301,
            },
        };
    }

    const orderDetails = await getSingleOrder(orderId);

    return {
        props: {
            order: orderDetails.data,
            orderId: orderDetails.id,
        },
    };
};

function ItemSummary() {
    const { cart } = useContext(OrderDetailsContext);
    return (
        <table className="border-separate border-spacing-x-0 border-spacing-y-3 w-full bg-white/50 rounded-lg px-3">
            <thead>
                <tr className="font-semibold">
                    <td className="px-3 py-1 bg-white rounded-l-lg border border-r-transparent border-slate-300">
                        Item Summary
                    </td>
                    <td className="px-3 py-1 bg-white border-y border-slate-300">
                        Qty
                    </td>
                    <td className="px-3 py-1 bg-white border-y border-slate-300">
                        Price
                    </td>
                    <td className="px-3 py-1 bg-white rounded-r-lg border border-l-transparent border-slate-300">
                        Total
                    </td>
                </tr>
            </thead>
            <tbody>
                {cart.map((item) => (
                    <tr key={item.cart_item_id}>
                        <td className="px-2 py-3 bg-white rounded-l-lg border border-r-transparent border-slate-300">
                            <div className="flex gap-2 items-center">
                                <Image
                                    height={240}
                                    width={240}
                                    src={item.image}
                                    alt={item.name}
                                    className="h-12 w-auto"
                                />
                                <span>{item.name}</span>
                            </div>
                        </td>
                        <td className="px-2 py-2 bg-white border-y border-slate-300">
                            x{item.quantity}
                        </td>
                        <td className="px-2 py-2 bg-white border-y border-slate-300">
                            ₦{item.price}
                        </td>
                        <td className="px-2 py-2 bg-white rounded-r-lg border border-l-transparent border-slate-300">
                            ₦{item.sub_total}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function CustomerDetails() {
    const { user } = useContext(OrderDetailsContext);

    return (
        <section className="bg-white p-4 flex flex-col gap-3 rounded-lg border border-slate-300">
            <h2 className="text-lg font-semibold text-slate-800">
                Customer Details
            </h2>
            <div className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between">
                    <span>Full name</span>
                    <span className="font-semibold">{user.full_name}</span>
                </div>
                <div className="flex items-baseline justify-between">
                    <span>Email Address</span>
                    <a
                        href={`mailto:${user.email}`}
                        className="font-semibold underline"
                    >
                        {user.email}
                    </a>
                </div>
                <div className="flex items-baseline justify-between">
                    <span>Phone number</span>
                    <a
                        href={`tel:${user.phone_number}`}
                        className="font-semibold underline"
                    >
                        {user.phone_number}
                    </a>
                </div>
            </div>
        </section>
    );
}

function DeliveryAddress() {
    const { user } = useContext(OrderDetailsContext);

    return (
        <section className="bg-white p-4 flex flex-col gap-3 rounded-lg border border-slate-300">
            <h2 className="text-lg font-semibold text-slate-800">
                Delivery Address
            </h2>
            <p className="flex flex-col gap-2">{user.address}</p>
        </section>
    );
}

const OrderColors: Record<OrderStatus, string> = {
    completed: 'bg-[#5cb85c]/20 text-[#5cb85c]',
    failed: 'bg-[#ff5e4a]/20 text-[#ff5e4a]',
    inprogress: 'bg-[#4b9ed7]/20 text-[#4b9ed7]',
    pending: 'bg-[#ffb21e]/20 text-[#ffb21e]',
};

function OrderSummary({ status }: { status: OrderStatus }) {
    const { orderId, created_at, total, transaction_reference } =
        useContext(OrderDetailsContext);

    return (
        <section className="bg-white p-4 flex flex-col gap-3 rounded-lg border border-slate-300">
            <h2 className="text-lg font-semibold text-slate-800">
                Order Summary
            </h2>
            <div className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between">
                    <span>Order Summary</span>
                    <span
                        className={`capitalize px-2 py-1.5 font-medium rounded-lg ${OrderColors[status]}`}
                    >
                        {status}
                    </span>
                </div>
                <div className="flex items-baseline justify-between">
                    <span>Order ID</span>
                    <span className="font-semibold">{orderId}</span>
                </div>
                <div className="flex items-baseline justify-between">
                    <span>Order created at date</span>
                    <span className="font-semibold">
                        {new Date(
                            parseFloat(created_at as string),
                        ).toDateString()}
                    </span>
                </div>
                <div className="flex items-baseline justify-between">
                    <span>Order created at time</span>
                    <span className="font-semibold">
                        {new Date(
                            parseFloat(created_at as string),
                        ).toLocaleTimeString()}
                    </span>
                </div>
                <div className="flex items-baseline justify-between">
                    <span>Total</span>
                    <span className="font-semibold">₦{total}</span>
                </div>
                <div className="flex items-baseline justify-between">
                    <span>Transaction Reference</span>
                    <Link
                        className="font-semibold underline"
                        href={`/admin/transaction/${transaction_reference}`}
                    >
                        {transaction_reference}
                    </Link>
                </div>
            </div>
        </section>
    );
}

const orderStatuses: OrderStatus[] = [
    'pending',
    'inprogress',
    'completed',
    'failed',
];

function UpdateOrderStatus({
    orderStatus,
    updateOrderStatus,
}: {
    orderStatus: OrderStatus;
    updateOrderStatus: (status: string) => Promise<void>;
}) {
    const handleClick = (status: string) => () => {
        if (orderStatus === status) return;
        updateOrderStatus(status);
    };
    return (
        <section className="bg-white p-4 flex flex-col gap-3 rounded-lg border border-slate-300 pb-8">
            <h2 className="text-lg font-semibold text-slate-800">
                Update Order Status
            </h2>
            <div className="flex items-center gap-4">
                {orderStatuses.map((status) => (
                    <button
                        key={status}
                        onClick={handleClick(status)}
                        className={`relative px-4 py-2.5 rounded-lg font-semibold clickable transition-all duration-200 ${
                            orderStatus === status
                                ? 'border-2 border-white opacity-100 shadow-md'
                                : 'opacity-40'
                        } ${OrderColors[status]}`}
                    >
                        {status}
                        {orderStatus === status && (
                            <span className="absolute text-xs font-semibold text-slate-500 -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                Current State
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </section>
    );
}
