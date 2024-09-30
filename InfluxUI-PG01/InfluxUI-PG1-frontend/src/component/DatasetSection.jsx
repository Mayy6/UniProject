import React from 'react';
import { Box, Typography, TextField, MenuItem } from '@mui/material';
import DragItem from './DragItem';

const DatasetSection = ({
  bucketList,
  loadingBuckets,
  bucketError,
  selectedBucket,
  setSelectedBucket,
  bucketData,
  loadingMetadata,
  metadataError,
}) => {
  const handleBucketChange = (event) => {
    setSelectedBucket(event.target.value);
  };

  return (
    <Box sx={{ padding: '10px' }}>
      {/* Bucket Selection */}
      {loadingBuckets && <Typography>Loading buckets...</Typography>}
      {bucketError && <Typography color="error">Error loading bucket list</Typography>}

      {bucketList && (
        <TextField
          select
          fullWidth
          label="Bucket"
          value={selectedBucket || ''}
          onChange={handleBucketChange}
          variant="outlined"
          sx={{ marginBottom: '20px' }}
        >
          {bucketList.buckets.map((bucket, index) => (
            <MenuItem key={index} value={bucket}>
              {bucket}
            </MenuItem>
          ))}
        </TextField>
      )}

      {/* Display Metadata */}
      {loadingMetadata && <Typography>Loading metadata...</Typography>}
      {metadataError && <Typography color="error">Error loading metadata</Typography>}
      {bucketData && (
        <Box>
          {Object.keys(bucketData).map((key) => (
            <Box key={key} sx={{ marginBottom: '20px' }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {key}
              </Typography>
              <Box
                sx={{
                  height: '150px',
                  padding: '10px',
                  border: '2px solid rgba(0, 0, 0, 0.2)', 
                  display: 'flex',
                  flexWrap: 'wrap',
                  overflowY: 'auto',
                  gap: '8px',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', 
                  borderRadius: '8px', 
                  backgroundColor: '#f5f7fa', 
                }}
              >
                {Array.isArray(bucketData[key]) ? (
                  bucketData[key].map((value, index) => (
                    <DragItem key={index} label={value} type="ITEM" />
                  ))
                ) : (
                  <DragItem label={bucketData[key]} type="ITEM" />
                )}
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default DatasetSection;
