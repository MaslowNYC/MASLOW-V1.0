interface FormatOptions extends Intl.NumberFormatOptions {
  type?: 'currency' | 'percent' | 'decimal';
}

/**
 * Formats a number with commas at thousand and million marks.
 * Handles edge cases like null, undefined, zero, and negative numbers.
 * Supports currency and percentage formatting.
 */
export const formatNumber = (value: number | string | null | undefined, options: FormatOptions = {}): string => {
  // Handle null, undefined, or empty string
  if (value === null || value === undefined || value === '') {
    return '0';
  }

  // Handle string inputs that might contain commas
  const cleanValue = typeof value === 'string' ? value.replace(/,/g, '') : value;
  const num = Number(cleanValue);

  // Handle invalid numbers
  if (isNaN(num)) {
    return '0';
  }

  // Handle Currency
  if (options.type === 'currency') {
    const { type, ...restOptions } = options;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      ...restOptions
    }).format(num);
  }

  // Handle Percentage (assumes input is like 65 for 65%, not 0.65)
  if (options.type === 'percent') {
    const { type, ...restOptions } = options;
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 1,
      ...restOptions
    }).format(num) + '%';
  }

  // Default Decimal Formatting
  const { type, ...restOptions } = options;
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    ...restOptions
  }).format(num);
};

/**
 * Formats a number as currency with exactly 2 decimal places.
 * Use this for displaying calculated monetary values to avoid $1.3333.
 */
export const formatCurrency = (value: number | string | null | undefined, showCents = true): string => {
  if (value === null || value === undefined || value === '') {
    return showCents ? '$0.00' : '$0';
  }

  const cleanValue = typeof value === 'string' ? value.replace(/,/g, '') : value;
  const num = Number(cleanValue);

  if (isNaN(num)) {
    return showCents ? '$0.00' : '$0';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0
  }).format(num);
};

/**
 * Formats a number with commas and exactly 2 decimal places (no $ sign).
 * Use this for input displays where you add the $ separately.
 */
export const formatDecimal = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined || value === '') {
    return '0.00';
  }

  const cleanValue = typeof value === 'string' ? value.replace(/,/g, '') : value;
  const num = Number(cleanValue);

  if (isNaN(num)) {
    return '0.00';
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
};
