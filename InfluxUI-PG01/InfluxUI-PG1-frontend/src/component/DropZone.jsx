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
        padding: '10px',
        border: '1px dashed #ccc',
        borderRadius: '4px',
      }}
    >
      {children}
    </Box>
  );
};

export default DropZone;
