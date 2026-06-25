package com.skybook.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    private String id;

    @NotBlank(message = "Passenger name is required")
    private String passengerName;

    @Email(message = "Enter a valid email address")
    private String email;

    @Pattern(regexp = "^[0-9]{10}$", message = "Enter a valid 10-digit phone number")
    private String phone;

    private String gender;

    @NotBlank(message = "Flight ID is required")
    private String flightId;

    // Email of the logged-in user who made this booking (null if booked without logging in)
    private String userEmail;

    // Stored as a comma-separated string in the DB, exposed as a List in JSON
    @Column(name = "seats")
    private String seatsCsv;

    private String pnr;

    @Transient
    public List<String> getSeats() {
        if (seatsCsv == null || seatsCsv.isBlank()) return new ArrayList<>();
        List<String> list = new ArrayList<>();
        for (String s : seatsCsv.split(",")) list.add(s.trim());
        return list;
    }

    public void setSeats(List<String> seats) {
        this.seatsCsv = seats == null ? "" : String.join(",", seats);
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPassengerName() { return passengerName; }
    public void setPassengerName(String passengerName) { this.passengerName = passengerName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getFlightId() { return flightId; }
    public void setFlightId(String flightId) { this.flightId = flightId; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getPnr() { return pnr; }
    public void setPnr(String pnr) { this.pnr = pnr; }
}
