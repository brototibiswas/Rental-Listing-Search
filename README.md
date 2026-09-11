# Rental Management

Monorepo scaffold for a Java backend and React TypeScript frontend.

## Structure

- `backend` - Spring Boot application built with Maven
- `frontend` - React application built with Vite and TypeScript
- `sample_listings.json` - supplied sample data

## Backend

Requires Java 17+ and `JAVA_HOME` pointing at that JDK. Maven does not need to be
installed - the bundled wrapper downloads Maven 3.9.16 on first run.

```text
cd backend
./mvnw spring-boot:run
```

On Windows use `.\mvnw.cmd spring-boot:run`.

The app listens on http://localhost:8080. It has no endpoints yet, so a request to
`/` returns a 404 from Spring - that response confirms the server is up.

## Frontend

Requires Node.js 20+ and npm.

```text
cd frontend
npm install
npm run dev
```
