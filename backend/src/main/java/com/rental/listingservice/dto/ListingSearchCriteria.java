package com.rental.listingservice.dto;

public record ListingSearchCriteria(Integer minPrice, Integer maxPrice, Integer minBedrooms, String city, String keyword, int page, Integer targetBudget) {
    public static final int DEFAULT_PAGE = 0;

    public static ListingSearchCriteria of(Integer minPrice, Integer maxPrice, Integer minBedrooms, String city, String keyword, Integer page, Integer targetBudget) {
        String validatedCity = (city == null || city.isBlank()) ? null : city.trim();
        String validatedKeyword =  (keyword == null || keyword.isBlank()) ? null : keyword.trim();

        return new ListingSearchCriteria(minPrice, maxPrice, minBedrooms, validatedCity, validatedKeyword, page == null ? DEFAULT_PAGE : page, targetBudget);
    }
}
