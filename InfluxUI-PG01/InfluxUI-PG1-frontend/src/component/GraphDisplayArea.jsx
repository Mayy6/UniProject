import React, { useState } from 'react';
import { Box, Button } from '@mui/material';

const GraphDisplayArea = ({ onShowCode }) => {
  const [graphUrl, setGraphUrl] = useState(''); // The API endpoint for the graph iframe

  // Function to set the graph URL (can be fetched from backend when Run Query is clicked)
  const handleRunQuery = () => {
    // Replace with actual API endpoint
    const apiEndpoint = 'https://your-api-endpoint.com/graph';
    setGraphUrl(apiEndpoint);
  };

  return (
    <Box style={{ height: '100%', padding: '10px', border: '1px solid #ccc' }}>
      {/* Graph area */}
      <Box style={{ 
          height: '70%', 
          marginBottom: '10px', 
          border: '2px solid #ccc',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
        {graphUrl ? (
          // If graphUrl is set, display the iframe
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
      <Box display="flex" justifyContent="space-between">
        <Button variant="outlined" onClick={onShowCode}>
          Show Code
        </Button>
        <Button variant="contained" color="primary" onClick={handleRunQuery}>
          Run Query
        </Button>
        <Button variant="contained" color="secondary" disabled={!graphUrl}>
          Save Image
        </Button>
      </Box>
    </Box>
  );
};

export default GraphDisplayArea;
