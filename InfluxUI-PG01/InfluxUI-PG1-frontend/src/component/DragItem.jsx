import React from "react";
import { useDrag } from "react-dnd";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default function DragItem({ type, label }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item: { label },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <Box
      ref={drag}
      sx={{
        margin: '4px',
      }}
    >
      <Button
        variant="contained"
        sx={{ 
          opacity: isDragging ? 0.5 : 1,
          display: "block",
          cursor: "move" }}
      >
        {label}
      </Button>
    </Box>
  );
}
