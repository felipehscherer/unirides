import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, useLoadScript, Libraries } from '@react-google-maps/api';

interface MapProps {
  origin?: { lat: number; lng: number } | null;
  destination?: { lat: number; lng: number } | null;
  onOriginMapClick?: (event: google.maps.MapMouseEvent) => void;
  onDestinationMapClick?: (event: google.maps.MapMouseEvent) => void;
}

const libraries: Libraries = ['places']; 

const MapWithMarker: React.FC<MapProps> = ({ origin, destination, onOriginMapClick, onDestinationMapClick }) => {
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: -23.550520, lng: -46.633308 }); 
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(origin || destination || null); 

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
    libraries,
    language: 'pt-BR',
    region: 'BR'
  });

  useEffect(() => {
    if (origin) {
      setMapCenter(origin);
      setMarkerPosition(origin); 
    } else if (destination) {
      setMapCenter(destination);
      setMarkerPosition(destination); 
    }
  }, [origin, destination]);

  if (!isLoaded) return <div>Carregando Mapa...</div>;

  return (
    <div className="h-64 rounded-lg overflow-hidden">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        zoom={14}
        center={mapCenter}
        onClick={(event) => {
          if (event.latLng) {
            setMarkerPosition({
              lat: event.latLng.lat(),
              lng: event.latLng.lng()
            });
            // Chamar as funções de clique do componente pai
            if (origin) {
              onOriginMapClick!(event); 
            } else if (destination) {
              onDestinationMapClick!(event);
            }
          }
        }}
      >
        {markerPosition && <Marker position={markerPosition} />} 
      </GoogleMap>
    </div>
  );
};

export default MapWithMarker;