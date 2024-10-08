import React, { useState } from 'react';
import { useFluxQuery } from '../FluxQueryContext';
import { Button, Box } from '@mui/material';

const CodeArea = ({ onGenerateQuery }) => {
  const { fluxQuery } = useFluxQuery();
  const [isCodeVisible, setIsCodeVisible] = useState(false);

  const toggleCodeVisibility = () => {
    setIsCodeVisible(!isCodeVisible);
  };

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <Button variant="contained" onClick={toggleCodeVisibility}>
          {isCodeVisible ? 'Hide Code' : 'Show Code'}
        </Button>
      </Box>

      {isCodeVisible && (
        <textarea
          value={fluxQuery}
          rows={20}
          cols={50}
          style={{
            marginTop: '5px',
            width: '100%',
            height: '100%', 
            whiteSpace: 'pre-wrap',
            overflowWrap: 'break-word',
          }}
        />
      )}
    </div>
  );
};

export default CodeArea;
