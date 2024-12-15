import React, { useEffect, useState } from "react";
import { GoogleMap, DirectionsRenderer} from "@react-google-maps/api";

const MapWithRoute = ({ origin, destination }) => {
  const [directionsResponse, setDirectionsResponse] = useState(null);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const directionsService = new window.google.maps.DirectionsService();
        const directionsRenderer = new window.google.maps.DirectionsRenderer();
        console.log("Requisição para rota:", { origin, destination });

        const request = {
            origin: origin,
            destination: destination,
            travelMode: 'DRIVING'
        }
        
        directionsService.route(request, function(response, status) {
            if (status === 'OK') {
              directionsRenderer.setDirections(response);
              setDirectionsResponse(response);
            }
          });

      } catch (error) {
        console.error("Erro ao obter rota:", error);
      }
    };

    if (origin && destination) {
      fetchRoute();
    }
  }, [origin, destination]);

  return (
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "350px" }}
        center={origin}
        zoom={10}
      >
        {directionsResponse && (
          <DirectionsRenderer directions={directionsResponse} />
        )}
      </GoogleMap>
  );
};

export default MapWithRoute;
