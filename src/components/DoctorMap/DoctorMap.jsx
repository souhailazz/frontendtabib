import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ErrorBoundary from './ErrorBoundary';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import './DoctorMap.css';

// Fix default icon issue with Leaflet in React
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Create a different icon for user location
const UserLocationIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="25" height="25" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12.5" cy="12.5" r="8" fill="#4285F4" stroke="white" stroke-width="3"/>
      <circle cx="12.5" cy="12.5" r="3" fill="white"/>
    </svg>
  `),
  iconSize: [25, 25],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
});

L.Marker.prototype.options.icon = DefaultIcon;

const DoctorMap = ({ doctors = [], onDoctorSelect }) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 36.8065, lng: 10.1815 }); // Default to Tunisia center
  const [mapError, setMapError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyDoctors, setNearbyDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [locationStatus, setLocationStatus] = useState('Getting location...');

  // Get user's location
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setLocationStatus('Requesting location permission...');

    const getLocation = () => {
      if (!navigator.geolocation) {
        if (isMounted) {
          setMapError('Geolocation is not supported by your browser');
          setLocationStatus('Geolocation not supported');
          setIsLoading(false);
        }
        return;
      }

      // Check if location permission is already granted
      if ('permissions' in navigator) {
        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
          console.log('Geolocation permission status:', result.state);
          setLocationStatus(`Permission: ${result.state}`);
        });
      }

      setLocationStatus('Getting your location...');
      console.log('Requesting geolocation...');

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Location obtained:', position.coords);
          if (isMounted) {
            const userLoc = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            console.log('Setting user location:', userLoc);
            setUserLocation(userLoc);
            setMapCenter(userLoc);
            setLocationStatus('Location found!');
            setIsLoading(false);
            setMapError(null); // Clear any previous errors
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          let errorMessage = 'Unable to get your location. ';
          
          switch(error.code) {
            case 1:
              errorMessage += 'Permission denied by user.';
              setLocationStatus('Permission denied');
              break;
            case 2:
              errorMessage += 'Position unavailable.';
              setLocationStatus('Position unavailable');
              break;
            case 3:
              errorMessage += 'Request timeout.';
              setLocationStatus('Request timeout');
              break;
            default:
              errorMessage += 'Unknown error.';
              setLocationStatus('Unknown error');
              break;
          }
          
          if (isMounted) {
            setMapCenter({ lat: 36.8065, lng: 10.1815 });
            setMapError(errorMessage + ' Using default center.');
            setIsLoading(false);
          }
        },
        { 
          timeout: 15000, // Increased timeout
          maximumAge: 300000, // Cache location for 5 minutes
          enableHighAccuracy: true
        }
      );
    };

    getLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  // Calculate distances and find nearby doctors
  useEffect(() => {
    if (!userLocation || !Array.isArray(doctors) || doctors.length === 0) {
      setNearbyDoctors([]);
      return;
    }

    try {
      
      const doctorsWithDistance = doctors
        .filter(doctor => doctor && doctor.latitude && doctor.longitude)
        .map(doctor => {
          const distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            parseFloat(doctor.latitude),
            parseFloat(doctor.longitude)
          );
          return {
            ...doctor,
            distance
          };
        });

      const sortedDoctors = doctorsWithDistance.sort((a, b) => a.distance - b.distance);
      setNearbyDoctors(sortedDoctors);
      console.log('Found', sortedDoctors.length, 'nearby doctors');
    } catch (error) {
      console.error('Error calculating distances:', error);
      setMapError('Error calculating doctor distances');
    }
  }, [userLocation, doctors]);

  const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
    try {
      const R = 6371; // Radius of the earth in km
      const dLat = deg2rad(lat2 - lat1);
      const dLon = deg2rad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // Distance in km
    } catch (error) {
      return Infinity;
    }
  }, []);

  const deg2rad = useCallback((deg) => {
    return deg * (Math.PI / 180);
  }, []);

  // Helper to move map to user location
  function ChangeMapView({ center }) {
    const map = useMap();
    useEffect(() => {
      if (center && center.lat && center.lng) {
        map.setView([center.lat, center.lng], 12);
      }
    }, [center, map]);
    return null;
  }

  // Function to retry getting location
  const retryLocation = () => {
    setIsLoading(true);
    setMapError(null);
    setUserLocation(null);
    
    // Trigger the useEffect to run again
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="map-loading">
        <LoadingSpinner size="large" color="primary" text="Loading map..." />
        <div style={{ fontSize: '0.9em', color: '#666', marginTop: '8px' }}>
          {locationStatus}
        </div>
        <div style={{ fontSize: '0.8em', color: '#999', marginTop: '4px' }}>
          Make sure to allow location access when prompted
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="doctor-map-container">
        {mapError && (
          <div className="map-error-banner" style={{ 
            backgroundColor: '#fff3cd', 
            color: '#856404', 
            padding: '8px 12px', 
            marginBottom: '8px',
            borderRadius: '4px',
            fontSize: '0.9em'
          }}>
            {mapError}
            <button 
              onClick={retryLocation}
              style={{ 
                marginLeft: '12px', 
                padding: '4px 8px', 
                fontSize: '0.8em',
                backgroundColor: '#856404',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        )}
        
        

        <MapContainer 
          center={[mapCenter.lat, mapCenter.lng]} 
          zoom={12} 
          style={{ width: '100%', height: '500px', position: 'fixed', top: '1rem' }} 
          scrollWheelZoom={true}
        >
          <ChangeMapView center={mapCenter} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* User location marker with distinct icon */}
          {userLocation && (
            <Marker 
              position={[userLocation.lat, userLocation.lng]} 
              icon={UserLocationIcon}
            >
              <Popup>
                <div style={{ textAlign: 'center' }}>
                  <b>📍 Your Location</b>
                  <br />
                  <small>
                    {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                  </small>
                </div>
              </Popup>
            </Marker>
          )}
          
          {/* Doctor markers */}
          {nearbyDoctors.map((doctor, index) => (
            <Marker
              key={doctor.id || index}
              position={[parseFloat(doctor.latitude), parseFloat(doctor.longitude)]}
              icon={DefaultIcon}
              eventHandlers={{
                click: () => setSelectedDoctor(doctor)
              }}
            >
              <Popup
                onClose={() => setSelectedDoctor(null)}
              >
                <div className="info-window">
                  <h3>Dr. {doctor.prenom} {doctor.nom}</h3>
                  <p><strong>Specialty:</strong> {doctor.specialite}</p>
                  <p><strong>Hospital:</strong> {doctor.hopital}</p>
                  <p><strong>City:</strong> {doctor.city}</p>
                  <p><strong>Rating:</strong> {doctor.rating}/5</p>
                  <p><strong>Consultations:</strong> {doctor.nombreConsultations}</p>
                  {doctor.distance && (
                    <p><strong>Distance:</strong> {doctor.distance.toFixed(1)} km</p>
                  )}
                  {doctor.telephone && (
                    <p><strong>Phone:</strong> {doctor.telephone}</p>
                  )}
                  <button 
                    className="select-doctor-btn"
                    onClick={() => onDoctorSelect && onDoctorSelect(doctor)}
                  >
                    Book Consultation
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </ErrorBoundary>
  );
};

export default DoctorMap;