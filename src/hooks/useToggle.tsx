import { useCallback, useState } from 'react';

function useToggle(defaultValue: boolean = false) {
    const [state, setState] = useState(defaultValue);
    const open = useCallback(() => {
        setState(true);
    }, []);
    const close = useCallback(() => {
        setState(false);
    }, []);
    const toggle = useCallback(() => {
        setState((prev) => !prev);
    }, []);
    const reset = useCallback(() => {
        setState(defaultValue);
    }, [defaultValue]);
    return {
        state,
        open,
        close,
        toggle,
        reset,
    };
}

export default useToggle;
