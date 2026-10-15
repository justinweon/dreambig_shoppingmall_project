interface QuantitySelectorProps {
  value: number;
  onChange: (quantity: number) => void;
  disabled?: boolean;
}

export default function QuantitySelector({
  value,
  onChange,
  disabled = false,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        aria-label="수량 줄이기"
        disabled={disabled || value <= 1}
        onClick={() => onChange(Math.max(1, value - 1))}
        className="flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-md border border-border bg-background text-lg text-foreground enabled:hover:bg-accent enabled:active:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground disabled:cursor-not-allowed disabled:opacity-40"
      >
        −
      </button>

      <span
        aria-live="polite"
        aria-label={`선택 수량 ${value}개`}
        className="min-w-10 text-center font-medium tabular-nums"
      >
        {value}
      </span>

      <button
        type="button"
        aria-label="수량 늘리기"
        disabled={disabled || value >= Number.MAX_SAFE_INTEGER}
        onClick={() => onChange(value + 1)}
        className="flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-md border border-border bg-background text-lg text-foreground enabled:hover:bg-accent enabled:active:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground disabled:cursor-not-allowed disabled:opacity-40"
      >
        +
      </button>
    </div>
  );
}
