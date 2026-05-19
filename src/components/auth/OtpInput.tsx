import { CSSProperties, KeyboardEvent, useRef } from 'react';

interface OtpInputProps {
  value: string[];
  onChange: (digits: string[]) => void;
  length?: number;
  disabled?: boolean;
  containerClassName?: string;
  boxClassName?: string;
  boxStyle?: CSSProperties;
}

export default function OtpInput({
  value,
  onChange,
  length = 6,
  disabled,
  containerClassName,
  boxClassName,
  boxStyle,
}: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleDigitChange = (index: number, raw: string) => {
    if (!/^\d*$/.test(raw)) return;
    const next = [...value];
    next[index] = raw.slice(-1);
    onChange(next);
    if (raw && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  return (
    <div className={containerClassName ?? 'flex gap-2 justify-center'}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => { refs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="one-time-code"
          maxLength={1}
          value={value[index] ?? ''}
          onChange={(e) => handleDigitChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className={boxClassName}
          style={boxStyle}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
