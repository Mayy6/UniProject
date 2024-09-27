import React from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const AddQuery = ({ onAdd }) => {
  return (
    <Button
      onClick={onAdd}
      variant="outlined"
      size="small"
      style={{
        marginRight: "8px",
        backgroundColor: "#B3ECFF", 
        color: "#5f6368",
        display: "flex",
        alignItems: "center",
        padding: "5px 10px",
        textTransform: "none",
        borderRadius: "8px", 
        border: "1px solid #ccc", 
        minWidth: "90px", 
        maxWidth: "90px",
        height: "21px", 
        boxShadow: "none", 
        transition: "all 0.3s ease",
      }}
      startIcon={<AddIcon />}
    >
      New
    </Button>
  );
};

export default AddQuery;
