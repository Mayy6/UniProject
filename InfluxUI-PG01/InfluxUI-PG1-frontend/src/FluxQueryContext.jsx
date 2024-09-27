import React, { createContext, useState, useContext } from 'react';

const FluxQueryContext = createContext();

export const FluxQueryProvider = ({ children }) => {
  const [fluxQuery, setFluxQuery] = useState('');

  return (
    <FluxQueryContext.Provider value={{ fluxQuery, setFluxQuery }}>
      {children}
    </FluxQueryContext.Provider>
  );
};

export const useFluxQuery = () => useContext(FluxQueryContext);
