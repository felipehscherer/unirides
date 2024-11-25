export interface TravelModeStrategy {
    getMode(): google.maps.TravelMode;
}

export class DrivingMode implements TravelModeStrategy {
    getMode() {
        return google.maps.TravelMode.DRIVING;
    }
}

export class WalkingMode implements TravelModeStrategy {
    getMode() {
        return google.maps.TravelMode.WALKING;
    }
}

export class BicyclingMode implements TravelModeStrategy {
    getMode() {
        return google.maps.TravelMode.BICYCLING;
    }
}

export class TransitMode implements TravelModeStrategy {
    getMode() {
        return google.maps.TravelMode.TRANSIT;
    }
}
