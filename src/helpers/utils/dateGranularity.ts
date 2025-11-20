export type Granularity = "hour" | "day" | "month";

export const detectGranularity = (start: string, end: string): Granularity => {
  const s = new Date(start);
  const e = new Date(end);

  const diffMs = e.getTime() - s.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours <= 1.01) return "hour";
  if (diffHours <= 25) return "day";
  return "month";
};

export const formatByGranularity = (
  dateString: string,
  granularity: Granularity
): string => {
  const d = new Date(dateString);

  if (granularity === "hour") {
    const date = d.toISOString().split("T")[0]; // YYYY-MM-DD
    const time = d.toISOString().substring(11, 16); // HH:mm
    return `${date} ${time}`;
  }

  if (granularity === "day") {
    return d.toISOString().split("T")[0]; // YYYY-MM-DD
  }

  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};