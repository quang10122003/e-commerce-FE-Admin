// hooks/useCssVars.ts
// Hook đọc giá trị thực của biến CSS từ :root (dành cho Recharts).

import { useEffect, useRef, useState } from "react";

export function useCssVars(names: string[]) {
    const [vars, setVars] = useState<Record<string, string>>({});
    const isMounted = useRef(false);

    useEffect(() => {
        if (isMounted.current) return;
        const styles = getComputedStyle(document.documentElement);
        const next: Record<string, string> = {};
        for (const name of names) {
            next[name] = styles.getPropertyValue(name).trim();
        }
        setVars(next);
        isMounted.current = true;
    }, [names]);

    return vars;
}