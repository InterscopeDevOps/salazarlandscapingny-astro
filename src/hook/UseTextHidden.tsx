import { useEffect, useState } from 'react';

interface UseTextHiddenProps {
    text?: string; // texto opcional
}

export default function UseTextHidden({ text = '' }: UseTextHiddenProps) {
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        // Fijo: el texto aparecerá después de 1 segundo (1000 ms)
        const timer = setTimeout(() => {
            setDisplayText(text);
        }, 1000);

        return () => clearTimeout(timer);
    }, [text]);

    return <span data-nosnippet>{displayText}</span>;
}