import React from 'react';
import { Button, Box, TextField } from '@mui/material';

const QueryGenerator = ({ fileName, measurements, tags, fields, timeRange, customStartTime, customEndTime, onGenerateQuery }) => {
  const generateQuery = () => {
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
      }
      
    else if(timeRange === 'Last 1 hour'){
      query += `  |> range(start: -1h)\n`;
    }
    else if(timeRange === 'Last 24 hours'){
        query += `  |> range(start: -24h)\n`;
    }
    else if(timeRange === 'Last 7 days'){
        query += `  |> range(start: -7d)\n`;
    }

    query += `  |> filter(fn: (r) => r._measurement == "${measurements.join('" or r._measurement == "')})`;

    if (tags.length > 0) {
        tags.forEach(tag => {
          const [key, value] = tag.split(' = ');
          const tagWithoutPrefix = key.split('.').pop();
          query += `\n  |> filter(fn: (r) => r.${tagWithoutPrefix} == ${value})`;
        });
    }

    if (fields.length > 0) {
        const fieldsWithoutPrefix = fields.map(field => field.split('.').pop());
        query += `\n  |> filter(fn: (r) => r._field == "${fieldsWithoutPrefix.join('" or r._field == "')})"`;
    }

    onGenerateQuery(query);
  };

  return (
    <Box sx={{ margin: '20px' }}>
      <Button variant="contained" onClick={generateQuery}>
        Generate Query
      </Button>
    </Box>
  );
};

export default QueryGenerator;
