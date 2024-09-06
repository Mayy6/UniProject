import React from 'react';
import { Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DatasetSection from './DatasetSection';
import FilterSection from './FilterSection';
import useFetchData from './useFetchData';

const QueryBuilder = ({
  filters,
  onDrop,
  onRemoveFilter,
  queryLabel,
  onDelete,
  showRemove,
  selectedBucket,
  setSelectedBucket,
}) => {
  // Fetch all bucket names from buckets.json file
  const { data: bucketList, loading: loadingBuckets, error: bucketError } = useFetchData('/dataset/buckets.json');

  // Fetch metadata for the selected bucket
  const { data: bucketData, loading: loadingMetadata, error: metadataError } = useFetchData(
    selectedBucket ? `/dataset/${selectedBucket}.json` : null
  );

  return (
    <Box
      style={{
        marginBottom: '10px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        width: '90%',
        marginLeft: '20px',
        marginRight: '20px',
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{queryLabel}</span>
        {showRemove && (
          <IconButton onClick={onDelete} size="small" style={{ marginLeft: '8px' }}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <Box display="flex" flexDirection="row" width="100%" marginTop="10px">
        <Box style={{ width: '45%', paddingRight: '10px' }}>
          <DatasetSection
            bucketList={bucketList}
            loadingBuckets={loadingBuckets}
            bucketError={bucketError}
            selectedBucket={selectedBucket}
            setSelectedBucket={setSelectedBucket}
            bucketData={bucketData}
            loadingMetadata={loadingMetadata}
            metadataError={metadataError}
          />
        </Box>
        <Box style={{ width: '45%' }}>
          <FilterSection
            selectedFilters={filters}
            onDrop={onDrop}
            onRemoveFilter={onRemoveFilter}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default QueryBuilder;
