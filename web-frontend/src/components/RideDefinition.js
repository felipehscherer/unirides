import React, { useState } from 'react';
import LocationInput from './LocationInput';
import MapWithMarker from './MapWithMarker';
import './RideDefinition.css';

const RideDefinition = () => {
  const [originValue, setOriginValue] = useState('');
  const [originPosition, setOriginPosition] = useState(null);

  const [destinationValue, setDestinationValue] = useState('');
  const [destinationPosition, setDestinationPosition] = useState(null);

  return (
    <div className="ride-registrationu">
      {/* Campo de Origem */}
      <LocationInput
        value={originValue}
        setValue={setOriginValue}
        onSelect={(position) => setOriginPosition(position)}
      />
      {originPosition && (
        <MapWithMarker
          position={originPosition}
          onClick={(position) => setOriginPosition(position)}
        />
      )}

      {/* Campo de Destino */}
      <LocationInput
        value={destinationValue}
        setValue={setDestinationValue}
        onSelect={(position) => setDestinationPosition(position)}
      />
      {destinationPosition && (
        <MapWithMarker
          position={destinationPosition}
          onClick={(position) => setDestinationPosition(position)}
        />
      )}
    </div>
  );
};

export default RideDefinition;
