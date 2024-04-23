import axios from '@/lib/axios';
import { useCallback, useEffect, useRef, useState } from 'react';

function useOrders(currentList: Order[] = []) {
    const currentListCount = useRef(currentList.length);
    const listContainerRef = useRef<HTMLDivElement>(null);

    const [orders, setOrders] = useState(currentList);
    const [requestStatus, setRequestStatus] =
        useState<FetchRequestStatus>('idle');
    const [endReached, setEndReached] = useState(false);

    const fetchMore = useCallback(async () => {
        setRequestStatus('loading');
        try {
            const { data } = await axios.get('/admin/get-more-orders', {
                params: {
                    start_at: currentListCount.current,
                    end_at: currentListCount.current + 20,
                },
            });
            if (data.orders.length === 0) setEndReached(true);
            setOrders((prev) => {
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
                Number(listContainer?.scrollTop) >=
                    Number(listContainer?.scrollHeight) -
                        Number(listContainer?.clientHeight) -
                        1 &&
                requestStatus === 'idle' &&
                !endReached
            ) {
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
        orders,
        isFetching: requestStatus === 'loading',
        isEndReached: endReached,
    };
}

export default useOrders;
