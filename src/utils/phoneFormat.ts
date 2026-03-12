// Phone number formatting utilities
// All phone numbers stored in Supabase should use E.164 format: +12125550100

/**
 * Convert a phone number to E.164 format for storage
 * @param phone Raw phone input (any format)
 * @returns E.164 formatted number or null if invalid
 */
export function toE164(phone: string): string | null {
  const digits = phone.replace(/\D/g, '');

  // 10-digit US number
  if (digits.length === 10) {
    return `+1${digits}`;
  }

  // 11-digit US number starting with 1
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }

  // Already has country code (12+ digits starting with country code)
  if (digits.length >= 11 && digits.length <= 15) {
    return `+${digits}`;
  }

  return null; // Invalid format
}

/**
 * Format E.164 phone for display: +12125550100 → (212) 555-0100
 * @param e164 Phone in E.164 format
 * @returns Human-readable format or original if not US
 */
export function formatForDisplay(e164: string): string {
  if (!e164) return '';

  // US number: +1XXXXXXXXXX
  if (e164.startsWith('+1') && e164.length === 12) {
    const area = e164.slice(2, 5);
    const prefix = e164.slice(5, 8);
    const line = e164.slice(8, 12);
    return `(${area}) ${prefix}-${line}`;
  }

  // Non-US: just return as-is
  return e164;
}

/**
 * Validate phone number format
 * @param phone Phone number to validate
 * @returns true if valid E.164 or convertible to E.164
 */
export function isValidPhone(phone: string): boolean {
  return toE164(phone) !== null;
}
