export function maskDigits(
  raw: string,
  cursor: number,
  format: (digits: string) => string,
  maxDigits: number,
) {
  const safeCursor = Math.max(0, Math.min(cursor, raw.length));
  const digitsBefore = raw.slice(0, safeCursor).replace(/\D/g, '').length;
  const digits = raw.replace(/\D/g, '').slice(0, maxDigits);
  const keptBefore = Math.min(digitsBefore, digits.length);
  const value = format(digits);

  if (keptBefore === 0) return { value, cursor: 0 };

  let seen = 0;
  for (let index = 0; index < value.length; index += 1) {
    if (/\d/.test(value[index])) seen += 1;
    if (seen === keptBefore) return { value, cursor: index + 1 };
  }
  return { value, cursor: value.length };
}

export function formatPhone(digits: string) {
  const value = digits.slice(0, 11);
  if (!value) return '';
  if (value.length < 3) return `(${value}`;
  const head = `(${value.slice(0, 2)}) ${value.slice(2, 7)}`;
  if (value.length <= 7) return head;
  return `${head}-${value.slice(7, 11)}`;
}

export function formatDate(digits: string) {
  const value = digits.slice(0, 8);
  if (value.length <= 2) return value;
  if (value.length <= 4) return `${value.slice(0, 2)}/${value.slice(2)}`;
  return `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
}

export function formatCep(digits: string) {
  const value = digits.slice(0, 8);
  if (value.length <= 5) return value;
  return `${value.slice(0, 5)}-${value.slice(5)}`;
}

export function formatYear(digits: string) {
  return digits.slice(0, 4);
}

export function formatMonthYear(digits: string) {
  const value = digits.slice(0, 6);
  if (value.length <= 2) return value;
  return `${value.slice(0, 2)}/${value.slice(2)}`;
}
