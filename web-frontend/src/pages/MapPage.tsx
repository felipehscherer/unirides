// @ts-ignore
import React, {useState, useEffect, useRef} from "react";
import {GoogleMap, Marker, DirectionsRenderer} from "@react-google-maps/api";
import "./styles/MapPage.css";
import {Messages} from "primereact/messages";

const MapPage = () => {
    const [originValue, setOriginValue] = useState<string>("");
    const [destinationValue, setDestinationValue] = useState<string>("");
    const [originData, setOriginData] = useState<any[]>([]);
    const [destinyData, setDestinyData] = useState<any[]>([]);
    const [originStatus, setOriginStatus] = useState<string>("");
    const [destinyStatus, setDestinyStatus] = useState<string>("");
    const [directionsResponse, setDirectionsResponse] = useState<any>(null);
    const [travelMode, setTravelMode] = useState<google.maps.TravelMode>(google.maps.TravelMode.TRANSIT);
    const messagesRef = useRef(null);

    const position = {lat: -29.789286, lng: -55.768070};

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
                    setOriginData(predictions || []);
                    setOriginStatus("OK");
                } else {
                    setDestinyData(predictions || []);
                    setDestinyStatus("OK");
                }
            } else {
                if (type === "origin") {
                    setOriginData([]);
                    setOriginStatus("ERROR");
                } else {
                    setDestinyData([]);
                    setDestinyStatus("ERROR");
                }
            }
        });
    };

    useEffect(() => {
        if (originValue) {
            fetchSuggestions(originValue, "origin");
        } else {
            setOriginData([]);
        }
    }, [originValue]);

    useEffect(() => {
        if (destinationValue) {
            fetchSuggestions(destinationValue, "destination");
        } else {
            setDestinyData([]);
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
                showError("error", "Erro:", "Nenhuma rota encontrada entre os endereços fornecidos.");
            }
        } catch (error) {
            console.error("Erro ao buscar rotas:", error);
            showError("error", "Erro:", "Erro ao buscar rotas. Por favor, tente novamente.");
        }
    };

    const handleTravelModeChange = (mode: string) => {
        setTravelMode(google.maps.TravelMode[mode as keyof typeof google.maps.TravelMode]);
    };

    const handleSuggestionSelect = (description: string, type: "origin" | "destination") => {
        if (type === "origin") {
            setOriginValue(description);
            setOriginData([]);
        } else {
            setDestinationValue(description);
            setDestinyData([]);
        }
    };

    const showError = (severity: string, summary: string, detail: string) => {
        messagesRef.current?.clear();
        messagesRef.current?.show({
            severity: severity,
            summary: summary,
            detail: detail,
            life: 5000,
        });
    };

    return (
        <div className="container-1">
            <div className="search-box">
                <div className="address-icon-box">
                    <input
                        value={originValue || ""}
                        onChange={(e) => setOriginValue(e.target.value)}
                        placeholder="Endereço de Origem"
                        onBlur={() => setTimeout(() => setOriginData([]), 200)}
                    />

                    {originValue && originStatus === "OK" && originData.length > 0 && (
                        <div className="suggestions-list">
                            {originData.map((suggestion, index) => (
                                <div
                                    key={suggestion.place_id || index}
                                    onClick={() => handleSuggestionSelect(suggestion.description, "origin")}
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
                        onBlur={() => setTimeout(() => setDestinyData([]), 200)}
                    />
                    {destinationValue && destinyStatus === "OK" && destinyData.length > 0 && (
                        <div className="suggestions-list">
                            {destinyData.map((suggestion, index) => (
                                <div
                                    key={suggestion.place_id || index}
                                    onClick={() => handleSuggestionSelect(suggestion.description, "destination")}
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
                    mapContainerStyle={{width: "100%", height: "100%"}}
                    center={position}
                    zoom={15}
                >
                    <Marker position={position}/>
                    {directionsResponse && <DirectionsRenderer directions={directionsResponse}/>}
                </GoogleMap>
            </div>
            <Messages className='custom-toast' ref={messagesRef}/>
        </div>
    );
};

export default MapPage;
