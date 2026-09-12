import ResultsTable from '../../src/components/table/ResultsTable';
import { ListingResult } from '../../src/types/Listing.type';

const listing = (overrides: Partial<ListingResult> = {}): ListingResult => ({
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
    ...overrides,
});

describe('ResultsTable', () => {
    it('renders one card per listing', () => {
        const data = [listing(), listing({ id: 'A4', address: '22 Birch Ln' })];
        cy.mount(<ResultsTable data={data} page={1} totalPages={1} onPageChange={cy.stub()} />);

        cy.get('.listing-card').should('have.length', 2);
    });

    it('shows the address, city, state and zip on one comma separated line', () => {
        cy.mount(<ResultsTable data={[listing()]} page={1} totalPages={1} onPageChange={cy.stub()} />);

        cy.get('.listing-card__address')
            .should('have.text', 'Address: 55 Elm Ct, Vienna, VA, 22180');
    });

    it('shows the score to two decimals, large and bold', () => {
        cy.mount(<ResultsTable data={[listing({ score: 0.9 })]} page={1} totalPages={1} onPageChange={cy.stub()} />);

        cy.get('.listing-card__score')
            .should('have.text', '0.90')
            .and('have.css', 'font-weight', '700');

        // Larger than the surrounding body text, whatever the exact rem value is.
        cy.get('.listing-card__score').then(($score) => {
            const scoreSize = parseFloat($score.css('font-size'));
            cy.get('.listing-card__description').then(($description) => {
                expect(scoreSize).to.be.greaterThan(parseFloat($description.css('font-size')));
            });
        });
    });

    it('renders the remaining listing details and the description', () => {
        cy.mount(<ResultsTable data={[listing()]} page={1} totalPages={1} onPageChange={cy.stub()} />);

        cy.get('.listing-card__details').should('contain.text', '3 bed');
        cy.get('.listing-card__details').should('contain.text', '2 bath');
        cy.get('.listing-card__details').should('contain.text', '$470,000');
        cy.get('.listing-card__description').should('have.text', 'Sunny three bedroom near the metro');
    });

    it('reports days on market, and calls it unknown when the backend sends -1', () => {
        cy.mount(<ResultsTable data={[listing()]} page={1} totalPages={1} onPageChange={cy.stub()} />);
        cy.get('.listing-card__days').should('have.text', '16 days on market');

        cy.mount(<ResultsTable data={[listing({ daysOnMarket: -1 })]} page={1} totalPages={1} onPageChange={cy.stub()} />);
        cy.get('.listing-card__days').should('have.text', 'Days on market unknown');
    });

    it('shows an empty state instead of a card when nothing matched', () => {
        cy.mount(<ResultsTable data={[]} page={1} totalPages={0} onPageChange={cy.stub()} />);

        cy.contains('No listings matched your search.').should('exist');
        cy.get('.listing-card').should('not.exist');
        cy.get('.pagination').should('not.exist');
    });

    describe('pagination', () => {
        it('disables Prev on the first page and Next on the last', () => {
            cy.mount(<ResultsTable data={[listing()]} page={1} totalPages={2} onPageChange={cy.stub()} />);
            cy.contains('button', 'Prev').should('be.disabled');
            cy.contains('button', 'Next').should('not.be.disabled');
            cy.get('.pagination').should('contain.text', 'Page 1 of 2');

            cy.mount(<ResultsTable data={[listing()]} page={2} totalPages={2} onPageChange={cy.stub()} />);
            cy.contains('button', 'Prev').should('not.be.disabled');
            cy.contains('button', 'Next').should('be.disabled');
        });

        it('asks for the next and previous page by number', () => {
            const onPageChange = cy.stub().as('onPageChange');
            cy.mount(<ResultsTable data={[listing()]} page={2} totalPages={3} onPageChange={onPageChange} />);

            cy.contains('button', 'Next').click();
            cy.get('@onPageChange').should('have.been.calledWith', 3);

            cy.contains('button', 'Prev').click();
            cy.get('@onPageChange').should('have.been.calledWith', 1);
        });
    });
});
