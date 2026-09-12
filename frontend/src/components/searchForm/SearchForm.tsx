import { ListingSearchCriteria } from "../../types/Listing.type";
import { validateNumber, validateText } from "../../util/formUtility";

interface SearchFormProps {
    cities: string[]
    onSearch: (criteria: ListingSearchCriteria) => void
    onReset: () => void
}

const SearchForm = ({ cities, onSearch, onReset }: SearchFormProps) => {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        onSearch({
            city: validateText(formData, 'city'),
            minPrice: validateNumber(formData, 'minPrice'),
            maxPrice: validateNumber(formData, 'maxPrice'),
            minBedrooms: validateNumber(formData, 'minBedrooms'),
            keyword: validateText(formData, 'keyword'),
            targetBudget: validateNumber(formData, 'targetBudget'),
        });
    }

    return (
        <form className="search-form" onSubmit={handleSubmit} onReset={onReset}>
            <label>
                Min price
                <input type="number" name="minPrice" min={0} placeholder="Any" />
            </label>
            <label>
                Max price
                <input type="number" name="maxPrice" min={0} placeholder="Any" />
            </label>
            <label>
                Target budget
                <input type="number" name="targetBudget" min={0} placeholder="Any" />
            </label>
            <label>
                Min bedrooms
                <input type="number" name="minBedrooms" min={0} placeholder="Any" />
            </label>
            {cities.length > 0 && (
                <label>
                    City
                    <select name="city" defaultValue="">
                        <option value="">All cities</option>
                        {cities.map((city) => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                </label>
            )}
            <input type="text" name="keyword" placeholder="Search by keyword" />
            <button type="submit">Search</button>
            <button type="reset">Clear Filters</button>
        </form>
    )
}

export default SearchForm;
