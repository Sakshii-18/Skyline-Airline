package com.skybook.controller;

import com.skybook.model.Booking;
import com.skybook.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // GET /api/bookings/seats/{flightId} -> seats already occupied for a flight
    @GetMapping("/seats/{flightId}")
    public Set<String> getOccupiedSeats(@PathVariable String flightId) {
        return bookingService.getOccupiedSeats(flightId);
    }

    // POST /api/bookings -> create a booking, returns booking with generated PNR.
    // If the request includes a valid JWT (user is logged in), the booking is
    // automatically linked to that user's account so it shows up in "My Bookings".
    @PostMapping
    public ResponseEntity<?> createBooking(@Valid @RequestBody Booking booking, Authentication authentication) {
        try {
            if (isLoggedIn(authentication)) {
                booking.setUserEmail((String) authentication.getPrincipal());
            }
            Booking saved = bookingService.createBooking(booking);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    // GET /api/bookings/my -> bookings belonging to the logged-in user (requires JWT)
    @GetMapping("/my")
    public ResponseEntity<?> getMyBookings(Authentication authentication) {
        if (!isLoggedIn(authentication)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login is required to view bookings.");
        }

        String email = (String) authentication.getPrincipal();
        return ResponseEntity.ok(bookingService.getBookingsForUser(email));
    }

    private boolean isLoggedIn(Authentication authentication) {
        return authentication != null
                && authentication.isAuthenticated()
                && !(authentication instanceof AnonymousAuthenticationToken);
    }
}
