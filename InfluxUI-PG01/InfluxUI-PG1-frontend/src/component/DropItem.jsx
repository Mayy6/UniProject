import React from 'react';
import { useDrop } from 'react-dnd';

export default function DropItem({ acceptType, onDrop, children }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: acceptType,
    drop: (item) => onDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      style={{
        minHeight: '100px',
        padding: '8px',
        border: '2px dashed #ccc',
        backgroundColor: isOver ? '#f0f0f0' : '#fafafa',
      }}
    >
      {children}
    </div>
  );
}
