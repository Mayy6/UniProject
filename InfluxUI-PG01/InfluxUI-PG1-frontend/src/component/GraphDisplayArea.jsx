import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import CodeArea from './CodeArea'; 

const GraphDisplayArea = ({ onShowCode, selectedFilters }) => {
  const [graphUrl, setGraphUrl] = useState(''); // The API endpoint for the graph iframe
  const [showCode, setShowCode] = useState(false); 

  const handleRunQuery = () => {
    // Replace with actual API endpoint
    const apiEndpoint = 'https://your-api-endpoint.com/graph';
    setGraphUrl(apiEndpoint);
  };

  const handleToggleCode = () => {
    setShowCode(!showCode);
  };

  return (
    <Box style={{ height: '100%', padding: '10px', border: '1px solid #ccc', display: 'flex', flexDirection: 'column' }}>
      {/* Graph area */}
      <Box style={{ 
          height: showCode ? '50%' : '70%',  
          marginBottom: '10px', 
          border: '2px solid #ccc',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
        {graphUrl ? (
          <iframe
            src={graphUrl}
            title="Graph Display"
            width="100%"
            height="100%"
          />
        ) : (
          <p>Graph will be displayed here</p>
        )}
      </Box>

      {/* Button Area */}
      <Box display="flex" justifyContent="space-between" style={{ marginBottom: '10px' }}>
        <Button variant="outlined" onClick={handleToggleCode}>
          {showCode ? 'Hide Code' : 'Show Code'}
        </Button>
        <Button variant="contained" color="primary" onClick={handleRunQuery}>
          Run Query
        </Button>
        <Button variant="contained" color="secondary" disabled={!graphUrl}>
          Save Image
        </Button>
      </Box>

      {showCode && (
        <Box style={{ 
            height: '30%',  
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '10px',
            overflow: 'auto',
            backgroundColor: '#f9f9f9'
          }}>
          <CodeArea selectedFilters={selectedFilters} />  
        </Box>
      )}
    </Box>
  );
};

export default GraphDisplayArea;
