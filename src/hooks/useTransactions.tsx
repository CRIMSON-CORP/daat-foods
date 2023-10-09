import axios from '@/lib/axios';
import { useCallback, useEffect, useRef, useState } from 'react';

function useTransactions(currentList: Transaction[] = []) {
    const currentListCount = useRef(currentList.length);
    const listContainerRef = useRef<HTMLDivElement>(null);

    const [transactions, setTransactions] = useState(currentList);
    const [requestStatus, setRequestStatus] =
        useState<FetchRequestStatus>('idle');
    const [endReached, setEndReached] = useState(false);

    const fetchMore = useCallback(async () => {
        setRequestStatus('loading');
        try {
            const { data } = await axios.get('/admin/get-more-transactions', {
                params: {
                    start_at: currentListCount.current,
                    end_at: currentListCount.current + 20,
                },
            });
            if (data.orders.length === 0) setEndReached(true);
            setTransactions((prev) => {
                const appendedList = [...prev, ...data.orders];
                currentListCount.current = appendedList.length;
                return appendedList;
            });
        } catch (error) {
        } finally {
            setRequestStatus('idle');
        }
    }, []);

    useEffect(() => {
        const { current: listContainer } = listContainerRef;

        const handleListContainerSCrollEvent = (e: Event) => {
            if (
                Number(listContainer?.scrollTop) ===
                    Number(listContainer?.scrollHeight) -
                        Number(listContainer?.clientHeight) &&
                requestStatus === 'idle' &&
                !endReached
            ) {
                console.log('scrolling');

                fetchMore();
            }
        };

        listContainer?.addEventListener(
            'scroll',
            handleListContainerSCrollEvent,
        );

        return () => {
            listContainer?.removeEventListener(
                'scroll',
                handleListContainerSCrollEvent,
            );
        };
    }, [endReached, fetchMore, requestStatus]);

    return {
        listContainerRef,
        transactions,
        isFetching: requestStatus === 'loading',
        isEndReached: endReached,
    };
}

export default useTransactions;
