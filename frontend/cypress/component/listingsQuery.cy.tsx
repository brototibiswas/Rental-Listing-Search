import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useListings } from '../../src/query/listingsQuery';
import { ListingSearchCriteria, SearchResultResponse } from '../../src/types/Listing.type';

const SEARCH_URL = 'http://localhost:8080/api/listings/search*';

const response: SearchResultResponse = {
    results: [{
        id: 'A5',
        address: '55 Elm Ct',
        city: 'Vienna',
        state: 'VA',
        zip: '22180',
        price: 470000,
        bedrooms: 3,
        bathrooms: 2,
        description: 'Sunny three bedroom near the metro',
        daysOnMarket: 16,
        score: 0.93,
    }],
    page: 0,
    totalPages: 2,
    itemsPerPage: 10,
    totalItems: 12,
};

// Renders just enough of the hook's output for the assertions below.
const Probe = ({ criteria, page }: { criteria: ListingSearchCriteria, page: number }) => {
    const { data, isError, error } = useListings(criteria, page);

    if (isError) {
        return <p data-cy="error">{error.message}</p>;
    }
    if (!data) {
        return <p data-cy="loading">loading</p>;
    }
    return <p data-cy="summary">{`${data.results.length} of ${data.totalItems}, page size ${data.itemsPerPage}`}</p>;
};

const mountProbe = (criteria: ListingSearchCriteria = {}, page = 0) => {
    // retry: false so a stubbed failure surfaces immediately instead of being retried.
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    cy.mount(
        <QueryClientProvider client={queryClient}>
            <Probe criteria={criteria} page={page} />
        </QueryClientProvider>,
    );
};

const searchParamsOf = (url: string) => new URL(url).searchParams;

describe('listings query', () => {
    it('sends every supplied filter as a query parameter', () => {
        cy.intercept('GET', SEARCH_URL, { body: response }).as('search');

        mountProbe({
            city: 'Vienna',
            minPrice: 300000,
            maxPrice: 600000,
            minBedrooms: 3,
            keyword: 'garage',
            targetBudget: 420000,
        });

        cy.wait('@search').then(({ request }) => {
            const params = searchParamsOf(request.url);
            expect(params.get('city')).to.equal('Vienna');
            expect(params.get('minPrice')).to.equal('300000');
            expect(params.get('maxPrice')).to.equal('600000');
            expect(params.get('minBedrooms')).to.equal('3');
            expect(params.get('keyword')).to.equal('garage');
            expect(params.get('targetBudget')).to.equal('420000');
        });
    });

    it('omits filters that were not supplied', () => {
        cy.intercept('GET', SEARCH_URL, { body: response }).as('search');

        mountProbe({ minPrice: 250000 });

        cy.wait('@search').then(({ request }) => {
            const params = searchParamsOf(request.url);
            expect(params.get('minPrice')).to.equal('250000');
            expect(params.has('maxPrice')).to.equal(false);
            expect(params.has('minBedrooms')).to.equal(false);
            expect(params.has('city')).to.equal(false);
            expect(params.has('keyword')).to.equal(false);
            expect(params.has('targetBudget')).to.equal(false);
        });
    });

    // Page size is owned by the backend; sending one used to be a silently ignored no-op.
    it('never asks for a page size', () => {
        cy.intercept('GET', SEARCH_URL, { body: response }).as('search');

        mountProbe({}, 0);

        cy.wait('@search').then(({ request }) => {
            const params = searchParamsOf(request.url);
            expect(params.has('items')).to.equal(false);
            expect(params.has('itemsPerPage')).to.equal(false);
        });
    });

    it('requests the page it was given', () => {
        cy.intercept('GET', SEARCH_URL, { body: response }).as('search');

        mountProbe({}, 2);

        cy.wait('@search').then(({ request }) => {
            expect(searchParamsOf(request.url).get('page')).to.equal('2');
        });
    });

    it('exposes the parsed payload on success', () => {
        cy.intercept('GET', SEARCH_URL, { body: response }).as('search');

        mountProbe();

        cy.get('[data-cy="summary"]').should('have.text', '1 of 12, page size 10');
    });

    it('surfaces the validation message from a 400 body', () => {
        cy.intercept('GET', SEARCH_URL, {
            statusCode: 400,
            body: { error: 'minPrice must not be greater than maxPrice' },
        }).as('search');

        mountProbe({ minPrice: 900000, maxPrice: 1000 });

        cy.get('[data-cy="error"]').should('have.text', 'minPrice must not be greater than maxPrice');
    });

    it('falls back to the status code when the error body is not JSON', () => {
        cy.intercept('GET', SEARCH_URL, {
            statusCode: 500,
            headers: { 'content-type': 'text/html' },
            body: '<html><body>Gateway exploded</body></html>',
        }).as('search');

        mountProbe();

        cy.get('[data-cy="error"]').should('have.text', 'Failed to fetch listings (500)');
    });

    it('falls back to the status code when the error body has no error field', () => {
        cy.intercept('GET', SEARCH_URL, { statusCode: 503, body: {} }).as('search');

        mountProbe();

        cy.get('[data-cy="error"]').should('have.text', 'Failed to fetch listings (503)');
    });
});
