import { useState, useEffect, useRef, useCallback } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);

      const abortController = new AbortController();
      activeHttpRequests.current.push(abortController);

      try {
        const response = await fetch(url, {
          method,
          headers,
          body,
          signal: abortController.signal,
        });

        const responseData = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== abortController
        );

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setIsLoading(false);

        return responseData;
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => {
        abortCtrl.abort();
      });
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
