package com.rental.listingservice.dto;

import java.util.List;

public record PagedResult<T>(List<T> results, int page, int items, long totalCount, int totalPages) {
    
}
