export const formatMobileInput = (val: string): string => {
  let cleaned = val.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    return cleaned.slice(0, 11);
  }
  return cleaned.slice(0, 10);
};

export const normalizeMobileNumber = (val: string): string => {
  let cleaned = val.replace(/\D/g, '');
  return cleaned.replace(/^0+/, '').slice(0, 10);
};

export const isValidIndianMobileNumber = (val: string): boolean => {
  const normalized = normalizeMobileNumber(val);
  return /^[6-9]\d{9}$/.test(normalized);
};
