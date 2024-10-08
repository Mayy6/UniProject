import React, { useState } from 'react';
import { Box, IconButton, Tab, Tabs, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const TabsManager = ({ tabs, activeTabIndex, onTabChange, onAddTab, onRemoveTab }) => {
  return (
    <Box sx={{ width: '100%', borderBottom: 1, borderColor: 'divider', marginBottom: '10px' }}>
      <Tabs
        value={activeTabIndex}
        onChange={(event, newValue) => onTabChange(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        aria-label="scrollable auto tabs"
      >
        {tabs.map((tab, index) => (
          <Tab
            key={tab.id}  
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {`Tab ${tab.name}`}
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
