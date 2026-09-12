import SearchForm from '../../src/components/searchForm/SearchForm';

describe('SearchForm', () => {
    it('renders every filter input', () => {
        cy.mount(<SearchForm cities={[]} onSearch={cy.stub()} onReset={cy.stub()} />);

        cy.get('input[name="minPrice"]').should('exist');
        cy.get('input[name="maxPrice"]').should('exist');
        cy.get('input[name="targetBudget"]').should('exist');
        cy.get('input[name="minBedrooms"]').should('exist');
        cy.get('input[name="keyword"]').should('exist');
        cy.contains('button', 'Search').should('exist');
        cy.contains('button', 'Clear Filters').should('exist');
    });

    it('hides the city dropdown until a search has supplied cities', () => {
        cy.mount(<SearchForm cities={[]} onSearch={cy.stub()} onReset={cy.stub()} />);
        cy.get('select[name="city"]').should('not.exist');
    });

    it('shows the city dropdown with an All cities option once cities exist', () => {
        cy.mount(<SearchForm cities={['Reston', 'Vienna']} onSearch={cy.stub()} onReset={cy.stub()} />);

        cy.get('select[name="city"]').should('exist');
        cy.get('select[name="city"] option').should('have.length', 3);
        cy.get('select[name="city"] option').first().should('have.text', 'All cities');
    });

    it('submits the typed filters as criteria', () => {
        const onSearch = cy.stub().as('onSearch');
        cy.mount(<SearchForm cities={['Vienna']} onSearch={onSearch} onReset={cy.stub()} />);

        cy.get('input[name="minPrice"]').type('300000');
        cy.get('input[name="maxPrice"]').type('600000');
        cy.get('input[name="targetBudget"]').type('420000');
        cy.get('input[name="minBedrooms"]').type('3');
        cy.get('input[name="keyword"]').type('garage');
        cy.get('select[name="city"]').select('Vienna');
        cy.contains('button', 'Search').click();

        cy.get('@onSearch').should('have.been.calledOnceWith', {
            city: 'Vienna',
            minPrice: 300000,
            maxPrice: 600000,
            minBedrooms: 3,
            keyword: 'garage',
            targetBudget: 420000,
        });
    });

    // Blank inputs must drop out of the criteria rather than being sent as 0 or "".
    it('omits filters that were left blank', () => {
        const onSearch = cy.stub().as('onSearch');
        cy.mount(<SearchForm cities={[]} onSearch={onSearch} onReset={cy.stub()} />);

        cy.get('input[name="minPrice"]').type('250000');
        cy.contains('button', 'Search').click();

        cy.get('@onSearch').should('have.been.calledOnceWith', {
            city: undefined,
            minPrice: 250000,
            maxPrice: undefined,
            minBedrooms: undefined,
            keyword: undefined,
            targetBudget: undefined,
        });
    });

    it('clears the inputs and notifies the page when Clear Filters is pressed', () => {
        const onReset = cy.stub().as('onReset');
        cy.mount(<SearchForm cities={['Vienna']} onSearch={cy.stub()} onReset={onReset} />);

        cy.get('input[name="minPrice"]').type('300000');
        cy.get('input[name="keyword"]').type('garage');
        cy.get('select[name="city"]').select('Vienna');

        cy.contains('button', 'Clear Filters').click();

        cy.get('@onReset').should('have.been.calledOnce');
        cy.get('input[name="minPrice"]').should('have.value', '');
        cy.get('input[name="keyword"]').should('have.value', '');
        cy.get('select[name="city"]').should('have.value', '');
    });
});
