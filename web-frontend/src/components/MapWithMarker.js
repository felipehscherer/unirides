import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

const MapWithMarker = ({ position, onClick }) => (
  <GoogleMap
    mapContainerStyle={{ width: "100%", height: "200px" }}
    zoom={14}
    center={position}
    onClick={(event) =>
      onClick({ lat: event.latLng.lat(), lng: event.latLng.lng() })
    }
  >
    {position && <Marker position={position} />}
  </GoogleMap>
);

export default MapWithMarker;
