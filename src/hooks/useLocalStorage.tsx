import { useEffect, useState } from 'react';

function useLocalStorage(key: string) {
    const [value, setValue] = useState('');

    useEffect(() => {
        const localStorageValue = localStorage.getItem(key);

        if (localStorageValue !== undefined) {
            setValue(JSON.stringify(localStorageValue));
        }
    }, [key]);

    const set = (_value: any) => {
        localStorage.setItem('key', JSON.stringify(_value));
    };

    return {
        value,
        set,
    };
}

export default useLocalStorage;
