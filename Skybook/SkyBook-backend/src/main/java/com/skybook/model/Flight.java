package com.skybook.model;

import jakarta.persistence.*;

@Entity
@Table(name = "flights")
public class Flight {

    @Id
    private String id;

    private String airline;

    @Column(name = "origin")
    private String from;

    @Column(name = "destination")
    private String to;

    private String departureTime;
    private String arrivalTime;
    private int stops;
    private double price;

    public Flight() {}

    public Flight(String id, String airline, String from, String to,
                  String departureTime, String arrivalTime, int stops, double price) {
        this.id = id;
        this.airline = airline;
        this.from = from;
        this.to = to;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.stops = stops;
        this.price = price;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getAirline() { return airline; }
    public void setAirline(String airline) { this.airline = airline; }

    public String getFrom() { return from; }
    public void setFrom(String from) { this.from = from; }

    public String getTo() { return to; }
    public void setTo(String to) { this.to = to; }

    public String getDepartureTime() { return departureTime; }
    public void setDepartureTime(String departureTime) { this.departureTime = departureTime; }

    public String getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(String arrivalTime) { this.arrivalTime = arrivalTime; }

    public int getStops() { return stops; }
    public void setStops(int stops) { this.stops = stops; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
}
