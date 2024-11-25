// SuggestionService.ts
export interface Suggestion {
    fetchSuggestions(query: string): Promise<google.maps.places.AutocompletePrediction[]>;
}

export class GooglePlacesSuggestionService implements Suggestion {
    fetchSuggestions(query: string): Promise<google.maps.places.AutocompletePrediction[]> {
        return new Promise((resolve, reject) => {
            const service = new google.maps.places.AutocompleteService();
            const request = { input: query, types: ["geocode"] };

            service.getPlacePredictions(request, (predictions, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    resolve(predictions || []);
                } else {
                    reject("Erro ao buscar sugestões.");
                }
            });
        });
    }
}
