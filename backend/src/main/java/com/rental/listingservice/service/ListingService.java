package com.rental.listingservice.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
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
    private final ScoringService scoringService;

    public ListingService(ListingRepository repo, ScoringService scoringService) {
        this.repo = repo;
        this.scoringService = scoringService;
    }

    public PagedResult<ListingResponse> search(ListingSearchCriteria criteria) {
        List<Listing> filteredList = repo.findAll().stream()
        .filter(item -> matchesPrice(item, criteria))
        .filter(item -> matchesBedroom(item, criteria))
        .filter(item -> matchesCity(item, criteria))
        .filter(item -> matchesKeyword(item, criteria))
        .toList();

        List<Listing> sortedList = rankListings(filteredList, criteria);

        List<ListingResponse> scoredList = sortedList.stream()
        .map(item -> buildSearchResponse(item, scoringService.getPriceScore(item.getPrice(), criteria.targetBudget())))
        .toList();

        return paginate(scoredList, criteria);
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

    private List<Listing> rankListings(List<Listing> listings, ListingSearchCriteria criteria) {
        return listings.stream()
        .sorted(
            Comparator.comparingDouble((Listing item) -> scoringService.getPriceScore(item.getPrice(), criteria.targetBudget()))
            .reversed()
            .thenComparing(scoringService::getRecencyRank, Comparator.reverseOrder())
        ).toList();
    }

    private PagedResult<ListingResponse> paginate(List<ListingResponse> listings, ListingSearchCriteria criteria) {
    int totalCount = listings.size();
    int totalPages = (int) Math.ceil((double) totalCount / criteria.items());

    int fromIndex = criteria.page() * criteria.items();
    List<ListingResponse> pageSlice = (fromIndex >= totalCount || fromIndex < 0)
            ? List.of()
            : listings.subList(fromIndex, Math.min(fromIndex + criteria.items(), totalCount));

    return new PagedResult<>(pageSlice, criteria.page(), criteria.items(), totalCount, totalPages);
}

    private long getDaysOnMarket(Listing item) {
        try{
            LocalDate listed = LocalDate.parse(item.getListedDate());
            return ChronoUnit.DAYS.between(listed, LocalDate.now());
        } catch(Exception e) {
            return -1; // missing date
        }
    }

    private ListingResponse buildSearchResponse(Listing item, double score) {
        return new ListingResponse(item.getId(),item.getAddress(),item.getCity(),item.getZip(),item.getPrice(),item.getBedrooms(),item.getBathrooms(),item.getDescription(),getDaysOnMarket(item), score);
    }
}
