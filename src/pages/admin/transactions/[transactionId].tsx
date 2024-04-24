import DashboardLayout from '@/layouts/DashboardLayout';
import { getSingleTransaction } from '@/service/firebase';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { createContext, useContext } from 'react';

interface PageProps {
    transaction: Transaction;
    transactionId: string;
}

const TraansactionDetailsContext = createContext<Transaction | null>(null);

function Transaction({ transaction, transactionId }: PageProps) {
    return (
        <div className="py-10 text-slate-600 flex flex-col gap-10">
            <Head>
                <title>
                    {transactionId} | Transaction | Admin | Daat Foods
                </title>
            </Head>
            <h1 className="text-3xl font-bold text-slate-600">
                <Link href="/admin/transactions" className="opacity-70">
                    Transaction
                </Link>{' '}
                / {transactionId}
            </h1>
            <TraansactionDetailsContext.Provider value={transaction}>
                <div className="flex flex-wrap gap-6">
                    <div className="flex flex-col grow gap-6">
                        <TransactionSummary />
                        <CustomerDetails />
                    </div>
                </div>
            </TraansactionDetailsContext.Provider>
        </div>
    );
}

export default Transaction;

Transaction.getLayout = (page: React.ReactElement, pageProps: any) => (
    <DashboardLayout>{page}</DashboardLayout>
);

export const getServerSideProps: GetServerSideProps = async (
    ctx: GetServerSidePropsContext,
) => {
    const { transactionId } = ctx.query;

    if (typeof transactionId !== 'string') {
        return {
            redirect: {
                destination: '/admin',
                statusCode: 301,
            },
        };
    }

    const transaction = await getSingleTransaction(transactionId);

    return {
        props: {
            transaction: transaction.data,
            transactionId: transaction.id,
        },
    };
};

function TransactionSummary() {
    const transaction = useContext(TraansactionDetailsContext);

    return (
        <section className="bg-white p-4 flex flex-col gap-3 rounded-lg border border-slate-300">
            <h2 className="text-lg font-semibold text-slate-800">
                Transaction Summary
            </h2>
            <div className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between">
                    <span>Transaction Status</span>
                    <span className="font-semibold">
                        {transaction?.data.status}
                    </span>
                </div>
                <div className="flex items-baseline justify-between">
                    <span>Transaction Refrence</span>
                    <span className="font-semibold">
                        {transaction?.data.reference}
                    </span>
                </div>
                <div className="flex items-baseline justify-between">
                    <span>Transaction Amount</span>
                    <span className="font-semibold">
                        ₦
                        {(
                            Number(transaction?.data.amount) / 100
                        )?.toLocaleString()}
                    </span>
                </div>
                <div className="flex items-baseline justify-between">
                    <span>Payment Chanel</span>
                    <span className="font-semibold">
                        {transaction?.data.channel}
                    </span>
                </div>
                <div className="flex items-baseline justify-between">
                    <span>Transaction Date</span>
                    <span className="font-semibold">
                        {new Date(
                            transaction?.data.created_at || '',
                        ).toDateString()}
                    </span>
                </div>
                <div className="flex items-baseline justify-between">
                    <span>Transaction Time</span>
                    <span className="font-semibold">
                        {new Date(
                            transaction?.data.created_at || '',
                        ).toLocaleTimeString()}
                    </span>
                </div>
                <div className="flex items-baseline justify-between">
                    <span>Payment Currency</span>
                    <span className="font-semibold">
                        {transaction?.data.currency}
                    </span>
                </div>
            </div>
        </section>
    );
}
function CustomerDetails() {
    const transaction = useContext(TraansactionDetailsContext);

    return (
        <section className="bg-white p-4 flex flex-col gap-3 rounded-lg border border-slate-300">
            <h2 className="text-lg font-semibold text-slate-800">
                Customer Details
            </h2>
            <div className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between">
                    <span>Full name</span>
                    <span className="font-semibold">
                        {transaction?.data.metadata?.user?.full_name}
                    </span>
                </div>
                <div className="flex items-baseline justify-between">
                    <span>Email</span>
                    <span className="font-semibold">
                        {transaction?.data.metadata?.user?.email}
                    </span>
                </div>
                <div className="flex items-baseline justify-between">
                    <span>Phone number</span>
                    <span className="font-semibold">
                        {transaction?.data.metadata?.user?.phone_number}
                    </span>
                </div>
            </div>
        </section>
    );
}
