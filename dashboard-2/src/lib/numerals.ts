// Convert Latin numerals to Eastern Arabic numerals (٠–٩) for Arabic context.
const AR_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

export function ar(input: string | number): string {
  const s = String(input);
  return s.replace(/[0-9]/g, (d) => AR_DIGITS[Number(d)]);
}

export function pad2(n: number): string {
  return n.toString().padStart(2, '0');
}
