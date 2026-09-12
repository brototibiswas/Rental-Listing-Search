import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { ListingSearchCriteria, SearchResultResponse } from "../types/Listing.type";

const BASE_URL = 'http://localhost:8080/api/listings';

async function readErrorMessage(res: Response): Promise<string> {
    try {
        const body: unknown = await res.json();
        if (body !== null && typeof body === 'object' && 'error' in body
            && typeof body.error === 'string' && body.error.trim() !== '') {
            return body.error;
        }
    } catch {
        // Body was empty or not JSON - use the generic message below.
    }
    return `Failed to fetch listings (${res.status})`;
}

export async function searchListings(searchCriteria: ListingSearchCriteria, page: number): Promise<SearchResultResponse> {
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
    if (searchCriteria.targetBudget !== null && searchCriteria.targetBudget !== undefined) {
        params.set('targetBudget', searchCriteria.targetBudget.toString());
    }

    // Page size is owned by the server
    params.set('page', page.toString());

    const res = await fetch(`${BASE_URL}/search?${params.toString()}`);
    if (!res.ok) {
        throw new Error(await readErrorMessage(res));
    }
    return res.json() as Promise<SearchResultResponse>;
}

export const listingKeys = {
    all: ['listings'] as const,
    search: (searchCriteria: ListingSearchCriteria, page: number) =>
        [...listingKeys.all, 'search', searchCriteria, page] as const,
};

export function useListings(
    searchCriteria: ListingSearchCriteria,
    page: number,
    enabled: boolean = true,
) {
    return useQuery<SearchResultResponse>({
        queryKey: listingKeys.search(searchCriteria, page),
        queryFn: () => searchListings(searchCriteria, page),
        enabled,
        placeholderData: keepPreviousData,
    });
}
