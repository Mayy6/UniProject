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
        
        {/* Query Tab Manager (Left - 40%) */}
        <Box 
          style={{ 
            flexBasis: '35%',  // 占40%的宽度
            padding: '10px', 
            borderRight: '1px solid #ccc', 
            overflowY: 'auto' 
          }}
        >
          <QueryTabManager />
        </Box>

        {/* Graph Display Area (Right - 60%) */}
        <Box 
          style={{ 
            flexBasis: '65%',  // 占60%的宽度
            padding: '10px',
            overflowY: 'auto'
          }}
        >
          <GraphDisplayArea />
        </Box>
      </Box>
    </DndProvider>
  );
};

export default Dashboard;
