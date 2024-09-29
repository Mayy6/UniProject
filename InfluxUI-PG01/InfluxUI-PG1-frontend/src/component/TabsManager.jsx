import React from 'react';
import { Box, IconButton, Tab, Tabs, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const TabsManager = ({ tabs, activeTabIndex, onTabChange, onAddTab, onRemoveTab }) => {
  return (
    <Box sx={{ width: '100%', borderBottom: 1, borderColor: 'divider', marginBottom: '10px' }}>
      <Tabs value={activeTabIndex} onChange={(event, newValue) => onTabChange(newValue)}>
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {`Tab ${index + 1}`}
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveTab(index);
                  }}
                  sx={{ marginLeft: '8px' }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            }
          />
        ))}
        <Button onClick={onAddTab}>+ Add Tab</Button>
      </Tabs>
    </Box>
  );
};

export default TabsManager;
