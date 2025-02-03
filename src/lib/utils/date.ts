export function convertToLocalDateString(
  date: Date,
  shortFormat = false,
): string {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: shortFormat ? "short" : "long",
    day: "numeric",
  };

  return localDate.toLocaleDateString("en-US", options);
}
