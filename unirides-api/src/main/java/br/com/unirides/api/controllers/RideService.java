package br.com.unirides.api.controllers;

import br.com.unirides.api.domain.ride.Ride;
import br.com.unirides.api.repository.RideRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RideService {

    @Autowired
    private RideRepository rideRepository;

    public List<Ride> findRidesByDestination(String destination) {
        String normalizedDestination = normalizeText(destination);

        // Obtenha todas as caronas e filtre pelo destino
        return rideRepository.findAll().stream()
                .filter(ride -> normalizeText(ride.getDestination()).contains(normalizedDestination))
                .collect(Collectors.toList());
    }

    // Método para remover acentuação e transformar em minúsculas
    private String normalizeText(String text) {
        if (text == null) return null;
        return Normalizer.normalize(text, Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "")
                .toLowerCase();
    }
}
