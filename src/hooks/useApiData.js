import { useState, useEffect, useCallback } from 'react';

// Hook personalizado para manejar datos de API con cache y estados de carga
export const useApiData = (fetchFunction, dependencies = [], options = {}) => {
  const {
    enabled = true,
    refetchOnMount = true,
    cacheTime = 5 * 60 * 1000, // 5 minutos por defecto
  } = options;

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  const fetchData = useCallback(async (force = false) => {
    // Verificar si necesitamos hacer fetch
    if (!enabled) return;
    
    const now = Date.now();
    const shouldFetch = force || 
      !lastFetch || 
      !refetchOnMount || 
      (now - lastFetch) > cacheTime;

    if (!shouldFetch) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const result = await fetchFunction();
      setData(result);
      setLastFetch(now);
    } catch (err) {
      setError(err);
      console.error('Error in useApiData:', err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFunction, enabled, lastFetch, refetchOnMount, cacheTime]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  const refetch = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch,
    lastFetch
  };
};

// Hook para múltiples llamadas de API en paralelo
export const useMultipleApiData = (apiCalls, dependencies = [], options = {}) => {
  const {
    enabled = true,
    refetchOnMount = true,
    cacheTime = 5 * 60 * 1000,
  } = options;

  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  const fetchAllData = useCallback(async (force = false) => {
    if (!enabled) return;
    
    const now = Date.now();
    const shouldFetch = force || 
      !lastFetch || 
      !refetchOnMount || 
      (now - lastFetch) > cacheTime;

    if (!shouldFetch) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const results = await Promise.all(
        apiCalls.map(call => call.function())
      );
      
      const newData = {};
      apiCalls.forEach((call, index) => {
        newData[call.key] = results[index];
      });
      
      setData(newData);
      setLastFetch(now);
    } catch (err) {
      setError(err);
      console.error('Error in useMultipleApiData:', err);
    } finally {
      setIsLoading(false);
    }
  }, [apiCalls, enabled, lastFetch, refetchOnMount, cacheTime]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData, ...dependencies]);

  const refetch = useCallback(() => {
    fetchAllData(true);
  }, [fetchAllData]);

  return {
    data,
    isLoading,
    error,
    refetch,
    lastFetch
  };
};

export default useApiData;
