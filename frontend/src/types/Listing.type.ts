export interface Listing {
    id: number
    source: string
    address: string
    city: string
    state: string
    zip: string
    price: number
    bedrooms: number
    bathrooms: number
    sqft: number
    latitude: number
    longitude: number
    listedDate: string
    status: string
    description: string
}

export interface SearchResultResponse {
    results: Listing[]
    page: number
    totalPages: number
    itemsPerPage: number
    totalItems: number
}

export interface ListingSearchCriteria {
    city?: string
    minPrice?: number
    maxPrice?: number
    minBedrooms?: number
    keyword?: string
}