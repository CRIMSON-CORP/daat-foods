import useTransactions from '@/hooks/useTransactions';
import DashboardLayout from '@/layouts/DashboardLayout';
import { getTransactions } from '@/service/firebase';
import ProtectDashboard from '@/utils/protect-route';
import { User } from 'firebase/auth';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Link from 'next/link';

const OrderColors: Record<OrderStatus, string> = {
    completed: 'bg-[#5cb85c]/20 text-[#5cb85c]',
    failed: 'bg-[#ff5e4a]/20 text-[#ff5e4a]',
    inprogress: 'bg-[#4b9ed7]/20 text-[#4b9ed7]',
    pending: 'bg-[#ffb21e]/20 text-[#ffb21e]',
};

const Transactions = ({ transactions }: { transactions: Transaction[] }) => {
    const {
        listContainerRef,
        transactions: paginatedTransactions,
        isFetching,
        isEndReached,
    } = useTransactions(transactions);

    return (
        <section className="flex flex-col gap-4 h-full overflow-auto min-h-80 py-10">
            <h2 className="text-3xl font-bold text-slate-800">Transactions</h2>
            <div ref={listContainerRef} className="overflow-auto">
                <div className="relative grid gap-4 pr-2 pb-16">
                    <table className="text-slate-500 border-separate border-spacing-0 text-sm border-spacing-y-4 -mt-4 max-h-full min-w-[1000px]">
                        <thead>
                            <tr>
                                <td className="px-2 py-3 bg-white rounded-l-lg border border-r-transparent border-slate-300">
                                    <span>Reference</span>
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
                                    <span>Amount</span>
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
                            {paginatedTransactions.map((transaction) => (
                                <tr key={transaction.data.reference}>
                                    <td className="px-2 py-3 bg-white rounded-l-lg border border-r-transparent border-slate-300">
                                        <span className="max-w-[80px] overflow-hidden text-ellipsis whitespace-nowrap inline-block">
                                            {transaction.data.reference}
                                        </span>
                                    </td>
                                    <td className="px-2 py-2 bg-white border-y border-slate-300">
                                        <span>
                                            {
                                                transaction.data.customer
                                                    .first_name
                                            }
                                        </span>
                                        <span>
                                            {
                                                transaction.data.customer
                                                    .last_name
                                            }
                                        </span>
                                    </td>
                                    <td className="px-2 py-2 bg-white border-y border-slate-300 underline">
                                        <a
                                            href={`tel:${transaction.data.customer.phone}`}
                                        >
                                            <span>
                                                {
                                                    transaction.data.customer
                                                        .phone
                                                }
                                            </span>
                                        </a>
                                    </td>
                                    <td className="px-2 py-2 bg-white border-y border-slate-300 underline">
                                        <a
                                            href={`mailto:${transaction.data.customer.email}`}
                                        >
                                            <span>
                                                {
                                                    transaction.data.customer
                                                        .email
                                                }
                                            </span>
                                        </a>
                                    </td>

                                    <td className="px-2 py-2 bg-white border-y border-slate-300">
                                        <span>
                                            ₦
                                            {(
                                                transaction.data.amount / 100
                                            ).toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-2 py-2 bg-white border-y border-slate-300">
                                        <span
                                            className={`capitalize px-2 py-1.5 font-medium rounded-lg ${
                                                OrderColors[
                                                    transaction.data
                                                        .status as OrderStatus
                                                ]
                                            }`}
                                        >
                                            {transaction.data.status}
                                        </span>
                                    </td>
                                    <td className="px-2 py-2 bg-white rounded-r-lg border border-l-transparent border-slate-300">
                                        <span>
                                            <Link
                                                href={`/admin/transactions/${transaction.data.reference}`}
                                                className="px-2 py-1.5 bg-primary-100/20 text-primary-800/70 rounded-lg font-bold clickable border border-primary-100"
                                            >
                                                View Transaction
                                            </Link>
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {isFetching && (
                        <span className="absolute bottom-2 left-1/2 -translate-x-1/2">
                            <span className="animate-spin inline-block w-12 h-12 rounded-full border-4 border-primary-100/30 border-t-primary-800/60"></span>
                        </span>
                    )}
                    {isEndReached && (
                        <span className="text-primary-800/50 font-bold text-2xl absolute bottom-2 left-1/2 -translate-x-1/2 w-full text-center">
                            No more Transactions to Show
                        </span>
                    )}
                </div>
            </div>
        </section>
    );
};

export const getServerSideProps: GetServerSideProps = ProtectDashboard(
    async (_: GetServerSidePropsContext, currentUser: User) => {
        const transactions = await getTransactions();
        return {
            props: {
                transactions,
            },
        };
    },
);

Transactions.getLayout = (page: React.ReactElement, pageProps: any) => {
    return <DashboardLayout>{page}</DashboardLayout>;
};

export default Transactions;
