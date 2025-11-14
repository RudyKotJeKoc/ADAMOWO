/**
 * Utility functions for anonymizing sensitive data in public content
 *
 * Use these functions to mask personal information, addresses,
 * financial data, and identification numbers while maintaining
 * readability and context.
 */

export interface AnonymizationOptions {
  /** Preserve partial information (e.g., first letter, city) */
  partial?: boolean;
  /** Custom replacement text */
  replacement?: string;
  /** Keep structural format (e.g., XXX-XXX-XXX for phone) */
  preserveFormat?: boolean;
}

/**
 * Anonymizes personal names
 * @example anonymizeName("Jan Kowalski") → "J. K." or "[imię i nazwisko]"
 */
export function anonymizeName(name: string, options: AnonymizationOptions = {}): string {
  if (!name?.trim()) return name;

  if (options.replacement) {
    return options.replacement;
  }

  if (options.partial) {
    const parts = name.trim().split(/\s+/);
    return parts.map(part => part[0] + '.').join(' ');
  }

  return '[imię i nazwisko]';
}

/**
 * Anonymizes addresses
 * @example anonymizeAddress("ul. Kwiatowa 15, 00-001 Warszawa") → "ul. [...]  15, Warszawa" (partial)
 * @example anonymizeAddress("ul. Kwiatowa 15, 00-001 Warszawa") → "[adres]" (full)
 */
export function anonymizeAddress(address: string, options: AnonymizationOptions = {}): string {
  if (!address?.trim()) return address;

  if (options.replacement) {
    return options.replacement;
  }

  if (options.partial) {
    // Keep city, remove street details
    const cityMatch = address.match(/(\d{2}-\d{3}\s+)?([A-ZĆŁŚŻŹ][a-ząćęłńóśźż]+)$/);
    const city = cityMatch ? cityMatch[2] : '';
    const streetType = address.match(/^(ul\.|al\.|pl\.)/)?.[1] || '';

    if (city && streetType) {
      return `${streetType} [...], ${city}`;
    }
    return '[adres - szczegóły ukryte]';
  }

  return '[adres]';
}

/**
 * Anonymizes monetary values
 * @example anonymizeMonetaryValue("1234567.89 PLN") → "~1.2M PLN" (partial)
 * @example anonymizeMonetaryValue("1234567.89 PLN") → "[kwota]" (full)
 */
export function anonymizeMonetaryValue(value: string | number, options: AnonymizationOptions = {}): string {
  if (value === null || value === undefined) return '';

  if (options.replacement) {
    return options.replacement;
  }

  const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.-]/g, '')) : value;
  const currency = typeof value === 'string' ? value.match(/[A-Z]{3}$/)?.[0] || 'PLN' : 'PLN';

  if (isNaN(numValue)) return '[kwota]';

  if (options.partial) {
    // Round to approximate range
    if (numValue >= 1000000) {
      return `~${(numValue / 1000000).toFixed(1)}M ${currency}`;
    } else if (numValue >= 1000) {
      return `~${(numValue / 1000).toFixed(0)}K ${currency}`;
    } else {
      return `~${Math.round(numValue / 100) * 100} ${currency}`;
    }
  }

  return '[kwota]';
}

/**
 * Anonymizes Polish identification numbers (PESEL, NIP, REGON)
 * @example anonymizeIdNumber("12345678901", "PESEL") → "123***789**" (partial)
 * @example anonymizeIdNumber("12345678901", "PESEL") → "[PESEL]" (full)
 */
export function anonymizeIdNumber(
  idNumber: string,
  type: 'PESEL' | 'NIP' | 'REGON' | 'KRS' | string = 'ID',
  options: AnonymizationOptions = {}
): string {
  if (!idNumber?.trim()) return idNumber;

  if (options.replacement) {
    return options.replacement;
  }

  const cleaned = idNumber.replace(/[^0-9]/g, '');

  if (options.partial && options.preserveFormat) {
    // Show first 3 and last 2 digits
    if (cleaned.length >= 5) {
      const first = cleaned.substring(0, 3);
      const last = cleaned.substring(cleaned.length - 2);
      const middle = '*'.repeat(cleaned.length - 5);
      return `${first}${middle}${last}`;
    }
  }

  return `[${type}]`;
}

/**
 * Anonymizes phone numbers
 * @example anonymizePhoneNumber("+48 123 456 789") → "+48 *** *** 789" (partial)
 * @example anonymizePhoneNumber("+48 123 456 789") → "[numer telefonu]" (full)
 */
