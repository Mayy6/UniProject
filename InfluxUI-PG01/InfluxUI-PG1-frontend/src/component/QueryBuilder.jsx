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
  const { data: bucketList, loading: loadingBuckets, error: bucketError } = useFetchData('/dataset/buckets.json');

  const { data: bucketData, loading: loadingMetadata, error: metadataError } = useFetchData(
    selectedBucket ? `/dataset/${selectedBucket}.json` : null
  );

  return (
    <Box
      style={{
        marginBottom: '5px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        width: '95%',
        marginLeft: '0px',
        marginRight: '10px',
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
        <Box style={{ width: '50%', paddingRight: '10px' }}>
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
        <Box style={{ width: '50%' }}>
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
