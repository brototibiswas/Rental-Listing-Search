package com.rental.listingservice.dto;

public record ListingSearchCriteria(Integer minPrice, Integer maxPrice, Integer minBedrooms, String city, String keyword, int page, int items, Integer targetBudget) {
    public static final int DEFAULT_PAGE = 0;
    public static final int DEFAULT_ITEMS_PER_PAGE=10;

    public static ListingSearchCriteria of(Integer minPrice, Integer maxPrice, Integer minBedrooms, String city, String keyword, Integer page, Integer items, Integer targetBudget) {
        String validatedCity = (city == null || city.isBlank()) ? null : city.trim();
        String validatedKeyword =  (keyword == null || keyword.isBlank()) ? null : keyword.trim();

        return new ListingSearchCriteria(minPrice, maxPrice, minBedrooms, validatedCity, validatedKeyword, page == null ? DEFAULT_PAGE : page, items == null ? DEFAULT_ITEMS_PER_PAGE : items, targetBudget);
    }
}
