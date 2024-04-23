import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import useOrders from '@/hooks/useOrders';
import DashboardLayout from '@/layouts/DashboardLayout';
import { getOrderMetrics, getOrders } from '@/service/firebase';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface HomeProps {
    orders: Order[];
    order_metrics: Record<OrderStatus, number>;
}

function Home({ orders, order_metrics }: HomeProps) {
    return (
        <div className="grid gap-10 pt-10 pb-5 grid-rows-[max-content,minmax(100px,80vh)]">
            <Head>
                <title>Admin | Daat Foods</title>
            </Head>
            <OrderMetrics order_metrics={order_metrics} />
            <OrderTable orders={orders} />
        </div>
    );
}

Home.getLayout = (page: React.ReactElement) => {
    return <DashboardLayout>{page}</DashboardLayout>;
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (
    context: GetServerSidePropsContext,
) => {
    const ordersDocs = await getOrders();
    const orderMetrics = await getOrderMetrics();

    return {
        props: {
            orders: ordersDocs,
            order_metrics: orderMetrics,
        },
    };
};
function OrderMetrics({
    order_metrics,
}: {
    order_metrics: Record<OrderStatus, number>;
}) {
    return (
        <section className="flex flex-col gap-4">
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

const grid_cols =
    'px-4 py-2 grid gap-4 grid-cols-1 md:grid-cols-[0.5fr,1.2fr,1fr,1fr,1.2fr,0.8fr,0.5fr,0.8fr] items-center';

function OrderTable({ orders }: { orders: Order[] }) {
    const {
        orders: paginatedOrders,
        listContainerRef,
        isFetching,
        isEndReached,
    } = useOrders(orders);
    const {
        query: { search },
    } = useRouter();
    return (
        <section className="flex flex-col gap-4 h-full overflow-auto min-h-80">
            <h2 className="text-3xl font-bold text-slate-800">Orders</h2>
            <form className="flex items-center gap-4 max-w-xl whitespace-nowrap">
                <input
                    className="px-4 py-2 text-slate-500 bg-white border border-slate-300 rounded-lg w-full"
                    placeholder="Search Order by ID, email, name, phone number, transaction ref"
                />
                <button className="py-2 px-4 bg-primary-800/50 text-white rounded-lg">
                    Search
                </button>
                {search && (
                    <button className="py-2 px-4 bg-primary-800/10 text-primary-800/60 rounded-lg">
                        Clear Search
                    </button>
                )}
            </form>
            <div ref={listContainerRef} className="overflow-auto">
                <div className="relative grid gap-4 md:pr-2 pb-16">
                    <div
                        className={`text-slate-500 ${grid_cols} bg-white border border-slate-300 rounded-lg hidden md:grid`}
                    >
                        <div>
                            <span>ID</span>
                        </div>
                        <div>
                            <span>Name</span>
                        </div>
                        <div>
                            <span>Phone number</span>
                        </div>
                        <div>
                            <span>Email Address</span>
                        </div>
                        <div>
                            <span>Transaction Ref</span>
                        </div>
                        <div>
                            <span>Total Cost</span>
                        </div>
                        <div>
                            <span>Status</span>
                        </div>
                        <div>
                            <span>Action</span>
                        </div>
                    </div>
                    {paginatedOrders.map((order) => (
                        <div
                            key={order.id}
                            className={`text-slate-500 ${grid_cols} bg-white border border-slate-300 rounded-lg`}
                        >
                            <div className="flex items-center justify-between gap-2">
                                <span className="md:hidden">Order ID</span>
                                <span className="md:max-w-[50px] md:overflow-hidden md:text-ellipsis md:whitespace-nowrap inline-block">
                                    {order.id}
                                </span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <span className="md:hidden">Name</span>
                                <span className="md:max-w-[50px] md:overflow-hidden md:text-ellipsis md:whitespace-nowrap inline-block">
                                    <span>{order.user.full_name}</span>
                                </span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <span className="md:hidden">Phone number</span>
                                <a
                                    className="underline"
                                    href={`tel:${order.user.phone_number} underline`}
                                >
                                    <span>{order.user.phone_number}</span>
                                </a>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <span className="md:hidden">Emaill</span>
                                <a
                                    className="underline"
                                    href={`mailto:${order.user.email} `}
                                >
                                    <span>{order.user.email}</span>
                                </a>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <span className="md:hidden">
                                    Transaction Ref
                                </span>
                                <Link
                                    className="underline"
                                    href={`/admin/divansaction/${order.transaction_reference}`}
                                >
                                    <span>{order.transaction_reference}</span>
                                </Link>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <span className="md:hidden">
                                    Transaction Ref
                                </span>
                                <span>₦{order.total.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <span className="md:hidden">Status</span>
                                <span
                                    className={`capitalize px-2 py-1.5 font-medium rounded-lg ${
                                        OrderColors[order.status]
                                    }`}
                                >
                                    {order.status}
                                </span>
                            </div>
                            <div>
                                <Link
                                    href={`/admin/order/${order.id}`}
                                    className="px-2 py-1.5 bg-primary-100/20 text-primary-800/70 w-full inline-block text-center md:w-fit rounded-lg font-bold clickable border border-primary-100"
                                >
                                    View Order
                                </Link>
                            </div>
                        </div>
                    ))}
                    {isFetching && (
                        <span className="absolute bottom-2 left-1/2 -translate-x-1/2">
                            <span className="animate-spin inline-block w-12 h-12 rounded-full border-4 border-primary-100/30 border-t-primary-800/60"></span>
                        </span>
                    )}
                    {isEndReached && (
                        <span className="text-primary-800/50 font-bold text-xl md:text-2xl absolute bottom-2 left-1/2 -translate-x-1/2 w-full text-center">
                            No more Orders to Show
                        </span>
                    )}
                </div>
            </div>
        </section>
    );
}
