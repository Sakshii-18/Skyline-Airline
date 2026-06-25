package com.skybook.controller;

import com.skybook.model.Flight;
import com.skybook.service.FlightService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flights")
@CrossOrigin(origins = "*")
public class FlightController {

    private final FlightService flightService;

    public FlightController(FlightService flightService) {
        this.flightService = flightService;
    }

    // GET /api/flights -> list all flights
    @GetMapping
    public List<Flight> getFlights() {
        return flightService.getAllFlights();
    }

    // GET /api/flights/{id} -> single flight
    @GetMapping("/{id}")
    public ResponseEntity<Flight> getFlight(@PathVariable String id) {
        Flight flight = flightService.getFlightById(id);
        if (flight == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(flight);
    }
}
