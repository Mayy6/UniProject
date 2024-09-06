import React, { useState } from 'react';
import { Box } from '@mui/material';
import QueryTab from './QueryTab';
import QueryBuilder from './QueryBuilder';
import AddQuery from './AddQuery';

const QueryTabManager = () => {
  const [queryBuilders, setQueryBuilders] = useState([
    {
      id: 0,
      filters: { _measurement: [], room: [], _field: [] },
      selectedBucket: '',
    },
  ]);
  const [activeQuery, setActiveQuery] = useState(0);

  const handleAddQueryBuilder = () => {
    const newId = queryBuilders.length > 0 ? queryBuilders[queryBuilders.length - 1].id + 1 : 0;
    setQueryBuilders([
      ...queryBuilders,
      {
        id: newId,
        filters: { _measurement: [], room: [], _field: [] },
        selectedBucket: '',
      },
    ]);
    setActiveQuery(newId);
  };

  const handleRemoveQueryBuilder = (id) => {
    const newBuilders = queryBuilders.filter((builder) => builder.id !== id);
    setQueryBuilders(newBuilders);

    if (newBuilders.length > 0) {
      setActiveQuery(newBuilders[newBuilders.length - 1].id);
    } else {
      setActiveQuery(null);
    }
  };

  const handleToggle = (id) => {
    setActiveQuery(id);
  };

  const handleFilterChange = (id, key, value) => {
    setQueryBuilders((prevBuilders) =>
      prevBuilders.map((builder) =>
        builder.id === id
          ? {
              ...builder,
              filters: {
                ...builder.filters,
                [key]: builder.filters[key].includes(value)
                  ? builder.filters[key]
                  : [...builder.filters[key], value],
              },
            }
          : builder
      )
    );
  };

  const handleRemoveFilter = (id, key, value) => {
    setQueryBuilders((prevBuilders) =>
      prevBuilders.map((builder) =>
        builder.id === id
          ? {
              ...builder,
              filters: {
                ...builder.filters,
                [key]: builder.filters[key].filter((item) => item !== value),
              },
            }
          : builder
      )
    );
  };

  const handleBucketChange = (id, bucket) => {
    setQueryBuilders((prevBuilders) =>
      prevBuilders.map((builder) =>
        builder.id === id ? { ...builder, selectedBucket: bucket } : builder
      )
    );
  };

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Query Tabs */}
      <Box
        style={{
          display: 'flex',
          padding: '10px',
          alignItems: 'center',
          borderBottom: '1px solid #ccc',
          overflowX: 'auto',
        }}
      >
        {queryBuilders.map((builder, index) => (
          <QueryTab
            key={builder.id}
            label={`Query ${index + 1}`}
            isActive={activeQuery === builder.id}
            onClick={() => handleToggle(builder.id)}
            onDelete={() => handleRemoveQueryBuilder(builder.id)}
          />
        ))}
        <AddQuery onAdd={handleAddQueryBuilder} />
      </Box>

      {/* Active QueryBuilder */}
      <Box style={{ padding: '10px', flexGrow: 1 }}>
        {queryBuilders.map(
          (builder) =>
            builder.id === activeQuery && (
              <QueryBuilder
                key={builder.id}
                filters={builder.filters}
                onDrop={(key, value) => handleFilterChange(builder.id, key, value)}
                onRemoveFilter={(key, value) => handleRemoveFilter(builder.id, key, value)}
                onDelete={() => handleRemoveQueryBuilder(builder.id)}
                showRemove={queryBuilders.length > 1}
                queryLabel={`Query ${builder.id + 1}`}
                selectedBucket={builder.selectedBucket}
                setSelectedBucket={(bucket) => handleBucketChange(builder.id, bucket)}
              />
            )
        )}
      </Box>
    </Box>
  );
};

export default QueryTabManager;
