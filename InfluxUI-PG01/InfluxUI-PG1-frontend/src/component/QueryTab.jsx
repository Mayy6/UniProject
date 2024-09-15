import React from 'react';
import { Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const QueryTab = ({ label, isActive, onClick, onDelete }) => {
  return (
    <Button
      onClick={onClick}
      variant="outlined"
      size="small"
      style={{
        marginRight: "5px",
        backgroundColor: isActive ? "#fff" : "#e0e0e0",
        color: isActive ? "#1976d2" : "#5f6368",
        display: "flex",
        alignItems: "center",
        padding: "5px 10px",
        textTransform: "none",
        borderRadius: "8px 8px 0 0", 
        border: isActive ? "2px solid #1976d2" : "1px solid #ccc", 
        boxShadow: isActive
          ? "0px 4px 8px rgba(0, 0, 0, 0.1)" 
          : "none",
        transition: "all 0.3s ease",
        minWidth: "120px", 
        maxWidth: "200px",
        overflow: "hidden",
        whiteSpace: "nowrap", 
        textOverflow: "ellipsis",
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
          style={{ marginLeft: "8px", color: isActive ? "#1976d2" : "#5f6368" }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    </Button>
  );
};

export default QueryTab;
