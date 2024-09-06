// CodeArea.jsx
import React from 'react';
import { Box } from '@mui/material';

const CodeArea = ({ generatedCode }) => {
  return (
    <Box style={{ padding: '10px', backgroundColor: '#f5f5f5', border: '1px solid #ccc', borderRadius: '4px', overflowY: 'auto' }}>
      <pre>{generatedCode}</pre>
    </Box>
  );
};

export default CodeArea;
