import React from 'react';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import './LocationInput.css'

const LocationInput = ({ value, setValue, onSelect }) => {
  const {
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({
    value,
    onChange: setValue,
    debounce: 300,
  });

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();
    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      onSelect({ lat, lng });
    } catch (error) {
      console.error("Erro ao obter a geolocalização:", error);
    }
  };

  return (
    <div className='ride-registration'>
      <input
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          if (e.target.value === "") clearSuggestions();
        }}
        placeholder="Digite o endereço"
        style={{ marginBottom: '0.5rem' }}
      />
      {value && status === "OK" && data.length > 0 && (
        <div className="suggestions-list">
          {data.map((suggestion, index) => (
            <div
              key={suggestion.place_id || index}
              onClick={() => handleSelect(suggestion.description)}
              className="suggestion-item"
            >
              {suggestion.description}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationInput;
