import { useState, useEffect } from "react";

export const useFetchedData = () => {
  const [buckets, setBuckets] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [fields, setFields] = useState([]);

  // Initial data for reset later when click Clear All button
  const [initialBuckets, setInitialBuckets] = useState([]);
  const [initialMeasurements, setInitialMeasurements] = useState([]);
  const [initialFields, setInitialFields] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Simulation to get bucket, measurement, and field data
      const bucketData = [
        "example-bucket-1",
        "example-bucket-2",
        "example-bucket-3",
      ];
      const measurementData = [
        "example-measurement-1",
        "example-measurement-2",
        "example-measurement-3",
      ];
      const fieldData = [
        "example-field-1",
        "example-field-2",
        "example-field-3",
      ];

      // Set the current chosen data
      setBuckets(bucketData);
      setMeasurements(measurementData);
      setFields(fieldData);

      // Set the initial data
      setInitialBuckets(bucketData);
      setInitialMeasurements(measurementData);
      setInitialFields(fieldData);
    };

    fetchData();
  }, []);

  return {
    buckets,
    measurements,
    fields,
    setBuckets,
    setMeasurements,
    setFields,
    initialBuckets,
    initialMeasurements,
    initialFields,
  };
};
