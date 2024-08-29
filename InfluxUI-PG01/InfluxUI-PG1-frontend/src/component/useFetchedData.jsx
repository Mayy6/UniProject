import { useState, useEffect } from "react";

export const useFetchedData = () => {
  const [buckets, setBuckets] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [tags, setTags] = useState([]);
  const [fields, setFields] = useState([]);

  // Initial data for reset later when click Clear All button
  const [initialBuckets, setInitialBuckets] = useState([]);
  const [initialMeasurements, setInitialMeasurements] = useState([]);
  const [initialTags, setInitialTags] = useState([]);
  const [initialFields, setInitialFields] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Simulation to get bucket, measurement, and field data
      const bucketData = [
        "bucket-1",
        "bucket-2",
        "bucket-3",
      ];
      const measurementData = [
        "measurement-1",
        "measurement-2",
        "measurement-3",
      ];
      const tagData = [
        "tag-1",
        "tag-2",
        "tag-3",
      ];
      const fieldData = [
        "field-1",
        "field-2",
        "field-3",
      ];

      // Set the current chosen data
      setBuckets(bucketData);
      setMeasurements(measurementData);
      setTags(tagData);
      setFields(fieldData);

      // Set the initial data
      setInitialBuckets(bucketData);
      setInitialMeasurements(measurementData);
      setInitialTags(tagData);
      setInitialFields(fieldData);
    };

    fetchData();
  }, []);

  return {
    buckets,
    measurements,
    tags,
    fields,
    setBuckets,
    setMeasurements,
    setTags,
    setFields,
    initialBuckets,
    initialMeasurements,
    initialTags,
    initialFields,
  };
};
