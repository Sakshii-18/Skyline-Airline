# SkyBook Backend (Spring Boot)

A Spring Boot REST API that backs the SkyBook frontend, now with **real database persistence** using H2 (file-based) + Spring Data JPA. Data is saved to `./data/skybookdb.mv.db` and survives app restarts — open the project, run it, stop it, run it again, and your bookings/messages are still there.

## Endpoints

| Method | URL | Description |
|---|---|---|
| GET | `/api/flights` | List all flights |
| GET | `/api/flights/{id}` | Get one flight by ID (e.g. `SB-204`) |
| GET | `/api/bookings/seats/{flightId}` | Get occupied seats for a flight |
| POST | `/api/bookings` | Create a booking (saved to DB, returns generated PNR) |
| POST | `/api/contact` | Save a contact form submission to DB |

## Run it

```
cd SkyBook-backend
mvn spring-boot:run
```

Runs on **http://localhost:8080**.

## View the saved data (H2 console)

1. Go to **http://localhost:8080/h2-console**
2. JDBC URL: `jdbc:h2:file:./data/skybookdb`
3. Username: `sa`, Password: *(leave blank)*
4. Click Connect → run `SELECT * FROM BOOKINGS;` or `SELECT * FROM CONTACT_MESSAGES;`

This is a great thing to show in your viva — it proves the data is actually being saved, not just held in memory.

## Example: create a booking

```
POST http://localhost:8080/api/bookings
Content-Type: application/json

{
  "passengerName": "Sakshii Suryawanshi",
  "email": "sakshii@example.com",
  "phone": "9876543210",
  "gender": "Female",
  "flightId": "SB-204",
  "seats": ["B3"]
}
```

Response includes a generated `pnr` and `id`. The booking is now permanently stored in H2 — restart the app and `GET` it again, it's still there.

## Connecting the frontend

CORS is open (`@CrossOrigin(origins = "*")`) so the static frontend (Netlify or `file://`) can call this API directly with `fetch()`, e.g.:

```js
fetch('http://localhost:8080/api/flights')
  .then(res => res.json())
  .then(flights => console.log(flights));
```

For the viva: client-side validation happens first (script.js), then if connected, this Spring Boot API does server-side validation again (`@Valid` + Bean Validation), saves the row via Spring Data JPA into H2, and returns a PNR — same layered pattern as your Leave Approval and Cafe Billing Spring Boot projects.
