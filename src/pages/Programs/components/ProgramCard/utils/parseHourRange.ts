export const parseHourRange = (startStr: string, endStr: string) => {
  const start = new Date(startStr);
  const end = new Date(endStr);
  const startH = start.getHours().toString().padStart(2, "0");
  const startM = start.getMinutes().toString().padStart(2, "0");
  const endH = end.getHours().toString().padStart(2, "0");
  const endM = end.getMinutes().toString().padStart(2, "0");
  return `${startH}:${startM}-${endH}:${endM}`;
};
