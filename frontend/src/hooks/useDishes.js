import { useState, useCallback } from 'react';
import { dishesService } from '../services/api';

export const useDishes = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadPremiumDishes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await dishesService.getPremiumDishes();
      if (response.success) {
        setDishes(response.data);
      } else {
        setError(response.message || 'Error al cargar platillos');
      }
    } catch (err) {
      setError(err.message || 'Error al cargar platillos');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    dishes,
    loading,
    error,
    loadPremiumDishes,
  };
};