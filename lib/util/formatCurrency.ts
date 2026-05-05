const COMPACT_CURRENCY_UNITS = [
  { value: 1_000_000_000, suffix: "B" },
  { value: 1_000_000, suffix: "M" },
  { value: 1_000, suffix: "K" },
];

const compactCurrencyFormatter = new Intl.NumberFormat("vi-VN", {
  maximumFractionDigits: 3,
});

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  maximumFractionDigits: 0,
});

// format tiền theo viết tắt
export function formatCompactCurrency(value: number) {
  if (!Number.isFinite(value)) {
    return "0";
  }

  const sign = value < 0 ? "-" : "";
  const absoluteValue = Math.abs(value);
  const unit = COMPACT_CURRENCY_UNITS.find(
    (compactUnit) => absoluteValue >= compactUnit.value,
  );

  if (!unit) {
    return `${sign}${compactCurrencyFormatter.format(absoluteValue)}`;
  }

  return `${sign}${compactCurrencyFormatter.format(absoluteValue / unit.value)}${unit.suffix}`;
}

// format tiền theo vnd
export function formatCurrency(value: number) {
  if (!Number.isFinite(value)) {
    return "0 vnd";
  }

  return `${currencyFormatter.format(value)} vnd`;
}
