# Rental Listing Search

A rental listing search service: a Spring Boot REST API that filters and ranks
listings, and a React + TypeScript frontend for searching them.

## Structure

- `backend` - Spring Boot application built with Maven
- `frontend` - React application built with Vite and TypeScript
- `backend/src/main/resources/sample_listings.json` - supplied sample data, loaded
  into memory at startup. There is no database to set up.

## Requirements

- **Java 17 or newer**, with `JAVA_HOME` pointing at it (or `java` on your `PATH`).
  Maven does not need to be installed - the bundled wrapper downloads Maven 3.9.16
  on first run.
- **Node.js 20 or newer** and npm.
- An internet connection for the first build, so the Maven and npm dependencies can
  be downloaded.

## Running

Start the backend first, then the frontend in a second terminal.

### Backend

```text
cd backend
./mvnw spring-boot:run
```

On Windows use `.\mvnw.cmd spring-boot:run`.

The API listens on http://localhost:8080. To confirm it is up:

```text
curl "http://localhost:8080/api/listings/search"
```

### Frontend

```text
cd frontend
npm ci
npm run dev
```

The app runs on http://localhost:5173 and calls the backend at
http://localhost:8080. Use `npm ci` rather than `npm install` so the versions in
`package-lock.json` are installed exactly.

## API

### `GET /api/listings/search`

All query parameters are optional. With none supplied, the first page of all
listings is returned.

| Parameter | Type | Description |
| --- | --- | --- |
| `minPrice` | integer | Exclude listings priced below this. |
| `maxPrice` | integer | Exclude listings priced above this. |
| `minBedrooms` | integer | Exclude listings with fewer bedrooms than this. |
| `city` | string | Exact city match, case and whitespace insensitive. |
| `keyword` | string | Case insensitive substring match on the description. |
| `targetBudget` | integer | Drives the ranking score - see below. |
| `page` | integer | Zero based page number. Defaults to `0`. |

Page size is fixed at 10 by the server and cannot be changed by the client.

Example:

```text
curl "http://localhost:8080/api/listings/search?city=Springfield&minBedrooms=2&targetBudget=500000"
```

Response:

```json
{
  "results": [
    {
      "id": "A1",
      "address": "123 Main St, Apt 4B",
      "city": "Springfield",
      "state": "VA",
      "zip": "22150",
      "price": 450000,
      "bedrooms": 2,
      "bathrooms": 1.5,
      "description": "Bright top-floor condo near shops and transit. Pet friendly.",
      "daysOnMarket": 14,
      "score": 1.0
    }
  ],
  "page": 0,
  "itemsPerPage": 10,
  "totalItems": 4,
  "totalPages": 1
}
```

The `results` array is truncated to one entry above; this query actually returns
all four matches on a single page.

The sample data holds 12 listings across Chantilly, Fairfax, Manassas, Reston,
Springfield and Vienna, priced in the mid six figures.

`daysOnMarket` is `-1` when a listing has a missing or malformed `listedDate`.

### Ranking

Results are ordered by `score` descending, with the most recently listed property
winning ties.

- No `targetBudget` supplied: every listing scores a neutral `0.5`.
- Priced at or below `targetBudget`: scores `1.0`.
- Priced above `targetBudget`: the score falls off in proportion to how far over it
  is, to a floor of `0.0`.

### Errors

Invalid input returns `400 Bad Request` with a JSON body naming the problem:

```json
{ "error": "minPrice must not be greater than maxPrice" }
```

This covers negative `minPrice`, `maxPrice`, `minBedrooms`, `targetBudget` or
`page`, and a `minPrice` greater than `maxPrice`.

### CORS

The API allows browser `GET` requests to `/api/**` from the origins listed in
`app.cors.allowed-origins` in `backend/src/main/resources/application.properties`,
which defaults to the Vite dev server at `http://localhost:5173`. Add any other
origin you serve the frontend from.

## Tests

Backend, 22 tests covering the search API, filtering, validation and scoring:

```text
cd backend
./mvnw test
```

Frontend, Cypress component tests for the search form, results table and query
layer:

```text
cd frontend
npm test
```

Use `npm run test:open` for the interactive Cypress runner.
