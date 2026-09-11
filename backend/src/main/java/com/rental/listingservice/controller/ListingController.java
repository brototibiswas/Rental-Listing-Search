package com.rental.listingservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rental.listingservice.dto.ListingResponse;
import com.rental.listingservice.dto.ListingSearchCriteria;
import com.rental.listingservice.dto.PagedResult;
import com.rental.listingservice.service.ListingService;

@RestController
@RequestMapping("/api/listings")
public class ListingController {
    private final ListingService listingService;

    public ListingController(ListingService listingService) {
        this.listingService = listingService;
    }

    @GetMapping("/search")
    public PagedResult<ListingResponse> search(
        @RequestParam(required=false) Double minPrice,
        @RequestParam(required=false) Double maxPrice,
        @RequestParam(required=false) Integer minBedrooms,
        @RequestParam(required=false) String city,
        @RequestParam(required=false) String keyword,
        @RequestParam(required=false) Integer page,
        @RequestParam(required=false) Integer itemsPerPage
    ) {
        ListingSearchCriteria criteria = ListingSearchCriteria.of(minPrice, maxPrice, minBedrooms, city, keyword, page, page);
        return listingService.search(criteria);
    }
}
