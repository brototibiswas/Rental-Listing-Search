import { mount } from 'cypress/react';

// The app's own stylesheet, so layout assertions see the real CSS.
import '../../src/index.css';

declare global {
    namespace Cypress {
        interface Chainable {
            mount: typeof mount;
        }
    }
}

Cypress.Commands.add('mount', mount);
