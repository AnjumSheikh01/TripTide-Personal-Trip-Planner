# TripTide — Project Journal

## Goal
Build a useful travel-planning workspace that makes trips and day-by-day activities easier to organize.

## Problem
Trip details often end up scattered across notes, messages, calendars, and spreadsheets. TripTide puts destination details, dates, activity plans, and estimated costs into one place.

## Core implementation
- `useState` manages trips, selected trip/day, search/filter state, and modal form values.
- `useEffect` synchronizes trip data to LocalStorage.
- `useMemo` derives the filtered trip list instead of storing duplicate derived state.
- Activity cost totals and budget progress are calculated from the current itinerary.
- Date helpers calculate trip duration and generate each date in the itinerary.
- JSON export uses `Blob`, an object URL, and a temporary download link.
- Responsive CSS adapts the sidebar, cards, itinerary, and forms to small screens.

## Decisions and trade-offs
- LocalStorage keeps the app usable without a backend, but data is browser/device-specific.
- Sample trips make the dashboard meaningful on first launch; users can create their own trips.
- Budget totals represent estimated activity costs, not verified purchases or a complete accounting ledger.
- Trip dates are handled as date-only values and formatted at midday to reduce common timezone display shifts.

## Manual test checklist
- [ ] Create a trip with valid dates and a budget.
- [ ] Confirm an end date earlier than the start date is rejected.
- [ ] Reload and confirm created trips persist.
- [ ] Search by trip name and destination.
- [ ] Add an activity on a valid trip day.
- [ ] Mark an activity complete and then incomplete.
- [ ] Delete an activity and delete a trip.
- [ ] Confirm activity costs update the budget meter and remaining amount.
- [ ] Export a JSON backup and inspect the downloaded file.
- [ ] Check layout at desktop and mobile widths.
- [ ] Run `npm.cmd run build` and resolve any reported errors.

## What I learned
This project is a chance to practise state modeling, derived values, form validation, persistent browser data, date manipulation, responsive layout, and accessible interaction patterns.

## Known limitations
- No backend, login, shared collaboration, map routing, or live travel data.
- Sample trips use remote Unsplash images and Google Fonts, so those assets require internet access.
- The "past/upcoming" filter is based on the current date and should be reviewed if the app's date logic is changed.
- Existing trip details and notes are not yet editable after creation.

## Interview honesty
Be prepared to walk through the code and explain the state shape, LocalStorage effect, date calculations, budget formula, validation, and trade-offs. Do not claim backend or AI functionality; neither is part of this version.
