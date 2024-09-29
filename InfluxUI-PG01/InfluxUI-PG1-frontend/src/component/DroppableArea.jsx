import React from 'react';
import { useDrop } from 'react-dnd';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const DroppableArea = ({ acceptType, onDrop, items, boxHeight, removeItem }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: acceptType,
    drop: (droppedItem) => onDrop(droppedItem),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [items]);

  return (
    <Box
      ref={drop}
      sx={{
        padding: '10px',
        height: boxHeight,
        border: '2px dashed #0288d1',
        backgroundColor: isOver ? '#e0f7fa' : '#ffffff',
        marginBottom: '10px',
        overflowY: 'auto',
      }}
    >
      {items.map((item, index) => (
        <Paper
          key={index}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px',
            marginBottom: '10px',
            backgroundColor: '#f9f9f9',
            border: '1px solid #e0e0e0',
            height: '10%', 
          }}
        >
          <Typography variant="body2">{item}</Typography>
          <IconButton onClick={() => removeItem(item)} size="small">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Paper>
      ))}
    </Box>
  );
};

export default DroppableArea;
