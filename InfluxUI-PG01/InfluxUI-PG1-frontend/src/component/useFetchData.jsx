import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchData = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return; 

    const fetchData = async () => {
      setLoading(true);
      setData(null);  
      setError(null);  
      try {
        const response = await axios.get(url);
        setData(response.data);
      } catch (err) {
        setError(err);
        setData(null); 
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useFetchData;
