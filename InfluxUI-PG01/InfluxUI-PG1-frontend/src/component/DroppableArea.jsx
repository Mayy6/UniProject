import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { Box, Paper, Typography, IconButton, Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText, ListItemIcon, Checkbox, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

const DroppableArea = ({ acceptType, onDrop, items, boxHeight, removeItem, tagOptions, updateTagSelections, selectedTagValues }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: acceptType,
    drop: (droppedItem) => onDrop(droppedItem),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [items]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedValues, setSelectedValues] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); 

  const handleOpenDialog = (tag) => {
    setSelectedTag(tag);
    setSelectedValues(selectedTagValues[tag] || tagOptions[tag] || []); 
    setOpenDialog(true);
    setSearchTerm(''); 
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCheckboxChange = (value) => {
    setSelectedValues((prevValues) => {
      if (prevValues.includes(value)) {
        return prevValues.filter((val) => val !== value);
      } else {
        return [...prevValues, value];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedTag && tagOptions[selectedTag]) {
      setSelectedValues([...tagOptions[selectedTag]]);
    }
  };

  const handleInverseSelection = () => {
    if (selectedTag && tagOptions[selectedTag]) {
      setSelectedValues(prevValues =>
        tagOptions[selectedTag].filter(value => !prevValues.includes(value))
      );
    }
  };

  const handleSaveSelection = () => {
    if (selectedTag) {
      updateTagSelections(selectedTag, selectedValues); 
    }
    setOpenDialog(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredOptions = selectedTag
    ? tagOptions[selectedTag].filter((value) =>
        value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

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
          <Box>
            {acceptType === 'tag' && (
              <IconButton onClick={() => handleOpenDialog(item)} size="small">
                <FilterAltIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton onClick={() => removeItem(item)} size="small">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Paper>
      ))}

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="xs">
        <DialogTitle>Edit the value of&nbsp;&nbsp;<strong>{selectedTag}</strong></DialogTitle>

        <Box sx={{ paddingX: 2, paddingTop: 1 }}>
          <TextField
            fullWidth
            label="Search"
            variant="outlined"
            size="small" 
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Box>

        <DialogContent sx={{ maxHeight: '250px', overflowY: 'auto', paddingTop: '10px' }}>
          <List>
            {filteredOptions.map((value, idx) => (
              <ListItem key={idx} sx={{ marginBottom: '2px', paddingY: '2px' }}>
                <ListItemIcon>
                  <Checkbox
                    checked={selectedValues.includes(value)}
                    onChange={() => handleCheckboxChange(value)}
                  />
                </ListItemIcon>
                <ListItemText primary={value} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        
        <DialogActions sx={{ padding: '10px 10px', display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button onClick={handleSelectAll} variant="outlined" size="small">Select All</Button>
            <Button onClick={handleInverseSelection} variant="outlined" size="small">Inverse</Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button onClick={handleCloseDialog} variant="contained" color="error" size="small">Cancel</Button>
            <Button onClick={handleSaveSelection} variant="contained" color="primary" size="small">Confirm</Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DroppableArea;
