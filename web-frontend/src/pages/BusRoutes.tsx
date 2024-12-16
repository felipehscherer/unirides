// @ts-ignore
import React, {useState, useEffect, useRef} from "react";
import {GoogleMap, Marker, DirectionsRenderer} from "@react-google-maps/api";
import "./styles/MapPage.css";
import {Messages} from "primereact/messages";
// @ts-ignore
import {TransitMode, DrivingMode, WalkingMode, BicyclingMode, TravelModeStrategy,} from "../components/TravelModeStrategy.ts";
// @ts-ignore
import {GooglePlacesSuggestionService} from "../components/Suggestion.ts";
import {HomeIcon} from "lucide-react";

const BusRoutes = () => {
    const [originValue, setOriginValue] = useState<string>("");
    const [destinationValue, setDestinationValue] = useState<string>("");
    const [originData, setOriginData] = useState<any[]>([]);
    const [destinyData, setDestinyData] = useState<any[]>([]);
    const [directionsResponse, setDirectionsResponse] = useState<any>(null);
    const [travelModeStrategy, setTravelModeStrategy] = useState<TravelModeStrategy>(new TransitMode());
    const messagesRef = useRef<Messages | null>(null); // Tipo ajustado para resolver o erro de tipo do messagesRef

    const position = {lat: -29.789286, lng: -55.768070};

    const suggestionService = new GooglePlacesSuggestionService();

    const fetchSuggestions = async (query: string, type: "origin" | "destination") => {
        try {
            const predictions = await suggestionService.fetchSuggestions(query);
            if (type === "origin") {
                setOriginData(predictions);
            } else {
                setDestinyData(predictions);
            }
        } catch (error) {
            console.error(error);
            if (type === "origin") setOriginData([]);
            else setDestinyData([]);
        }
    };

    useEffect(() => {
        if (originValue) fetchSuggestions(originValue, "origin");
        else setOriginData([]);
    }, [originValue]);

    useEffect(() => {
        if (destinationValue) fetchSuggestions(destinationValue, "destination");
        else setDestinyData([]);
    }, [destinationValue]);

    const handleSearch = async () => {
        try {
            const directionsService = new google.maps.DirectionsService();
            const result = await directionsService.route({
                origin: originValue,
                destination: destinationValue,
                travelMode: travelModeStrategy.getMode(),
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
        switch (mode) {
            case "DRIVING":
                setTravelModeStrategy(new DrivingMode());
                break;
            case "WALKING":
                setTravelModeStrategy(new WalkingMode());
                break;
            case "BICYCLING":
                setTravelModeStrategy(new BicyclingMode());
                break;
            case "TRANSIT":
                setTravelModeStrategy(new TransitMode());
                break;
            default:
                setTravelModeStrategy(new TransitMode());
        }
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

    const showError = (
        severity: "error" | "success" | "info" | "warn" | "secondary" | "contrast" | undefined, // Ajuste no tipo do parâmetro severity
        summary: string,
        detail: string
    ) => {
        messagesRef.current?.clear();
        messagesRef.current?.show({
            severity: severity,
            summary: summary,
            detail: detail,
            life: 5000,
        });
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#e8f6e8]">
            <header className="bg-[#43A715] text-white shadow-lg">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Unirides</h1>
                    <nav>
                        <ul className="flex space-x-4">
                            <li>
                                <a
                                    href="/home"
                                    className="flex items-center hover:text-[#2e760f] transition-colors"
                                >
                                    <HomeIcon className="w-5 h-5 mr-1"/>
                                    Home
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
            <div className="container-1">
                <div className="search-box">
                    <div className="address-icon-box">
                        <input
                            value={originValue || ""}
                            onChange={(e) => setOriginValue(e.target.value)}
                            placeholder="Endereço de Origem"
                            onBlur={() => setTimeout(() => setOriginData([]), 200)}
                        />
                        {originValue && originData.length > 0 && (
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
                        {destinationValue && destinyData.length > 0 && (
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
                        <select onChange={(e) => handleTravelModeChange(e.target.value)}>
                            <option value="DRIVING">Dirigindo</option>
                            <option value="WALKING">Caminhando</option>
                            <option value="BICYCLING">Bicicleta</option>
                            <option value="TRANSIT">Transporte Público</option>
                        </select>
                    </div>
                    <button className="buscar-onibus-box-button" type="button" onClick={handleSearch}>
                        Buscar Rota
                    </button>
                </div>
                <div className="map">
                    <GoogleMap mapContainerStyle={{width: "100%", height: "100%"}} center={position} zoom={15}>
                        <Marker position={position}/>
                        {directionsResponse && <DirectionsRenderer directions={directionsResponse}/>}
                    </GoogleMap>
                </div>

            </div>
            <footer className="bg-[#43A715] text-white py-4 mt-auto">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm">&copy; 2023 RideShare. Todos os direitos reservados.</p>
                </div>
            </footer>
            <div className="error-messages">
                <Messages ref={messagesRef}/>
            </div>
        </div>
    );
};

export default BusRoutes;
