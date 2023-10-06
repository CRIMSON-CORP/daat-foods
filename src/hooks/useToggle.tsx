import { useState } from 'react';

function useToggle(defaultValue: boolean = false) {
    const [state, setState] = useState(defaultValue);
    const open = () => {
        setState(true);
    };
    const close = () => {
        setState(false);
    };
    const toggle = () => {
        setState((prev) => !prev);
    };
    const reset = () => {
        setState(defaultValue);
    };
    return {
        state,
        open,
        close,
        toggle,
        reset,
    };
}

export default useToggle;
