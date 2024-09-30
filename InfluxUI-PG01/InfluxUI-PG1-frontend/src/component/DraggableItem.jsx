import React from 'react';
import { useDrag } from 'react-dnd';
import { Paper, Typography } from '@mui/material';

const DraggableItem = ({ item, type, isDraggable }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item: { item, type },
    canDrag: isDraggable,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [item, isDraggable]);

  return (
    <Paper
      ref={isDraggable ? drag : null}
      sx={{
        opacity: isDragging ? 0.5 : 1,
        padding: '8px',
        marginBottom: '10px',
        height: '10%',
        cursor: isDraggable ? 'pointer' : 'not-allowed',
        border: '1px solid #e0e0e0',
        backgroundColor: isDraggable ? '#f9f9f9' : '#e0e0e0', 
        '&:hover': {
          backgroundColor: isDraggable ? '#e0f7fa' : '#e0e0e0',
        }
        
      }}
    >
      <Typography variant="body1" color="textPrimary" sx={{ fontSize: '0.9rem' }}>
        {item}
      </Typography>
    </Paper>
  );
};

export default DraggableItem;
