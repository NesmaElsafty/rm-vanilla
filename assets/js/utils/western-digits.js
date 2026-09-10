/**
 * Normalize Arabic-Indic / Persian digits to Western ASCII digits.
 * Safe for visitor-facing copy; leave technical numbers alone.
 */
export function normalizeWesternDigits(value) {
  if (value == null) return value;
  const map = {
    '٠': '0',
    '١': '1',
    '٢': '2',
    '٣': '3',
    '٤': '4',
    '٥': '5',
    '٦': '6',
    '٧': '7',
    '٨': '8',
    '٩': '9',
    '۰': '0',
    '۱': '1',
    '۲': '2',
    '۳': '3',
    '۴': '4',
    '۵': '5',
    '۶': '6',
    '۷': '7',
    '۸': '8',
    '۹': '9',
  };
  return String(value).replace(/[٠-٩۰-۹]/g, (ch) => map[ch] ?? ch);
}
