// CodeGeneration.jsx
import React, { useEffect, useState } from 'react';

const CodeGeneration = ({ selectedBucket, filters, onCodeGenerated }) => {
  const [generatedCode, setGeneratedCode] = useState('');

  useEffect(() => {
    let code = '';

    if (selectedBucket) {
      code += `from(bucket: "${selectedBucket}")\n`;
    }

    if (filters._measurement && filters._measurement.length > 0) {
      const measurements = filters._measurement.map(m => `r["_measurement"] == "${m}"`).join(' or ');
      code += `  |> filter(fn: (r) => ${measurements})\n`;
    }

    if (filters.room && filters.room.length > 0) {
      const tags = filters.room.map(tag => `r["room"] == "${tag}"`).join(' or ');
      code += `  |> filter(fn: (r) => ${tags})\n`;
    }

    if (filters._field && filters._field.length > 0) {
      const fields = filters._field.map(f => `r["_field"] == "${f}"`).join(' or ');
      code += `  |> filter(fn: (r) => ${fields})\n`;
    }

    setGeneratedCode(code);

    // Call the callback to pass the generated code up to the parent
    onCodeGenerated(code);
  }, [selectedBucket, filters, onCodeGenerated]);

  return null; 
};

export default CodeGeneration;
