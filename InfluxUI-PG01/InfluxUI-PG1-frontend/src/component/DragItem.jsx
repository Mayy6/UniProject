import React from 'react';
import { useDrag } from 'react-dnd';
import { Chip } from '@mui/material';

const DragItem = ({ label, type, onDragStart, allowedDropEffect }) => {
  const [{ isDragging }, drag] = useDrag({
    type: type,
    item: { label, allowedDropEffect },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    begin: onDragStart,
  });

  return (
    <div
      style={{
        margin: '5px',
        width: '50%',
      }}
    >
      <Chip
        ref={drag}
        label={label}
        style={{
          backgroundColor: isDragging ? '#e0e0e0' : '#f1f1f1',
          border: '1px solid #ccc',
          cursor: 'move',
          maxWidth: '200px',
          minWidth: '50px',
          whiteSpace: 'nowrap',
          borderRadius: isDragging ? '0px' : '16px', 
          opacity: isDragging ? 1 : 1, 
        }}
      />
    </div>
  );
};

export default DragItem;
