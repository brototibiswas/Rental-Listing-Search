import { useMemo, useState } from "react";
import SearchForm from "../components/searchForm/SearchForm";
import ResultsTable from "../components/table/ResultsTable";
import { useListings } from "../query/listingsQuery";
import { ListingSearchCriteria } from "../types/Listing.type";

const ListingPage = () => {

    const [searchCriteria, setSearchCriteria] = useState<ListingSearchCriteria>({});
    const [page, setPage] = useState(0);
    const [hasSearched, setHasSearched] = useState(false);

    const { data, isLoading, isError, error } = useListings(searchCriteria, page, hasSearched);

    const cities = useMemo(() => {
        const unique = new Set(data?.results.map((listing) => listing.city));
        return [...unique].sort();
    }, [data]);

    const handleSearch = (criteria: ListingSearchCriteria) => {
        setSearchCriteria(criteria);
        setPage(0);
        setHasSearched(true);
    };

    return (
        <div>
            <h1>Listing Search Service</h1>
            <SearchForm cities={cities} onSearch={handleSearch} />
            {!hasSearched && <h3>What do you want to search?</h3>}
            {hasSearched && isError && <p role="alert">{error.message}</p>}
            {hasSearched && isLoading && <p>Loading...</p>}
            {hasSearched && !isLoading && !isError &&
            (<ResultsTable
                data={data?.results ?? []}
                page={(data?.page ?? page) + 1}
                totalPages={data?.totalPages ?? 0}
                onPageChange={(nextPage) => setPage(nextPage - 1)}
            />)
            }
        </div>
    );
}

export default ListingPage;
