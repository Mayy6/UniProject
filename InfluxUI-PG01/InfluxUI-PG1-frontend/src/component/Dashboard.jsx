import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import GraphDisplayArea from './GraphDisplayArea';
import QueryTabManager from './QueryTabManager';
import { Box } from '@mui/material';

const Dashboard = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Box style={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
        
        {/* Query Tab Manager (Left) */}
        <Box 
          style={{ 
            // flexBasis: '40%', 
            width: '450px',
            padding: '10px', 
            borderRight: '1px solid #ccc', 
            overflowY: 'auto' 
          }}
        >
          <QueryTabManager />
        </Box>
        <Box style={{ flexBasis: '65%', borderRight: '1px solid #ccc', }}>
          <GraphDisplayArea />
        </Box>
      </Box>
    </DndProvider>
  );
};

export default Dashboard;
