import { Listing } from "../../types/Listing.type";

interface ResultsTableProp {
    data: Listing[]
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void
}

const toHeaderLabel = (key: string) =>
    key.replace(/([A-Z])/g, ' $1').replace(/^./, (character) => character.toUpperCase());

const ResultsTable = ({data,page,totalPages,onPageChange}: ResultsTableProp) => {
    const COLUMNS = data.length > 0
        ? (Object.keys(data[0]) as (keyof Listing)[]).filter((key) => key !== 'id')
        : [];

    const TABLE_HEADERS = COLUMNS.map(toHeaderLabel);

    return(
        <>
            {data.length > 0 && (
                <div>
                    <table>
                        <thead>
                            <tr>
                                {TABLE_HEADERS.map((header, index) => (
                                    <th key={`header-${index}`}>{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={`listing-${item.id}-${index}`}>
                                    {COLUMNS.map((column) => (
                                        <td key={`${item.id}-${column}`}>{item[column]}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div>
                        <button disabled={page <= 1} onClick={() => onPageChange(page-1)}>Prev</button>
                        <span>Page {page}</span>
                        <button disabled={page >= totalPages} onClick={() => onPageChange(page+1)}>Next</button>
                    </div>
                </div>
            )}
        </>
    )
}

export default ResultsTable;
