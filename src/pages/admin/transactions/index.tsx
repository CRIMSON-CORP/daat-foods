import useTransactions from '@/hooks/useTransactions';
import DashboardLayout from '@/layouts/DashboardLayout';
import { getTransaction, getTransactions } from '@/service/firebase';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';

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

    const {
        query: { search_query },
    } = useRouter();

    return (
        <section className="flex flex-col gap-4 h-full overflow-auto min-h-80 py-10">
            <h2 className="text-3xl font-bold text-slate-800">Transactions</h2>
            <form className="flex items-center gap-4 max-w-xl whitespace-nowrap">
                <input
                    key={search_query as string | undefined}
                    name="search_query"
                    defaultValue={search_query}
                    className="px-4 py-2 text-slate-500 bg-white border border-slate-300 rounded-lg w-full"
                    placeholder="Search Order by ID, email, name, phone number, transaction ref"
                />
                <button className="py-2 px-4 bg-primary-800/50 text-white rounded-lg">
                    Search
                </button>
                {search_query && (
                    <Link
                        href=""
                        className="py-2 px-4 bg-primary-800/10 text-primary-800/60 rounded-lg"
                    >
                        Clear Search
                    </Link>
                )}
            </form>
            <div ref={listContainerRef} className="overflow-auto">
                <div className="relative grid gap-4 pr-2 pb-16">
                    <table className="text-slate-500 w-full overflow-auto border-separate border-spacing-0 text-sm border-spacing-y-4 -mt-4 max-h-full whitespace-nowrap">
                        <thead>
                            <tr className="sticky top-0 left-0">
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
                                                transaction.data.metadata?.user
                                                    ?.full_name
                                            }
                                        </span>
                                    </td>
                                    <td className="px-2 py-2 bg-white border-y border-slate-300 underline">
                                        <a
                                            href={`tel:${transaction.data.customer.phone}`}
                                        >
                                            <span>
                                                {
                                                    transaction.data.metadata
                                                        ?.user?.phone_number
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
                                                    transaction.data.metadata
                                                        ?.user?.email
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

export const getServerSideProps: GetServerSideProps = async (
    context: GetServerSidePropsContext,
) => {
    const { search_query } = context.query;

    return {
        props: {
            transactions: search_query
                ? await getTransaction(search_query as string)
                : await getTransactions(),
        },
    };
};

Transactions.getLayout = (page: React.ReactElement, pageProps: any) => {
    return <DashboardLayout>{page}</DashboardLayout>;
};

export default Transactions;
