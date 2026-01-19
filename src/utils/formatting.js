
/**
 * Formats a number with commas at thousand and million marks.
 * Handles edge cases like null, undefined, zero, and negative numbers.
 * Supports currency and percentage formatting.
 * 
 * @param {number|string} value - The number to format
 * @param {Object} options - formatting options
 * @param {string} [options.type] - 'currency' | 'percent' | 'decimal' (default)
 * @param {Intl.NumberFormatOptions} [options] - Standard Intl.NumberFormat options
 * @returns {string} The formatted number string
 */
export const formatNumber = (value, options = {}) => {
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
