import React from "react";
import { Box, Typography, TextField, MenuItem, Chip } from "@mui/material";
import DropZone from "./DropZone";

const FilterSection = ({ selectedFilters, onDrop, onRemoveFilter }) => {
  const timeRanges = ["Last 1 hour", "Last 24 hours", "Last 7 days"]; // Example time ranges
  const [selectedTimeRange, setSelectedTimeRange] = React.useState(
    timeRanges[0]
  ); // Default to the first time range

  const handleTimeRangeChange = (event) => {
    setSelectedTimeRange(event.target.value);
  };

  return (
    <Box >
      {/* Time Filter Section */}
      <TextField
        select
        fullWidth
        label="Time Range"
        value={selectedTimeRange}
        onChange={handleTimeRangeChange}
        variant="outlined"
        style={{ marginBottom: "20px" }}
      >
        {timeRanges.map((range, index) => (
          <MenuItem key={index} value={range}>
            {range}
          </MenuItem>
        ))}
      </TextField>

      {/* Dynamic Filter Sections */}
      {Object.keys(selectedFilters).map((key) => (
        <Box
          key={key}
          style={{
            marginBottom: "20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="body1">
            <strong>{key}</strong>
          </Typography>
          <DropZone
            acceptType="ITEM"
            onDrop={(item) => onDrop(key, item.label)}
          >
            <Box
              style={{
                height: "150px",
                padding: 0,
                border: "1px dashed #ccc",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                overflowY: "auto",
                gap: "0px",
              }}
            >
              {selectedFilters[key].map((value, index) => (
                <Chip
                  key={index}
                  label={value}
                  onDelete={() => onRemoveFilter(key, value)}
                  style={{ margin: "5px"}}
                />
              ))}
            </Box>
          </DropZone>
        </Box>
      ))}
    </Box>
  );
};

export default FilterSection;