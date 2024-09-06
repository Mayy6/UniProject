import React from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const AddQuery = ({ onAdd }) => {
  return (
    <Button
      onClick={onAdd}
      variant="contained"
      size="small"
      style={{
        alignSelf: "flex-start",
        marginTop: "10px",
        display: "flex",
        alignItems: "center",
        backgroundColor: '#1976d2',
        color: '#fff',
        textTransform: 'none',
        padding: '6px 6px',
      }}
      startIcon={<AddIcon />}
    >
      New Query
    </Button>
  );
};

export default AddQuery;
