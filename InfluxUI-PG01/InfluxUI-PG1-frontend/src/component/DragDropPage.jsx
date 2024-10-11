import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Grid, Box, Typography, FormControl, InputLabel, Select, MenuItem, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import DraggableItem from './DraggableItem';
import DroppableArea from './DroppableArea';
import TabsManager from './TabsManager';
import QueryGenerator from './QueryGenerator';
import { useFluxQuery } from '../FluxQueryContext';

const DragDropPage = () => {
  const [tabs, setTabs] = useState([createNewTab(1)]);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [searchMeasurement, setSearchMeasurement] = useState('');  // State for Measurements search
  const [searchTag, setSearchTag] = useState('');  // State for Tags search
  const [searchField, setSearchField] = useState('');  // State for Fields search
  const { setFluxQuery } = useFluxQuery();
  const [tabCounter, setTabCounter] = useState(2);

  function createNewTab(counter) {
    return {
      id: Date.now(),
      name: counter,
      measurements: [],
      tags: [],
      fields: [],
      rightMeasurements: [],
      rightTags: [],
      rightFields: [],
      selectedFile: '',
      selectedTimeRange: '',
      customStartTime: new Date(),
      customEndTime: new Date(),
      open: false,
      bucketFiles: [],
    };
  }

  const handleAddTab = () => {
    setTabs([...tabs, createNewTab(tabCounter)]);
    setActiveTabIndex(tabs.length);
    setTabCounter(tabCounter + 1);
  };

  const handleRemoveTab = (indexToRemove) => {
    if (tabs.length === 1) return;

    const updatedTabs = tabs.filter((_, index) => index !== indexToRemove);
    setTabs(updatedTabs);

    if (activeTabIndex === indexToRemove) {
      setActiveTabIndex(Math.max(0, indexToRemove - 1));
    } else if (activeTabIndex > indexToRemove) {
      setActiveTabIndex((prevIndex) => prevIndex - 1);
    }
  };

  const currentTab = tabs[activeTabIndex];

  const loadBucketFiles = (tabIndex) => {
    fetch('/dataset/buckets.json')
      .then((response) => response.json())
      .then((data) => {
        const updatedTabs = [...tabs];
        updatedTabs[tabIndex].bucketFiles = data.buckets;
        setTabs(updatedTabs);
      })
      .catch((error) => console.error('Error loading buckets.json:', error));
  };

  const loadDataFromFile = (fileName, tabIndex) => {
    fetch(`/dataset/${fileName}.json`)
      .then((response) => response.json())
      .then((data) => {
        const allMeasurements = data.map((item) => item._measurement);
        const updatedTabs = [...tabs];
        updatedTabs[tabIndex].measurements = allMeasurements;
        updatedTabs[tabIndex].rightMeasurements = [];
        updatedTabs[tabIndex].rightTags = [];
        updatedTabs[tabIndex].rightFields = [];
        updatedTabs[tabIndex].tags = [];
        updatedTabs[tabIndex].fields = [];
        setTabs(updatedTabs);
      })
      .catch((error) => console.error('Error loading Buckets:', error));
  };

  useEffect(() => {
    loadBucketFiles(activeTabIndex);
  }, [activeTabIndex]);

  const generateTagsAndFields = (measurement, tabIndex) => {
    const selectedFile = tabs[tabIndex].selectedFile;
    fetch(`/dataset/${selectedFile}.json`)
      .then((response) => response.json())
      .then((data) => {
        const selectedData = data.find(item => item._measurement === measurement);
        if (selectedData) {
          const newTags = selectedData.tags.flatMap((tag) =>
            Object.entries(tag).map(([key, values]) =>
              values.map((value) => `${measurement}.${key} = "${value}"`)
            ).flat()
          );
          const newFields = selectedData.fields.map((field) => `${measurement}.${field}`);

          const updatedTabs = [...tabs];
          updatedTabs[tabIndex].tags = Array.from(new Set([...updatedTabs[tabIndex].tags, ...newTags]));
          updatedTabs[tabIndex].fields = Array.from(new Set([...updatedTabs[tabIndex].fields, ...newFields]));
          setTabs(updatedTabs);
        }
      })
      .catch((error) => console.error('Error generating tags and fields:', error));
  };

  const handleDrop = (droppedItem, tabIndex) => {
    const { item, type } = droppedItem;
    const updatedTabs = [...tabs];
    if (type === 'measurement' && !updatedTabs[tabIndex].rightMeasurements.includes(item)) {
      updatedTabs[tabIndex].rightMeasurements.push(item);
      generateTagsAndFields(item, tabIndex);
    } else if (type === 'tag' && !updatedTabs[tabIndex].rightTags.includes(item)) {
      updatedTabs[tabIndex].rightTags.push(item);
    } else if (type === 'field' && !updatedTabs[tabIndex].rightFields.includes(item)) {
      updatedTabs[tabIndex].rightFields.push(item);
    }
    setTabs(updatedTabs);
  };

  const removeItem = (item, tabIndex) => {
    const updatedTabs = [...tabs];
    if (updatedTabs[tabIndex].rightMeasurements.includes(item)) {
      const relatedTags = updatedTabs[tabIndex].tags.filter(tag => tag.startsWith(`${item}.`));
      const relatedFields = updatedTabs[tabIndex].fields.filter(field => field.startsWith(`${item}.`));

      updatedTabs[tabIndex].tags = updatedTabs[tabIndex].tags.filter(tag => !relatedTags.includes(tag));
      updatedTabs[tabIndex].fields = updatedTabs[tabIndex].fields.filter(field => !relatedFields.includes(field));
      updatedTabs[tabIndex].rightMeasurements = updatedTabs[tabIndex].rightMeasurements.filter(m => m !== item);
    }
    updatedTabs[tabIndex].rightTags = updatedTabs[tabIndex].rightTags.filter(t => t !== item);
    updatedTabs[tabIndex].rightFields = updatedTabs[tabIndex].rightFields.filter(f => f !== item);
    setTabs(updatedTabs);
  };

  const handleOpenDialog = (tabIndex) => {
    const updatedTabs = [...tabs];
    updatedTabs[tabIndex].open = true;
    setTabs(updatedTabs);
  };

  const handleCloseDialog = (tabIndex) => {
    const updatedTabs = [...tabs];
    updatedTabs[tabIndex].open = false;
    setTabs(updatedTabs);
  };

  const handleTimeRangeChange = (event, tabIndex) => {
    const value = event.target.value;
    const updatedTabs = [...tabs];
    updatedTabs[tabIndex].selectedTimeRange = value;

    if (value === "Custom Time Range") {
      handleOpenDialog(tabIndex);
    }
    setTabs(updatedTabs);
  };

  const handleGenerateQuery = (query) => {
    setFluxQuery(query);
  };

  // Filter measurements, tags, and fields independently based on their search terms
  const filteredMeasurements = currentTab.measurements.filter(measurement =>
    measurement.toLowerCase().includes(searchMeasurement.toLowerCase())
  );
  const filteredTags = currentTab.tags.filter(tag =>
    tag.toLowerCase().includes(searchTag.toLowerCase())
  );
  const filteredFields = currentTab.fields.filter(field =>
    field.toLowerCase().includes(searchField.toLowerCase())
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DndProvider backend={HTML5Backend}>
        <Grid container spacing={2} sx={{ height: '100vh', padding: '5px' }}>
          <TabsManager
            tabs={tabs}
            activeTabIndex={activeTabIndex}
            onTabChange={setActiveTabIndex}
            onAddTab={handleAddTab}
            onRemoveTab={handleRemoveTab}
          />

          <Grid item xs={6}>
            <Box sx={{ padding: '0px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <FormControl fullWidth>
                  <InputLabel id="file-select-label">Select Bucket</InputLabel>
                  <Select
                    labelId="file-select-label"
                    value={currentTab.selectedFile}
                    label="Select Bucket"
                    onChange={(e) => {
                      const updatedTabs = [...tabs];
                      updatedTabs[activeTabIndex].selectedFile = e.target.value;
                      setTabs(updatedTabs);
                      loadDataFromFile(e.target.value, activeTabIndex);
                    }}
                  >

                    {currentTab.bucketFiles.map((file, index) => (
                      <MenuItem key={index} value={file}>{file}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {currentTab.selectedFile ? (
                <>
                  <Box sx={{ marginBottom: '10px' }}>
                    <Typography variant="h6" sx={{ fontSize: '0.9rem' }} gutterBottom>Measurements</Typography>
                    <Box sx={{ height: '200px', overflowY: 'auto', border: '2px solid #0288d1', padding: '10px', borderRadius: '8px' }}>
                      {/* Search bar for measurements */}
                      <TextField
                        label="Search Measurements"
                        variant="outlined"
                        value={searchMeasurement}
                        onChange={(e) => setSearchMeasurement(e.target.value)}
                        fullWidth
                        style={{ marginBottom: '20px', width: '100%', height: '30px' }}
                        InputProps={{
                          style: {
                            height: '40px',
                            padding: '5px',
                            fontSize: '14px',
                          },
                        }}
                        InputLabelProps={{
                          style: {
                            fontSize: '14px',
                            top: '-3px',
                          },
                        }}
                      />
                      {filteredMeasurements.map((m, index) => (
                        <DraggableItem
                          key={index}
                          item={m}
                          type="measurement"
                          isDraggable={!currentTab.rightMeasurements.includes(m)}
                        />
                      ))}
                    </Box>
                  </Box>

                  <Box sx={{ marginBottom: '10px' }}>
                    <Typography variant="h6" sx={{ fontSize: '0.9rem' }} gutterBottom>Tags</Typography>
                    <Box sx={{ height: '200px', overflowY: 'auto', border: '2px solid #0288d1', padding: '10px', borderRadius: '8px' }}>

                      {filteredTags.length === 0 ? (
                        <Typography variant="body2" color="textSecondary">No tags available. Please select a measurement.</Typography>
                      ) : (
                        <>
                        {/* Search bar for tags */}
                      <TextField
                        label="Search Tags"
                        variant="outlined"
                        value={searchTag}
                        onChange={(e) => setSearchTag(e.target.value)}
                        fullWidth
                        style={{ marginBottom: '20px', width: '100%', height: '30px' }}
                        InputProps={{
                          style: {
                            height: '40px',
                            padding: '5px',
                            fontSize: '14px',
                          },
                        }}
                        InputLabelProps={{
                          style: {
                            fontSize: '14px',
                            top: '-3px',
                          },
                        }}
                      />
                        {filteredTags.map((tag, index) => (
                          <DraggableItem
                            key={index}
                            item={tag}
                            type="tag"
                            isDraggable={!currentTab.rightTags.includes(tag)}
                          />
                        ))}
                        </>
                      )}
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="h6" sx={{ fontSize: '0.9rem' }} gutterBottom>Fields</Typography>
                    <Box sx={{ height: '200px', overflowY: 'auto', border: '2px solid #0288d1', padding: '10px', borderRadius: '8px' }}>

                      {filteredFields.length === 0 ? (
                        <Typography variant="body2" color="textSecondary">No fields available. Please select a measurement.</Typography>
                      ) : (
                        <>
                        {/* Search bar for fields */}
                        <TextField
                          label="Search Fields"
                          variant="outlined"
                          value={searchField}
                          onChange={(e) => setSearchField(e.target.value)}
                          fullWidth
                          style={{ marginBottom: '20px', width: '100%', height: '30px' }}
                          InputProps={{
                            style: {
                              height: '40px',
                              padding: '5px',
                              fontSize: '14px',
                            },
                          }}
                          InputLabelProps={{
                            style: {
                              fontSize: '14px',
                              top: '-3px',
                            },
                          }}
                        />
                        {filteredFields.map((field, index) => (
                          <DraggableItem
                            key={index}
                            item={field}
                            type="field"
                            isDraggable={!currentTab.rightFields.includes(field)}
                          />
                        ))}
                        </>
                      )}
                    </Box>
                  </Box>
                </>
              ) : (
                <Typography variant="body1" color="textSecondary">Please select a Bucket to load data.</Typography>
              )}
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ padding: '0px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <FormControl fullWidth>
                  <InputLabel id="time-range-select-label">Select Time Range</InputLabel>
                  <Select
                    labelId="time-range-select-label"
                    value={currentTab.selectedTimeRange}
                    label="Select Time Range"
                    onChange={(e) => handleTimeRangeChange(e, activeTabIndex)}
                  >
                    <MenuItem value="Last 1 hour">Last 1 hour</MenuItem>
                    <MenuItem value="Last 24 hours">Last 24 hours</MenuItem>
                    <MenuItem value="Last 7 days">Last 7 days</MenuItem>
                    <MenuItem value="Custom Time Range">Custom Time Range</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Dialog open={currentTab.open} onClose={() => handleCloseDialog(activeTabIndex)}>
                <DialogTitle>Select Custom Time Range</DialogTitle>
                <DialogContent>
                  <DateTimePicker
                    label="Start Time"
                    value={currentTab.customStartTime}
                    onChange={(newValue) => {
                      const updatedTabs = [...tabs];
                      updatedTabs[activeTabIndex].customStartTime = newValue;
                      setTabs(updatedTabs);
                    }}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                  <DateTimePicker
                    label="End Time"
                    value={currentTab.customEndTime}
                    onChange={(newValue) => {
                      const updatedTabs = [...tabs];
                      updatedTabs[activeTabIndex].customEndTime = newValue;
                      setTabs(updatedTabs);
                    }}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => handleCloseDialog(activeTabIndex)}>Cancel</Button>
                  <Button onClick={() => handleCloseDialog(activeTabIndex)}>Confirm</Button>
                </DialogActions>
              </Dialog>

              <Box sx={{ marginBottom: '10px' }}>
                <Typography variant="h6" sx={{ fontSize: '0.9rem' }} gutterBottom>Measurements (Drop Here)</Typography>
                <DroppableArea
                  acceptType="measurement"
                  onDrop={(droppedItem) => handleDrop(droppedItem, activeTabIndex)}
                  items={currentTab.rightMeasurements}
                  removeItem={(item) => removeItem(item, activeTabIndex)}
                  boxHeight={'200px'}
                />
              </Box>

              <Box sx={{ marginBottom: '10px' }}>
                <Typography variant="h6" sx={{ fontSize: '0.9rem' }} gutterBottom>Tags (Drop Here)</Typography>
                <DroppableArea
                  acceptType="tag"
                  onDrop={(droppedItem) => handleDrop(droppedItem, activeTabIndex)}
                  items={currentTab.rightTags}
                  removeItem={(item) => removeItem(item, activeTabIndex)}
                  boxHeight={'200px'}
                />
              </Box>

              <Box sx={{ marginBottom: '10px' }}>
                <Typography variant="h6" sx={{ fontSize: '0.9rem' }} gutterBottom>Fields (Drop Here)</Typography>
                <DroppableArea
                  acceptType="field"
                  onDrop={(droppedItem) => handleDrop(droppedItem, activeTabIndex)}
                  items={currentTab.rightFields}
                  removeItem={(item) => removeItem(item, activeTabIndex)}
                  boxHeight={'200px'}
                />
              </Box>

              <QueryGenerator
                fileName={currentTab.selectedFile}
                measurements={currentTab.rightMeasurements}
                tags={currentTab.rightTags}
                fields={currentTab.rightFields}
                timeRange={currentTab.selectedTimeRange}
                customStartTime={currentTab.customStartTime}
                customEndTime={currentTab.customEndTime}
                onGenerateQuery={handleGenerateQuery}
              />
              
            </Box>
          </Grid>
        </Grid>
      </DndProvider>
    </LocalizationProvider>
  );
};

export default DragDropPage;
