import { defineConfig } from 'cypress';

export default defineConfig({
    component: {
        devServer: {
            framework: 'react',
            bundler: 'vite',
        },
        specPattern: 'cypress/component/**/*.cy.tsx',
        supportFile: 'cypress/support/component.ts',
        video: false,
    },
});
