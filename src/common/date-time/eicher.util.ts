export function parseLastUpdated(value?: string | number): Date | null {
  if (value === undefined) {
    return null;
  }

  const timestamp = String(value);
  if (!/^\d{14}$/.test(timestamp)) {
    return null;
  }

  const year = Number(timestamp.slice(0, 4));
  const firstPair = Number(timestamp.slice(4, 6));
  const secondPair = Number(timestamp.slice(6, 8));
  const hour = Number(timestamp.slice(8, 10));
  const minute = Number(timestamp.slice(10, 12));
  const second = Number(timestamp.slice(12, 14));

  const documentedFormat = createIstDate(
    year,
    secondPair,
    firstPair,
    hour,
    minute,
    second,
  );
  if (documentedFormat) {
    return documentedFormat;
  }

  return createIstDate(
    year,
    firstPair,
    secondPair,
    hour,
    minute,
    second,
  );
}

function createIstDate(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
): Date | null {
  const utcWallTime = Date.UTC(year, month - 1, day, hour, minute, second);
  const wallDate = new Date(utcWallTime);

  if (
    wallDate.getUTCFullYear() !== year ||
    wallDate.getUTCMonth() !== month - 1 ||
    wallDate.getUTCDate() !== day ||
    wallDate.getUTCHours() !== hour ||
    wallDate.getUTCMinutes() !== minute ||
    wallDate.getUTCSeconds() !== second
  ) {
    return null;
  }

  return new Date(utcWallTime - 330 * 60 * 1000);
}