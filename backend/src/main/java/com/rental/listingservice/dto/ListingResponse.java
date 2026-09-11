package com.rental.listingservice.dto;

public record ListingResponse(  String id, String address, String city, String zip,
        int price, int bedrooms, double bathrooms, String description, long daysOnMarket, double score) {
    
}
