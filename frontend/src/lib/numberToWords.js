const ONES = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];

const TENS = [
  "",
  "",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
];

const SCALES = ["", " thousand", " million", " billion", " trillion"];

function belowThousand(value) {
  if (value < 20) return ONES[value];
  if (value < 100) {
    const tens = TENS[Math.floor(value / 10)];
    const rest = value % 10;
    return rest ? `${tens}-${ONES[rest]}` : tens;
  }
  const hundreds = `${ONES[Math.floor(value / 100)]} hundred`;
  const rest = value % 100;
  return rest ? `${hundreds} and ${belowThousand(rest)}` : hundreds;
}

/* "450000" -> "Four hundred and fifty thousand". Shown under the rent field so
   the landlord can see what they typed in words before publishing. */
export function numberToWords(value) {
  const amount = Math.floor(Number(String(value).replace(/[^\d]/g, "")));
  if (!Number.isFinite(amount) || amount <= 0) return "";

  const groups = [];
  let rest = amount;
  while (rest > 0) {
    groups.push(rest % 1000);
    rest = Math.floor(rest / 1000);
  }

  const words = groups
    .map((group, index) =>
      group === 0 ? "" : `${belowThousand(group)}${SCALES[index]}`,
    )
    .filter(Boolean)
    .reverse()
    .join(", ");

  return words.charAt(0).toUpperCase() + words.slice(1);
}

/* Keeps the rent field to digits with thousand separators ("450,000"). */
export function formatAmountInput(value) {
  const digits = String(value ?? "")
    .replace(/[^\d]/g, "")
    .slice(0, 12);
  if (!digits) return "";
  return Number(digits).toLocaleString("en-NG");
}

/* The API stores rent as digits only, so the separators are stripped on submit. */
export function amountToDigits(value) {
  return String(value ?? "").replace(/[^\d]/g, "");
}
