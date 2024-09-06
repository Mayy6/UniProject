import React from 'react';
import { Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const QueryTab = ({ label, isActive, onClick, onDelete }) => {
  return (
    <Button
      onClick={onClick}
      variant={isActive ? "contained" : "outlined"}
      size="small"
      style={{
        marginRight: "8px",
        backgroundColor: isActive ? "#1976d2" : "#fff",
        color: isActive ? "#fff" : "#1976d2",
        display: "flex",
        alignItems: "center",
        padding: "5px 10px",
        textTransform: "none",
      }}
    >
      {label}
      {onDelete && (
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          size="small"
          style={{ marginLeft: "8px", color: isActive ? "#fff" : "#1976d2" }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    </Button>
  );
};

export default QueryTab;
