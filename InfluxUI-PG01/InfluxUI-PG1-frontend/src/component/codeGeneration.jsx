export const generateFluxQuery = (selectedFilters, timeRange, customTimeRange) => {
  const { bucket } = selectedFilters; 
  let query = `from(bucket: "${bucket || 'default_bucket'}")\n`;

  switch (timeRange) {
    case "Last 1 hour":
      query += `  |> range(start: -1h)\n`;
      break;
    case "Last 24 hours":
      query += `  |> range(start: -24h)\n`;
      break;
    case "Last 7 days":
      query += `  |> range(start: -7d)\n`;
      break;
    case "Custom Time Range":
      if (customTimeRange && customTimeRange.startDate && customTimeRange.endDate) {
        const startTime = customTimeRange.startDate.toISOString().split('.')[0];
        const endTime = customTimeRange.endDate.toISOString().split('.')[0];
        query += `  |> range(start: "${startTime}", stop: "${endTime}")\n`;
      }
      break;
    default:
      break;
  }
  Object.keys(selectedFilters).forEach(key => {
    if (key !== 'bucket' && selectedFilters[key].length > 0) {
      selectedFilters[key].forEach(value => {
        query += `  |> filter(fn: (r) => r.${key} == "${value}")\n`;
      });
    }
  });

  query += '  |> yield(name: "result")';

  return query;
};
