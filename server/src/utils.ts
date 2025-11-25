export const getToday = (digit: number) => {
  const year = digit === 6 ? '2-digit' : 'numeric';
  const sixDigit = new Date()
    .toLocaleDateString('ko-KR', {
      year,
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\ |\./g, '');
  return sixDigit;
};
