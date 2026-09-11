package com.rental.listingservice.repository;

import java.io.InputStream;
import java.util.List;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Repository;

import com.rental.listingservice.model.Listing;

import jakarta.annotation.PostConstruct;
import tools.jackson.databind.ObjectMapper;

@Repository 
public class ListingRepository {
    private List<Listing> listings;

     @PostConstruct
    public void loadData() {
        try (InputStream is = new ClassPathResource("sample_listings.json").getInputStream()) {
            ObjectMapper mapper = new ObjectMapper();
            Listing[] array = mapper.readValue(is, Listing[].class);
            this.listings = List.of(array);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to load sample_listings.json", e);
        }
    }

    public List<Listing> findAll() {
        return listings;
    }
}
