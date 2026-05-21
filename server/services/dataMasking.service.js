export function maskSensitiveData(text = "") {
  let masked = text;

  // PAN
  masked = masked.replace(
    /([A-Z]{3})[A-Z]{2}([0-9]{2})[0-9]{2}([A-Z])/gi,
    "$1****$2$3"
  );

  // Phone
  masked = masked.replace(
    /\b([6-9]{2})\d{6}(\d{2})\b/g,
    "$1******$2"
  );

  // Aadhaar
  masked = masked.replace(
  /\b(\d{2})\d{2}\s?\d{4}\s?\d{2}(\d{2})\b/g,
  "$1********$2"
);

  // Email
  masked = masked.replace(
    /([A-Z0-9._%+-]{2})[A-Z0-9._%+-]*(@[A-Z0-9.-]+\.[A-Z]{2,})/gi,
    "$1****$2"
  );

  // Bank account
  masked = masked.replace(
    /\b(\d{2})\d{6,12}(\d{2})\b/g,
    "$1******$2"
  );

  return masked;
}