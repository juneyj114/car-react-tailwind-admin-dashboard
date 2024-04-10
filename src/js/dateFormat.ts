export const formatYMD = (date: Date): string => {
  const year = date.getFullYear();
  const month = formatTwoDigitPart(date.getMonth() + 1);
  const day = formatTwoDigitPart(date.getDate());
  return `${year}-${month}-${day}`;
}

export const formatTwoDigitPart = (value) => {
  return String(value).padStart(2, '0');
};