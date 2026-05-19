import { ChangeEvent, CSSProperties } from 'react';

interface PhoneInputProps {
  value: string;
  onChange: (formatted: string) => void;
  countryCode?: string;
  countryFlag?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  // Wrapper around the prefix box + input
  containerClassName?: string;
  // Country-code/flag prefix box
  prefixClassName?: string;
  prefixStyle?: CSSProperties;
  // <input> element
  inputClassName?: string;
  inputStyle?: CSSProperties;
}

export function formatUSPhone(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
  return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
}

export default function PhoneInput({
  value,
  onChange,
  countryCode = '+1',
  countryFlag = '🇺🇸',
  placeholder = '(212) 555-0100',
  required,
  disabled,
  containerClassName,
  prefixClassName,
  prefixStyle,
  inputClassName,
  inputStyle,
}: PhoneInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(formatUSPhone(e.target.value));
  };

  return (
    <div className={containerClassName ?? 'flex gap-2'}>
      <div className={prefixClassName} style={prefixStyle}>
        {countryFlag} {countryCode}
      </div>
      <input
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className={inputClassName}
        style={inputStyle}
        required={required}
        disabled={disabled}
      />
    </div>
  );
}
