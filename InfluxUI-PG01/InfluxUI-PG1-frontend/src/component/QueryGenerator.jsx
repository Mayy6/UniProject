// QueryGenerator.jsx
export const generateQuery = (fileName, measurements, tags, fields, timeRange, customStartTime, customEndTime) => {
  if (!measurements || measurements.length === 0) {
    alert('Please select at least one measurement.');
    return;
  }

  let query = `from(bucket: "${fileName}")\n`;

  if (timeRange === 'Custom Time Range') {
    const formatLocalTime = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}:00`;
    };

    const customStartTimeLocal = formatLocalTime(customStartTime);
    const customEndTimeLocal = formatLocalTime(customEndTime);

    query += `  |> range(start: ${customStartTimeLocal}, stop: ${customEndTimeLocal})\n`;
  } else if (timeRange === 'Last 1 hour') {
    query += `  |> range(start: -1h)\n`;
  } else if (timeRange === 'Last 24 hours') {
    query += `  |> range(start: -24h)\n`;
  } else if (timeRange === 'Last 7 days') {
    query += `  |> range(start: -7d)\n`;
  }

  query += `  |> filter(fn: (r) => r._measurement == "${measurements.join('" or r._measurement == "')}")\n`;

  if (Object.keys(tags).length > 0) {
    Object.keys(tags).forEach(tagKey => {
      const tagValues = tags[tagKey];
      if (tagValues && tagValues.length > 0) {
        const tagWithoutPrefix = tagKey.split('.').pop();
        query += `  |> filter(fn: (r) => ${tagValues.map(value => `r.${tagWithoutPrefix} == "${value}"`).join(' or ')})\n`;
      }
    });
  }

  if (fields.length > 0) {
    const fieldsWithoutPrefix = fields.map(field => field.split('.').pop());
    query += `  |> filter(fn: (r) => r._field == "${fieldsWithoutPrefix.join('" or r._field == "')}")\n`;
  }
  return query;
};
