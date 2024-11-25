// @ts-ignore
import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api";
import "./styles/MapPage.css";

const MapPage = () => {
    const [originValue, setOriginValue] = useState<string>("");
    const [destinationValue, setDestinationValue] = useState<string>("");
    const [oData, setOData] = useState<any[]>([]);
    const [dData, setDData] = useState<any[]>([]);
    const [oStatus, setOStatus] = useState<string>("");
    const [dStatus, setDStatus] = useState<string>("");
    const [directionsResponse, setDirectionsResponse] = useState<any>(null);
    const [travelMode, setTravelMode] = useState<google.maps.TravelMode>(google.maps.TravelMode.DRIVING);

    const position = { lat: -29.789286, lng: -55.768070 };

    const fetchSuggestions = (query: string, type: "origin" | "destination") => {
        if (!query) return;

        const service = new google.maps.places.AutocompleteService();
        const request = {
            input: query,
            types: ["geocode"],
        };

        service.getPlacePredictions(request, (predictions, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                if (type === "origin") {
                    setOData(predictions || []);
                    setOStatus("OK");
                } else {
                    setDData(predictions || []);
                    setDStatus("OK");
                }
            } else {
                if (type === "origin") {
                    setOData([]);
                    setOStatus("ERROR");
                } else {
                    setDData([]);
                    setDStatus("ERROR");
                }
            }
        });
    };

    useEffect(() => {
        if (originValue) {
            fetchSuggestions(originValue, "origin");
        } else {
            setOData([]);
        }
    }, [originValue]);

    useEffect(() => {
        if (destinationValue) {
            fetchSuggestions(destinationValue, "destination");
        } else {
            setDData([]);
        }
    }, [destinationValue]);

    const handleSearch = async () => {
        try {
            const directionsService = new google.maps.DirectionsService();
            const result = await directionsService.route({
                origin: originValue,
                destination: destinationValue,
                travelMode: travelMode,
            });

            if (result.routes && result.routes.length > 0) {
                setDirectionsResponse(result);
            } else {
                alert("Nenhuma rota encontrada entre os endereços fornecidos.");
            }
        } catch (error) {
            console.error("Erro ao buscar rotas:", error);
            alert("Erro ao buscar rotas. Por favor, tente novamente.");
        }
    };

    const handleTravelModeChange = (mode: string) => {
        setTravelMode(google.maps.TravelMode[mode as keyof typeof google.maps.TravelMode]);
    };

    const handleOriginSelect = (description: string) => {
        setOriginValue(description);
        setOData([]);
    };

    const handleDestinationSelect = (description: string) => {
        setDestinationValue(description);
        setDData([]);
    };

    return (
        <div className="container-1">
            <div className="search-box">
                <div className="address-icon-box">
                    <input
                        value={originValue || ""}
                        onChange={(e) => setOriginValue(e.target.value)}
                        placeholder="Endereço de Origem"
                    />
                    {originValue && oStatus === "OK" && oData.length > 0 && (
                        <div className="suggestions-list">
                            {oData.map((suggestion, index) => (
                                <div
                                    key={suggestion.place_id || index}
                                    onClick={() => handleOriginSelect(suggestion.description)}
                                    className="suggestion-item"
                                >
                                    {suggestion.description}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="address-icon-box">
                    <input
                        value={destinationValue || ""}
                        onChange={(e) => setDestinationValue(e.target.value)}
                        placeholder="Endereço de Destino"
                    />
                    {destinationValue && dStatus === "OK" && dData.length > 0 && (
                        <div className="suggestions-list">
                            {dData.map((suggestion, index) => (
                                <div
                                    key={suggestion.place_id || index}
                                    onClick={() => handleDestinationSelect(suggestion.description)}
                                    className="suggestion-item"
                                >
                                    {suggestion.description}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="travel-mode-select">
                    <select
                        value={travelMode}
                        onChange={(e) => handleTravelModeChange(e.target.value)}
                    >
                        <option value="DRIVING">Dirigindo</option>
                        <option value="WALKING">Caminhando</option>
                        <option value="BICYCLING">Bicicleta</option>
                        <option value="TRANSIT">Transporte Público</option>
                    </select>
                </div>

                <button type="button" className="buscar-carona-box-button" onClick={handleSearch}>
                    Buscar Rota
                </button>
            </div>

            <div className="map">
                <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    center={position}
                    zoom={15}
                >
                    <Marker position={position} />
                    {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
                </GoogleMap>
            </div>
        </div>
    );
};

export default MapPage;
