import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DragDropPage from './DragDropPage'; 
import { Box, Typography } from '@mui/material';
import CodeArea from './CodeArea'; 

const DashboardNew = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Box 
        style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          height: 'calc(100vh - 60px)',
          overflow: 'hidden' 
        }}
      >
        <Box 
          style={{ 
            flexBasis: '40%',
            padding: '10px', 
            borderRight: '1px solid #ccc', 
            overflowY: 'scroll', 
            maxHeight: '100%' 
          }}
        >
          <DragDropPage />
        </Box>

        <Box 
          style={{ 
            flexBasis: '60%',  
            display: 'flex', 
            flexDirection: 'column', 
            padding: '10px', 
          }}
        >
          <Box 
            style={{ 
              flexBasis: '50%',  
              padding: '10px',
              borderBottom: '1px solid #ccc', 
            }}
          >
            <Typography variant="h6">Graph Area</Typography>
          </Box>

          <Box 
            style={{ 
              flexBasis: '50%',  
              padding: '10px',
            }}
          >
            <CodeArea/> 
          </Box>
        </Box>
      </Box>
    </DndProvider>
  );
};

export default DashboardNew;
