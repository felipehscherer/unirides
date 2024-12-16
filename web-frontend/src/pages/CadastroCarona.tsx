import React, { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from '../services/axiosConfig';
import MapWithMarker from '../components/MapWithMarker';
import { RideCreationRequestBuilder } from '../components/RideCreationRequestBuilder';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, Users, DollarSign, Check, ArrowRight } from 'lucide-react';

interface Position {
  lat: number;
  lng: number;
}

const CadastroCarona: React.FC = () => {
  const navigate = useNavigate();
  const [isConfirmarEnabled, setIsConfirmarEnabled] = useState(false);
  const [originPosition, setOriginPosition] = useState<Position | null>(null);
  const [destinationPosition, setDestinationPosition] = useState<Position | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState('');
  const [passengers, setPassengers] = useState<number | null>(null);
  const [suggestedPrice, setSuggestedPrice] = useState('');
  const [distanceInKm, setDistanceInKm] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [originAddress, setOriginAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [originCity, setOriginCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const messagesRef = useRef<any>(null);
  
  const {
    value: originValue,
    suggestions: { status: oStatus, data: oData },
    setValue: setOriginValue,
    clearSuggestions: clearOriginSuggestions,
  } = usePlacesAutocomplete({
    debounce: 300,
    requestOptions: {
      types: ['geocode', 'establishment'],
      componentRestrictions: { country: 'br' }
    }
  });

  const {
    value: destinationValue,
    suggestions: { status: dStatus, data: dData },
    setValue: setDestinationValue,
    clearSuggestions: clearDestinationSuggestions,
  } = usePlacesAutocomplete({
    debounce: 300,
    requestOptions: {
      types: ['geocode', 'establishment'], // Add more specific types
      componentRestrictions: { country: 'br' } // Restrict to Brazil
    }
  });

  const showMessage = (severity: string, summary: string, detail: string) => {
    messagesRef.current?.show({
      severity,
      summary,
      detail,
      life: 5000,
    });
  };

  const handleOriginSelect = async (address: string) => {
    setOriginValue(address, false);
    clearOriginSuggestions();
    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      setOriginPosition({ lat, lng });
    } catch (error) {
      console.error('Erro ao obter a geolocalização:', error);
    }
  };

  const handleDestinationSelect = async (address: string) => {
    setDestinationValue(address, false);
    clearDestinationSuggestions();
    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      setDestinationPosition({ lat, lng });
    } catch (error) {
      console.error('Erro ao obter a geolocalização:', error);
    }
  };

  const handleMapClickOrigin = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      setOriginPosition({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      });
    }
  };

  const handleMapClickDestination = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      setDestinationPosition({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      });
    }
  };

  const extractCityName = (address: string) => {
    if (!address) return '';
    const parts = address.split(',');
    const cityAndState = parts[parts.length - 3]?.trim() || '';
    return cityAndState.split('-')[0].trim();
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}min`;
  };

  const calculateDistanceAndSuggestPrice = async () => {
    if (!originPosition || !destinationPosition) {
      showMessage('warn', 'Alerta:', 'Preencha todos os campos!');
      return false;
    }

    const origin = `${originPosition.lat},${originPosition.lng}`;
    const destination = `${destinationPosition.lat},${destinationPosition.lng}`;

    try {
      const { data } = await axios.get('/api/distance', {
        params: { origin, destination },
      });

      if (!data || !data.rows || !data.rows[0] || !data.rows[0].elements || !data.rows[0].elements[0]) {
        showMessage('error', 'Erro:', 'Resposta inválida do servidor');
        return false;
      }

      const element = data.rows[0].elements[0];
      if (element.status === 'OK') {
        setDuration(element.duration.value);
        setDistanceInKm(element.distance.text);
        setSuggestedPrice(calculatePrice(element.distance.value / 1000).toString());

        setOriginAddress(data.origin_addresses[0]);
        setDestinationAddress(data.destination_addresses[0]);
        setOriginCity(extractCityName(data.origin_addresses[0]));
        setDestinationCity(extractCityName(data.destination_addresses[0]));

        return true;
      } else {
        showMessage('error', 'Erro:', 'Não foi possível calcular a distância');
        return false;
      }
    } catch (error: any) {
      console.error('Erro ao calcular a distância:', error);
      const errorMessage = error.response?.data?.message || 'Não foi possível calcular a distância';
      showMessage('error', 'Erro:', errorMessage);
      return false;
    }
  };

  const calculatePrice = (distanceInKm: number) => {
    const basePrice = 0.75;
    const pricePerKm = 0.3;
    return basePrice + pricePerKm * distanceInKm;
  };

  const handleOkClick = async () => {
    if (!originPosition || !destinationPosition || !date || !time || !passengers) {
      showMessage('warn', 'Alerta:', 'Preencha todos os campos!');
      return;
    } else if (passengers > 4) {
      showMessage('warn', 'Alerta:', 'Muitos passageiros, máximo 4!');
      return;
    }
    if (await calculateDistanceAndSuggestPrice()) {
      setIsConfirmarEnabled(true);
    }
  };

  const handleAgendarCarona = async () => {
    if (!originPosition || !destinationPosition || !date || !time || !passengers) {
      showMessage('warn', 'Alerta:', 'Preencha todos os campos!');
      return;
    } else if (passengers > 4) {
      showMessage('warn', 'Alerta:', 'Muitos passageiros, máximo 4!');
      return;
    }

    const dataToSend = new RideCreationRequestBuilder()
      .setOrigin(originPosition.lat, originPosition.lng)
      .setDestination(destinationPosition.lat, destinationPosition.lng)
      .setAddresses(originAddress, destinationAddress)
      .setCities(originCity, destinationCity)
      .setDateAndTime(date, time)
      .setDesiredPassengersNumber(passengers)
      .setPrice(parseFloat(suggestedPrice))
      .setDistance(distanceInKm || '')
      .setDuration(duration || 0)
      .build();

    try {
      await axios.post('/rides/create', dataToSend);
      showMessage('success', 'Sucesso:', 'Carona agendada com sucesso!');
      setTimeout(() => {
        navigate('/home');
      }, 2000);
    } catch (error: any) {
      const errorMsg = error.response?.data || 'Algo deu errado..';
      showMessage('error', 'Erro:', errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Cadastro de Carona</h2>

          <div className="space-y-6">
            {/* Origin Input */}
            <div>
              <label htmlFor="origin" className="block text-sm font-medium text-gray-700">
                Endereço de Origem
              </label>
              <div className="mt-1 relative">
                <input
                  id="origin"
                  type="text"
                  value={originValue}
                  onChange={(e) => {
                    setOriginValue(e.target.value);
                    if (e.target.value === '') {
                      clearOriginSuggestions();
                    }
                  }}
                  className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Digite o endereço de origem"
                />
                <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
              {originValue && oStatus === 'OK' && oData.length > 0 && (
                <ul className="mt-2 bg-white border border-gray-300 rounded-md shadow-sm">
                  {oData.map((suggestion) => (
                    <li
                      key={suggestion.place_id}
                      onClick={() => handleOriginSelect(suggestion.description)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {suggestion.description}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Origin Map */}
            {originPosition && (
              <MapWithMarker origin={originPosition} onOriginMapClick={handleMapClickOrigin} />
            )}

            {/* Destination Input */}
            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
                Endereço de Destino
              </label>
              <div className="mt-1 relative">
                <input
                  id="destination"
                  type="text"
                  value={destinationValue}
                  onChange={(e) => {
                    setDestinationValue(e.target.value);
                    if (e.target.value === '') {
                      clearDestinationSuggestions();
                    }
                  }}
                  className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Digite o endereço de destino"
                />
                <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
              {destinationValue && dStatus === 'OK' && dData.length > 0 && (
                <ul className="mt-2 bg-white border border-gray-300 rounded-md shadow-sm">
                  {dData.map((suggestion) => (
                    <li
                      key={suggestion.place_id}
                      onClick={() => handleDestinationSelect(suggestion.description)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {suggestion.description}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Destination Map */}
            {destinationPosition && (
              <MapWithMarker destination={destinationPosition} onDestinationMapClick={handleMapClickDestination} />
            )}

            {/* Date, Time, and Passengers */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Data da viagem
                </label>
                <div className="relative">
                <DatePicker
                    id="date"
                    selected={date}
                    onChange={(date: Date | null, event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
                      if (date) {
                        setDate(date);
                      }
                    }}
                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md pr-10"
                    placeholderText="Selecione a data"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>
              </div>
              <div>

              <style>
              {`
                input[type="time"]::-webkit-calendar-picker-indicator {
                  display: none;
                  -webkit-appearance: none;
                }
              `}
            </style>

                <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                  Horário
                </label>
                <div className="mt-1 relative">
                  <input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>
              </div>
              <div>
                <label htmlFor="passengers" className="block text-sm font-medium text-gray-700">
                  Nº de Passageiros
                </label>
                <div className="mt-1 relative">
                  <input
                    id="passengers"
                    type="number"
                    min="1"
                    max="4"
                    value={passengers || ''}
                    onChange={(e) => setPassengers(parseInt(e.target.value, 10))}
                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Máximo 4"
                  />
                  <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>
            </div>

            {/* Confirm Button */}
            <div className="mt-6">
              <button
                onClick={handleOkClick}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Check className="mr-2" size={20} />
                Confirmar Detalhes
              </button>
            </div>

            {/* Trip Details */}
            {isConfirmarEnabled && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-6 bg-gray-50 p-4 rounded-md"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-4">Detalhes da Viagem</h3>
                <div className="flex flex-col sm:flex-row justify-around items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center">
                    <MapPin className="text-green-500 mr-2" size={20} />
                    <p className="text-sm text-gray-900">{distanceInKm}</p>
                  </div>
                  <div className="flex items-center">
                    <Clock className="text-green-500 mr-2" size={20} />
                    <p className="text-sm text-gray-900">{formatDuration(duration || 0)}</p>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="text-green-500 mr-2" size={20} />
                    <p className="text-sm text-gray-900">R$ {parseFloat(suggestedPrice).toFixed()}</p>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Offer Ride Button */}
            <div className="mt-6">
              <button
                onClick={handleAgendarCarona}
                disabled={!isConfirmarEnabled}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isConfirmarEnabled
                    ? 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                <ArrowRight className="mr-2" size={20} />
                Oferecer Carona
              </button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default CadastroCarona;


