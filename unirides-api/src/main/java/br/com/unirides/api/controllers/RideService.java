package br.com.unirides.api.controllers;

import br.com.unirides.api.domain.ride.Ride;
import br.com.unirides.api.domain.ride.RideStatus;
import br.com.unirides.api.dto.ride.RideSearchDTO;
import br.com.unirides.api.repository.RideRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Slf4j
public class RideService {

    @Autowired
    private RideRepository rideRepository;

    private static final double DISTANCE_THRESHOLD = 10.0; // Aproximadamente 10km em graus

    public List<Ride> findRidesByDestination(RideSearchDTO searchDTO) {
        Coordinates searchOrigin = parseCoordinates(searchDTO.getOrigin());
        Coordinates searchDestination = parseCoordinates(searchDTO.getDestination());

        if (searchDestination == null || searchOrigin == null) {
            log.warn("Coordenadas inválidas na busca: origem={}, destino={}",
                    searchDTO.getOrigin(), searchDTO.getDestination());
            return Collections.emptyList();
        }

        // Obter caronas abertas, calcular proximidade e ordenar
        return rideRepository.findAll().stream()
                .filter(ride -> ride.getStatus().equals(RideStatus.ABERTA))
                .map(ride -> {
                    Coordinates rideOrigin = parseCoordinates(ride.getOrigin());
                    Coordinates rideDestination = parseCoordinates(ride.getDestination());

                    if (rideOrigin == null || rideDestination == null) {
                        log.warn("Coordenadas inválidas na carona {}: origem={}, destino={}",
                                ride.getId(), ride.getOrigin(), ride.getDestination());
                        return null;
                    }

                    double proximityScore = calculateProximityScore(
                            searchOrigin, searchDestination,
                            rideOrigin, rideDestination
                    );

                    return new RideWithScore(ride, proximityScore);
                })
                .filter(Objects::nonNull)
                // Filtrar apenas caronas próximas
                .filter(rideWithScore -> rideWithScore.getProximityScore() <= DISTANCE_THRESHOLD * 2)
                // Ordenar por proximidade
                .sorted(Comparator.comparingDouble(RideWithScore::getProximityScore))
                .map(RideWithScore::getRide)
                .collect(Collectors.toList());
    }

    private double calculateProximityScore(Coordinates searchOrigin, Coordinates searchDestination,
                                           Coordinates rideOrigin, Coordinates rideDestination) {
        // Calcular distância para origem e destino usando a fórmula de Haversine
        double originDistance = calculateHaversineDistance(searchOrigin, rideOrigin);
        double destinationDistance = calculateHaversineDistance(searchDestination, rideDestination);

        // Retornar a soma das distâncias como score (quanto menor, melhor)
        return originDistance + destinationDistance;
    }

    private double calculateHaversineDistance(Coordinates coord1, Coordinates coord2) {
        final int R = 6371; // Raio da Terra em quilômetros

        double lat1 = Math.toRadians(coord1.getLatitude());
        double lat2 = Math.toRadians(coord2.getLatitude());
        double lon1 = Math.toRadians(coord1.getLongitude());
        double lon2 = Math.toRadians(coord2.getLongitude());

        double dLat = lat2 - lat1;
        double dLon = lon2 - lon1;

        double a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1) * Math.cos(lat2) *
                        Math.sin(dLon/2) * Math.sin(dLon/2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c; // Distância em quilômetros
    }

    private Coordinates parseCoordinates(String coordsStr) {
        try {
            String[] parts = coordsStr.split(",");
            if (parts.length == 2) {
                double lat = Double.parseDouble(parts[0]);
                double lng = Double.parseDouble(parts[1]);
                return new Coordinates(lat, lng);
            }
        } catch (Exception e) {
            log.error("Erro ao fazer parse das coordenadas: {}", coordsStr, e);
        }
        return null;
    }

    @Data
    @AllArgsConstructor
    private static class Coordinates {
        private double latitude;
        private double longitude;
    }

    @Data
    @AllArgsConstructor
    private static class RideWithScore {
        private Ride ride;
        private double proximityScore;
    }
}