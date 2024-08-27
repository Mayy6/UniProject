import React from 'react';
import { useDrag } from 'react-dnd';

export default function DragItem({ type, label }) {
    const [{ isDragging }, drag] = useDrag(() => ({
      type,
      item: { label },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));

    return (
        <div
          ref={drag}
          style={{
            opacity: isDragging ? 0.5 : 1,
            cursor: 'move',
            padding: '8px',
            border: '1px solid #ccc',
            margin: '4px',
            backgroundColor: '#fff',
          }}
        >
          {label}
        </div>
      );
    }