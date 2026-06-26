// Hiển thị phần trăm thay đổi với màu xanh/đỏ.

export function DeltaBadge({ deltaPct }: { deltaPct: number | null }) {
    if (deltaPct === null || deltaPct === undefined) {
        return <span className="chip">--</span>;
    }
    const isPositive = deltaPct >= 0;
    return (
        <span className={`chip ${isPositive ? "chip-success" : "chip-danger"}`}>
            {isPositive ? "▲" : "▼"} {Math.abs(deltaPct).toFixed(1)}%
        </span>
    );
}