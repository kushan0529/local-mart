import { useState, useEffect } from 'react';

const useGeolocation = () => {
  const [location, setLocation] = useState(() => {
    const saved = localStorage.getItem('user_location');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(!location);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    const handleSuccess = (position) => {
      const newLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      setLocation(newLocation);
      localStorage.setItem('user_location', JSON.stringify(newLocation));
      setLoading(false);
    };

    const handleError = (error) => {
      setError(error.message);
      setLoading(false);
      // Fallback to a default location if needed (e.g., city center)
      if (!location) {
        const defaultLoc = { lat: 12.9716, lng: 77.5946 }; // Example: Bangalore
        setLocation(defaultLoc);
        localStorage.setItem('user_location', JSON.stringify(defaultLoc));
      }
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    });
  }, []);

  return { location, loading, error };
};

export default useGeolocation;
