package com.skybook.service;

import com.skybook.model.Flight;
import com.skybook.repository.FlightRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FlightService {

    private final FlightRepository flightRepository;

    public FlightService(FlightRepository flightRepository) {
        this.flightRepository = flightRepository;
    }

    // Seeds sample flights into the database the first time the app runs.
    // On later runs (data already saved on disk), this does nothing.
    @PostConstruct
    public void seedFlights() {
        if (flightRepository.count() > 0) return;

        flightRepository.save(new Flight("SB-204", "SkyBook Air", "Pune (PNQ)", "Delhi (DEL)", "06:40", "08:50", 0, 4599));
        flightRepository.save(new Flight("IJ-118", "IndoJet", "Pune (PNQ)", "Delhi (DEL)", "09:15", "13:15", 1, 3899));
        flightRepository.save(new Flight("AL-330", "AeroLine", "Pune (PNQ)", "Delhi (DEL)", "13:50", "15:55", 0, 5299));
        flightRepository.save(new Flight("SB-512", "SkyBook Air", "Pune (PNQ)", "Delhi (DEL)", "18:25", "20:40", 0, 6150));
        flightRepository.save(new Flight("SB-771", "SkyBook Air", "Pune (PNQ)", "Dubai (DXB)", "22:10", "03:30", 1, 18499));
        flightRepository.save(new Flight("IJ-905", "IndoJet", "Pune (PNQ)", "Singapore (SIN)", "04:45", "12:45", 2, 22950));
    }

    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }

    public Flight getFlightById(String id) {
        return flightRepository.findById(id).orElse(null);
    }
}
