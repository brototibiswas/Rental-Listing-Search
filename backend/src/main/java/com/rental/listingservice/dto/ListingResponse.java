package com.rental.listingservice.dto;

public record ListingResponse(  String id, String source, String address, String city, String zip,
        double price, int bedrooms, double bathrooms, String status, String description, double score) {
    
}
