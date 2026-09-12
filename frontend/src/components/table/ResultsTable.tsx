import { ListingResult } from "../../types/Listing.type";

interface ResultsTableProp {
    data: ListingResult[]
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void
}

const priceFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
});

// The backend sends -1 when a listing has no parseable listed date.
const formatDaysOnMarket = (days: number) =>
    days < 0 ? 'Days on market unknown' : `${days} days on market`;

const ResultsTable = ({ data, page, totalPages, onPageChange }: ResultsTableProp) => {
    if (data.length === 0) {
        return <p>No listings matched your search.</p>;
    }

    return (
        <div>
            <div className="results-list">
                {data.map((item) => (
                    <article className="listing-card" key={item.id}>
                        <div className="listing-card__top">
                            <span className="listing-card__score">{item.score.toFixed(2)}</span>
                            <span className="listing-card__days">{formatDaysOnMarket(item.daysOnMarket)}</span>
                        </div>

                        <p className="listing-card__address">
                            Address: {[item.address, item.city, item.state, item.zip].join(', ')}
                        </p>

                        <div className="listing-card__details">
                            <span>{item.bedrooms} bed</span>
                            <span>{item.bathrooms} bath</span>
                            <span>{priceFormatter.format(item.price)}</span>
                        </div>

                        <p className="listing-card__description">{item.description}</p>
                    </article>
                ))}
            </div>

            <div className="pagination">
                <button disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Prev</button>
                <span>Page {page} of {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>Next</button>
            </div>
        </div>
    )
}

export default ResultsTable;
