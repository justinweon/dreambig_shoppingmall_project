interface QuantitySelectorProps {
  value: number;
  onChange: (quantity: number) => void;
}

export default function QuantitySelector({
  value,
  onChange,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        aria-label="수량 줄이기"
        disabled={value <= 1}
        onClick={() => onChange(Math.max(1, value - 1))}
        className="rounded border px-3 py-1 disabled:opacity-40"
      >
        −
      </button>

      <span aria-live="polite">{value}</span>

      <button
        type="button"
        aria-label="수량 늘리기"
        onClick={() => onChange(value + 1)}
        className="rounded border px-3 py-1"
      >
        +
      </button>
    </div>
  );
}