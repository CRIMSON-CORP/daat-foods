import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import DashboardLayout from '@/layouts/DashboardLayout';
import { getOrderMetrics, getOrders } from '@/service/firebase';
import ProtectDashboard from '@/utils/protect-route';
import { User } from 'firebase/auth';
import Image from 'next/image';
import Link from 'next/link';

interface HomeProps {
    orders: (Order & {
        id: string;
    })[];
    order_metrics: Record<OrderStatus, number>;
    current_user: User;
}

function Home({ orders, order_metrics }: HomeProps) {
    return (
        <div className="flex flex-col gap-10">
            <OrderMetrics order_metrics={order_metrics} />
            <OrderTable orders={orders} />
        </div>
    );
}

Home.getLayout = (page: React.ReactElement, pageProps: any) => {
    return <DashboardLayout pageProps={pageProps}>{page}</DashboardLayout>;
};

export default Home;

export const getServerSideProps: GetServerSideProps = ProtectDashboard(
    async (_: GetServerSidePropsContext, currentUser: User) => {
        const ordersDocs = await getOrders();
        const orderMetrics = await getOrderMetrics();
        return {
            props: {
                orders: ordersDocs,
                order_metrics: orderMetrics,
                current_user: {
                    name: currentUser.displayName,
                    email: currentUser.email,
                    image: currentUser.photoURL,
                },
            },
        };
    },
);

function OrderMetrics({
    order_metrics,
}: {
    order_metrics: Record<OrderStatus, number>;
}) {
    return (
        <section className="flex flex-col gap-4 py-10">
            <h2 className="text-3xl font-bold text-slate-800">Order Metrics</h2>
            <div className="gap-5 grid grid-cols-[repeat(auto-fit,_minmax(250px,1fr))]">
                <MetricCard
                    title="Pending Orders"
                    count={order_metrics.pending}
                    icon_path="/pending-order.svg"
                    bg_color="bg-[#ffb21e]/10"
                />
                <MetricCard
                    title="Orders Inprogress"
                    count={order_metrics.inprogress}
                    icon_path="/inprogress-order.svg"
                    bg_color="bg-[#4b9ed7]/10"
                />
                <MetricCard
                    title="Completed Orders"
                    count={order_metrics.completed}
                    icon_path="/completed-order.svg"
                    bg_color="bg-[#5cb85c]/10"
                />
                <MetricCard
                    title="Failed Orders"
                    count={order_metrics.failed}
                    icon_path="/failed-order.svg"
                    bg_color="bg-[#ff5e4a]/10"
                />
            </div>
        </section>
    );
}

interface MetricCardProps {
    title: string;
    count: number;
    icon_path: string;
    bg_color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
    title,
    count,
    icon_path,
    bg_color,
}: MetricCardProps) => {
    return (
        <article className="border border-slate-200 bg-white rounded-2xl p-5 flex items-center gap-4">
            <div className={`aspect-square rounded-full p-4 ${bg_color}`}>
                <Image
                    width={52}
                    height={52}
                    src={icon_path}
                    alt="pending orders"
                />
            </div>
            <div className="flex flex-col gap-3">
                <span className="font-bold text-slate-800 text-5xl">
                    {count}
                </span>
                <span className="text-slate-500 font-semibold">{title}</span>
            </div>
        </article>
    );
};

const OrderColors: Record<OrderStatus, string> = {
    completed: 'bg-[#5cb85c]/20 text-[#5cb85c]',
    failed: 'bg-[#ff5e4a]/20 text-[#ff5e4a]',
    inprogress: 'bg-[#4b9ed7]/20 text-[#4b9ed7]',
    pending: 'bg-[#ffb21e]/20 text-[#ffb21e]',
};

function OrderTable({
    orders,
}: {
    orders: (Order & {
        id: string;
    })[];
}) {
    return (
        <section className="flex flex-col gap-4 py-10">
            <h2 className="text-3xl font-bold text-slate-800">Orders</h2>
            <div className="grid gap-4">
                <table className="text-slate-500 border-separate border-spacing-0 text-sm border-spacing-y-4 -mt-4">
                    <thead>
                        <tr>
                            <td className="px-2 py-3 bg-white rounded-l-lg border border-r-transparent border-slate-300">
                                <span>ID</span>
                            </td>
                            <td className="px-2 py-2 bg-white border-y border-slate-300">
                                <span>Name</span>
                            </td>
                            <td className="px-2 py-2 bg-white border-y border-slate-300">
                                <span>Phone number</span>
                            </td>
                            <td className="px-2 py-2 bg-white border-y border-slate-300">
                                <span>Email Address</span>
                            </td>
                            <td className="px-2 py-2 bg-white border-y border-slate-300">
                                <span>Transaction Reference</span>
                            </td>
                            <td className="px-2 py-2 bg-white border-y border-slate-300">
                                <span>Total Cost</span>
                            </td>
                            <td className="px-2 py-2 bg-white border-y border-slate-300">
                                <span>Status</span>
                            </td>
                            <td className="px-2 py-2 bg-white rounded-r-lg border border-l-transparent border-slate-300">
                                <span>Action</span>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td className="px-2 py-3 bg-white rounded-l-lg border border-r-transparent border-slate-300">
                                    <span className="max-w-[50px] overflow-hidden text-ellipsis whitespace-nowrap inline-block">
                                        {order.id}
                                    </span>
                                </td>
                                <td className="px-2 py-2 bg-white border-y border-slate-300">
                                    <span>{order.user.full_name}</span>
                                </td>
                                <td className="px-2 py-2 bg-white border-y border-slate-300 underline">
                                    <a href={`tel:${order.user.phone_number}`}>
                                        <span>{order.user.phone_number}</span>
                                    </a>
                                </td>
                                <td className="px-2 py-2 bg-white border-y border-slate-300 underline">
                                    <a href={`mailto:${order.user.email}`}>
                                        <span>{order.user.email}</span>
                                    </a>
                                </td>
                                <td className="px-2 py-2 bg-white border-y border-slate-300">
                                    <Link
                                        className="underline"
                                        href={`/admin/transaction/${order.transaction_reference}`}
                                    >
                                        <span>
                                            {order.transaction_reference}
                                        </span>
                                    </Link>
                                </td>
                                <td className="px-2 py-2 bg-white border-y border-slate-300">
                                    <span>{order.total}</span>
                                </td>
                                <td className="px-2 py-2 bg-white border-y border-slate-300">
                                    <span
                                        className={`capitalize px-2 py-1.5 font-medium rounded-lg ${
                                            OrderColors[order.status]
                                        }`}
                                    >
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-2 py-2 bg-white rounded-r-lg border border-l-transparent border-slate-300">
                                    <span>
                                        <Link
                                            href={`/admin/order/${order.id}`}
                                            className="px-2 py-1.5 bg-primary-100/20 text-primary-800/70 rounded-lg font-bold clickable border border-primary-100"
                                        >
                                            View Order
                                        </Link>
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
