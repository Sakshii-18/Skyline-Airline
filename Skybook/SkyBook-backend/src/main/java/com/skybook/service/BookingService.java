package com.skybook.service;

import com.skybook.model.Booking;
import com.skybook.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;
import java.util.UUID;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    // Seats taken before any booking is made (pretend pre-existing reservations)
    private static final Set<String> PRESET_OCCUPIED = Set.of("A2", "B4", "C1", "D3");

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    // Occupied seats = preset seats + every seat already saved in the database for this flight
    public Set<String> getOccupiedSeats(String flightId) {
        Set<String> occupied = new HashSet<>(PRESET_OCCUPIED);
        for (Booking b : bookingRepository.findByFlightId(flightId)) {
            occupied.addAll(b.getSeats());
        }
        return occupied;
    }

    public Booking createBooking(Booking booking) {
        Set<String> taken = getOccupiedSeats(booking.getFlightId());

        for (String seat : booking.getSeats()) {
            if (taken.contains(seat)) {
                throw new IllegalStateException("Seat " + seat + " is already booked.");
            }
        }

        booking.setId(UUID.randomUUID().toString());
        booking.setPnr(generatePnr());
        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getBookingsForUser(String userEmail) {
        return bookingRepository.findByUserEmail(userEmail);
    }

    private String generatePnr() {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZ123456789";
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }
}
