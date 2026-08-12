export function buildPeriodOptions(filtersData) {
  const options = [];
  const seen = new Set();
  const add = (label, from, to) => {
    if (!from || !to) return;
    const key = `${from}|${to}`;
    if (seen.has(key)) return;
    seen.add(key);
    options.push({ label, from, to });
  };

  const defaultPeriod = filtersData?.defaultPeriod;
  if (defaultPeriod?.from && defaultPeriod?.to) {
    add(
      `FY ${defaultPeriod.from.slice(0, 4)}-${defaultPeriod.to.slice(2, 4)}`,
      defaultPeriod.from,
      defaultPeriod.to,
    );
  }

  for (const fy of filtersData?.fiscalYears || []) {
    add(fy.name, fy.startDate, fy.endDate);
  }

  return options;
}
