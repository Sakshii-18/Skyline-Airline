package com.skybook.repository;

import com.skybook.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, String> {
    List<Booking> findByFlightId(String flightId);
    List<Booking> findByUserEmail(String userEmail);
}
