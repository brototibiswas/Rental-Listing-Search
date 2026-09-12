export interface ListingResult {
    id: string
    address: string
    city: string
    state: string
    zip: string
    price: number
    bedrooms: number
    bathrooms: number
    description: string
    daysOnMarket: number
    score: number
}

export interface SearchResultResponse {
    results: ListingResult[]
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
    targetBudget?: number
}