export function anonymizePhoneNumber(phoneNumber: string, options: AnonymizationOptions = {}): string {
  if (!phoneNumber?.trim()) return phoneNumber;

  if (options.replacement) {
    return options.replacement;
  }

  if (options.partial && options.preserveFormat) {
    // Keep country code and last 3 digits
    const match = phoneNumber.match(/^(\+\d{1,3})?[\s.-]*(\d{3})[\s.-]*(\d{3})[\s.-]*(\d{3})$/);
    if (match) {
      const [, country = '', , , last] = match;
      return `${country} *** *** ${last}`;
    }
  }

  return '[numer telefonu]';
}

/**
 * Anonymizes email addresses
 * @example anonymizeEmail("jan.kowalski@example.com") → "j***i@example.com" (partial)
 * @example anonymizeEmail("jan.kowalski@example.com") → "[adres email]" (full)
 */
export function anonymizeEmail(email: string, options: AnonymizationOptions = {}): string {
  if (!email?.trim()) return email;

  if (options.replacement) {
    return options.replacement;
  }

  if (options.partial) {
    const match = email.match(/^(.)[^@]*(.)?@(.+)$/);
    if (match) {
      const [, first, lastBeforeAt = '', domain] = match;
      return `${first}***${lastBeforeAt}@${domain}`;
    }
  }

  return '[adres email]';
}

/**
 * Anonymizes court case numbers and document signatures
 * @example anonymizeDocumentSignature("I C 1234/23") → "I C ***/23" (partial)
 * @example anonymizeDocumentSignature("I C 1234/23") → "[sygnatura akt]" (full)
 */
export function anonymizeDocumentSignature(signature: string, options: AnonymizationOptions = {}): string {
  if (!signature?.trim()) return signature;

  if (options.replacement) {
    return options.replacement;
  }

  if (options.partial && options.preserveFormat) {
    // Keep format but hide specific numbers
    const match = signature.match(/^([A-Z\s]+)(\d+)\/(\d+)$/);
    if (match) {
      const [, prefix, , year] = match;
      return `${prefix}***/${year}`;
    }
  }

  return '[sygnatura akt]';
}

/**
 * Anonymizes dates while preserving context
 * @example anonymizeDate("2023-05-15", {partial: true}) → "maj 2023"
 * @example anonymizeDate("2023-05-15") → "[data]"
 */
export function anonymizeDate(date: string | Date, options: AnonymizationOptions = {}): string {
  if (!date) return '';

  if (options.replacement) {
    return options.replacement;
  }

  if (options.partial) {
    const d = typeof date === 'string' ? new Date(date) : date;
    const months = ['styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec',
                    'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień'];
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  return '[data]';
}

/**
 * Batch anonymize multiple fields in an object
 * @example
 * anonymizeObject({
 *   name: "Jan Kowalski",
 *   address: "ul. Kwiatowa 15",
 *   pesel: "12345678901"
 * }, {
 *   name: 'name',
 *   address: 'address',
 *   pesel: {type: 'PESEL', partial: true}
 * })
 */
export function anonymizeObject<T extends Record<string, any>>(
  obj: T,
  fieldConfig: Record<keyof T, 'name' | 'address' | 'monetary' | 'phone' | 'email' | { type: string; options?: AnonymizationOptions }>
): T {
  const result = { ...obj };

  for (const [field, config] of Object.entries(fieldConfig)) {
    if (!(field in result)) continue;

    const value = result[field as keyof T];
    if (typeof value !== 'string' && typeof value !== 'number') continue;

    let anonymized: string;

    if (typeof config === 'string') {
      switch (config) {
        case 'name':
          anonymized = anonymizeName(String(value));
          break;
        case 'address':
          anonymized = anonymizeAddress(String(value));
          break;
        case 'monetary':
          anonymized = anonymizeMonetaryValue(value);
          break;
        case 'phone':
          anonymized = anonymizePhoneNumber(String(value));
          break;
        case 'email':
          anonymized = anonymizeEmail(String(value));
          break;
        default:
          anonymized = String(value);
      }
    } else {
      const { type, options = {} } = config;
      switch (type) {
        case 'PESEL':
        case 'NIP':
        case 'REGON':
        case 'KRS':
          anonymized = anonymizeIdNumber(String(value), type, options);
          break;
        case 'signature':
          anonymized = anonymizeDocumentSignature(String(value), options);
          break;
        case 'date':
          anonymized = anonymizeDate(String(value), options);
          break;
        default:
          anonymized = String(value);
      }
    }

    result[field as keyof T] = anonymized as any;
  }

  return result;
}
