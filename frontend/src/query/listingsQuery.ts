import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { ListingSearchCriteria, SearchResultResponse } from "../types/Listing.type";

const BASE_URL = 'http://localhost:8080/api/listings';

export async function searchListings(searchCriteria: ListingSearchCriteria, page: number, itemsPerPage: number): Promise<SearchResultResponse> {
    const params = new URLSearchParams()

    if (searchCriteria.city) {
        params.set('city', searchCriteria.city);
    }
    if (searchCriteria.minPrice !== null && searchCriteria.minPrice !== undefined) {
        params.set('minPrice', searchCriteria.minPrice.toString());
    }
    if (searchCriteria.maxPrice !== null && searchCriteria.maxPrice !== undefined) {
        params.set('maxPrice', searchCriteria.maxPrice.toString());
    }
    if (searchCriteria.minBedrooms !== null && searchCriteria.minBedrooms !== undefined) {
        params.set('minBedrooms', searchCriteria.minBedrooms.toString());
    }
    if (searchCriteria.keyword) {
        params.set('keyword', searchCriteria.keyword);
    }

    params.set('page', page.toString());
    params.set('items', itemsPerPage.toString());

    const res = await fetch(`${BASE_URL}/search?${params.toString()}`);
    if (!res.ok) {
        throw new Error('Failed to fetch listings');
    }
    return res.json() as Promise<SearchResultResponse>;
}

export const listingKeys = {
    all: ['listings'] as const,
    search: (searchCriteria: ListingSearchCriteria, page: number, itemsPerPage: number) =>
        [...listingKeys.all, 'search', searchCriteria, page, itemsPerPage] as const,
};

export function useListings(
    searchCriteria: ListingSearchCriteria,
    page: number,
    itemsPerPage: number,
    enabled: boolean = true,
) {
    return useQuery<SearchResultResponse>({
        queryKey: listingKeys.search(searchCriteria, page, itemsPerPage),
        queryFn: () => searchListings(searchCriteria, page, itemsPerPage),
        enabled,
        placeholderData: keepPreviousData,
    });
}