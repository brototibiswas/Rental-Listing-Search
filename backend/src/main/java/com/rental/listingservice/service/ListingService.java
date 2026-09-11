package com.rental.listingservice.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.rental.listingservice.dto.ListingResponse;
import com.rental.listingservice.dto.ListingSearchCriteria;
import com.rental.listingservice.dto.PagedResult;
import com.rental.listingservice.model.Listing;
import com.rental.listingservice.repository.ListingRepository;

@Service
public class ListingService {
    private final ListingRepository repo;

    public ListingService(ListingRepository repo) {
        this.repo = repo;
    }

    public PagedResult<ListingResponse> search(ListingSearchCriteria criteria) {
        List<Listing> filteredList = repo.findAll().stream()
        .filter(item -> matchesPrice(item, criteria))
        .filter(item -> matchesBedroom(item, criteria))
        .filter(item -> matchesCity(item, criteria))
        .filter(item -> matchesKeyword(item, criteria))
        .toList();

        List<ListingResponse> res = filteredList.stream().map(item -> buildSearchResponse(item, getScore(item))).toList();

        return new PagedResult<>(res, 0, res.size(), res.size(), 1);
    }

    private boolean matchesPrice(Listing item, ListingSearchCriteria criteria) {
        boolean searchPriceGreaterThanListingPrice = criteria.minPrice() != null && (item.getPrice() < criteria.minPrice());
        boolean searchPriceSmallerThanListingPrice = criteria.maxPrice() != null && (item.getPrice() > criteria.maxPrice());

        return !(searchPriceGreaterThanListingPrice || searchPriceSmallerThanListingPrice);
    }

    private boolean matchesBedroom(Listing item, ListingSearchCriteria criteria) {
        if(criteria.minBedrooms() == null) return true;
        return (criteria.minBedrooms() != null && (item.getBedrooms() >= criteria.minBedrooms()));
    }

    private boolean matchesCity(Listing item, ListingSearchCriteria criteria) {
        if(criteria.city() == null) return true;
        String normalizedCity = item.getCity() == null ? "" : item.getCity().trim();
        String normalizedInput = criteria.city() == null ? "" : criteria.city().trim();
        return normalizedCity.equalsIgnoreCase(normalizedInput);
    }

    private boolean matchesKeyword(Listing item, ListingSearchCriteria criteria) {
        if(criteria.keyword() == null) return true;
        return item.getDescription().toLowerCase().trim().contains(criteria.keyword().toLowerCase().trim());
    }

    private double getScore(Listing item) {
        return 0.0;
    }

    private ListingResponse buildSearchResponse(Listing item, double score) {
        return new ListingResponse(item.getId(), item.getSource(), item.getAddress(), item.getCity(), item.getZip(), item.getPrice(), item.getBedrooms(), item.getBathrooms(),item.getStatus(), item.getDescription(), score);
    }
}
