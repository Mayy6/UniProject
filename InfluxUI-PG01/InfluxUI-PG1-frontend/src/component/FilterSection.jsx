import React, { useState } from "react";
import { Box, Typography, TextField, MenuItem, Chip, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import DropZone from "./DropZone";
import { generateFluxQuery } from "./codeGeneration"; 
import { useFluxQuery } from '../FluxQueryContext'; 

const FilterSection = ({ selectedFilters, onDrop, onRemoveFilter, onTimeRangeChange, bucket }) => {
  const timeRanges = [
    "Last 1 hour",
    "Last 24 hours",
    "Last 7 days",
    "Custom Time Range",
  ];

  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRanges[0]); 
  const [customTimeRange, setCustomTimeRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [fluxQuery, setFluxQuery] = useState('');
  const [open, setOpen] = useState(false); 

  const { setFluxQuery: setGlobalFluxQuery } = useFluxQuery();  

  const handleTimeRangeChange = (event) => {
    const range = event.target.value;
    setSelectedTimeRange(range);

    if (range === "Custom Time Range") {
      setOpen(true); 
    } else {
      onTimeRangeChange({ start: range, stop: "now()" });
    }
  };

  const handleCustomTimeChange = (key, newValue) => {
    setCustomTimeRange((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  };

  const handleClose = () => {
    setOpen(false);
    onTimeRangeChange({ start: customTimeRange.startDate, stop: customTimeRange.endDate });
  };

  const handleGenerateQuery = () => {
    if (selectedFilters) {
      const query = generateFluxQuery({ ...selectedFilters, bucket }, selectedTimeRange, customTimeRange); 
      setFluxQuery(query); 
      setGlobalFluxQuery(query); 
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ padding: '10px' }}>
        
        <TextField
          select
          fullWidth
          label="Time Range"
          value={selectedTimeRange}
          onChange={handleTimeRangeChange}
          variant="outlined"
          sx={{ marginBottom: '20px' }}
        >
          {timeRanges.map((range, index) => (
            <MenuItem key={index} value={range}>
              {range}
            </MenuItem>
          ))}
        </TextField>

        {Object.keys(selectedFilters).map((key) => (
          <Box key={key} sx={{ marginBottom: '20px' }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold'}}>
              {key}
            </Typography>
            <DropZone acceptType="ITEM" onDrop={(item) => onDrop(key, item.label)}>
              <Box
                sx={{
                  height: '150px',
                  padding: '10px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  overflowY: 'scroll',
                  gap: '8px',
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.05)', 
                  borderRadius: '8px', 
                  backgroundColor: '#f5f7ff',
                }}
              >
                {selectedFilters[key].map((value, index) => (
                  <Chip
                    key={index}
                    label={value}
                    onDelete={() => onRemoveFilter(key, value)}
                    sx={{ margin: "5px" }}
                  />
                ))}
              </Box>
            </DropZone>
          </Box>
        ))}

        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Custom Time Range</DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
              <DateTimePicker
                label="Start Date"
                value={customTimeRange.startDate}
                onChange={(newValue) => handleCustomTimeChange("startDate", newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
              <DateTimePicker
                label="End Date"
                value={customTimeRange.endDate}
                onChange={(newValue) => handleCustomTimeChange("endDate", newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleClose} color="primary">OK</Button>
          </DialogActions>
        </Dialog>

        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerateQuery}
          sx={{ marginTop: '10px' }}
        >
          Generate Query
        </Button>

      
      </Box>
    </LocalizationProvider>
  );
};

export default FilterSection;
