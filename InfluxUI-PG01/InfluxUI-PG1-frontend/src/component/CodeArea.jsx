import React from 'react';
import { useFluxQuery } from '../FluxQueryContext';

const CodeArea = () => {
  const { fluxQuery } = useFluxQuery(); 
  return (
    <div>
      <textarea
        value={fluxQuery}
        rows={10}
        cols={50}
        style={{
          marginTop: '20px',
          width: '100%',
          height: '100%', 
          whiteSpace: 'pre-wrap',
          overflowWrap: 'break-word',
        }}
      />
    </div>
  );
};

export default CodeArea;
