// lightweight API hook that wraps the axios client
import { useState, useCallback } from 'react';
import api from '../src/services/api';

export function useAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const get = useCallback(async (url, config = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.client.get(url, config);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const post = useCallback(async (url, body = {}, config = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.client.post(url, body, config);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { get, post, loading, error };
}
