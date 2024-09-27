import React from 'react';
import { useDrop } from 'react-dnd';
import { Box } from '@mui/material';

const DropZone = ({ acceptType, onDrop, allowedDropEffect, children }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: acceptType,
    drop: (item) => {
      if (item.allowedDropEffect === allowedDropEffect) {
        onDrop(item);
      }
    },
    canDrop: (item) => item.allowedDropEffect === allowedDropEffect,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <Box
      ref={drop}
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '10px',
        backgroundColor: isOver && canDrop ? '#f0f0f0' : '#f1f1f1',
        padding: '0px',
        border: '2px solid rgba(0, 0, 0, 0.2)',
        borderRadius: '8px',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', 

      }}
    >
      {children}
    </Box>
  );
};

export default DropZone;
