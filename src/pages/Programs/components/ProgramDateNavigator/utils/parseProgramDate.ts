export function parseProgramDate(dateYYYYMMDD: string) {
  const [year, month, day] = dateYYYYMMDD.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  const formattedDate = date.toLocaleDateString("es-PE", options);
  return formattedDate;
}
